//! DRC execution engine.

use std::collections::{HashMap, HashSet};
use std::time::{Duration, Instant};

use rosette_core::cell::Element;
use rosette_core::{BBox, Cell, Layer, Library, Point, Polygon, Transform, offset_polygon};

use crate::checks::{
    check_angles, check_area, check_edge_length, check_enclosure, check_forbid_overlap_bulk,
    check_max_width, check_require_overlap_bulk, check_self_intersection, check_spacing,
    check_width,
};
use crate::rules::{DrcRules, Rule};
use crate::violation::{DrcViolation, RuleType, Severity};

/// Statistics from a DRC run.
#[derive(Debug, Clone)]
pub struct DrcStats {
    /// Number of polygons checked.
    pub polygons_checked: usize,
    /// Number of rules checked.
    pub rules_checked: usize,
    /// Total elapsed time.
    pub elapsed: Duration,
}

/// Result of running DRC.
#[derive(Debug, Clone)]
pub struct DrcResult {
    /// List of violations found.
    pub violations: Vec<DrcViolation>,
    /// Statistics from the run.
    pub stats: DrcStats,
}

impl DrcResult {
    /// Check if DRC passed (no violations).
    pub fn passed(&self) -> bool {
        self.violations.is_empty()
    }

    /// Number of violations found.
    pub fn violation_count(&self) -> usize {
        self.violations.len()
    }
}

/// DRC execution engine.
pub struct DrcRunner {
    rules: DrcRules,
}

/// Polygons from a single cell instance with its bounding box.
///
/// Used for instance-level spatial culling: only instances whose bounding
/// boxes are within interaction range need their polygons cross-checked.
struct InstancePolygons {
    polygons_by_layer: HashMap<Layer, Vec<(Polygon, usize)>>,
    bbox: BBox,
    /// Name of the cell this instance comes from.
    cell_name: String,
}

impl DrcRunner {
    /// Create a new DRC runner with the given rules.
    pub fn new(rules: DrcRules) -> Self {
        Self { rules }
    }

    /// Run DRC on a cell with hierarchy-aware optimization.
    ///
    /// Three-phase approach:
    ///
    /// 1. **Per-polygon rules** (width, area, angles, edge length, self-intersection):
    ///    checked on each unique cell definition only once. These properties are
    ///    invariant under rigid transforms.
    ///
    /// 2. **Intra-cell pairwise rules** (same-layer spacing, overlap): checked within
    ///    each unique cell's local geometry once. If a cell's internal polygons don't
    ///    overlap or violate spacing, no instance of that cell will either.
    ///
    /// 3. **Inter-instance pairwise rules**: flattened polygons grouped by source
    ///    instance, with instance-level bbox pre-culling so only nearby instances
    ///    have their polygons cross-checked.
    ///
    /// # Arguments
    ///
    /// * `cell` - The cell to check
    /// * `library` - Optional library containing referenced cells
    pub fn check(&self, cell: &Cell, library: Option<&Library>) -> DrcResult {
        let start = Instant::now();

        // Classify rules into per-polygon and pairwise categories
        let (per_polygon_rules, pairwise_rules): (Vec<&Rule>, Vec<&Rule>) =
            self.rules.rules().iter().partition(|rule| match rule {
                Rule::MinWidth { .. }
                | Rule::MinArea { .. }
                | Rule::AllowedAngles { .. }
                | Rule::MinEdgeLength { .. }
                | Rule::SelfIntersection { .. }
                | Rule::MaxWidth { .. } => true,
                Rule::MinSpacing { .. }
                | Rule::Enclosure { .. }
                | Rule::RequireOverlap { .. }
                | Rule::ForbidOverlap { .. } => false,
            });

        let mut violations = Vec::new();

        // Phase 1: Per-polygon rules — check each unique cell once.
        // These rules examine individual polygon properties (width, area, angles,
        // etc.) which are invariant under rigid transforms (rotation + translation).
        let mut checked_cells: HashSet<String> = HashSet::new();
        if !per_polygon_rules.is_empty() {
            self.check_per_polygon_hierarchical(
                cell,
                library,
                &per_polygon_rules,
                &Transform::identity(),
                &mut checked_cells,
                &mut violations,
            );
        }

        // Phase 2 & 3: Pairwise rules — intra-cell once + inter-instance with culling
        let polygons_checked: usize;
        if !pairwise_rules.is_empty() {
            // Phase 2: Intra-cell pairwise checks (each unique cell once)
            let mut intra_checked: HashSet<String> = HashSet::new();
            self.check_intra_cell_pairwise(
                cell,
                library,
                &pairwise_rules,
                &mut intra_checked,
                &mut violations,
            );

            // Phase 3: Inter-instance pairwise checks
            // Flatten into per-instance groups for instance-level bbox culling
            let mut instance_groups: Vec<InstancePolygons> = Vec::new();
            let mut global_index = 0usize;
            self.flatten_into_groups(
                cell,
                library,
                &Transform::identity(),
                &mut instance_groups,
                &mut global_index,
            );

            polygons_checked = instance_groups
                .iter()
                .map(|g| g.polygons_by_layer.values().map(|v| v.len()).sum::<usize>())
                .sum();

            // Merge all polygons into a flat map but tag them with instance id.
            // Then for pairwise rules, use inter-instance checking.
            let merged = Self::merge_instance_groups(&instance_groups);

            for rule in &pairwise_rules {
                let rule_violations =
                    self.check_pairwise_rule_inter_instance(rule, &instance_groups, &merged);
                violations.extend(rule_violations);
            }
        } else {
            polygons_checked = self.count_polygons(cell, library);
        }

        DrcResult {
            violations,
            stats: DrcStats {
                polygons_checked,
                rules_checked: self.rules.rules().len(),
                elapsed: start.elapsed(),
            },
        }
    }

    /// Check per-polygon rules hierarchically, visiting each unique cell once.
    ///
    /// For cells referenced only through rigid transforms (rotation, translation,
    /// reflection), per-polygon properties are invariant so we check local
    /// (untransformed) geometry once. For non-rigid transforms (non-uniform scale),
    /// the transformed geometry is checked per instance since width/area/angles
    /// change under such transforms.
    fn check_per_polygon_hierarchical(
        &self,
        cell: &Cell,
        library: Option<&Library>,
        rules: &[&Rule],
        transform: &Transform,
        checked_cells: &mut HashSet<String>,
        violations: &mut Vec<DrcViolation>,
    ) {
        if transform.is_rigid() {
            // Rigid transform: per-polygon properties are invariant, check once
            if checked_cells.insert(cell.name().to_string()) {
                let local_polygons = self.collect_local_polygons(cell);
                for rule in rules {
                    let rule_violations = self.check_rule(rule, &local_polygons);
                    violations.extend(rule_violations);
                }
            }
        } else {
            // Non-rigid transform: must check transformed geometry per instance
            let transformed_polygons = self.collect_transformed_polygons(cell, transform);
            for rule in rules {
                let rule_violations = self.check_rule(rule, &transformed_polygons);
                violations.extend(rule_violations);
            }
        }

        for element in cell.elements() {
            if let Element::CellRef(cell_ref) = element
                && let Some(lib) = library
                && let Some(ref_cell) = lib.cell(&cell_ref.cell_name)
            {
                let transforms = Self::expand_cellref_transforms(cell_ref);
                for copy_transform in transforms {
                    let combined = transform.then(&copy_transform);
                    self.check_per_polygon_hierarchical(
                        ref_cell,
                        Some(lib),
                        rules,
                        &combined,
                        checked_cells,
                        violations,
                    );
                }
            }
        }
    }

    /// Check intra-cell pairwise rules (same-layer spacing and overlap only).
    ///
    /// Each unique cell is checked once. This catches overlapping polygons and
    /// spacing violations within a cell definition without needing to flatten.
    /// Only same-layer rules benefit from this optimization; cross-layer rules
    /// (enclosure, require_overlap) are handled in the full merged pass.
    fn check_intra_cell_pairwise(
        &self,
        cell: &Cell,
        library: Option<&Library>,
        rules: &[&Rule],
        checked_cells: &mut HashSet<String>,
        violations: &mut Vec<DrcViolation>,
    ) {
        if checked_cells.insert(cell.name().to_string()) {
            let local_polygons = self.collect_local_polygons(cell);
            // Only run same-layer forbid_overlap and same-layer spacing rules
            for rule in rules {
                let is_same_layer_pairwise = match rule {
                    Rule::MinSpacing { layer1, layer2, .. } => layer1 == layer2,
                    Rule::ForbidOverlap { layer1, layer2, .. } => layer1 == layer2,
                    _ => false,
                };
                if is_same_layer_pairwise {
                    let rule_violations = self.check_rule(rule, &local_polygons);
                    // Annotate intra-cell violations with the cell name
                    let cell_name = cell.name().to_string();
                    for mut v in rule_violations {
                        v.cell_name = Some(cell_name.clone());
                        v.cell_name2 = Some(cell_name.clone());
                        violations.push(v);
                    }
                }
            }
        }

        for element in cell.elements() {
            if let Element::CellRef(cell_ref) = element
                && let Some(lib) = library
                && let Some(ref_cell) = lib.cell(&cell_ref.cell_name)
            {
                self.check_intra_cell_pairwise(
                    ref_cell,
                    Some(lib),
                    rules,
                    checked_cells,
                    violations,
                );
            }
        }
    }

    /// Flatten cell hierarchy into per-instance polygon groups.
    ///
    /// Each leaf-level grouping has its own set of transformed polygons and
    /// a bounding box for fast inter-instance culling.
    fn flatten_into_groups(
        &self,
        cell: &Cell,
        library: Option<&Library>,
        transform: &Transform,
        groups: &mut Vec<InstancePolygons>,
        global_index: &mut usize,
    ) {
        // Collect this cell's own polygons as one instance group
        let mut local_polys: HashMap<Layer, Vec<(Polygon, usize)>> = HashMap::new();
        let mut local_bbox: Option<BBox> = None;

        for element in cell.elements() {
            match element {
                Element::Polygon { polygon, layer } => {
                    let transformed = polygon.transform(transform);
                    let poly_bbox = transformed.bbox();
                    local_bbox = Some(match local_bbox {
                        Some(b) => b.merge(&poly_bbox),
                        None => poly_bbox,
                    });
                    local_polys
                        .entry(*layer)
                        .or_default()
                        .push((transformed, *global_index));
                    *global_index += 1;
                }
                Element::Path {
                    points,
                    width,
                    layer,
                    ..
                } => {
                    let transformed_points: Vec<Point> =
                        points.iter().map(|p| transform.apply(*p)).collect();
                    let scale = (transform.a.powi(2) + transform.c.powi(2)).sqrt();
                    let scaled_width = *width * scale;

                    if let Some(ribbon) = offset_polygon(&transformed_points, scaled_width) {
                        let poly_bbox = ribbon.bbox();
                        local_bbox = Some(match local_bbox {
                            Some(b) => b.merge(&poly_bbox),
                            None => poly_bbox,
                        });
                        local_polys
                            .entry(*layer)
                            .or_default()
                            .push((ribbon, *global_index));
                        *global_index += 1;
                    }
                }
                Element::CellRef(cell_ref) => {
                    if let Some(lib) = library
                        && let Some(ref_cell) = lib.cell(&cell_ref.cell_name)
                    {
                        for copy_transform in Self::expand_cellref_transforms(cell_ref) {
                            let combined = transform.then(&copy_transform);
                            self.flatten_into_groups(
                                ref_cell,
                                Some(lib),
                                &combined,
                                groups,
                                global_index,
                            );
                        }
                    }
                }
                Element::Text { .. } => {}
            }
        }

        if !local_polys.is_empty()
            && let Some(bbox) = local_bbox
        {
            groups.push(InstancePolygons {
                polygons_by_layer: local_polys,
                bbox,
                cell_name: cell.name().to_string(),
            });
        }
    }

    /// Merge all instance groups into one flat polygon map (for rules that need it).
    fn merge_instance_groups(groups: &[InstancePolygons]) -> HashMap<Layer, Vec<(Polygon, usize)>> {
        let mut merged: HashMap<Layer, Vec<(Polygon, usize)>> = HashMap::new();
        for group in groups {
            for (layer, polys) in &group.polygons_by_layer {
                merged
                    .entry(*layer)
                    .or_default()
                    .extend(polys.iter().cloned());
            }
        }
        merged
    }

    /// Check a pairwise rule with inter-instance optimization.
    ///
    /// For same-layer spacing and forbid_overlap, intra-cell checks are already
    /// done in Phase 2, so here we only check inter-instance polygon pairs using
    /// instance-level bbox culling. For all other rules (cross-layer spacing,
    /// enclosure, require_overlap), we fall back to the full merged polygon set.
    fn check_pairwise_rule_inter_instance(
        &self,
        rule: &Rule,
        instance_groups: &[InstancePolygons],
        merged: &HashMap<Layer, Vec<(Polygon, usize)>>,
    ) -> Vec<DrcViolation> {
        match rule {
            Rule::MinSpacing {
                layer1,
                layer2,
                spacing,
                name,
            } if layer1 == layer2 => self.check_inter_instance_spacing(
                instance_groups,
                *layer1,
                *spacing,
                name.as_deref(),
            ),
            Rule::ForbidOverlap {
                layer1,
                layer2,
                name,
            } if layer1 == layer2 => {
                self.check_inter_instance_overlap(instance_groups, *layer1, name.as_deref())
            }
            // Cross-layer and non-optimizable rules: full merged polygon check.
            // These were NOT checked in the intra-cell phase, so no dedup issue.
            // Note: cell_name/cell_name2 are not set for these violations because
            // the merged polygon map loses per-cell provenance. Only same-layer
            // pairwise rules (overlap, spacing) get cell name annotations.
            _ => self.check_rule(rule, merged),
        }
    }

    /// Check minimum spacing between polygons from different instances only.
    ///
    /// Uses instance-level bbox expansion to skip pairs that can't possibly
    /// violate the spacing rule.
    fn check_inter_instance_spacing(
        &self,
        groups: &[InstancePolygons],
        layer: Layer,
        min_spacing: f64,
        rule_name: Option<&str>,
    ) -> Vec<DrcViolation> {
        let mut violations = Vec::new();

        for (i, group_i) in groups.iter().enumerate() {
            let polys_i = match group_i.polygons_by_layer.get(&layer) {
                Some(p) if !p.is_empty() => p,
                _ => continue,
            };

            let expanded_i = group_i.bbox.expand_by(min_spacing);

            for group_j in &groups[i + 1..] {
                // Instance-level bbox culling: skip if expanded bboxes don't overlap
                if !expanded_i.overlaps(&group_j.bbox) {
                    continue;
                }

                let polys_j = match group_j.polygons_by_layer.get(&layer) {
                    Some(p) if !p.is_empty() => p,
                    _ => continue,
                };

                // Check spacing between polygons from instance i and instance j
                let inter_violations = check_spacing(
                    polys_i,
                    layer,
                    polys_j,
                    layer,
                    min_spacing,
                    rule_name,
                    false, // not same-layer dedup — these are from different instances
                );
                // Annotate violations with source cell names
                for mut v in inter_violations {
                    v.cell_name = Some(group_i.cell_name.clone());
                    v.cell_name2 = Some(group_j.cell_name.clone());
                    violations.push(v);
                }
            }
        }

        violations
    }

    /// Check forbidden overlap between polygons from different instances only.
    ///
    /// Uses instance-level bbox culling to skip pairs that can't overlap.
    fn check_inter_instance_overlap(
        &self,
        groups: &[InstancePolygons],
        layer: Layer,
        rule_name: Option<&str>,
    ) -> Vec<DrcViolation> {
        let mut violations = Vec::new();

        for (i, group_i) in groups.iter().enumerate() {
            let polys_i = match group_i.polygons_by_layer.get(&layer) {
                Some(p) if !p.is_empty() => p,
                _ => continue,
            };

            for group_j in &groups[i + 1..] {
                // Instance-level bbox culling: skip if bboxes don't overlap
                if !group_i.bbox.overlaps(&group_j.bbox) {
                    continue;
                }

                let polys_j = match group_j.polygons_by_layer.get(&layer) {
                    Some(p) if !p.is_empty() => p,
                    _ => continue,
                };

                // Check overlap between polygons from instance i and instance j
                let inter_violations = check_forbid_overlap_bulk(
                    polys_i, layer, polys_j, layer, rule_name,
                    false, // not same-layer dedup — these are from different instances
                );
                // Annotate violations with source cell names
                for mut v in inter_violations {
                    v.cell_name = Some(group_i.cell_name.clone());
                    v.cell_name2 = Some(group_j.cell_name.clone());
                    violations.push(v);
                }
            }
        }

        violations
    }

    /// Expand a CellRef's repetition into individual transforms.
    fn expand_cellref_transforms(cell_ref: &rosette_core::CellRef) -> Vec<Transform> {
        match &cell_ref.repetition {
            None => vec![cell_ref.transform],
            Some(rep) if rep.is_single() => vec![cell_ref.transform],
            Some(rep) => {
                let mut ts = Vec::with_capacity(rep.count());
                for row in 0..rep.rows {
                    for col in 0..rep.columns {
                        let dx = col as f64 * rep.col_spacing;
                        let dy = row as f64 * rep.row_spacing;
                        ts.push(Transform::translate(dx, dy).then(&cell_ref.transform));
                    }
                }
                ts
            }
        }
    }

    /// Collect polygons from a cell's own elements with transform applied.
    ///
    /// Used for non-rigid transforms where local geometry is not representative.
    fn collect_transformed_polygons(
        &self,
        cell: &Cell,
        transform: &Transform,
    ) -> HashMap<Layer, Vec<(Polygon, usize)>> {
        let mut result: HashMap<Layer, Vec<(Polygon, usize)>> = HashMap::new();
        let mut index = 0usize;

        for element in cell.elements() {
            match element {
                Element::Polygon { polygon, layer } => {
                    let transformed = polygon.transform(transform);
                    result.entry(*layer).or_default().push((transformed, index));
                    index += 1;
                }
                Element::Path {
                    points,
                    width,
                    layer,
                    ..
                } => {
                    let transformed_points: Vec<Point> =
                        points.iter().map(|p| transform.apply(*p)).collect();
                    let scale = (transform.a.powi(2) + transform.c.powi(2)).sqrt();
                    let scaled_width = *width * scale;
                    if let Some(ribbon) = offset_polygon(&transformed_points, scaled_width) {
                        result.entry(*layer).or_default().push((ribbon, index));
                        index += 1;
                    }
                }
                _ => {}
            }
        }

        result
    }

    /// Collect polygons from a cell's own elements (no hierarchy traversal).
    fn collect_local_polygons(&self, cell: &Cell) -> HashMap<Layer, Vec<(Polygon, usize)>> {
        let mut result: HashMap<Layer, Vec<(Polygon, usize)>> = HashMap::new();
        let mut index = 0usize;

        for element in cell.elements() {
            match element {
                Element::Polygon { polygon, layer } => {
                    result
                        .entry(*layer)
                        .or_default()
                        .push((polygon.clone(), index));
                    index += 1;
                }
                Element::Path {
                    points,
                    width,
                    layer,
                    ..
                } => {
                    if let Some(ribbon) = offset_polygon(points, *width) {
                        result.entry(*layer).or_default().push((ribbon, index));
                        index += 1;
                    }
                }
                _ => {}
            }
        }

        result
    }

    /// Count total flattened polygons without materializing them (for stats).
    fn count_polygons(&self, cell: &Cell, library: Option<&Library>) -> usize {
        let mut count = 0usize;
        for element in cell.elements() {
            match element {
                Element::Polygon { .. } => count += 1,
                Element::Path { points, width, .. } => {
                    // Match collect_local_polygons: count only if offset_polygon would succeed
                    if offset_polygon(points, *width).is_some() {
                        count += 1;
                    }
                }
                Element::CellRef(cell_ref) => {
                    if let Some(lib) = library
                        && let Some(ref_cell) = lib.cell(&cell_ref.cell_name)
                    {
                        let copies = cell_ref.repetition.as_ref().map_or(1, |rep| rep.count());
                        count += copies * self.count_polygons(ref_cell, Some(lib));
                    }
                }
                Element::Text { .. } => {}
            }
        }
        count
    }

    /// Check a single rule against the flattened polygons.
    fn check_rule(
        &self,
        rule: &Rule,
        polygons_by_layer: &HashMap<Layer, Vec<(Polygon, usize)>>,
    ) -> Vec<DrcViolation> {
        match rule {
            Rule::MinWidth { layer, width, name } => {
                let Some(polys) = polygons_by_layer.get(layer) else {
                    return Vec::new();
                };

                polys
                    .iter()
                    .filter_map(|(poly, _)| check_width(poly, *layer, *width, name.as_deref()))
                    .collect()
            }

            Rule::MinArea { layer, area, name } => {
                let Some(polys) = polygons_by_layer.get(layer) else {
                    return Vec::new();
                };

                polys
                    .iter()
                    .filter_map(|(poly, _)| check_area(poly, *layer, *area, name.as_deref()))
                    .collect()
            }

            Rule::AllowedAngles {
                layer,
                allowed_angles,
                name,
            } => {
                let Some(polys) = polygons_by_layer.get(layer) else {
                    return Vec::new();
                };

                polys
                    .iter()
                    .flat_map(|(poly, _)| {
                        check_angles(poly, *layer, allowed_angles, name.as_deref())
                    })
                    .collect()
            }

            Rule::MinSpacing {
                layer1,
                layer2,
                spacing,
                name,
            } => {
                let polys1 = polygons_by_layer.get(layer1);
                let polys2 = polygons_by_layer.get(layer2);

                match (polys1, polys2) {
                    (Some(p1), Some(p2)) => check_spacing(
                        p1,
                        *layer1,
                        p2,
                        *layer2,
                        *spacing,
                        name.as_deref(),
                        layer1 == layer2,
                    ),
                    _ => Vec::new(),
                }
            }

            Rule::Enclosure {
                inner,
                outer,
                enclosure,
                name,
            } => {
                let inner_polys = polygons_by_layer.get(inner);
                let outer_polys = polygons_by_layer.get(outer);

                match (inner_polys, outer_polys) {
                    (Some(ip), Some(op)) => {
                        let mut violations = Vec::new();
                        // For each inner polygon, check if ANY outer polygon encloses it.
                        // Only report a violation if no outer polygon provides sufficient enclosure.
                        for (inner_poly, _) in ip {
                            let mut best_violation: Option<DrcViolation> = None;
                            let mut is_enclosed = false;

                            for (outer_poly, _) in op {
                                match check_enclosure(
                                    inner_poly,
                                    *inner,
                                    outer_poly,
                                    *outer,
                                    *enclosure,
                                    name.as_deref(),
                                ) {
                                    None => {
                                        // This outer polygon encloses the inner one — no violation
                                        is_enclosed = true;
                                        break;
                                    }
                                    Some(v) => {
                                        // Keep the closest near-miss (largest actual value).
                                        // This gives the most actionable report: "you need 0.1
                                        // more enclosure" is more useful than "no enclosure
                                        // at all" from a distant unrelated outer polygon.
                                        let dominated = best_violation.as_ref().is_none_or(|bv| {
                                            match (&bv.rule_type, &v.rule_type) {
                                                (
                                                    RuleType::Enclosure {
                                                        actual: best_actual,
                                                        ..
                                                    },
                                                    RuleType::Enclosure {
                                                        actual: new_actual, ..
                                                    },
                                                ) => *new_actual > *best_actual,
                                                _ => false,
                                            }
                                        });
                                        if dominated {
                                            best_violation = Some(v);
                                        }
                                    }
                                }
                            }

                            if !is_enclosed && let Some(v) = best_violation {
                                violations.push(v);
                            }
                        }
                        violations
                    }
                    (Some(ip), None) => {
                        // Inner polygons exist but no outer polygons — every inner is unenclosed
                        let mut violations = Vec::new();
                        for (inner_poly, _) in ip {
                            let mut violation = DrcViolation::new(
                                RuleType::Enclosure {
                                    required: *enclosure,
                                    actual: 0.0,
                                },
                                inner_poly.bbox(),
                                *inner,
                                format!(
                                    "Inner layer ({}, {}) has no enclosing geometry on outer layer ({}, {})",
                                    inner.number, inner.datatype, outer.number, outer.datatype
                                ),
                            )
                            .with_layer2(*outer)
                            .with_severity(Severity::Error);

                            if let Some(name) = name {
                                violation = violation.with_name(name);
                            }

                            violations.push(violation);
                        }
                        violations
                    }
                    _ => Vec::new(),
                }
            }

            Rule::RequireOverlap {
                layer1,
                layer2,
                name,
            } => {
                let polys1 = polygons_by_layer.get(layer1);
                let polys2 = polygons_by_layer.get(layer2);
                let same_layer = layer1 == layer2;
                let empty = Vec::new();

                // Both None and empty layer2 are handled inside the bulk function.
                let p1 = polys1.unwrap_or(&empty);
                let p2 = polys2.unwrap_or(&empty);

                check_require_overlap_bulk(p1, *layer1, p2, *layer2, name.as_deref(), same_layer)
            }

            Rule::ForbidOverlap {
                layer1,
                layer2,
                name,
            } => {
                let polys1 = polygons_by_layer.get(layer1);
                let polys2 = polygons_by_layer.get(layer2);
                let same_layer = layer1 == layer2;

                match (polys1, polys2) {
                    (Some(p1), Some(p2)) => check_forbid_overlap_bulk(
                        p1,
                        *layer1,
                        p2,
                        *layer2,
                        name.as_deref(),
                        same_layer,
                    ),
                    _ => Vec::new(),
                }
            }

            Rule::MinEdgeLength {
                layer,
                length,
                name,
            } => {
                let Some(polys) = polygons_by_layer.get(layer) else {
                    return Vec::new();
                };

                polys
                    .iter()
                    .flat_map(|(poly, _)| check_edge_length(poly, *layer, *length, name.as_deref()))
                    .collect()
            }

            Rule::SelfIntersection { layer, name } => {
                let Some(polys) = polygons_by_layer.get(layer) else {
                    return Vec::new();
                };

                polys
                    .iter()
                    .filter_map(|(poly, _)| check_self_intersection(poly, *layer, name.as_deref()))
                    .collect()
            }

            Rule::MaxWidth { layer, width, name } => {
                let Some(polys) = polygons_by_layer.get(layer) else {
                    return Vec::new();
                };

                polys
                    .iter()
                    .filter_map(|(poly, _)| check_max_width(poly, *layer, *width, name.as_deref()))
                    .collect()
            }
        }
    }
}

/// Convenience function to run DRC.
pub fn run_drc(cell: &Cell, rules: &DrcRules, library: Option<&Library>) -> DrcResult {
    DrcRunner::new(rules.clone()).check(cell, library)
}

#[cfg(test)]
mod tests {
    use super::*;
    use rosette_core::{CellRef, Point};

    #[test]
    fn test_empty_cell() {
        let cell = Cell::new("empty");
        let rules = DrcRules::new().min_area(Layer::new(1, 0), 1.0, None);

        let result = run_drc(&cell, &rules, None);
        assert!(result.passed());
        assert_eq!(result.stats.polygons_checked, 0);
    }

    #[test]
    fn test_min_area_pass() {
        let mut cell = Cell::new("test");
        cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 10.0), Layer::new(1, 0));

        let rules = DrcRules::new().min_area(Layer::new(1, 0), 50.0, None);
        let result = run_drc(&cell, &rules, None);

        assert!(result.passed());
    }

    #[test]
    fn test_min_area_fail() {
        let mut cell = Cell::new("test");
        cell.add_polygon(Polygon::rect(Point::origin(), 2.0, 2.0), Layer::new(1, 0));

        let rules = DrcRules::new().min_area(Layer::new(1, 0), 50.0, Some("MIN_AREA"));
        let result = run_drc(&cell, &rules, None);

        assert!(!result.passed());
        assert_eq!(result.violations.len(), 1);
        assert_eq!(result.violations[0].rule_name, Some("MIN_AREA".to_string()));
    }

    #[test]
    fn test_multiple_rules() {
        let mut cell = Cell::new("test");
        cell.add_polygon(Polygon::rect(Point::origin(), 2.0, 2.0), Layer::new(1, 0));

        let rules = DrcRules::new()
            .min_area(Layer::new(1, 0), 50.0, None)
            .min_width(Layer::new(1, 0), 5.0, None);

        let result = run_drc(&cell, &rules, None);

        assert!(!result.passed());
        assert_eq!(result.violations.len(), 2);
        assert_eq!(result.stats.rules_checked, 2);
    }

    // --- Bug fix tests ---

    #[test]
    fn test_require_overlap_propagates_name_and_layer2() {
        // Two non-overlapping polygons on different layers with a named require_overlap rule
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );
        cell.add_polygon(
            Polygon::rect(Point::new(20.0, 0.0), 5.0, 5.0),
            Layer::new(2, 0),
        );

        let rules =
            DrcRules::new().require_overlap(Layer::new(1, 0), Layer::new(2, 0), Some("VIA_OVLP"));
        let result = run_drc(&cell, &rules, None);

        assert!(!result.passed());
        assert_eq!(result.violations.len(), 1);

        let v = &result.violations[0];
        assert_eq!(v.rule_name, Some("VIA_OVLP".to_string()));
        assert_eq!(v.layer, Layer::new(1, 0));
        assert_eq!(v.layer2, Some(Layer::new(2, 0)));
        assert!(matches!(v.rule_type, RuleType::MissingOverlap));
    }

    #[test]
    fn test_require_overlap_empty_layer2() {
        // Polygon on layer1 but nothing on layer2 — should still report violation
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );

        let rules =
            DrcRules::new().require_overlap(Layer::new(1, 0), Layer::new(2, 0), Some("MUST_OVLP"));
        let result = run_drc(&cell, &rules, None);

        assert!(!result.passed());
        assert_eq!(result.violations.len(), 1);

        let v = &result.violations[0];
        assert_eq!(v.rule_name, Some("MUST_OVLP".to_string()));
        assert_eq!(v.layer2, Some(Layer::new(2, 0)));
        assert!(v.message.contains("layer is empty"));
    }

    #[test]
    fn test_require_overlap_passes_when_overlapping() {
        // Overlapping polygons should pass
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );
        cell.add_polygon(
            Polygon::rect(Point::new(3.0, 0.0), 5.0, 5.0),
            Layer::new(2, 0),
        );

        let rules =
            DrcRules::new().require_overlap(Layer::new(1, 0), Layer::new(2, 0), Some("OVLP"));
        let result = run_drc(&cell, &rules, None);

        assert!(result.passed());
    }

    #[test]
    fn test_require_overlap_same_layer_isolated_polygon_fails() {
        // A single polygon has no other polygon to overlap with
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );

        let rules =
            DrcRules::new().require_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("SELF_OVLP"));
        let result = run_drc(&cell, &rules, None);

        assert!(
            !result.passed(),
            "Single polygon should fail same-layer require_overlap (no other polygon to overlap)"
        );
        assert_eq!(result.violations.len(), 1);
    }

    #[test]
    fn test_require_overlap_same_layer_overlapping_passes() {
        // Two overlapping polygons on the same layer should pass
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );
        cell.add_polygon(
            Polygon::rect(Point::new(3.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );

        let rules =
            DrcRules::new().require_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("SELF_OVLP"));
        let result = run_drc(&cell, &rules, None);

        assert!(
            result.passed(),
            "Two overlapping same-layer polygons should pass require_overlap"
        );
    }

    #[test]
    fn test_require_overlap_same_layer_non_overlapping_fails() {
        // Two non-overlapping polygons should each fail (neither overlaps another)
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );
        cell.add_polygon(
            Polygon::rect(Point::new(10.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );

        let rules =
            DrcRules::new().require_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("SELF_OVLP"));
        let result = run_drc(&cell, &rules, None);

        assert!(
            !result.passed(),
            "Two non-overlapping same-layer polygons should fail require_overlap"
        );
        assert_eq!(
            result.violations.len(),
            2,
            "Each polygon should have its own violation"
        );
    }

    #[test]
    fn test_enclosure_any_outer_sufficient() {
        // Inner polygon enclosed by the second outer polygon but not the first.
        // Should pass because ANY outer is sufficient.
        let mut cell = Cell::new("test");

        // Inner: small box at (50, 50)
        cell.add_polygon(
            Polygon::rect(Point::new(50.0, 50.0), 5.0, 5.0),
            Layer::new(2, 0),
        );
        // Outer 1: far away — does NOT enclose inner
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0),
            Layer::new(1, 0),
        );
        // Outer 2: large box around inner — DOES enclose it
        cell.add_polygon(
            Polygon::rect(Point::new(40.0, 40.0), 25.0, 25.0),
            Layer::new(1, 0),
        );

        let rules =
            DrcRules::new().min_enclosure(Layer::new(2, 0), Layer::new(1, 0), 4.0, Some("ENC"));
        let result = run_drc(&cell, &rules, None);

        assert!(
            result.passed(),
            "Should pass because outer2 encloses inner, got {} violations",
            result.violations.len()
        );
    }

    #[test]
    fn test_enclosure_fails_when_no_outer_encloses() {
        // Inner polygon not enclosed by any outer polygon
        let mut cell = Cell::new("test");

        // Inner: box at (50, 50)
        cell.add_polygon(
            Polygon::rect(Point::new(50.0, 50.0), 5.0, 5.0),
            Layer::new(2, 0),
        );
        // Outer 1: too far away
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0),
            Layer::new(1, 0),
        );

        let rules =
            DrcRules::new().min_enclosure(Layer::new(2, 0), Layer::new(1, 0), 1.0, Some("ENC"));
        let result = run_drc(&cell, &rules, None);

        assert!(!result.passed());
        assert_eq!(result.violations.len(), 1);
        assert_eq!(result.violations[0].rule_name, Some("ENC".to_string()));
    }

    #[test]
    fn test_enclosure_no_outer_polygons() {
        // Inner polygon exists but no outer polygons at all
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(2, 0),
        );

        let rules = DrcRules::new().min_enclosure(
            Layer::new(2, 0),
            Layer::new(1, 0),
            1.0,
            Some("ENC_MISSING"),
        );
        let result = run_drc(&cell, &rules, None);

        assert!(!result.passed());
        assert_eq!(result.violations.len(), 1);

        let v = &result.violations[0];
        assert_eq!(v.rule_name, Some("ENC_MISSING".to_string()));
        assert_eq!(v.layer2, Some(Layer::new(1, 0)));
    }

    #[test]
    fn test_forbid_overlap_same_layer_no_self_compare() {
        // A single polygon on a layer must not be flagged against itself
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );

        let rules =
            DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
        let result = run_drc(&cell, &rules, None);

        assert!(
            result.passed(),
            "Single polygon should not trigger same-layer forbid_overlap (self-comparison)"
        );
    }

    #[test]
    fn test_forbid_overlap_same_layer_detects_overlap() {
        // Two overlapping polygons on the same layer should be flagged
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );
        cell.add_polygon(
            Polygon::rect(Point::new(3.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );

        let rules =
            DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
        let result = run_drc(&cell, &rules, None);

        assert!(
            !result.passed(),
            "Two overlapping same-layer polygons should fail forbid_overlap"
        );
        assert_eq!(
            result.violations.len(),
            1,
            "Should produce exactly one violation (no duplicate)"
        );
        assert_eq!(result.violations[0].rule_name, Some("NO_OVLP".to_string()));

        // Intra-cell violations should have both cell names set to the same cell
        let v = &result.violations[0];
        assert_eq!(v.cell_name, Some("test".to_string()));
        assert_eq!(v.cell_name2, Some("test".to_string()));
    }

    #[test]
    fn test_forbid_overlap_same_layer_non_overlapping_passes() {
        // Two non-overlapping polygons on the same layer should pass
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );
        cell.add_polygon(
            Polygon::rect(Point::new(10.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );

        let rules =
            DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
        let result = run_drc(&cell, &rules, None);

        assert!(
            result.passed(),
            "Two non-overlapping same-layer polygons should pass forbid_overlap"
        );
    }

    #[test]
    fn test_flatten_handles_repetition() {
        // Create a child cell with a small polygon
        let mut child = Cell::new("child");
        child.add_polygon(Polygon::rect(Point::origin(), 2.0, 2.0), Layer::new(1, 0));

        // Create top cell with an array reference: 3 columns, 2 rows
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("child").array(3, 2, 10.0, 20.0));

        let mut lib = Library::new("test_lib");
        lib.add_cell(child).unwrap();
        lib.add_cell(top).unwrap();

        // min_area rule that passes for each instance
        let rules = DrcRules::new().min_area(Layer::new(1, 0), 1.0, None);
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

        assert!(result.passed());
        // 3 columns * 2 rows = 6 polygon instances
        assert_eq!(
            result.stats.polygons_checked, 6,
            "Expected 6 polygons from 3x2 array, got {}",
            result.stats.polygons_checked
        );
    }

    #[test]
    fn test_flatten_handles_repetition_spacing() {
        // Array of small polygons that are too close together
        let mut child = Cell::new("child");
        child.add_polygon(Polygon::rect(Point::origin(), 3.0, 3.0), Layer::new(1, 0));

        // 2 columns with 5.0 spacing — gap is only 2.0 (5.0 - 3.0)
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("child").array(2, 1, 5.0, 10.0));

        let mut lib = Library::new("test_lib");
        lib.add_cell(child).unwrap();
        lib.add_cell(top).unwrap();

        let rules =
            DrcRules::new().min_spacing(Layer::new(1, 0), Layer::new(1, 0), 3.0, Some("SPC"));
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

        assert!(
            !result.passed(),
            "Should fail: gap is 2.0 but min_spacing is 3.0"
        );
    }

    #[test]
    fn test_flatten_handles_paths() {
        // Cell with a path element — should be converted to polygon for DRC
        let mut cell = Cell::new("test");
        cell.add_path_simple(
            vec![Point::new(0.0, 0.0), Point::new(20.0, 0.0)],
            2.0,
            Layer::new(1, 0),
        );

        // The path (width=2.0, length=20.0) becomes a polygon with area ~40
        let rules = DrcRules::new().min_area(Layer::new(1, 0), 30.0, None);
        let result = run_drc(&cell, &rules, None);

        assert_eq!(
            result.stats.polygons_checked, 1,
            "Path should be converted to 1 polygon"
        );
        assert!(
            result.passed(),
            "Path-derived polygon should pass min_area=30"
        );
    }

    #[test]
    fn test_flatten_path_width_checked() {
        // Path with width 1.0 should fail min_width=2.0
        let mut cell = Cell::new("test");
        cell.add_path_simple(
            vec![Point::new(0.0, 0.0), Point::new(20.0, 0.0)],
            1.0,
            Layer::new(1, 0),
        );

        let rules = DrcRules::new().min_width(Layer::new(1, 0), 2.0, Some("PATH_W"));
        let result = run_drc(&cell, &rules, None);

        assert!(
            !result.passed(),
            "Path with width=1.0 should fail min_width=2.0"
        );
    }

    #[test]
    fn test_forbid_overlap_cross_hierarchy() {
        // Child cell has a polygon at (0,0)-(5,5).
        // Top cell has a polygon at (3,0)-(8,5) AND a CellRef to child.
        // The two polygons overlap — DRC should catch it across hierarchy.
        let mut child = Cell::new("child");
        child.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );

        let mut top = Cell::new("top");
        top.add_polygon(
            Polygon::rect(Point::new(3.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );
        top.add_ref(CellRef::new("child"));

        let mut lib = Library::new("test_lib");
        lib.add_cell(child).unwrap();
        lib.add_cell(top).unwrap();

        let rules =
            DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

        assert!(
            !result.passed(),
            "Cross-hierarchy overlapping polygons should fail forbid_overlap"
        );
        assert_eq!(result.violations.len(), 1);
        assert_eq!(
            result.stats.polygons_checked, 2,
            "Should see 2 polygons: one from top, one from child"
        );

        // Verify cell names are attached to the violation
        let v = &result.violations[0];
        assert!(v.cell_name.is_some(), "cell_name should be set");
        assert!(v.cell_name2.is_some(), "cell_name2 should be set");
        // One should be "top", the other "child" (order depends on group iteration)
        let names: std::collections::HashSet<&str> = [
            v.cell_name.as_deref().unwrap(),
            v.cell_name2.as_deref().unwrap(),
        ]
        .into_iter()
        .collect();
        assert!(names.contains("top"), "violation should reference 'top'");
        assert!(
            names.contains("child"),
            "violation should reference 'child'"
        );
    }

    #[test]
    fn test_forbid_overlap_cross_hierarchy_no_overlap_passes() {
        // Child cell polygon at (0,0)-(5,5), top cell polygon at (10,0)-(15,5).
        // No overlap — should pass.
        let mut child = Cell::new("child");
        child.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );

        let mut top = Cell::new("top");
        top.add_polygon(
            Polygon::rect(Point::new(10.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );
        top.add_ref(CellRef::new("child"));

        let mut lib = Library::new("test_lib");
        lib.add_cell(child).unwrap();
        lib.add_cell(top).unwrap();

        let rules =
            DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

        assert!(
            result.passed(),
            "Non-overlapping cross-hierarchy polygons should pass"
        );
    }

    #[test]
    fn test_forbid_overlap_array_instances_overlap() {
        // Child cell has a 4-wide polygon. Array with col_spacing=3 means
        // copies overlap by 1 unit each.
        let mut child = Cell::new("child");
        child.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 4.0, 2.0),
            Layer::new(1, 0),
        );

        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("child").array(3, 1, 3.0, 10.0));

        let mut lib = Library::new("test_lib");
        lib.add_cell(child).unwrap();
        lib.add_cell(top).unwrap();

        let rules =
            DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

        assert!(
            !result.passed(),
            "Array instances with overlapping polygons should fail forbid_overlap"
        );
        // 3 copies: pairs (0,1) and (1,2) overlap, but (0,2) don't
        assert_eq!(
            result.violations.len(),
            2,
            "Should have 2 violations for 3 overlapping-adjacent copies"
        );
    }

    #[test]
    fn test_forbid_overlap_many_non_overlapping_fast() {
        // Many non-overlapping polygons spread apart. The bbox pre-filter should
        // skip expensive boolean intersection for all pairs.
        let mut cell = Cell::new("test");
        for i in 0..50 {
            cell.add_polygon(
                Polygon::rect(Point::new(i as f64 * 20.0, 0.0), 5.0, 5.0),
                Layer::new(1, 0),
            );
        }

        let rules =
            DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
        let result = run_drc(&cell, &rules, None);

        assert!(
            result.passed(),
            "Well-spaced polygons should not trigger overlap violations"
        );
        assert_eq!(result.stats.polygons_checked, 50);
    }

    #[test]
    fn test_require_overlap_many_separated_fast() {
        // Mirror of test_forbid_overlap_many_non_overlapping_fast but for
        // require_overlap. 50 polygons on layer1 each paired with an overlapping
        // polygon on layer2. The R-tree bulk path should resolve these in
        // O(n log n) rather than O(n*m) boolean intersections.
        let mut cell = Cell::new("test");
        let layer1 = Layer::new(1, 0);
        let layer2 = Layer::new(2, 0);

        for i in 0..50 {
            let x = i as f64 * 20.0;
            cell.add_polygon(Polygon::rect(Point::new(x, 0.0), 5.0, 5.0), layer1);
            cell.add_polygon(Polygon::rect(Point::new(x + 1.0, 0.0), 5.0, 5.0), layer2);
        }

        let rules = DrcRules::new().require_overlap(layer1, layer2, Some("REQ_OVLP"));
        let result = run_drc(&cell, &rules, None);

        assert!(
            result.passed(),
            "Each layer1 polygon overlaps a layer2 polygon — should pass"
        );
        assert_eq!(result.stats.polygons_checked, 100);
    }

    #[test]
    fn test_require_overlap_many_no_match_reports_all() {
        // 50 polygons on layer1, none on layer2. Every polygon should report a
        // missing-overlap violation.
        let mut cell = Cell::new("test");
        let layer1 = Layer::new(1, 0);
        let layer2 = Layer::new(2, 0);

        for i in 0..50 {
            cell.add_polygon(
                Polygon::rect(Point::new(i as f64 * 20.0, 0.0), 5.0, 5.0),
                layer1,
            );
        }

        let rules = DrcRules::new().require_overlap(layer1, layer2, Some("REQ_OVLP"));
        let result = run_drc(&cell, &rules, None);

        assert!(!result.passed());
        assert_eq!(
            result.violations.len(),
            50,
            "Each polygon should have a missing-overlap violation"
        );
    }

    #[test]
    fn test_spacing_skip_touching_at_ports() {
        // Simulate route polygon abutting component polygon at a port connection.
        // Touching polygons (distance=0) should NOT produce spacing violations.
        let mut cell = Cell::new("test");
        // Component polygon: 0..10 x 0..2
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 10.0, 2.0),
            Layer::new(1, 0),
        );
        // Route polygon: 10..20 x 0..2 (abuts at x=10)
        cell.add_polygon(
            Polygon::rect(Point::new(10.0, 0.0), 10.0, 2.0),
            Layer::new(1, 0),
        );

        let rules =
            DrcRules::new().min_spacing(Layer::new(1, 0), Layer::new(1, 0), 0.15, Some("SPC"));
        let result = run_drc(&cell, &rules, None);

        assert!(
            result.passed(),
            "Touching polygons at port connections should not fail spacing"
        );
    }

    #[test]
    fn test_non_rigid_transform_catches_width_violation() {
        // A child cell has a polygon with width 0.5 (passes min_width=0.15).
        // When scaled 0.1x in X direction, the actual width becomes 0.05 (fails).
        // The hierarchy-aware DRC must detect this despite the cell being reused.
        let mut child = Cell::new("narrow");
        // 0.5 wide, 10 long rectangle
        child.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 10.0, 0.5),
            Layer::new(1, 0),
        );

        // Create top cell with two refs: one rigid (passes), one scaled (should fail)
        let mut top = Cell::new("top");
        // Rigid instance at origin — width is 0.5, passes min_width=0.15
        top.add_ref(CellRef::new("narrow"));
        // Non-uniform scale: 0.1x in X — polygon becomes 1.0 x 0.05, width = 0.05
        top.add_ref(CellRef::with_transform(
            "narrow",
            Transform::scale(0.1, 0.1),
        ));

        let mut lib = Library::new("test_lib");
        lib.add_cell(child).unwrap();
        lib.add_cell(top).unwrap();

        let rules = DrcRules::new().min_width(Layer::new(1, 0), 0.15, Some("WIDTH"));
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

        assert!(
            !result.passed(),
            "Non-rigid scaled instance with insufficient width should fail min_width"
        );
    }

    #[test]
    fn test_rigid_transform_deduplicates() {
        // Multiple rigid instances of the same cell should only be checked once
        // (no duplicate violations).
        let mut child = Cell::new("tiny");
        // 0.05 wide polygon — fails min_width=0.15
        child.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 1.0, 0.05),
            Layer::new(1, 0),
        );

        let mut top = Cell::new("top");
        // 3 rigid instances at different positions
        top.add_ref(CellRef::new("tiny").at(0.0, 0.0));
        top.add_ref(CellRef::new("tiny").at(100.0, 0.0));
        top.add_ref(CellRef::new("tiny").at(200.0, 0.0));

        let mut lib = Library::new("test_lib");
        lib.add_cell(child).unwrap();
        lib.add_cell(top).unwrap();

        let rules = DrcRules::new().min_width(Layer::new(1, 0), 0.15, Some("WIDTH"));
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

        assert!(!result.passed());
        // Should report 1 violation (from the cell definition), not 3
        assert_eq!(
            result.violations.len(),
            1,
            "Rigid instances should deduplicate per-polygon violations"
        );
    }
}

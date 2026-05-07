//! DRC execution engine.

use std::collections::{HashMap, HashSet};
use std::time::{Duration, Instant};

use rosette_core::cell::Element;
use rosette_core::{BBox, Cell, Layer, Library, Point, Polygon, Transform, offset_polygon};

use crate::checks::{
    check_acute_angle, check_angles, check_area, check_density, check_edge_length,
    check_enclosure_bulk, check_forbid_overlap_bulk, check_max_width, check_not_inside,
    check_require_overlap_bulk, check_self_intersection, check_snap_to_grid, check_spacing,
    check_width, compute_region_bbox,
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
    /// Number of violations suppressed by `drc_skip` post-filtering.
    ///
    /// A violation is suppressed iff every cell it names
    /// (`cell_name`, `cell_name2`) is within the skipped-cell closure
    /// (a cell with `drc_skip = true` or any cell reachable from it via
    /// `CellRef`). As of ROS-552, per-polygon rules and cross-layer
    /// pairwise rules also carry cell-name provenance and therefore
    /// participate in suppression. The only rule that doesn't is
    /// `Density`, whose window-based check has no single source cell.
    pub suppressed_violations: usize,
    /// Number of unique cell names in the skipped-cell closure for this
    /// run.
    pub skipped_cells: usize,
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
    /// Whether the DRC check passed.
    ///
    /// Returns `true` if there are no error-severity violations. Warnings (see
    /// [`DrcRules::warning_margin`]) do not cause the check to fail, so a
    /// result containing only warnings still passes.
    pub fn passed(&self) -> bool {
        !self
            .violations
            .iter()
            .any(|v| v.severity == Severity::Error)
    }

    /// Total number of violations (errors **plus** warnings).
    ///
    /// Use [`Self::error_count`] if you want to gate pass/fail, since
    /// warnings do not cause [`Self::passed`] to return `false`.
    pub fn violation_count(&self) -> usize {
        self.violations.len()
    }

    /// Number of error-severity violations.
    pub fn error_count(&self) -> usize {
        self.violations
            .iter()
            .filter(|v| v.severity == Severity::Error)
            .count()
    }

    /// Number of warning-severity violations.
    pub fn warning_count(&self) -> usize {
        self.violations
            .iter()
            .filter(|v| v.severity == Severity::Warning)
            .count()
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

/// Compute the set of cell names whose violations should be suppressed.
///
/// This is the "skipped closure": every cell with `drc_skip = true` that is
/// reachable from the top cell (via `CellRef` through the optional library),
/// plus every cell reachable from any such cell via `CellRef`.
///
/// The top cell itself is considered if it has `drc_skip = true`.
///
/// Implementation note: uses two passes rather than a single DFS with an
/// "ancestor trusted" flag, because the latter is visit-order-dependent in
/// diamond hierarchies — a shared cell reached first via an untrusted parent
/// would be marked visited before a later visit via a trusted parent could
/// add it to the closure.
fn collect_skipped_closure(top: &Cell, library: Option<&Library>) -> HashSet<String> {
    // Pass 1: find every cell with drc_skip = true that is reachable from
    // the top cell.
    let mut roots: Vec<String> = Vec::new();
    let mut visited: HashSet<String> = HashSet::new();
    collect_skipped_roots(top, library, &mut roots, &mut visited);

    // Pass 2: expand each root into the full subtree of reachable cells.
    let mut closure: HashSet<String> = HashSet::new();
    for root in &roots {
        if closure.contains(root) {
            continue;
        }
        match library.and_then(|lib| lib.cell(root).map(|c| (lib, c))) {
            Some((lib, cell)) => expand_subtree(cell, lib, &mut closure),
            None => {
                // Root cell not in the library (e.g. the top cell with no
                // library). Just add the name itself.
                closure.insert(root.clone());
            }
        }
    }
    closure
}

/// Walk the hierarchy and collect names of every cell with `drc_skip = true`.
fn collect_skipped_roots(
    cell: &Cell,
    library: Option<&Library>,
    roots: &mut Vec<String>,
    visited: &mut HashSet<String>,
) {
    if !visited.insert(cell.name().to_string()) {
        return;
    }
    if cell.drc_skip() {
        roots.push(cell.name().to_string());
    }
    for element in cell.elements() {
        if let Element::CellRef(cell_ref) = element
            && let Some(lib) = library
            && let Some(ref_cell) = lib.cell(&cell_ref.cell_name)
        {
            collect_skipped_roots(ref_cell, Some(lib), roots, visited);
        }
    }
}

/// Recursively add `cell` and every cell reachable from it (via the library)
/// to `closure`. The visited set is `closure` itself.
fn expand_subtree(cell: &Cell, library: &Library, closure: &mut HashSet<String>) {
    if !closure.insert(cell.name().to_string()) {
        return;
    }
    for element in cell.elements() {
        if let Element::CellRef(cell_ref) = element
            && let Some(ref_cell) = library.cell(&cell_ref.cell_name)
        {
            expand_subtree(ref_cell, library, closure);
        }
    }
}

/// Apply the `drc_skip` suppression predicate to a list of violations.
///
/// A violation is suppressed iff `cell_name` and `cell_name2` are both
/// `Some(name)` with both names in `skipped`. Violations with any `None`
/// attribution are kept (safe default — we don't hide violations we can't
/// attribute).
///
/// Returns `(kept, suppressed_count)`.
fn apply_drc_skip_filter(
    violations: Vec<DrcViolation>,
    skipped: &HashSet<String>,
) -> (Vec<DrcViolation>, usize) {
    if skipped.is_empty() {
        return (violations, 0);
    }
    let mut kept = Vec::with_capacity(violations.len());
    let mut suppressed = 0usize;
    for v in violations {
        let should_suppress = match (&v.cell_name, &v.cell_name2) {
            (Some(a), Some(b)) => skipped.contains(a) && skipped.contains(b),
            // Single-side attribution (e.g. per-polygon rules, one-sided
            // Enclosure/NotInside): suppress iff the only named cell is
            // trusted. This is what makes drc_skip work for per-polygon
            // violations after ROS-552 populated provenance.
            (Some(a), None) => skipped.contains(a),
            _ => false,
        };
        if should_suppress {
            suppressed += 1;
        } else {
            kept.push(v);
        }
    }
    (kept, suppressed)
}

/// Map internal `polygon_idx`/`polygon_idx2` fields on each violation to
/// `cell_name`/`cell_name2` using a side-table built during flattening.
///
/// Cell names that were already set (by Phase 1/2 per-instance emission or
/// by the same-layer inter-instance pass) are left untouched. Empty strings
/// in the side-table (which would indicate an unclaimed index slot — in
/// practice this should never happen) are skipped rather than written
/// through, so a violation with truly unknown provenance keeps `None`
/// instead of becoming `Some("")`.
fn attach_cell_names(violations: &mut [DrcViolation], global_cell_names: &[String]) {
    for v in violations {
        if v.cell_name.is_none()
            && let Some(idx) = v.polygon_idx
            && let Some(name) = global_cell_names.get(idx)
            && !name.is_empty()
        {
            v.cell_name = Some(name.clone());
        }
        if v.cell_name2.is_none()
            && let Some(idx) = v.polygon_idx2
            && let Some(name) = global_cell_names.get(idx)
            && !name.is_empty()
        {
            v.cell_name2 = Some(name.clone());
        }
    }
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

        // Classify rules into three categories:
        // 1. Per-polygon, transform-invariant (width, area, angles, etc.)
        // 2. Per-polygon, transform-dependent (snap-to-grid — depends on final coords)
        // 3. Pairwise (spacing, overlap, enclosure)
        let mut per_polygon_rules: Vec<&Rule> = Vec::new();
        let mut transform_dep_rules: Vec<&Rule> = Vec::new();
        let mut pairwise_rules: Vec<&Rule> = Vec::new();

        for rule in self.rules.rules() {
            match rule {
                Rule::MinWidth { .. }
                | Rule::MinArea { .. }
                | Rule::AllowedAngles { .. }
                | Rule::MinEdgeLength { .. }
                | Rule::SelfIntersection { .. }
                | Rule::MaxWidth { .. }
                | Rule::AcuteAngle { .. } => per_polygon_rules.push(rule),
                Rule::SnapToGrid { .. } | Rule::Density { .. } => transform_dep_rules.push(rule),
                Rule::MinSpacing { .. }
                | Rule::Enclosure { .. }
                | Rule::RequireOverlap { .. }
                | Rule::ForbidOverlap { .. }
                | Rule::NotInside { .. } => pairwise_rules.push(rule),
            }
        }

        let mut violations = Vec::new();

        // Phase 1: Per-polygon rules — detect each unique cell once, emit
        // per-instance with `location` transformed into top-level global
        // coords and `cell_name` set to the owning cell.
        let mut per_polygon_cache: HashMap<String, Vec<DrcViolation>> = HashMap::new();
        if !per_polygon_rules.is_empty() {
            self.check_per_polygon_hierarchical(
                cell,
                library,
                &per_polygon_rules,
                &Transform::identity(),
                &mut per_polygon_cache,
                &mut violations,
            );
        }

        // Phases 2–3 and transform-dependent rules all need flattened geometry.
        let needs_flatten = !pairwise_rules.is_empty() || !transform_dep_rules.is_empty();
        let polygons_checked: usize;
        if needs_flatten {
            // Phase 2: Intra-cell same-layer pairwise — same detect-once,
            // emit-per-instance model as Phase 1.
            if !pairwise_rules.is_empty() {
                let mut intra_cache: HashMap<String, Vec<DrcViolation>> = HashMap::new();
                self.check_intra_cell_pairwise(
                    cell,
                    library,
                    &pairwise_rules,
                    &Transform::identity(),
                    &mut intra_cache,
                    &mut violations,
                );
            }

            // Flatten into per-instance groups with transformed coordinates.
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

            // Build a side-table mapping global polygon index to its owning
            // cell name. `check_rule` emits violations with `polygon_idx`
            // (and `polygon_idx2` for pairwise) populated; we map those
            // indices to cell names at the end.
            let global_cell_names = Self::build_global_cell_names(&instance_groups, global_index);

            let merged = Self::merge_instance_groups(&instance_groups);

            // Transform-dependent per-polygon rules run on flattened geometry
            // so they see final world coordinates (e.g., snap-to-grid depends
            // on the actual vertex positions after all transforms).
            let mut transform_dep_violations = Vec::new();
            for rule in &transform_dep_rules {
                transform_dep_violations.extend(self.check_rule(rule, &merged));
            }
            attach_cell_names(&mut transform_dep_violations, &global_cell_names);
            violations.extend(transform_dep_violations);

            // Phase 3: Inter-instance pairwise checks
            let mut pairwise_violations = Vec::new();
            for rule in &pairwise_rules {
                pairwise_violations.extend(self.check_pairwise_rule_inter_instance(
                    rule,
                    &instance_groups,
                    &merged,
                ));
            }
            attach_cell_names(&mut pairwise_violations, &global_cell_names);
            violations.extend(pairwise_violations);
        } else {
            polygons_checked = self.count_polygons(cell, library);
        }

        // Downgrade near-threshold violations to warnings if a global
        // `warning_margin` is configured. This is a single post-processing
        // pass over the collected violations so individual checks stay
        // ignorant of severity policy.
        if let Some(margin) = self.rules.warning_margin_value() {
            for v in &mut violations {
                if is_near_threshold(&v.rule_type, margin) {
                    v.severity = Severity::Warning;
                }
            }
        }

        // Post-filter: suppress violations attributed entirely to trusted
        // (drc_skip) cells. The runner itself stays ignorant of trust; we
        // just drop the violations afterwards.
        let skipped_closure = collect_skipped_closure(cell, library);
        let (kept_violations, suppressed_count) =
            apply_drc_skip_filter(violations, &skipped_closure);

        DrcResult {
            violations: kept_violations,
            stats: DrcStats {
                polygons_checked,
                rules_checked: self.rules.rules().len(),
                elapsed: start.elapsed(),
                suppressed_violations: suppressed_count,
                skipped_cells: skipped_closure.len(),
            },
        }
    }

    /// Check per-polygon rules hierarchically, visiting each unique cell once.
    ///
    /// For cells referenced only through rigid transforms (rotation, translation,
    /// reflection), per-polygon properties are invariant so we detect once on
    /// local (untransformed) geometry. Each detected violation is then cloned
    /// for every rigid instance of that cell, with `location` transformed into
    /// top-level global coordinates and `cell_name` set.
    ///
    /// For non-rigid transforms (non-uniform scale), the transformed geometry
    /// is checked per instance since width/area/angles change under such
    /// transforms — those violations are emitted directly in global coords.
    fn check_per_polygon_hierarchical(
        &self,
        cell: &Cell,
        library: Option<&Library>,
        rules: &[&Rule],
        transform: &Transform,
        detection_cache: &mut HashMap<String, Vec<DrcViolation>>,
        violations: &mut Vec<DrcViolation>,
    ) {
        if transform.is_rigid() {
            // Rigid transform: per-polygon properties are invariant. Detect
            // once per unique cell, cache the local-frame violations.
            let cached = detection_cache
                .entry(cell.name().to_string())
                .or_insert_with(|| {
                    let local_polygons = self.collect_local_polygons(cell);
                    let mut out = Vec::new();
                    for rule in rules {
                        out.extend(self.check_rule(rule, &local_polygons));
                    }
                    out
                });
            // Emit one violation per rigid instance with transformed location.
            for template in cached.iter() {
                let mut v = template.clone();
                v.location = v.location.transform(transform);
                v.cell_name = Some(cell.name().to_string());
                // Per-polygon violations have no second side.
                v.cell_name2 = None;
                // Polygon idx was relative to the local (per-cell) run; it
                // no longer maps to anything meaningful in the global
                // side-table, so clear it to avoid confusing downstream code.
                v.polygon_idx = None;
                v.polygon_idx2 = None;
                violations.push(v);
            }
        } else {
            // Non-rigid transform: check transformed geometry for this
            // specific instance. Violations already land in global coords.
            let transformed_polygons = self.collect_transformed_polygons(cell, transform);
            for rule in rules {
                for mut v in self.check_rule(rule, &transformed_polygons) {
                    v.cell_name = Some(cell.name().to_string());
                    v.cell_name2 = None;
                    v.polygon_idx = None;
                    v.polygon_idx2 = None;
                    violations.push(v);
                }
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
                        detection_cache,
                        violations,
                    );
                }
            }
        }
    }

    /// Check intra-cell pairwise rules (same-layer spacing and overlap only).
    ///
    /// For rigid transforms, detect once per unique cell on local geometry
    /// and emit per instance with `location` transformed into top-level
    /// global coordinates (the reported `actual` distance is distance-
    /// preserving under rigid transforms).
    ///
    /// For non-rigid transforms (non-uniform scale), detect on transformed
    /// geometry per-instance so the reported `actual` and `location` land
    /// in global coordinates — same pattern as
    /// [`Self::check_per_polygon_hierarchical`]. Phase 3 only cross-compares
    /// polygons from *different* instances, so intra-instance same-layer
    /// violations under non-rigid scaling would otherwise be lost.
    ///
    /// Only same-layer rules benefit from this path; cross-layer rules
    /// (enclosure, require_overlap) are handled in Phase 3's merged pass.
    fn check_intra_cell_pairwise(
        &self,
        cell: &Cell,
        library: Option<&Library>,
        rules: &[&Rule],
        transform: &Transform,
        detection_cache: &mut HashMap<String, Vec<DrcViolation>>,
        violations: &mut Vec<DrcViolation>,
    ) {
        let cell_name = cell.name().to_string();
        if transform.is_rigid() {
            // Rigid: distances are invariant, cache per unique cell.
            let cached = detection_cache.entry(cell_name.clone()).or_insert_with(|| {
                let local_polygons = self.collect_local_polygons(cell);
                let mut out = Vec::new();
                for rule in rules {
                    if Self::is_same_layer_pairwise(rule) {
                        out.extend(self.check_rule(rule, &local_polygons));
                    }
                }
                out
            });
            for template in cached.iter() {
                let mut v = template.clone();
                v.location = v.location.transform(transform);
                v.cell_name = Some(cell_name.clone());
                v.cell_name2 = Some(cell_name.clone());
                v.polygon_idx = None;
                v.polygon_idx2 = None;
                violations.push(v);
            }
        } else {
            // Non-rigid: re-detect on transformed geometry. The violation's
            // `location` and `actual` value both reflect the scaled shape.
            let transformed_polygons = self.collect_transformed_polygons(cell, transform);
            for rule in rules {
                if !Self::is_same_layer_pairwise(rule) {
                    continue;
                }
                for mut v in self.check_rule(rule, &transformed_polygons) {
                    v.cell_name = Some(cell_name.clone());
                    v.cell_name2 = Some(cell_name.clone());
                    v.polygon_idx = None;
                    v.polygon_idx2 = None;
                    violations.push(v);
                }
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
                    self.check_intra_cell_pairwise(
                        ref_cell,
                        Some(lib),
                        rules,
                        &combined,
                        detection_cache,
                        violations,
                    );
                }
            }
        }
    }

    /// Returns true iff `rule` is a same-layer pairwise rule (same-layer
    /// `MinSpacing` or `ForbidOverlap`). Same-layer pairwise rules are the
    /// only ones checked intra-cell in Phase 2; cross-layer and non-pairwise
    /// rules fall through to Phase 3's merged pass.
    fn is_same_layer_pairwise(rule: &Rule) -> bool {
        match rule {
            Rule::MinSpacing { layer1, layer2, .. } => layer1 == layer2,
            Rule::ForbidOverlap { layer1, layer2, .. } => layer1 == layer2,
            _ => false,
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

    /// Build a `global_index`-indexed side-table of cell names.
    ///
    /// `total` is the count returned by `flatten_into_groups` in its
    /// `global_index` out-parameter — the next unused index. Every
    /// `global_index` actually assigned to a polygon is strictly less than
    /// `total`, so the returned `Vec` has length `total`.
    ///
    /// Entries for indices that weren't assigned to a polygon (shouldn't
    /// happen in practice but kept for safety) are filled with empty strings.
    fn build_global_cell_names(groups: &[InstancePolygons], total: usize) -> Vec<String> {
        let mut names = vec![String::new(); total];
        for group in groups {
            for polys in group.polygons_by_layer.values() {
                for (_, idx) in polys {
                    if let Some(slot) = names.get_mut(*idx) {
                        *slot = group.cell_name.clone();
                    }
                }
            }
        }
        names
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
                // Annotate violations with source cell names.
                // Clear polygon_idx/polygon_idx2 set by check_spacing — we've
                // set cell_name/cell_name2 directly here, so the side-table
                // mapping in attach_cell_names would be redundant (it skips
                // already-set names anyway, but clearing keeps the indices
                // consistent with Phase 1/2 conventions).
                for mut v in inter_violations {
                    v.cell_name = Some(group_i.cell_name.clone());
                    v.cell_name2 = Some(group_j.cell_name.clone());
                    v.polygon_idx = None;
                    v.polygon_idx2 = None;
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
                // Annotate violations with source cell names; clear polygon
                // indices (see note in check_inter_instance_spacing).
                for mut v in inter_violations {
                    v.cell_name = Some(group_i.cell_name.clone());
                    v.cell_name2 = Some(group_j.cell_name.clone());
                    v.polygon_idx = None;
                    v.polygon_idx2 = None;
                    violations.push(v);
                }
            }
        }

        violations
    }

    /// Expand a CellRef's repetition into individual transforms.
    ///
    /// AREF pitch vectors (`col_vector`, `row_vector`) are defined in the
    /// CellRef's local (pre-transform) space, matching GDS writer semantics.
    /// We apply the per-copy translation BEFORE `cell_ref.transform` so
    /// copies lie along the transformed lattice vectors for
    /// rotated/mirrored/scaled refs.
    fn expand_cellref_transforms(cell_ref: &rosette_core::CellRef) -> Vec<Transform> {
        match &cell_ref.repetition {
            None => vec![cell_ref.transform],
            Some(rep) if rep.is_single() => vec![cell_ref.transform],
            Some(rep) => {
                let mut ts = Vec::with_capacity(rep.count());
                for row in 0..rep.rows {
                    for col in 0..rep.columns {
                        let offset = rep.copy_offset(col, row);
                        ts.push(
                            cell_ref
                                .transform
                                .then(&Transform::translate(offset.x, offset.y)),
                        );
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
                    .filter_map(|(poly, idx)| {
                        check_width(poly, *layer, *width, name.as_deref())
                            .map(|v| v.with_polygon_idx(*idx))
                    })
                    .collect()
            }

            Rule::MinArea { layer, area, name } => {
                let Some(polys) = polygons_by_layer.get(layer) else {
                    return Vec::new();
                };

                polys
                    .iter()
                    .filter_map(|(poly, idx)| {
                        check_area(poly, *layer, *area, name.as_deref())
                            .map(|v| v.with_polygon_idx(*idx))
                    })
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
                    .flat_map(|(poly, idx)| {
                        check_angles(poly, *layer, allowed_angles, name.as_deref())
                            .into_iter()
                            .map(|v| v.with_polygon_idx(*idx))
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
                let empty = Vec::new();
                let inner_polys = polygons_by_layer.get(inner).unwrap_or(&empty);
                let outer_polys = polygons_by_layer.get(outer).unwrap_or(&empty);

                // `check_enclosure_bulk` handles the empty-outer case (emits
                // "no enclosing geometry" per inner) and uses an R-tree so
                // each inner only compares against nearby outers — much
                // faster than the prior O(I×O) nested loop on large designs.
                check_enclosure_bulk(
                    inner_polys,
                    *inner,
                    outer_polys,
                    *outer,
                    *enclosure,
                    name.as_deref(),
                )
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
                    .flat_map(|(poly, idx)| {
                        check_edge_length(poly, *layer, *length, name.as_deref())
                            .into_iter()
                            .map(|v| v.with_polygon_idx(*idx))
                    })
                    .collect()
            }

            Rule::SelfIntersection { layer, name } => {
                let Some(polys) = polygons_by_layer.get(layer) else {
                    return Vec::new();
                };

                polys
                    .iter()
                    .filter_map(|(poly, idx)| {
                        check_self_intersection(poly, *layer, name.as_deref())
                            .map(|v| v.with_polygon_idx(*idx))
                    })
                    .collect()
            }

            Rule::MaxWidth { layer, width, name } => {
                let Some(polys) = polygons_by_layer.get(layer) else {
                    return Vec::new();
                };

                polys
                    .iter()
                    .filter_map(|(poly, idx)| {
                        check_max_width(poly, *layer, *width, name.as_deref())
                            .map(|v| v.with_polygon_idx(*idx))
                    })
                    .collect()
            }

            Rule::SnapToGrid {
                layer,
                grid_pitch,
                name,
            } => {
                let Some(polys) = polygons_by_layer.get(layer) else {
                    return Vec::new();
                };

                polys
                    .iter()
                    .flat_map(|(poly, idx)| {
                        check_snap_to_grid(poly, *layer, *grid_pitch, name.as_deref())
                            .into_iter()
                            .map(|v| v.with_polygon_idx(*idx))
                    })
                    .collect()
            }

            Rule::AcuteAngle {
                layer,
                threshold_deg,
                name,
            } => {
                let Some(polys) = polygons_by_layer.get(layer) else {
                    return Vec::new();
                };

                polys
                    .iter()
                    .flat_map(|(poly, idx)| {
                        check_acute_angle(poly, *layer, *threshold_deg, name.as_deref())
                            .into_iter()
                            .map(|v| v.with_polygon_idx(*idx))
                    })
                    .collect()
            }

            Rule::NotInside { inner, outer, name } => {
                let empty = Vec::new();
                let inner_polys = polygons_by_layer.get(inner).unwrap_or(&empty);
                let outer_polys = polygons_by_layer.get(outer).unwrap_or(&empty);

                check_not_inside(inner_polys, *inner, outer_polys, *outer, name.as_deref())
            }

            Rule::Density {
                layer,
                min,
                max,
                window,
                step,
                region_layer,
                name,
            } => {
                // Fallback region: union of bboxes of all flattened geometry
                // across every layer. This is the bbox of the design as
                // actually placed — equivalent to `Library::cell_bbox` on the
                // top cell, computed here from the already-flattened polygon
                // map without re-walking the hierarchy. When `region_layer`
                // is set, that layer's union drives the bbox instead.
                //
                // If the design is truly empty (no geometry anywhere), the
                // check cannot run — density is undefined without a region.
                // Users who want density checked over a specific extent
                // (e.g. reticle floor-plan with empty corners) must declare
                // a `region_layer`.
                let fallback = placed_geometry_bbox(polygons_by_layer);
                let region = match compute_region_bbox(*region_layer, polygons_by_layer, fallback) {
                    Some(r) => r,
                    None => return Vec::new(),
                };
                let empty = Vec::new();
                let target_polys = polygons_by_layer.get(layer).unwrap_or(&empty);
                check_density(
                    target_polys,
                    region,
                    *layer,
                    *min,
                    *max,
                    *window,
                    *step,
                    name.as_deref(),
                )
            }
        }
    }
}

/// Union bbox of every polygon across every layer in the merged map.
///
/// Returns `None` if no polygons exist. Used as the fallback region for
/// density checks when no `region_layer` is specified. Equivalent in value
/// to `Library::cell_bbox` on the top cell, since both describe the extent
/// of all geometry as placed.
fn placed_geometry_bbox(polygons_by_layer: &HashMap<Layer, Vec<(Polygon, usize)>>) -> Option<BBox> {
    let mut bb: Option<BBox> = None;
    for polys in polygons_by_layer.values() {
        for (poly, _) in polys {
            let pb = poly.bbox();
            bb = Some(match bb {
                Some(b) => b.merge(&pb),
                None => pb,
            });
        }
    }
    bb
}

/// Convenience function to run DRC.
pub fn run_drc(cell: &Cell, rules: &DrcRules, library: Option<&Library>) -> DrcResult {
    DrcRunner::new(rules.clone()).check(cell, library)
}

/// Return `true` if `rule_type` represents a numeric-threshold violation whose
/// `actual` value is within `margin` of the `required` threshold.
///
/// Only **length-unit** numeric threshold variants are eligible. `MinArea` is
/// deliberately excluded even though it has a numeric threshold: its values
/// are in squared user units (typically µm²), which cannot meaningfully be
/// compared against a length-unit `margin`. `Density` is excluded for the
/// same reason — its values are dimensionless fractions. Categorical / binary
/// violations (`ForbiddenAngle`, `ForbiddenOverlap`, `SelfIntersection`,
/// `OffGrid`, `NotInside`, `AcuteAngle`, `MissingOverlap`) are never
/// "near-threshold" — they are binary.
fn is_near_threshold(rule_type: &RuleType, margin: f64) -> bool {
    if margin <= 0.0 {
        return false;
    }
    match rule_type {
        RuleType::MinWidth { required, actual }
        | RuleType::MinSpacing { required, actual }
        | RuleType::Enclosure { required, actual }
        | RuleType::MinEdgeLength { required, actual } => *required - *actual <= margin,
        RuleType::MaxWidth { limit, actual } => *actual - *limit <= margin,
        // MinArea is numeric but in squared units — mixing it with a
        // length-unit margin would silently widen the warning band far
        // beyond what a designer configuring `warning_margin = 0.01` expects.
        // Density is a dimensionless fraction — same unit-mismatch concern.
        RuleType::MinArea { .. }
        | RuleType::Density { .. }
        | RuleType::ForbiddenOverlap
        | RuleType::MissingOverlap
        | RuleType::ForbiddenAngle { .. }
        | RuleType::SelfIntersection
        | RuleType::OffGrid { .. }
        | RuleType::AcuteAngle { .. }
        | RuleType::NotInside => false,
    }
}

#[cfg(test)]
mod tests;

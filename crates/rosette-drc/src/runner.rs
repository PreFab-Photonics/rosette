//! DRC execution engine.

use std::collections::{HashMap, HashSet};
use std::time::{Duration, Instant};

use rosette_core::cell::Element;
use rosette_core::{BBox, Cell, Layer, Library, Point, Polygon, Transform, offset_polygon};

use crate::checks::{
    check_acute_angle, check_angles, check_area, check_density, check_edge_length, check_enclosure,
    check_forbid_overlap_bulk, check_max_width, check_not_inside, check_require_overlap_bulk,
    check_self_intersection, check_snap_to_grid, check_spacing, check_width, compute_region_bbox,
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
                let inner_polys = polygons_by_layer.get(inner);
                let outer_polys = polygons_by_layer.get(outer);

                match (inner_polys, outer_polys) {
                    (Some(ip), Some(op)) => {
                        let mut violations = Vec::new();
                        // For each inner polygon, check if ANY outer polygon encloses it.
                        // Only report a violation if no outer polygon provides sufficient enclosure.
                        for (inner_poly, inner_idx) in ip {
                            let mut best_violation: Option<DrcViolation> = None;
                            let mut is_enclosed = false;

                            for (outer_poly, outer_idx) in op {
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
                                    Some(mut v) => {
                                        v = v
                                            .with_polygon_idx(*inner_idx)
                                            .with_polygon_idx2(*outer_idx);
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
                        for (inner_poly, inner_idx) in ip {
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
                            .with_severity(Severity::Error)
                            .with_polygon_idx(*inner_idx);

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
    fn test_rigid_transform_detects_once_emits_per_instance() {
        // Per ROS-552: per-polygon rules detect each unique cell once but
        // emit one violation per rigid instance, carrying the owning
        // `cell_name` and a `location` in top-level global coordinates.
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
        // One violation per rigid instance (3), each attributed to the child
        // cell with a distinct global-coord bbox.
        assert_eq!(
            result.violations.len(),
            3,
            "Per-polygon violations should be emitted once per rigid instance"
        );
        let xs: Vec<f64> = result
            .violations
            .iter()
            .map(|v| v.location.min().x)
            .collect();
        assert!(xs.contains(&0.0));
        assert!(xs.contains(&100.0));
        assert!(xs.contains(&200.0));
        for v in &result.violations {
            assert_eq!(v.cell_name.as_deref(), Some("tiny"));
            assert!(v.cell_name2.is_none());
        }
    }

    #[test]
    fn test_snap_to_grid_simple_pass() {
        // On-grid polygon passes snap-to-grid check.
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 1.0, 0.5),
            Layer::new(1, 0),
        );

        let rules = DrcRules::new().snap_to_grid(Layer::new(1, 0), 0.001, None);
        let result = run_drc(&cell, &rules, None);
        assert!(result.passed());
    }

    #[test]
    fn test_snap_to_grid_simple_fail() {
        // Off-grid polygon fails snap-to-grid check.
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::new(vec![
                Point::new(0.0, 0.0),
                Point::new(0.5, 0.0),
                Point::new(0.5, 0.003),
                Point::new(0.0, 0.003),
            ]),
            Layer::new(1, 0),
        );

        let rules = DrcRules::new().snap_to_grid(Layer::new(1, 0), 0.005, None);
        let result = run_drc(&cell, &rules, None);
        assert!(!result.passed());
    }

    #[test]
    fn test_snap_to_grid_off_grid_translation() {
        // A child cell has on-grid local vertices, but is placed at an off-grid
        // translation. The snap-to-grid check must catch this because the final
        // world coordinates are off-grid.
        let mut child = Cell::new("block");
        // All vertices are multiples of 0.005 (on 5nm grid locally)
        child.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 0.5, 0.25),
            Layer::new(1, 0),
        );

        let mut top = Cell::new("top");
        // Place at x=0.003 — off the 5nm grid
        top.add_ref(CellRef::new("block").at(0.003, 0.0));

        let mut lib = Library::new("test_lib");
        lib.add_cell(child).unwrap();
        lib.add_cell(top).unwrap();

        let rules = DrcRules::new().snap_to_grid(Layer::new(1, 0), 0.005, Some("GRID"));
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

        assert!(
            !result.passed(),
            "Off-grid translation should be caught even if local vertices are on-grid"
        );
        // All 4 rect vertices are shifted by 0.003 in x, so all are off-grid
        assert!(
            !result.violations.is_empty(),
            "Expected violations for off-grid translated vertices"
        );
    }

    #[test]
    fn test_snap_to_grid_on_grid_translation() {
        // Child cell placed at on-grid translation should pass.
        let mut child = Cell::new("block");
        child.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 0.5, 0.25),
            Layer::new(1, 0),
        );

        let mut top = Cell::new("top");
        // Place at x=0.005 — on the 5nm grid
        top.add_ref(CellRef::new("block").at(0.005, 0.0));

        let mut lib = Library::new("test_lib");
        lib.add_cell(child).unwrap();
        lib.add_cell(top).unwrap();

        let rules = DrcRules::new().snap_to_grid(Layer::new(1, 0), 0.005, None);
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

        assert!(result.passed(), "On-grid translation should pass");
    }

    // --- warning_margin tests (ROS-521) ---

    #[test]
    fn test_warning_margin_off_by_default_min_width() {
        // With no warning_margin, a near-threshold width is an error.
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::origin(), 0.115, 10.0),
            Layer::new(1, 0),
        );

        let rules = DrcRules::new().min_width(Layer::new(1, 0), 0.12, Some("W"));
        let result = run_drc(&cell, &rules, None);

        assert!(!result.passed(), "Legacy: any violation fails");
        assert_eq!(result.error_count(), 1);
        assert_eq!(result.warning_count(), 0);
        assert_eq!(result.violations[0].severity, Severity::Error);
    }

    #[test]
    fn test_warning_margin_downgrades_near_threshold_width() {
        // 0.115 < 0.12 (violation) but within margin 0.01 of 0.12 → warning.
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::origin(), 0.115, 10.0),
            Layer::new(1, 0),
        );

        let rules =
            DrcRules::new()
                .warning_margin(0.01)
                .min_width(Layer::new(1, 0), 0.12, Some("W"));
        let result = run_drc(&cell, &rules, None);

        assert!(result.passed(), "Warnings should not cause the run to fail");
        assert_eq!(result.error_count(), 0);
        assert_eq!(result.warning_count(), 1);
        assert_eq!(result.violations[0].severity, Severity::Warning);
    }

    #[test]
    fn test_warning_margin_keeps_far_violations_as_errors() {
        // 0.05 is far below 0.12 (well outside margin 0.01) → still an error.
        let mut cell = Cell::new("test");
        cell.add_polygon(Polygon::rect(Point::origin(), 0.05, 10.0), Layer::new(1, 0));

        let rules =
            DrcRules::new()
                .warning_margin(0.01)
                .min_width(Layer::new(1, 0), 0.12, Some("W"));
        let result = run_drc(&cell, &rules, None);

        assert!(!result.passed(), "Far-below-threshold should still error");
        assert_eq!(result.error_count(), 1);
        assert_eq!(result.warning_count(), 0);
    }

    #[test]
    fn test_warning_margin_applies_to_min_spacing() {
        // Two polygons with a 0.11 gap, min_spacing=0.12, margin=0.02.
        // Gap 0.11 is within [0.10, 0.12) → warning.
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 1.0, 1.0),
            Layer::new(1, 0),
        );
        cell.add_polygon(
            Polygon::rect(Point::new(1.11, 0.0), 1.0, 1.0),
            Layer::new(1, 0),
        );

        let rules = DrcRules::new().warning_margin(0.02).min_spacing(
            Layer::new(1, 0),
            Layer::new(1, 0),
            0.12,
            Some("S"),
        );
        let result = run_drc(&cell, &rules, None);

        assert_eq!(result.violation_count(), 1);
        assert_eq!(result.violations[0].severity, Severity::Warning);
        assert!(result.passed());
    }

    #[test]
    fn test_warning_margin_applies_to_max_width() {
        // max_width = 5.0, actual = 5.05, margin = 0.1 → warning.
        let mut cell = Cell::new("test");
        cell.add_polygon(Polygon::rect(Point::origin(), 5.05, 10.0), Layer::new(1, 0));

        let rules =
            DrcRules::new()
                .warning_margin(0.1)
                .max_width(Layer::new(1, 0), 5.0, Some("MW"));
        let result = run_drc(&cell, &rules, None);

        assert_eq!(result.violation_count(), 1);
        assert_eq!(result.violations[0].severity, Severity::Warning);
        assert!(result.passed());
    }

    #[test]
    fn test_warning_margin_does_not_downgrade_categorical() {
        // Forbidden-overlap is binary — a warning_margin must not silence it.
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );
        cell.add_polygon(
            Polygon::rect(Point::new(3.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );

        let rules = DrcRules::new()
            .warning_margin(999.0) // huge — must not matter
            .forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
        let result = run_drc(&cell, &rules, None);

        assert!(!result.passed());
        assert_eq!(result.error_count(), 1);
        assert_eq!(result.warning_count(), 0);
    }

    #[test]
    fn test_warning_margin_mixed_result() {
        // Two rules: one produces a warning, one produces an error.
        // Overall `passed()` should be false because of the error.
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::origin(), 0.115, 10.0),
            Layer::new(1, 0),
        );
        cell.add_polygon(
            Polygon::rect(Point::new(100.0, 0.0), 0.02, 10.0),
            Layer::new(1, 0),
        );

        let rules =
            DrcRules::new()
                .warning_margin(0.01)
                .min_width(Layer::new(1, 0), 0.12, Some("W"));
        let result = run_drc(&cell, &rules, None);

        assert!(
            !result.passed(),
            "Should fail because at least one error remains"
        );
        assert_eq!(result.error_count(), 1);
        assert_eq!(result.warning_count(), 1);
    }

    #[test]
    fn test_warning_margin_zero_disables() {
        // Explicit zero should behave identically to `None`.
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::origin(), 0.115, 10.0),
            Layer::new(1, 0),
        );

        let rules =
            DrcRules::new()
                .warning_margin(0.0)
                .min_width(Layer::new(1, 0), 0.12, Some("W"));
        let result = run_drc(&cell, &rules, None);

        assert!(!result.passed());
        assert_eq!(result.error_count(), 1);
    }

    #[test]
    fn test_warning_margin_does_not_apply_to_min_area() {
        // `warning_margin` is expressed in length units (typically µm).
        // `MinArea` thresholds are in µm², so mixing them would silently
        // downgrade huge area violations for a small length-unit margin.
        // The policy is: `MinArea` violations are never downgraded.
        let mut cell = Cell::new("test");
        // Area = 0.0099 µm²; threshold = 0.01 µm²; shortfall = 0.0001 µm².
        // With a 0.01-µm margin, a naive comparison would downgrade to a
        // warning — which we explicitly do NOT want.
        cell.add_polygon(Polygon::rect(Point::origin(), 0.099, 0.1), Layer::new(1, 0));

        let rules =
            DrcRules::new()
                .warning_margin(0.01)
                .min_area(Layer::new(1, 0), 0.01, Some("A"));
        let result = run_drc(&cell, &rules, None);

        assert!(!result.passed(), "MinArea violations must stay errors");
        assert_eq!(result.error_count(), 1);
        assert_eq!(result.warning_count(), 0);
        assert_eq!(result.violations[0].severity, Severity::Error);
    }

    // --- Density check tests (ROS-520) ---

    #[test]
    fn test_density_passes_uniform_fill() {
        // Region = cell's own 100x100 fill. Single big polygon gives density=1.0.
        // Rule: max=None (no upper), min=0.5 — passes everywhere.
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 100.0, 100.0),
            Layer::new(1, 0),
        );
        let rules = DrcRules::new().density(
            Layer::new(1, 0),
            Some(0.5),
            None,
            50.0,
            50.0,
            None,
            Some("DENS"),
        );
        let result = run_drc(&cell, &rules, None);
        assert!(result.passed(), "Full fill should pass min=0.5");
    }

    #[test]
    fn test_density_fails_above_max() {
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 100.0, 100.0),
            Layer::new(1, 0),
        );
        let rules = DrcRules::new().density(
            Layer::new(1, 0),
            None,
            Some(0.8),
            50.0,
            50.0,
            None,
            Some("DENS"),
        );
        let result = run_drc(&cell, &rules, None);
        assert!(!result.passed(), "Full fill should fail max=0.8");
        // Windows at (0,0), (50,0), (0,50), (50,50) -> 4 violations
        assert!(!result.violations.is_empty());
        assert_eq!(result.violations[0].rule_name.as_deref(), Some("DENS"));
        if let RuleType::Density { actual, .. } = result.violations[0].rule_type {
            assert!(actual > 0.99);
        } else {
            panic!("expected Density rule type");
        }
    }

    #[test]
    fn test_density_region_layer_limits_scope() {
        // Target polygon on layer 1 fills the right half.
        // Region layer (99) only covers the left half — where there's nothing.
        // So measured density in the region is 0 -> fails min=0.2.
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::new(50.0, 0.0), 50.0, 100.0),
            Layer::new(1, 0),
        );
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 50.0, 100.0),
            Layer::new(99, 0),
        );
        let rules = DrcRules::new().density(
            Layer::new(1, 0),
            Some(0.2),
            None,
            25.0,
            25.0,
            Some(Layer::new(99, 0)),
            None,
        );
        let result = run_drc(&cell, &rules, None);
        assert!(
            !result.passed(),
            "Density inside region (left half) is 0, should fail min=0.2"
        );
    }

    #[test]
    fn test_density_aggregates_across_array() {
        // A small filled cell arrayed across a region. Verify density
        // aggregates across instances (hierarchical flattening).
        let mut child = Cell::new("child");
        // 5x5 filled tile
        child.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );

        // 10 columns x 10 rows at pitch 10.0 -> tiles at x=0, 10, ..., 90.
        // Fill spans [0, 95] x [0, 95]. Use region_layer explicitly so the
        // bbox is a clean [0, 100] x [0, 100].
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("child").array(10, 10, 10.0, 10.0));
        top.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 100.0, 100.0),
            Layer::new(99, 0),
        );

        let mut lib = Library::new("test_lib");
        lib.add_cell(child).unwrap();
        lib.add_cell(top).unwrap();

        // 100 tiles, each 5x5 = 25 area, total = 2500. Region = 10000.
        // Density = 2500 / 10000 = 0.25
        let rules = DrcRules::new().density(
            Layer::new(1, 0),
            Some(0.5), // density is 0.25, below min=0.5 -> fail
            None,
            100.0,
            100.0,
            Some(Layer::new(99, 0)),
            Some("DENS_ARR"),
        );
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));
        assert!(
            !result.passed(),
            "Arrayed 25% fill should fail min=0.5, got {} violations",
            result.violations.len()
        );

        // Flip: same fill should pass min=0.2
        let rules_ok = DrcRules::new().density(
            Layer::new(1, 0),
            Some(0.2),
            None,
            100.0,
            100.0,
            Some(Layer::new(99, 0)),
            None,
        );
        let result_ok = run_drc(lib.cell("top").unwrap(), &rules_ok, Some(&lib));
        assert!(
            result_ok.passed(),
            "Arrayed 25% fill should pass min=0.2, got {} violations",
            result_ok.violations.len()
        );
    }

    #[test]
    fn test_density_empty_design_skips_silently() {
        // Truly empty design: no geometry anywhere. Density is undefined
        // (no region to measure over), so the check is a silent no-op.
        // Users who want density enforced over an explicit floor-plan must
        // declare a region_layer.
        let cell = Cell::new("empty");
        let rules = DrcRules::new().density(
            Layer::new(1, 0),
            Some(0.2),
            Some(0.8),
            100.0,
            100.0,
            None,
            None,
        );
        let result = run_drc(&cell, &rules, None);
        assert!(result.passed());
    }

    #[test]
    fn test_density_empty_target_layer_inside_populated_design() {
        // Target layer has no geometry, but the design has geometry on
        // another layer. Fallback region = bbox of placed geometry.
        // Measured density on the empty target = 0 everywhere -> fails min.
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 100.0, 100.0),
            Layer::new(2, 0),
        );
        let rules = DrcRules::new().density(
            Layer::new(1, 0), // target layer: no polygons
            Some(0.2),
            None,
            50.0,
            50.0,
            None, // no region_layer -> fallback to placed-geometry bbox
            Some("DENS"),
        );
        let result = run_drc(&cell, &rules, None);
        assert!(
            !result.passed(),
            "Empty target layer inside populated design should fail min=0.2"
        );
        assert!(!result.violations.is_empty());
        if let RuleType::Density { actual, .. } = result.violations[0].rule_type {
            assert_eq!(actual, 0.0);
        } else {
            panic!("expected Density rule type");
        }
    }

    // ---- drc_skip suppression tests ----

    #[test]
    fn test_drc_skip_suppresses_intra_cell_violation() {
        // A cell has two overlapping polygons on the same layer.
        // With drc_skip=true, the intra-cell violation should be suppressed.
        let mut trusted = Cell::new("trusted");
        trusted.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );
        trusted.add_polygon(
            Polygon::rect(Point::new(3.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );
        trusted.set_drc_skip(true);

        let rules =
            DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
        let result = run_drc(&trusted, &rules, None);

        assert!(
            result.passed(),
            "trusted cell should suppress its own violation"
        );
        assert_eq!(result.violations.len(), 0);
        assert_eq!(result.stats.suppressed_violations, 1);
        assert_eq!(result.stats.skipped_cells, 1);
    }

    #[test]
    fn test_drc_skip_keeps_inter_cell_violation() {
        // Trusted child cell has a polygon that overlaps a polygon in an
        // untrusted top cell. The inter-cell violation MUST survive — trust
        // is about interior, not about placement.
        let mut child = Cell::new("child");
        child.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );
        child.set_drc_skip(true);

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
            "inter-cell violation against a trusted cell must still be reported"
        );
        assert_eq!(result.violations.len(), 1);
        assert_eq!(result.stats.suppressed_violations, 0);
        assert_eq!(result.stats.skipped_cells, 1);
    }

    #[test]
    fn test_drc_skip_suppresses_when_both_cells_trusted() {
        // Two trusted cells overlap each other. With both trusted, the
        // inter-cell violation should be suppressed too.
        let mut a = Cell::new("a");
        a.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );
        a.set_drc_skip(true);

        let mut b = Cell::new("b");
        b.add_polygon(
            Polygon::rect(Point::new(3.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );
        b.set_drc_skip(true);

        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("a"));
        top.add_ref(CellRef::new("b"));

        let mut lib = Library::new("test_lib");
        lib.add_cell(a).unwrap();
        lib.add_cell(b).unwrap();
        lib.add_cell(top).unwrap();

        let rules =
            DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

        assert!(
            result.passed(),
            "overlap between two trusted cells should be suppressed"
        );
        assert_eq!(result.violations.len(), 0);
        assert_eq!(result.stats.suppressed_violations, 1);
        assert_eq!(result.stats.skipped_cells, 2);
    }

    #[test]
    fn test_drc_skip_propagates_to_subtree() {
        // Trusted parent contains an untrusted child. The child's own
        // intra-cell violation should still be suppressed because the child
        // is reachable from a trusted ancestor.
        let mut grandchild = Cell::new("grandchild");
        grandchild.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );
        grandchild.add_polygon(
            Polygon::rect(Point::new(3.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );

        let mut parent = Cell::new("parent");
        parent.add_ref(CellRef::new("grandchild"));
        parent.set_drc_skip(true);

        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("parent"));

        let mut lib = Library::new("test_lib");
        lib.add_cell(grandchild).unwrap();
        lib.add_cell(parent).unwrap();
        lib.add_cell(top).unwrap();

        let rules =
            DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

        assert!(
            result.passed(),
            "grandchild's intra-cell violation should be suppressed via trusted ancestor"
        );
        assert_eq!(result.stats.suppressed_violations, 1);
        assert_eq!(
            result.stats.skipped_cells, 2,
            "closure should include parent and grandchild"
        );
    }

    #[test]
    fn test_drc_skip_diamond_hierarchy() {
        // Regression: a "shared" cell reachable via BOTH a trusted and an
        // untrusted parent must be in the skipped closure regardless of
        // traversal order. Earlier single-pass DFS with a visited-set would
        // miss this because `shared` was marked visited via the untrusted
        // path before the trusted path had a chance to add it.
        //
        //        top (untrusted)
        //       /               \
        //   parent_a          parent_b  (drc_skip=true)
        //   (untrusted)           |
        //       \                /
        //          shared (untrusted) — has an internal overlap
        let mut shared = Cell::new("shared");
        shared.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );
        shared.add_polygon(
            Polygon::rect(Point::new(3.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );

        let mut parent_a = Cell::new("parent_a");
        parent_a.add_ref(CellRef::new("shared"));

        let mut parent_b = Cell::new("parent_b");
        parent_b.add_ref(CellRef::new("shared"));
        parent_b.set_drc_skip(true);

        let mut top = Cell::new("top");
        // Order matters for reproducing the old bug: put the untrusted
        // parent first so `shared` is visited via it first.
        top.add_ref(CellRef::new("parent_a"));
        top.add_ref(CellRef::new("parent_b"));

        let mut lib = Library::new("test_lib");
        lib.add_cell(shared).unwrap();
        lib.add_cell(parent_a).unwrap();
        lib.add_cell(parent_b).unwrap();
        lib.add_cell(top).unwrap();

        let rules =
            DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

        // `shared` must be in the closure via `parent_b`, so its intra-cell
        // violation is suppressed.
        assert!(
            result.passed(),
            "shared's intra-cell violation must be suppressed via trusted parent_b, \
             even though it's also reachable via untrusted parent_a"
        );
        // Multiple suppressed violations are expected here (intra-cell in
        // `shared` plus inter-instance overlaps between the two instances of
        // `shared`). The important invariant is that nothing survives.
        assert!(
            result.stats.suppressed_violations >= 1,
            "at least one violation should be suppressed via the trusted subtree"
        );
        assert_eq!(result.violations.len(), 0);
        assert_eq!(
            result.stats.skipped_cells, 2,
            "closure should include parent_b and shared"
        );
    }

    #[test]
    fn test_drc_skip_suppresses_per_polygon_violation() {
        // Regression for ROS-552: per-polygon rules now carry cell-name
        // provenance, so drc_skip suppresses them. Previously (v1 of
        // drc_skip) this was a documented gap — the violation was kept.
        let mut trusted = Cell::new("trusted");
        // A polygon with a thin neck that violates min_width.
        trusted.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 10.0, 0.05),
            Layer::new(1, 0),
        );
        trusted.set_drc_skip(true);

        let rules = DrcRules::new().min_width(Layer::new(1, 0), 0.5, Some("MIN_W"));
        let result = run_drc(&trusted, &rules, None);

        // With ROS-552 in place, the per-polygon violation is attributed to
        // "trusted" and therefore suppressed.
        assert!(
            result.passed(),
            "per-polygon violation attributed to trusted cell should be suppressed"
        );
        assert_eq!(result.stats.suppressed_violations, 1);
        assert_eq!(result.stats.skipped_cells, 1);
    }

    #[test]
    fn test_drc_skip_zero_skipped_cells_when_none_marked() {
        // Sanity: with no cells marked, stats reflect zero skipped cells
        // and zero suppressions, and behavior is unchanged.
        let mut cell = Cell::new("plain");
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

        assert!(!result.passed());
        assert_eq!(result.violations.len(), 1);
        assert_eq!(result.stats.suppressed_violations, 0);
        assert_eq!(result.stats.skipped_cells, 0);
    }

    // ==================================================================
    // ROS-552: Per-rule hierarchical provenance tests.
    //
    // Each rule type gets a test that:
    //   1. Puts violating geometry in a leaf cell.
    //   2. Instances that leaf in a parent at a non-identity transform.
    //   3. Asserts `cell_name` is set and `location` is in top-level
    //      global coordinates.
    // ==================================================================

    fn two_level_hierarchy(leaf: Cell) -> (Library, String) {
        // Parent places the leaf translated by (100, 50) — chosen so that
        // local-frame and global-frame are trivially distinguishable.
        let leaf_name = leaf.name().to_string();
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new(&leaf_name).at(100.0, 50.0));
        let mut lib = Library::new("prov_lib");
        lib.add_cell(leaf).unwrap();
        lib.add_cell(top).unwrap();
        (lib, "top".to_string())
    }

    #[test]
    fn prov_min_width_attributed_and_global() {
        let mut leaf = Cell::new("thin_wire");
        leaf.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 10.0, 0.05),
            Layer::new(1, 0),
        );
        let (lib, top) = two_level_hierarchy(leaf);
        let rules = DrcRules::new().min_width(Layer::new(1, 0), 0.5, None);
        let result = run_drc(lib.cell(&top).unwrap(), &rules, Some(&lib));
        assert_eq!(result.violations.len(), 1);
        let v = &result.violations[0];
        assert_eq!(v.cell_name.as_deref(), Some("thin_wire"));
        // Global-frame bbox: local (0,0)-(10,0.05) -> (100,50)-(110,50.05).
        assert!((v.location.min().x - 100.0).abs() < 1e-9);
        assert!((v.location.min().y - 50.0).abs() < 1e-9);
    }

    #[test]
    fn prov_min_area_attributed_and_global() {
        let mut leaf = Cell::new("tiny_sq");
        leaf.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 1.0, 1.0),
            Layer::new(1, 0),
        );
        let (lib, top) = two_level_hierarchy(leaf);
        let rules = DrcRules::new().min_area(Layer::new(1, 0), 10.0, None);
        let result = run_drc(lib.cell(&top).unwrap(), &rules, Some(&lib));
        assert_eq!(result.violations.len(), 1);
        let v = &result.violations[0];
        assert_eq!(v.cell_name.as_deref(), Some("tiny_sq"));
        assert!((v.location.min().x - 100.0).abs() < 1e-9);
        assert!((v.location.min().y - 50.0).abs() < 1e-9);
    }

    #[test]
    fn prov_allowed_angles_attributed_and_global() {
        // Triangle has 60° interior angles; allow only {0, 90} -> violation.
        let mut leaf = Cell::new("tri");
        leaf.add_polygon(
            Polygon::new(vec![
                Point::new(0.0, 0.0),
                Point::new(1.0, 0.0),
                Point::new(0.5, 1.0),
            ]),
            Layer::new(1, 0),
        );
        let (lib, top) = two_level_hierarchy(leaf);
        let rules = DrcRules::new().allowed_angles(Layer::new(1, 0), &[0.0, 90.0], None);
        let result = run_drc(lib.cell(&top).unwrap(), &rules, Some(&lib));
        assert!(!result.violations.is_empty());
        for v in &result.violations {
            assert_eq!(v.cell_name.as_deref(), Some("tri"));
            assert!(v.cell_name2.is_none());
            assert!(v.location.min().x >= 100.0 - 1e-9);
            assert!(v.location.min().y >= 50.0 - 1e-9);
        }
    }

    #[test]
    fn prov_min_edge_length_attributed_and_global() {
        // A polygon with one tiny edge (0.01 long).
        let mut leaf = Cell::new("short_edge");
        leaf.add_polygon(
            Polygon::new(vec![
                Point::new(0.0, 0.0),
                Point::new(10.0, 0.0),
                Point::new(10.0, 10.0),
                Point::new(10.0 - 0.01, 10.0),
                Point::new(0.0, 10.0),
            ]),
            Layer::new(1, 0),
        );
        let (lib, top) = two_level_hierarchy(leaf);
        let rules = DrcRules::new().min_edge_length(Layer::new(1, 0), 0.5, None);
        let result = run_drc(lib.cell(&top).unwrap(), &rules, Some(&lib));
        assert!(!result.violations.is_empty());
        for v in &result.violations {
            assert_eq!(v.cell_name.as_deref(), Some("short_edge"));
        }
    }

    #[test]
    fn prov_self_intersection_attributed_and_global() {
        // Bowtie polygon (self-intersecting).
        let mut leaf = Cell::new("bowtie");
        leaf.add_polygon(
            Polygon::new(vec![
                Point::new(0.0, 0.0),
                Point::new(10.0, 10.0),
                Point::new(10.0, 0.0),
                Point::new(0.0, 10.0),
            ]),
            Layer::new(1, 0),
        );
        let (lib, top) = two_level_hierarchy(leaf);
        let rules = DrcRules::new().no_self_intersection(Layer::new(1, 0), None);
        let result = run_drc(lib.cell(&top).unwrap(), &rules, Some(&lib));
        assert_eq!(result.violations.len(), 1);
        assert_eq!(result.violations[0].cell_name.as_deref(), Some("bowtie"));
    }

    #[test]
    fn prov_max_width_attributed_and_global() {
        let mut leaf = Cell::new("fat");
        leaf.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 20.0, 20.0),
            Layer::new(1, 0),
        );
        let (lib, top) = two_level_hierarchy(leaf);
        let rules = DrcRules::new().max_width(Layer::new(1, 0), 5.0, None);
        let result = run_drc(lib.cell(&top).unwrap(), &rules, Some(&lib));
        assert_eq!(result.violations.len(), 1);
        let v = &result.violations[0];
        assert_eq!(v.cell_name.as_deref(), Some("fat"));
        assert!((v.location.min().x - 100.0).abs() < 1e-9);
    }

    #[test]
    fn prov_acute_angle_attributed_and_global() {
        // Thin triangle has a very small apex angle.
        let mut leaf = Cell::new("sharp");
        leaf.add_polygon(
            Polygon::new(vec![
                Point::new(0.0, 0.0),
                Point::new(10.0, 0.01),
                Point::new(10.0, -0.01),
            ]),
            Layer::new(1, 0),
        );
        let (lib, top) = two_level_hierarchy(leaf);
        let rules = DrcRules::new().acute_angle(Layer::new(1, 0), 30.0, None);
        let result = run_drc(lib.cell(&top).unwrap(), &rules, Some(&lib));
        assert!(!result.violations.is_empty());
        for v in &result.violations {
            assert_eq!(v.cell_name.as_deref(), Some("sharp"));
        }
    }

    #[test]
    fn prov_snap_to_grid_attributed_and_global() {
        // Leaf is on-grid; but the parent translates by an off-grid offset
        // so the final global coords are off-grid — forces snap-to-grid
        // to find violations in the flattened geometry.
        let mut leaf = Cell::new("ongrid");
        leaf.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 1.0, 0.5),
            Layer::new(1, 0),
        );
        let mut top = Cell::new("top");
        // Translate by (0.0003, 0) — off 1nm grid since 0.0003 / 0.001 = 0.3.
        top.add_ref(CellRef::new("ongrid").at(0.0003, 0.0));
        let mut lib = Library::new("prov_lib");
        lib.add_cell(leaf).unwrap();
        lib.add_cell(top).unwrap();

        let rules = DrcRules::new().snap_to_grid(Layer::new(1, 0), 0.001, None);
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));
        assert!(!result.violations.is_empty());
        for v in &result.violations {
            assert_eq!(
                v.cell_name.as_deref(),
                Some("ongrid"),
                "snap-to-grid violation should be attributed to the owning cell"
            );
        }
    }

    #[test]
    fn prov_min_spacing_same_layer_intra_cell() {
        // Two close polygons in the leaf on the same layer -> intra-cell
        // same-layer min-spacing violation. Phase 2 emits per-instance
        // with cell_name == cell_name2 == leaf.
        let mut leaf = Cell::new("pair");
        leaf.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 1.0, 1.0),
            Layer::new(1, 0),
        );
        leaf.add_polygon(
            Polygon::rect(Point::new(1.05, 0.0), 1.0, 1.0),
            Layer::new(1, 0),
        );
        let (lib, top) = two_level_hierarchy(leaf);
        let rules = DrcRules::new().min_spacing(Layer::new(1, 0), Layer::new(1, 0), 0.2, None);
        let result = run_drc(lib.cell(&top).unwrap(), &rules, Some(&lib));
        assert!(!result.violations.is_empty());
        let v = &result.violations[0];
        assert_eq!(v.cell_name.as_deref(), Some("pair"));
        assert_eq!(v.cell_name2.as_deref(), Some("pair"));
        // Global: at least one coord should be at the shifted position.
        assert!(v.location.min().x >= 100.0 - 1e-9);
    }

    #[test]
    fn prov_min_spacing_cross_layer() {
        // Two layers, cross-layer spacing violation across instances.
        let mut a = Cell::new("layer_a");
        a.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 1.0, 1.0),
            Layer::new(1, 0),
        );
        let mut b = Cell::new("layer_b");
        b.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 1.0, 1.0),
            Layer::new(2, 0),
        );
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("layer_a").at(0.0, 0.0));
        top.add_ref(CellRef::new("layer_b").at(1.05, 0.0));
        let mut lib = Library::new("prov_lib");
        lib.add_cell(a).unwrap();
        lib.add_cell(b).unwrap();
        lib.add_cell(top).unwrap();
        let rules = DrcRules::new().min_spacing(Layer::new(1, 0), Layer::new(2, 0), 0.5, None);
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));
        assert!(!result.violations.is_empty());
        let v = &result.violations[0];
        assert_eq!(v.cell_name.as_deref(), Some("layer_a"));
        assert_eq!(v.cell_name2.as_deref(), Some("layer_b"));
    }

    #[test]
    fn prov_enclosure_cross_layer() {
        // Inner on layer 2 in cell `inner_cell`; outer on layer 1 in cell
        // `outer_cell`. Parent places them so inner is barely enclosed
        // (margin < required).
        let mut inner_cell = Cell::new("inner_cell");
        inner_cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 4.0, 4.0),
            Layer::new(2, 0),
        );
        let mut outer_cell = Cell::new("outer_cell");
        outer_cell.add_polygon(
            Polygon::rect(Point::new(-0.5, -0.5), 5.0, 5.0),
            Layer::new(1, 0),
        );
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("inner_cell").at(0.0, 0.0));
        top.add_ref(CellRef::new("outer_cell").at(0.0, 0.0));
        let mut lib = Library::new("prov_lib");
        lib.add_cell(inner_cell).unwrap();
        lib.add_cell(outer_cell).unwrap();
        lib.add_cell(top).unwrap();
        let rules = DrcRules::new().min_enclosure(Layer::new(2, 0), Layer::new(1, 0), 2.0, None);
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));
        assert!(!result.violations.is_empty());
        let v = &result.violations[0];
        assert_eq!(v.cell_name.as_deref(), Some("inner_cell"));
        assert_eq!(v.cell_name2.as_deref(), Some("outer_cell"));
    }

    #[test]
    fn prov_enclosure_no_outer() {
        // Inner polygon with no outer on layer 1 — cell_name set,
        // cell_name2 = None (there's no outer polygon to attribute to).
        let mut leaf = Cell::new("orphan_inner");
        leaf.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 4.0, 4.0),
            Layer::new(2, 0),
        );
        let (lib, top) = two_level_hierarchy(leaf);
        let rules = DrcRules::new().min_enclosure(Layer::new(2, 0), Layer::new(1, 0), 2.0, None);
        let result = run_drc(lib.cell(&top).unwrap(), &rules, Some(&lib));
        assert_eq!(result.violations.len(), 1);
        let v = &result.violations[0];
        assert_eq!(v.cell_name.as_deref(), Some("orphan_inner"));
        assert!(v.cell_name2.is_none());
    }

    #[test]
    fn prov_require_overlap_cross_layer() {
        // layer_a polygon has no overlapping layer_b polygon.
        let mut a = Cell::new("layer_a");
        a.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 1.0, 1.0),
            Layer::new(1, 0),
        );
        let mut b = Cell::new("layer_b");
        b.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 1.0, 1.0),
            Layer::new(2, 0),
        );
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("layer_a").at(0.0, 0.0));
        top.add_ref(CellRef::new("layer_b").at(50.0, 0.0)); // far away
        let mut lib = Library::new("prov_lib");
        lib.add_cell(a).unwrap();
        lib.add_cell(b).unwrap();
        lib.add_cell(top).unwrap();
        let rules = DrcRules::new().require_overlap(Layer::new(1, 0), Layer::new(2, 0), None);
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));
        assert!(!result.violations.is_empty());
        let v = &result.violations[0];
        assert_eq!(v.cell_name.as_deref(), Some("layer_a"));
        // cell_name2 is None — require_overlap's "no match" violation can't
        // attribute to a specific outer polygon.
        assert!(v.cell_name2.is_none());
    }

    #[test]
    fn prov_forbid_overlap_cross_layer() {
        let mut a = Cell::new("cell_a");
        a.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 2.0, 2.0),
            Layer::new(1, 0),
        );
        let mut b = Cell::new("cell_b");
        b.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 2.0, 2.0),
            Layer::new(2, 0),
        );
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("cell_a").at(0.0, 0.0));
        top.add_ref(CellRef::new("cell_b").at(1.0, 0.0)); // overlapping
        let mut lib = Library::new("prov_lib");
        lib.add_cell(a).unwrap();
        lib.add_cell(b).unwrap();
        lib.add_cell(top).unwrap();
        let rules = DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(2, 0), None);
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));
        assert!(!result.violations.is_empty());
        let v = &result.violations[0];
        assert_eq!(v.cell_name.as_deref(), Some("cell_a"));
        assert_eq!(v.cell_name2.as_deref(), Some("cell_b"));
    }

    #[test]
    fn prov_not_inside_cross_layer() {
        // Inner polygon fully inside exclusion zone from another cell.
        let mut inner_cell = Cell::new("inner_cell");
        inner_cell.add_polygon(
            Polygon::rect(Point::new(2.0, 2.0), 1.0, 1.0),
            Layer::new(1, 0),
        );
        let mut zone_cell = Cell::new("zone_cell");
        zone_cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0),
            Layer::new(2, 0),
        );
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("inner_cell").at(0.0, 0.0));
        top.add_ref(CellRef::new("zone_cell").at(0.0, 0.0));
        let mut lib = Library::new("prov_lib");
        lib.add_cell(inner_cell).unwrap();
        lib.add_cell(zone_cell).unwrap();
        lib.add_cell(top).unwrap();
        let rules = DrcRules::new().not_inside(Layer::new(1, 0), Layer::new(2, 0), None);
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));
        assert_eq!(result.violations.len(), 1);
        let v = &result.violations[0];
        assert_eq!(v.cell_name.as_deref(), Some("inner_cell"));
        // cell_name2 None here: not_inside unions outers, so we can't
        // attribute to a single outer polygon.
        assert!(v.cell_name2.is_none());
    }

    #[test]
    fn prov_density_leaves_cell_name_none_by_design() {
        // Density is a window-based check with no single source polygon,
        // so cell_name is documented as intentionally None.
        let mut leaf = Cell::new("sparse");
        leaf.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 1.0, 1.0),
            Layer::new(1, 0),
        );
        let (lib, top) = two_level_hierarchy(leaf);
        let rules =
            DrcRules::new().density(Layer::new(1, 0), Some(0.5), None, 10.0, 5.0, None, None);
        let result = run_drc(lib.cell(&top).unwrap(), &rules, Some(&lib));
        // There's some density violations since the 1x1 square in a 10x10
        // window is < 0.5. The contract: cell_name is None.
        if let Some(v) = result.violations.first() {
            assert!(
                v.cell_name.is_none(),
                "Density violations have no cell attribution by design"
            );
        }
    }

    #[test]
    fn prov_drc_skip_suppresses_per_polygon_in_nested_cell() {
        // Regression: a trusted leaf with per-polygon violation, placed in
        // an untrusted parent. ROS-552 lets drc_skip suppress it.
        let mut leaf = Cell::new("trusted_leaf");
        leaf.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 10.0, 0.05),
            Layer::new(1, 0),
        );
        leaf.set_drc_skip(true);
        let (lib, top) = two_level_hierarchy(leaf);
        let rules = DrcRules::new().min_width(Layer::new(1, 0), 0.5, None);
        let result = run_drc(lib.cell(&top).unwrap(), &rules, Some(&lib));
        assert!(result.passed());
        assert_eq!(result.stats.suppressed_violations, 1);
    }

    #[test]
    fn prov_drc_skip_suppresses_cross_layer_when_both_trusted() {
        // Two trusted leaves in cross-layer forbid_overlap — now
        // suppressed since both cell_name and cell_name2 are populated.
        let mut a = Cell::new("a");
        a.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 2.0, 2.0),
            Layer::new(1, 0),
        );
        a.set_drc_skip(true);
        let mut b = Cell::new("b");
        b.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 2.0, 2.0),
            Layer::new(2, 0),
        );
        b.set_drc_skip(true);
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("a").at(0.0, 0.0));
        top.add_ref(CellRef::new("b").at(1.0, 0.0));
        let mut lib = Library::new("prov_lib");
        lib.add_cell(a).unwrap();
        lib.add_cell(b).unwrap();
        lib.add_cell(top).unwrap();
        let rules = DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(2, 0), None);
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));
        assert!(result.passed());
        assert!(result.stats.suppressed_violations >= 1);
    }

    #[test]
    fn prov_non_rigid_intra_cell_spacing_reflects_scaled_geometry() {
        // Regression for the ROS-552 review: under non-rigid (non-uniform
        // or uniform-but-non-1.0) scaling, Phase 2 intra-cell pairwise must
        // re-detect on transformed geometry so the reported `actual` and
        // `location` reflect scaled world coordinates.
        //
        // Leaf has two same-layer polygons 0.05 apart. Under 2× scale, the
        // spacing becomes 0.10, which passes min_spacing=0.08 — the runner
        // must see the scaled geometry to reach that conclusion.
        let mut leaf = Cell::new("pair");
        leaf.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 1.0, 1.0),
            Layer::new(1, 0),
        );
        leaf.add_polygon(
            Polygon::rect(Point::new(1.05, 0.0), 1.0, 1.0),
            Layer::new(1, 0),
        );
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("pair").scale(2.0));
        let mut lib = Library::new("nr_lib");
        lib.add_cell(leaf).unwrap();
        lib.add_cell(top).unwrap();

        // Spacing threshold sits between 0.05 (local) and 0.10 (2× scaled):
        // local detection would flag a violation, but the scaled geometry
        // is fine. Expect 0 violations.
        let rules = DrcRules::new().min_spacing(Layer::new(1, 0), Layer::new(1, 0), 0.08, None);
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));
        assert!(
            result.passed(),
            "2x-scaled geometry should not trigger a 0.08 min-spacing violation"
        );

        // Tight threshold: both local (0.05) and scaled (0.10) fail. The
        // violation must be in global coords and carry cell_name set.
        let rules_tight =
            DrcRules::new().min_spacing(Layer::new(1, 0), Layer::new(1, 0), 0.2, None);
        let result = run_drc(lib.cell("top").unwrap(), &rules_tight, Some(&lib));
        assert!(!result.violations.is_empty());
        let v = &result.violations[0];
        assert_eq!(v.cell_name.as_deref(), Some("pair"));
        assert_eq!(v.cell_name2.as_deref(), Some("pair"));
        if let RuleType::MinSpacing { actual, .. } = v.rule_type {
            assert!(
                (actual - 0.1).abs() < 1e-6,
                "scaled actual should be 0.10, got {}",
                actual
            );
        } else {
            panic!("expected MinSpacing");
        }
    }

    #[test]
    fn prov_detection_cache_dedupes_rigid_instances() {
        // Regression guard for the per-unique-cell detection cache: N rigid
        // instances of the same leaf must produce exactly N identical
        // violation templates (one detection, cloned N times). If the
        // cache were ever removed, the runner would still emit the right
        // number of violations but every one would carry subtly different
        // float noise from re-running the detection. Asserting identical
        // rule_type payloads locks in the cache invariant.
        let mut leaf = Cell::new("leaf");
        leaf.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 10.0, 0.05),
            Layer::new(1, 0),
        );
        let mut top = Cell::new("top");
        for i in 0..5 {
            top.add_ref(CellRef::new("leaf").at(100.0 * i as f64, 0.0));
        }
        let mut lib = Library::new("dedup_lib");
        lib.add_cell(leaf).unwrap();
        lib.add_cell(top).unwrap();

        let rules = DrcRules::new().min_width(Layer::new(1, 0), 0.5, None);
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));
        assert_eq!(result.violations.len(), 5);

        // All violations share the same detection payload (same `actual`
        // width measurement). Any drift would indicate per-instance
        // re-detection rather than cached detection.
        let first_actual = match result.violations[0].rule_type {
            RuleType::MinWidth { actual, .. } => actual,
            _ => panic!("expected MinWidth"),
        };
        for v in &result.violations[1..] {
            if let RuleType::MinWidth { actual, .. } = v.rule_type {
                assert_eq!(
                    actual, first_actual,
                    "cached detection should produce bit-identical `actual` per instance"
                );
            }
        }
    }
}

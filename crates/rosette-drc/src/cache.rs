//! Cross-run DRC caching for the `rosette serve` live-preview loop (ROS-548).
//!
//! Full-rerun DRC is cheap on small designs but scales with layout
//! complexity. In a live preview loop that re-runs DRC on every save, we
//! want re-runs to be incremental: a change to one cell should only trigger
//! DRC work proportional to that cell, not the whole design.
//!
//! This module provides:
//!
//! * [`cell_content_hash`] — a transitive, name-independent content hash of a
//!   cell. Two cells with identical geometry/refs hash equal even if named
//!   differently; editing any polygon (or any transitively-referenced cell)
//!   changes the hash.
//! * [`DrcCache`] — an in-memory, process-lifetime cache that the serve loop
//!   holds across reloads. It memoises the per-cell Phase-1 (per-polygon) and
//!   Phase-2 (intra-cell same-layer pairwise) detection results keyed on
//!   content hash, and short-circuits the whole run when nothing changed.
//!
//! Phase-3 (inter-instance pairwise), transform-dependent rules (snap-to-grid,
//! density), flattening, and the drc_skip / waiver post-filters are **not**
//! cached — they depend on the full transform tree and are recomputed every
//! run. See [`crate::runner::DrcRunner::check_cached`].

use std::collections::HashMap;
use std::hash::{Hash, Hasher};

use rosette_core::cell::Element;
use rosette_core::{Cell, Library};

use crate::rules::DrcRules;
use crate::runner::DrcResult;
use crate::violation::DrcViolation;

/// Content hash of a cell, folding in its transitive sub-cell hashes.
///
/// Excludes the cell name (so a rename is a cache hit). Hashes only the data
/// DRC depends on: polygons, paths (and their layers/width/end-type),
/// `drc_skip`, region waivers, and each `CellRef`'s transform/repetition plus
/// the content hash of the referenced cell. Ports, text, metadata, and origin
/// don't affect DRC results and are excluded.
pub type ContentHash = u64;

/// Cached per-cell detection results, in the cell's local coordinate frame.
///
/// These are the "template" violations the runner re-emits per rigid
/// instance with `location` transformed into global coordinates — exactly
/// what the in-run `detection_cache` held before ROS-548, but now persisted
/// across runs and keyed on content hash instead of cell name.
#[derive(Debug, Clone, Default)]
pub struct CachedCell {
    /// Phase-1 per-polygon violations in local frame.
    pub phase1: Vec<DrcViolation>,
    /// Phase-2 intra-cell same-layer pairwise violations in local frame.
    pub phase2: Vec<DrcViolation>,
}

/// In-memory DRC cache held across serve reloads.
///
/// In-memory only for the serve process lifetime — there is intentionally no
/// on-disk cache (ROS-548 acceptance criteria). A persistent cache is a
/// separate concern, if ever.
#[derive(Debug, Default)]
pub struct DrcCache {
    /// Fingerprint of the rule set the cached entries were computed under.
    /// When the active rules differ, every entry is invalidated (a different
    /// rule set produces different violations).
    rules_fingerprint: Option<u64>,
    /// Per-cell detection results keyed on transitive content hash.
    per_cell: HashMap<ContentHash, CachedCell>,
    /// `(content_hash, rules_fingerprint)` of the top cell on the last run,
    /// plus the full result, for the whole-design short-circuit.
    last_top: Option<(ContentHash, u64)>,
    /// The full result produced on the last run, returned verbatim when the
    /// top cell and rules are unchanged (whole-design short-circuit).
    last_result: Option<DrcResult>,
}

impl DrcCache {
    /// Create an empty cache.
    pub fn new() -> Self {
        Self::default()
    }

    /// Invalidate all cached entries if `rules` differ from the set the cache
    /// was last populated under. Returns the current rules fingerprint.
    ///
    /// Called by the runner at the start of each cached run.
    pub(crate) fn sync_rules(&mut self, rules: &DrcRules) -> u64 {
        let fp = rules_fingerprint(rules);
        if self.rules_fingerprint != Some(fp) {
            self.per_cell.clear();
            self.last_top = None;
            self.last_result = None;
            self.rules_fingerprint = Some(fp);
        }
        fp
    }

    /// Look up cached detection results for a content hash.
    pub(crate) fn get(&self, hash: ContentHash) -> Option<&CachedCell> {
        self.per_cell.get(&hash)
    }

    /// Insert (or replace) cached detection results for a content hash.
    pub(crate) fn insert(&mut self, hash: ContentHash, entry: CachedCell) {
        self.per_cell.insert(hash, entry);
    }

    /// Record the top-cell fingerprint for the whole-design short-circuit.
    pub(crate) fn set_last_top(&mut self, top_hash: ContentHash, rules_fp: u64) {
        self.last_top = Some((top_hash, rules_fp));
    }

    /// Store the full result for the whole-design short-circuit.
    pub(crate) fn set_last_result(&mut self, result: DrcResult) {
        self.last_result = Some(result);
    }

    /// Retrieve the cached full result if the top cell and rules are
    /// unchanged since the last run.
    pub(crate) fn reusable_result(
        &self,
        top_hash: ContentHash,
        rules_fp: u64,
    ) -> Option<&DrcResult> {
        if self.top_unchanged(top_hash, rules_fp) {
            self.last_result.as_ref()
        } else {
            None
        }
    }

    /// Whether the top-cell content hash and rules are unchanged since the
    /// last run (so the entire previous result can be reused).
    pub(crate) fn top_unchanged(&self, top_hash: ContentHash, rules_fp: u64) -> bool {
        self.last_top == Some((top_hash, rules_fp))
    }

    /// Number of cached cell entries (for tests/diagnostics).
    pub fn len(&self) -> usize {
        self.per_cell.len()
    }

    /// Whether the cache holds no cell entries.
    pub fn is_empty(&self) -> bool {
        self.per_cell.is_empty()
    }
}

/// Fingerprint a rule set so a change to the `[drc]` configuration
/// invalidates the cache. `Rule` and `DrcRules` derive `Debug`; the debug
/// representation is a stable, total textual encoding of every field
/// (including `f64` thresholds and rule names), which is exactly what we want
/// to detect "different rule set = different results".
pub(crate) fn rules_fingerprint(rules: &DrcRules) -> u64 {
    let mut hasher = std::collections::hash_map::DefaultHasher::new();
    // Rules order is significant to the encoding but not to results; hashing
    // the debug string keeps it simple and is conservative (a reorder
    // invalidates, which is safe — never reuses stale results).
    format!("{:?}", rules.rules()).hash(&mut hasher);
    format!("{:?}", rules.warning_margin_value()).hash(&mut hasher);
    hasher.finish()
}

/// Compute the transitive, name-independent content hash of `cell`.
///
/// `memo` memoises hashes within a single recompute pass so each unique cell
/// is serialised once. `library` resolves `CellRef`s; refs whose target is
/// missing from the library contribute only their transform/repetition (the
/// same cells are invisible to DRC flattening anyway).
pub fn cell_content_hash(
    cell: &Cell,
    library: Option<&Library>,
    memo: &mut HashMap<String, ContentHash>,
) -> ContentHash {
    let mut stack = Vec::new();
    cell_content_hash_inner(cell, library, memo, &mut stack)
}

fn cell_content_hash_inner(
    cell: &Cell,
    library: Option<&Library>,
    memo: &mut HashMap<String, ContentHash>,
    stack: &mut Vec<String>,
) -> ContentHash {
    let name = cell.name().to_string();
    if let Some(h) = memo.get(&name) {
        return *h;
    }
    // Cycle guard: a cell that (illegally) references itself transitively
    // would otherwise recurse forever. Treat the back-edge as contributing a
    // sentinel so the hash is still total.
    if stack.contains(&name) {
        return 0;
    }
    stack.push(name.clone());

    let mut hasher = std::collections::hash_map::DefaultHasher::new();

    // Hash only the data DRC actually depends on, walking elements directly to
    // avoid any serialisation/allocation in this per-reload pass. The cell
    // name is intentionally excluded (a rename is a cache hit). Ports, text,
    // metadata, and origin do not affect DRC violations, so they are omitted.
    cell.drc_skip().hash(&mut hasher);
    for region in cell.drc_waive_regions() {
        hash_bbox(&mut hasher, region);
    }

    for element in cell.elements() {
        match element {
            Element::Polygon { polygon, layer } => {
                0u8.hash(&mut hasher); // element discriminant
                layer.hash(&mut hasher);
                hash_points(&mut hasher, polygon.vertices());
            }
            Element::Path {
                points,
                width,
                layer,
                end_type,
            } => {
                1u8.hash(&mut hasher);
                layer.hash(&mut hasher);
                width.to_bits().hash(&mut hasher);
                (*end_type as u8).hash(&mut hasher);
                hash_points(&mut hasher, points);
            }
            Element::CellRef(cell_ref) => {
                2u8.hash(&mut hasher);
                hash_transform(&mut hasher, &cell_ref.transform);
                if let Some(rep) = &cell_ref.repetition {
                    rep.columns.hash(&mut hasher);
                    rep.rows.hash(&mut hasher);
                    rep.col_vector.x.to_bits().hash(&mut hasher);
                    rep.col_vector.y.to_bits().hash(&mut hasher);
                    rep.row_vector.x.to_bits().hash(&mut hasher);
                    rep.row_vector.y.to_bits().hash(&mut hasher);
                }
                // Fold in the target's content hash so the hash is transitive:
                // editing a leaf changes every ancestor's hash.
                if let Some(lib) = library
                    && let Some(ref_cell) = lib.cell(&cell_ref.cell_name)
                {
                    let sub = cell_content_hash_inner(ref_cell, library, memo, stack);
                    sub.hash(&mut hasher);
                } else {
                    // Unresolved ref: fall back to the target name so two
                    // designs referencing different missing cells don't
                    // collide.
                    cell_ref.cell_name.hash(&mut hasher);
                }
            }
            // Text labels carry no geometry DRC checks, so they don't affect
            // results. Skip them to keep the hash stable under text edits.
            Element::Text { .. } => {}
        }
    }

    let h = hasher.finish();
    stack.pop();
    memo.insert(name, h);
    h
}

/// Hash a slice of points by their raw bits — deterministic and allocation-free.
fn hash_points(hasher: &mut impl Hasher, points: &[rosette_core::Point]) {
    points.len().hash(hasher);
    for p in points {
        p.x.to_bits().hash(hasher);
        p.y.to_bits().hash(hasher);
    }
}

fn hash_bbox(hasher: &mut impl Hasher, bbox: &rosette_core::BBox) {
    let (min, max) = (bbox.min(), bbox.max());
    min.x.to_bits().hash(hasher);
    min.y.to_bits().hash(hasher);
    max.x.to_bits().hash(hasher);
    max.y.to_bits().hash(hasher);
}

fn hash_transform(hasher: &mut impl Hasher, t: &rosette_core::Transform) {
    for v in [t.a, t.b, t.c, t.d, t.tx, t.ty] {
        v.to_bits().hash(hasher);
    }
}

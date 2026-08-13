//! DRC suppression policy, separate from layout geometry.

use std::collections::{HashMap, HashSet};
use std::hash::{Hash, Hasher};

use rosette_core::BBox;

/// Cell-level skip and local waiver annotations consumed by the DRC runner.
#[derive(Debug, Clone, Default)]
pub struct DrcPolicy {
    skipped_cells: HashSet<String>,
    waiver_regions: HashMap<String, Vec<BBox>>,
}

impl DrcPolicy {
    /// Create an empty policy.
    pub fn new() -> Self {
        Self::default()
    }

    /// Mark a cell and its reachable subtree as skipped during filtering.
    pub fn skip_cell(&mut self, cell_name: impl Into<String>) {
        self.skipped_cells.insert(cell_name.into());
    }

    /// Add a waiver region in a cell's local coordinate frame.
    pub fn waive_region(&mut self, cell_name: impl Into<String>, region: BBox) {
        assert!(region.is_valid(), "DRC waiver region must be a valid BBox");
        self.waiver_regions
            .entry(cell_name.into())
            .or_default()
            .push(region);
    }

    /// Whether a cell is a root of a skipped subtree.
    pub fn skips(&self, cell_name: &str) -> bool {
        self.skipped_cells.contains(cell_name)
    }

    /// Waiver regions attached to a cell in local coordinates.
    pub fn waiver_regions(&self, cell_name: &str) -> &[BBox] {
        self.waiver_regions
            .get(cell_name)
            .map(Vec::as_slice)
            .unwrap_or_default()
    }

    pub(crate) fn fingerprint(&self) -> u64 {
        let mut hasher = std::collections::hash_map::DefaultHasher::new();
        let mut skipped: Vec<_> = self.skipped_cells.iter().collect();
        skipped.sort_unstable();
        skipped.hash(&mut hasher);

        let mut waiver_cells: Vec<_> = self.waiver_regions.keys().collect();
        waiver_cells.sort_unstable();
        for cell_name in waiver_cells {
            cell_name.hash(&mut hasher);
            let mut regions: Vec<_> = self.waiver_regions[cell_name]
                .iter()
                .map(|region| {
                    let min = region.min();
                    let max = region.max();
                    (
                        min.x.to_bits(),
                        min.y.to_bits(),
                        max.x.to_bits(),
                        max.y.to_bits(),
                    )
                })
                .collect();
            regions.sort_unstable();
            regions.hash(&mut hasher);
        }
        hasher.finish()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rosette_core::Point;

    #[test]
    fn stores_explicit_cell_annotations() {
        let mut policy = DrcPolicy::new();
        policy.skip_cell("child");
        policy.waive_region("child", BBox::new(Point::origin(), Point::new(1.0, 2.0)));
        assert!(policy.skips("child"));
        assert_eq!(policy.waiver_regions("child").len(), 1);
    }

    #[test]
    #[should_panic(expected = "DRC waiver region must be a valid BBox")]
    fn rejects_invalid_waiver_regions() {
        let mut policy = DrcPolicy::new();
        policy.waive_region("child", BBox::new(Point::new(1.0, 0.0), Point::origin()));
    }

    #[test]
    fn fingerprint_is_order_independent() {
        let first = BBox::new(Point::origin(), Point::new(1.0, 2.0));
        let second = BBox::new(Point::new(3.0, 4.0), Point::new(5.0, 6.0));
        let mut a = DrcPolicy::new();
        a.skip_cell("a");
        a.skip_cell("b");
        a.waive_region("a", first);
        a.waive_region("a", second);
        let mut b = DrcPolicy::new();
        b.waive_region("a", second);
        b.waive_region("a", first);
        b.skip_cell("b");
        b.skip_cell("a");
        assert_eq!(a.fingerprint(), b.fingerprint());
    }
}

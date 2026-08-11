//! DRC suppression policy, separate from layout geometry.

use std::collections::{HashMap, HashSet};
use std::hash::{Hash, Hasher};

use rosette_core::{BBox, Cell, Library};

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

    /// Extract the legacy policy annotations from the reachable cell hierarchy.
    pub fn from_cells(top: &Cell, library: Option<&Library>) -> Self {
        let mut policy = Self::new();
        let mut visited = HashSet::new();
        policy.collect_cell(top, library, &mut visited);
        policy
    }

    /// Mark a cell and its reachable subtree as skipped during filtering.
    pub fn skip_cell(&mut self, cell_name: impl Into<String>) {
        self.skipped_cells.insert(cell_name.into());
    }

    /// Add a waiver region in a cell's local coordinate frame.
    pub fn waive_region(&mut self, cell_name: impl Into<String>, region: BBox) {
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
            for region in &self.waiver_regions[cell_name] {
                let min = region.min();
                let max = region.max();
                min.x.to_bits().hash(&mut hasher);
                min.y.to_bits().hash(&mut hasher);
                max.x.to_bits().hash(&mut hasher);
                max.y.to_bits().hash(&mut hasher);
            }
        }
        hasher.finish()
    }

    fn collect_cell(
        &mut self,
        cell: &Cell,
        library: Option<&Library>,
        visited: &mut HashSet<String>,
    ) {
        if !visited.insert(cell.name().to_string()) {
            return;
        }
        if cell.drc_skip() {
            self.skip_cell(cell.name());
        }
        for region in cell.drc_waive_regions() {
            self.waive_region(cell.name(), *region);
        }
        if let Some(library) = library {
            for cell_ref in cell.cell_refs() {
                if let Some(child) = library.cell(&cell_ref.cell_name) {
                    self.collect_cell(child, Some(library), visited);
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rosette_core::{CellRef, Point};

    #[test]
    fn extracts_reachable_legacy_annotations() {
        let mut child = Cell::new("child");
        child.set_drc_skip(true);
        child.add_drc_waive_region(BBox::new(Point::origin(), Point::new(1.0, 2.0)));
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("child"));
        let mut library = Library::new("test");
        library.add_cell(child).unwrap();
        library.add_cell(top.clone()).unwrap();

        let policy = DrcPolicy::from_cells(&top, Some(&library));
        assert!(policy.skips("child"));
        assert_eq!(policy.waiver_regions("child").len(), 1);
    }

    #[test]
    fn fingerprint_is_order_independent() {
        let region = BBox::new(Point::origin(), Point::new(1.0, 2.0));
        let mut a = DrcPolicy::new();
        a.skip_cell("a");
        a.skip_cell("b");
        a.waive_region("a", region);
        let mut b = DrcPolicy::new();
        b.waive_region("a", region);
        b.skip_cell("b");
        b.skip_cell("a");
        assert_eq!(a.fingerprint(), b.fingerprint());
    }
}

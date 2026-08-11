//! Shared cell-hierarchy traversal and array-reference expansion.

use std::collections::HashMap;

use crate::cell::Element;
use crate::{Cell, CellRef, Library, Transform};

/// One concrete copy produced by an SREF or AREF.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct CellRefCopy {
    /// Zero-based column coordinate within the repetition.
    pub column: u16,
    /// Zero-based row coordinate within the repetition.
    pub row: u16,
    /// Transform from the referenced cell's coordinates to its parent cell.
    pub transform: Transform,
}

/// Lazy iterator over the concrete copies represented by a [`CellRef`].
#[derive(Debug, Clone)]
pub struct CellRefCopies<'a> {
    cell_ref: &'a CellRef,
    next: usize,
    len: usize,
    columns: usize,
}

impl Iterator for CellRefCopies<'_> {
    type Item = CellRefCopy;

    fn next(&mut self) -> Option<Self::Item> {
        if self.next >= self.len {
            return None;
        }

        let index = self.next;
        self.next += 1;
        let column = (index % self.columns) as u16;
        let row = (index / self.columns) as u16;
        let transform = match self.cell_ref.repetition {
            Some(repetition) => {
                let offset = repetition.copy_offset(column, row);
                self.cell_ref
                    .transform
                    .then(&Transform::translate(offset.x, offset.y))
            }
            None => self.cell_ref.transform,
        };

        Some(CellRefCopy {
            column,
            row,
            transform,
        })
    }

    fn size_hint(&self) -> (usize, Option<usize>) {
        let remaining = self.len - self.next;
        (remaining, Some(remaining))
    }
}

impl ExactSizeIterator for CellRefCopies<'_> {}

impl CellRef {
    /// Iterate over the concrete copies represented by this reference.
    ///
    /// SREFs yield one copy at `(0, 0)`. AREFs are yielded with rows outermost
    /// and columns innermost. Repetition vectors are applied in the referenced
    /// cell's local coordinates before the reference transform.
    pub fn copies(&self) -> CellRefCopies<'_> {
        let (len, columns) = match self.repetition {
            Some(repetition) if repetition.is_single() => (1, 1),
            Some(repetition) => (repetition.count(), repetition.columns as usize),
            None => (1, 1),
        };
        CellRefCopies {
            cell_ref: self,
            next: 0,
            len,
            columns: columns.max(1),
        }
    }
}

/// One reference edge in a concrete hierarchy path.
#[derive(Debug, Clone, Copy)]
pub struct InstanceStep<'a> {
    /// Cell that owns the reference element.
    pub parent: &'a Cell,
    /// Referenced element.
    pub cell_ref: &'a CellRef,
    /// Element index of `cell_ref` in `parent`.
    pub element_index: usize,
    /// AREF column coordinate, or zero for an SREF.
    pub column: u16,
    /// AREF row coordinate, or zero for an SREF.
    pub row: u16,
}

/// One concrete placement of a cell in a hierarchy walk.
#[derive(Debug, Clone, Copy)]
pub struct PlacedCell<'cell, 'path> {
    /// Placed cell definition.
    pub cell: &'cell Cell,
    /// Transform from this cell's local coordinates to the walk's root frame.
    pub transform: Transform,
    /// Root-relative hierarchy depth. The root cell has depth zero.
    pub depth: usize,
    /// Reference edges from the root to this placement.
    pub path: &'path [InstanceStep<'cell>],
}

impl PlacedCell<'_, '_> {
    /// Format an unambiguous path containing reference indices and copy coordinates.
    pub fn path_string(&self) -> String {
        format_instance_path(self.cell, self.path)
    }

    /// Format the hierarchy path below the walk's root placement.
    ///
    /// The root itself is represented by an empty string.
    pub fn relative_path_string(&self) -> String {
        let mut result = String::new();
        for step in self.path {
            use std::fmt::Write;
            if !result.is_empty() {
                result.push('/');
            }
            let _ = write!(
                result,
                "{}[ref={},col={},row={}]",
                step.cell_ref.cell_name, step.element_index, step.column, step.row
            );
        }
        result
    }
}

/// One concrete non-reference element encountered during a hierarchy walk.
#[derive(Debug, Clone, Copy)]
pub struct PlacedElement<'cell, 'path> {
    /// Placement of the cell that owns this element.
    pub placement: PlacedCell<'cell, 'path>,
    /// Element index in the owning cell.
    pub element_index: usize,
    /// Element definition. Cell references are expanded rather than yielded.
    pub element: &'cell Element,
}

/// Event emitted by [`walk_hierarchy`].
#[derive(Debug, Clone, Copy)]
pub enum HierarchyEvent<'cell, 'path> {
    /// A concrete cell placement is about to be visited.
    Enter(PlacedCell<'cell, 'path>),
    /// A concrete non-reference element in the current placement.
    Element(PlacedElement<'cell, 'path>),
    /// A concrete cell placement has been completely visited.
    Exit(PlacedCell<'cell, 'path>),
}

/// Controls traversal after a hierarchy event.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum WalkControl {
    /// Continue normally.
    Continue,
    /// Skip this cell placement's elements and descendants. Only meaningful
    /// for [`HierarchyEvent::Enter`].
    SkipSubtree,
    /// Stop the entire walk.
    Break,
}

/// Kind of malformed hierarchy edge skipped during traversal.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum HierarchyIssueKind {
    /// The reference target is absent from the library.
    MissingReference,
    /// The reference target is already an ancestor of this placement.
    Cycle,
}

/// A malformed hierarchy edge skipped during traversal.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct HierarchyIssue {
    /// Issue classification.
    pub kind: HierarchyIssueKind,
    /// Referencing cell name.
    pub parent_cell: String,
    /// Referenced cell name.
    pub cell_name: String,
    /// Reference element index in `parent_cell`.
    pub element_index: usize,
    /// AREF column coordinate, or zero for an SREF.
    pub column: u16,
    /// AREF row coordinate, or zero for an SREF.
    pub row: u16,
    /// Unambiguous root-relative path to the skipped edge.
    pub path: String,
}

/// Summary of a completed hierarchy walk.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct HierarchyReport {
    /// Missing references and cycle back-edges skipped by the walk.
    pub issues: Vec<HierarchyIssue>,
    /// Whether the visitor stopped the walk with [`WalkControl::Break`].
    pub stopped: bool,
}

/// Walk one cell hierarchy in depth-first element order.
///
/// Every AREF copy is expanded lazily. Missing references and cycle back-edges
/// are reported and skipped, while valid siblings continue to be visited.
pub fn walk_hierarchy<'cell, F>(
    library: &'cell Library,
    root: &'cell Cell,
    root_transform: Transform,
    visitor: F,
) -> HierarchyReport
where
    F: for<'path> FnMut(HierarchyEvent<'cell, 'path>) -> WalkControl,
{
    walk_hierarchy_from(library, root, root_transform, &[], visitor)
}

/// Walk a hierarchy subtree with cells that are already on the ancestry path.
///
/// This is useful when a consumer starts at a referenced child rather than the
/// true root. References back to an `initial_ancestor` are reported as cycles.
pub fn walk_hierarchy_from<'cell, F>(
    library: &'cell Library,
    root: &'cell Cell,
    root_transform: Transform,
    initial_ancestors: &[&'cell str],
    mut visitor: F,
) -> HierarchyReport
where
    F: for<'path> FnMut(HierarchyEvent<'cell, 'path>) -> WalkControl,
{
    if initial_ancestors.contains(&root.name()) {
        return HierarchyReport::default();
    }
    let mut ancestors = initial_ancestors.to_vec();
    ancestors.push(root.name());
    let mut state = WalkState {
        library,
        visitor: &mut visitor,
        path: Vec::new(),
        ancestors,
        report: HierarchyReport::default(),
    };
    state.visit_cell(root, root_transform);
    state.report
}

struct WalkState<'library, 'visitor, F> {
    library: &'library Library,
    visitor: &'visitor mut F,
    path: Vec<InstanceStep<'library>>,
    ancestors: Vec<&'library str>,
    report: HierarchyReport,
}

impl<'library, F> WalkState<'library, '_, F>
where
    F: for<'path> FnMut(HierarchyEvent<'library, 'path>) -> WalkControl,
{
    fn visit_cell(&mut self, cell: &'library Cell, transform: Transform) {
        if self.report.stopped {
            return;
        }

        let placement = PlacedCell {
            cell,
            transform,
            depth: self.path.len(),
            path: &self.path,
        };
        match (self.visitor)(HierarchyEvent::Enter(placement)) {
            WalkControl::Break => {
                self.report.stopped = true;
                return;
            }
            WalkControl::SkipSubtree => {
                if (self.visitor)(HierarchyEvent::Exit(placement)) == WalkControl::Break {
                    self.report.stopped = true;
                }
                return;
            }
            WalkControl::Continue => {}
        }

        for (element_index, element) in cell.elements().iter().enumerate() {
            if self.report.stopped {
                return;
            }
            if let Element::CellRef(cell_ref) = element {
                self.visit_reference(cell, element_index, cell_ref, transform);
            } else {
                let placement = PlacedCell {
                    cell,
                    transform,
                    depth: self.path.len(),
                    path: &self.path,
                };
                let event = HierarchyEvent::Element(PlacedElement {
                    placement,
                    element_index,
                    element,
                });
                if (self.visitor)(event) == WalkControl::Break {
                    self.report.stopped = true;
                    return;
                }
            }
        }

        let placement = PlacedCell {
            cell,
            transform,
            depth: self.path.len(),
            path: &self.path,
        };
        if (self.visitor)(HierarchyEvent::Exit(placement)) == WalkControl::Break {
            self.report.stopped = true;
        }
    }

    fn visit_reference(
        &mut self,
        parent: &'library Cell,
        element_index: usize,
        cell_ref: &'library CellRef,
        parent_transform: Transform,
    ) {
        let child = self.library.cell(&cell_ref.cell_name);
        let issue_kind = if self.ancestors.contains(&cell_ref.cell_name.as_str()) {
            Some(HierarchyIssueKind::Cycle)
        } else if child.is_none() {
            Some(HierarchyIssueKind::MissingReference)
        } else {
            None
        };
        if let Some(kind) = issue_kind {
            if let Some(copy) = cell_ref.copies().next() {
                let step = InstanceStep {
                    parent,
                    cell_ref,
                    element_index,
                    column: copy.column,
                    row: copy.row,
                };
                self.path.push(step);
                self.report.issues.push(HierarchyIssue {
                    kind,
                    parent_cell: parent.name().to_string(),
                    cell_name: cell_ref.cell_name.clone(),
                    element_index,
                    column: copy.column,
                    row: copy.row,
                    path: format_instance_path(parent, &self.path),
                });
                self.path.pop();
            }
            return;
        }
        let child = child.unwrap();

        for copy in cell_ref.copies() {
            let step = InstanceStep {
                parent,
                cell_ref,
                element_index,
                column: copy.column,
                row: copy.row,
            };
            self.path.push(step);
            self.ancestors.push(child.name());
            self.visit_cell(child, parent_transform.then(&copy.transform));
            self.ancestors.pop();
            self.path.pop();

            if self.report.stopped {
                return;
            }
        }
    }
}

fn format_instance_path(current_cell: &Cell, path: &[InstanceStep<'_>]) -> String {
    let root_name = path
        .first()
        .map_or(current_cell.name(), |step| step.parent.name());
    let mut result = root_name.to_string();
    for step in path {
        use std::fmt::Write;
        let _ = write!(
            result,
            "/{}[ref={},col={},row={}]",
            step.cell_ref.cell_name, step.element_index, step.column, step.row
        );
    }
    result
}

impl Library {
    /// Return every cell once in cycle-safe dependency-first order.
    ///
    /// Missing targets and cycle back-edges do not prevent other definitions
    /// from being ordered. Library insertion order breaks ties deterministically.
    pub fn dependency_order(&self) -> Vec<&Cell> {
        let indexes: HashMap<&str, usize> = self
            .cells()
            .iter()
            .enumerate()
            .map(|(index, cell)| (cell.name(), index))
            .collect();
        let mut states = vec![0_u8; self.cells().len()];
        let mut ordered = Vec::with_capacity(self.cells().len());

        fn visit<'a>(
            library: &'a Library,
            indexes: &HashMap<&str, usize>,
            states: &mut [u8],
            ordered: &mut Vec<&'a Cell>,
            index: usize,
        ) {
            match states[index] {
                1 | 2 => return,
                _ => states[index] = 1,
            }

            let cell = &library.cells()[index];
            for cell_ref in cell.cell_refs() {
                if let Some(&child_index) = indexes.get(cell_ref.cell_name.as_str()) {
                    visit(library, indexes, states, ordered, child_index);
                }
            }
            states[index] = 2;
            ordered.push(cell);
        }

        for index in 0..self.cells().len() {
            visit(self, &indexes, &mut states, &mut ordered, index);
        }
        ordered
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{Layer, Point, Polygon, Repetition, Vector2};

    #[test]
    fn copies_are_lazy_and_follow_local_lattice_order() {
        let cell_ref = CellRef::new("child")
            .rotate(std::f64::consts::FRAC_PI_2)
            .array_vectors(2, 2, Vector2::new(10.0, 0.0), Vector2::new(5.0, 20.0));
        let copies: Vec<_> = cell_ref.copies().collect();
        assert_eq!(copies.len(), 4);
        assert_eq!(
            copies
                .iter()
                .map(|copy| (copy.column, copy.row))
                .collect::<Vec<_>>(),
            vec![(0, 0), (1, 0), (0, 1), (1, 1)]
        );
        let origins: Vec<_> = copies
            .iter()
            .map(|copy| copy.transform.apply(Point::origin()))
            .collect();
        assert!(origins[1].x.abs() < 1e-9);
        assert!((origins[1].y - 10.0).abs() < 1e-9);
        assert!((origins[2].x + 20.0).abs() < 1e-9);
        assert!((origins[2].y - 5.0).abs() < 1e-9);
    }

    #[test]
    fn malformed_single_repetitions_preserve_one_copy() {
        let mut cell_ref = CellRef::new("child");
        cell_ref.repetition = Some(Repetition {
            columns: 0,
            rows: 1,
            col_vector: Vector2::unit_x(),
            row_vector: Vector2::unit_y(),
        });
        assert_eq!(cell_ref.copies().len(), 1);
        assert_eq!(
            cell_ref.copies().next().unwrap().transform,
            Transform::identity()
        );
    }

    #[test]
    fn walk_reports_paths_arrays_missing_refs_and_cycles() {
        let mut leaf = Cell::new("leaf");
        leaf.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));
        leaf.add_ref(CellRef::new("root"));

        let mut root = Cell::new("root");
        root.add_ref(CellRef::new("leaf").array(2, 1, 10.0, 0.0));
        root.add_ref(CellRef::new("missing"));

        let mut library = Library::new("test");
        library.add_cell(leaf).unwrap();
        library.add_cell(root).unwrap();

        let mut paths = Vec::new();
        let report = walk_hierarchy(
            &library,
            library.cell("root").unwrap(),
            Transform::identity(),
            |event| {
                if let HierarchyEvent::Enter(placement) = event {
                    paths.push(placement.path_string());
                }
                WalkControl::Continue
            },
        );

        assert_eq!(
            paths,
            vec![
                "root",
                "root/leaf[ref=0,col=0,row=0]",
                "root/leaf[ref=0,col=1,row=0]",
            ]
        );
        assert_eq!(report.issues.len(), 3);
        assert_eq!(report.issues[0].kind, HierarchyIssueKind::Cycle);
        assert_eq!(report.issues[2].kind, HierarchyIssueKind::MissingReference);
    }

    #[test]
    fn dependency_order_handles_diamonds_cycles_and_disconnected_cells() {
        let leaf = Cell::new("leaf");
        let mut left = Cell::new("left");
        left.add_ref(CellRef::new("leaf"));
        let mut right = Cell::new("right");
        right.add_ref(CellRef::new("leaf"));
        let mut root = Cell::new("root");
        root.add_ref(CellRef::new("left"));
        root.add_ref(CellRef::new("right"));
        let mut cycle = Cell::new("cycle");
        cycle.add_ref(CellRef::new("cycle"));
        let disconnected = Cell::new("disconnected");

        let mut library = Library::new("test");
        for cell in [root, right, left, leaf, cycle, disconnected] {
            library.add_cell(cell).unwrap();
        }

        let names: Vec<_> = library
            .dependency_order()
            .into_iter()
            .map(Cell::name)
            .collect();
        assert_eq!(
            names,
            vec!["leaf", "left", "right", "root", "cycle", "disconnected"]
        );
    }

    #[test]
    fn subtree_pruning_is_balanced_and_initial_ancestors_break_cycles() {
        let mut child = Cell::new("child");
        child.add_ref(CellRef::new("root"));
        let mut root = Cell::new("root");
        root.add_ref(CellRef::new("child"));
        let mut library = Library::new("test");
        library.add_cell(child).unwrap();
        library.add_cell(root).unwrap();

        let mut events = Vec::new();
        walk_hierarchy(
            &library,
            library.cell("root").unwrap(),
            Transform::identity(),
            |event| match event {
                HierarchyEvent::Enter(placement) => {
                    events.push(format!("enter:{}", placement.cell.name()));
                    if placement.depth == 1 {
                        WalkControl::SkipSubtree
                    } else {
                        WalkControl::Continue
                    }
                }
                HierarchyEvent::Exit(placement) => {
                    events.push(format!("exit:{}", placement.cell.name()));
                    WalkControl::Continue
                }
                HierarchyEvent::Element(_) => WalkControl::Continue,
            },
        );
        assert_eq!(
            events,
            vec!["enter:root", "enter:child", "exit:child", "exit:root"]
        );

        let report = walk_hierarchy_from(
            &library,
            library.cell("child").unwrap(),
            Transform::identity(),
            &["root"],
            |_| WalkControl::Continue,
        );
        assert_eq!(report.issues.len(), 1);
        assert_eq!(report.issues[0].kind, HierarchyIssueKind::Cycle);

        let mut visited = false;
        walk_hierarchy_from(
            &library,
            library.cell("child").unwrap(),
            Transform::identity(),
            &["child"],
            |_| {
                visited = true;
                WalkControl::Continue
            },
        );
        assert!(!visited);

        let report = walk_hierarchy(
            &library,
            library.cell("root").unwrap(),
            Transform::identity(),
            |event| match event {
                HierarchyEvent::Enter(placement) if placement.depth == 1 => {
                    WalkControl::SkipSubtree
                }
                HierarchyEvent::Exit(placement) if placement.depth == 1 => WalkControl::Break,
                _ => WalkControl::Continue,
            },
        );
        assert!(report.stopped);
    }
}

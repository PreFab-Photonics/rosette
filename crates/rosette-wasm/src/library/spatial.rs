//! Lazy R-tree spatial index for interactive hit-testing.
//!
//! The interactive hit-test paths (`hit_test`, `hit_test_rect`) previously
//! scanned every element in the active cell on each pointer event — O(n) per
//! mouse move. For large designs (thousands of elements) this dominated the
//! cost of hover, marquee selection, and the move tool.
//!
//! This module builds an [`rstar::RTree`] over the active cell's element
//! bounding boxes so those queries become roughly O(log n + k). The index is
//! built lazily and memoised in a `RefCell` keyed by the active cell name,
//! mirroring the `instance_bbox_cache` strategy: it is invalidated by
//! `mark_dirty` (any structural mutation) and rebound whenever the active cell
//! changes, so no per-mutation bookkeeping is required at call sites.

use super::{WasmLibrary, text_bbox};
use rosette_core::cell::Element;
use rosette_core::geometry::{BBox, offset_polygon};
use rstar::{AABB, RTree, RTreeObject};

/// What an indexed entry points at within the active cell.
#[derive(Clone, Debug)]
pub(super) enum IndexedKind {
    /// A direct element (Polygon / Path / Text). Carries its stable UUID so
    /// candidates resolve to a selection id without scanning `element_refs`.
    Direct { uuid: String },
    /// A CellRef instance at `element_index`.
    Instance,
}

/// An element keyed into the spatial index by its (precomputed) bounding box.
///
/// For `Path` elements the stored `bbox` is the ribbon bbox, so the expensive
/// `offset_polygon` call is done once at build time rather than on every
/// mouse move (the previous hot-path behaviour).
#[derive(Clone, Debug)]
pub(super) struct IndexedElement {
    pub element_index: usize,
    pub kind: IndexedKind,
    pub bbox: BBox,
}

impl RTreeObject for IndexedElement {
    type Envelope = AABB<[f64; 2]>;

    fn envelope(&self) -> Self::Envelope {
        AABB::from_corners(
            [self.bbox.min().x, self.bbox.min().y],
            [self.bbox.max().x, self.bbox.max().y],
        )
    }
}

impl WasmLibrary {
    /// Ensure the spatial index is built for the active cell and run `f` with it.
    ///
    /// Returns `None` (and skips `f`) when there is no active cell. The index is
    /// (re)built on a cache miss — i.e. when invalidated by `mark_dirty` or when
    /// the active cell changed since the last build.
    pub(super) fn with_spatial_index<R>(
        &self,
        f: impl FnOnce(&RTree<IndexedElement>) -> R,
    ) -> Option<R> {
        let cell_name = self.active_cell.as_ref()?;

        // Rebind / rebuild on active-cell change, matching instance_bbox_cache.
        {
            let mut idx_cell = self.spatial_index_cell.borrow_mut();
            if idx_cell.as_deref() != Some(cell_name.as_str()) {
                *self.spatial_index.borrow_mut() = None;
                *idx_cell = Some(cell_name.clone());
            }
        }

        if self.spatial_index.borrow().is_none() {
            let tree = self.build_spatial_index(cell_name);
            *self.spatial_index.borrow_mut() = Some(tree);
        }

        let guard = self.spatial_index.borrow();
        guard.as_ref().map(f)
    }

    /// Build the R-tree over the active cell's elements.
    ///
    /// Bounding boxes here intentionally match the ones used by the precise
    /// hit-test checks (`hit_test`/`hit_test_rect`) so the broad-phase never
    /// drops a candidate that the narrow phase would have accepted. Layer
    /// visibility (alpha) is deliberately NOT encoded in the index — the index
    /// stores geometry only, and the narrow phase re-checks `layer_colors`
    /// alpha. (Layer color/visibility changes currently call `mark_dirty`, which
    /// rebuilds the index anyway, but keeping the alpha filter in the narrow
    /// phase means the index never has to be rebuilt purely for a visibility
    /// toggle if that invalidation is ever relaxed.)
    fn build_spatial_index(&self, cell_name: &str) -> RTree<IndexedElement> {
        let cell = match self.library.cell(cell_name) {
            Some(c) => c,
            None => return RTree::new(),
        };

        // Reverse map element_index -> uuid for this cell, built once.
        let mut index_to_uuid: std::collections::HashMap<usize, &str> =
            std::collections::HashMap::with_capacity(self.element_refs.len());
        for (uuid, r) in &self.element_refs {
            if r.cell_name == cell_name {
                index_to_uuid.insert(r.element_index, uuid.as_str());
            }
        }

        let mut items: Vec<IndexedElement> = Vec::with_capacity(cell.elements().len());

        for (elem_idx, element) in cell.elements().iter().enumerate() {
            let (bbox, kind) = match element {
                Element::Polygon { polygon, .. } => {
                    let Some(uuid) = index_to_uuid.get(&elem_idx) else {
                        continue;
                    };
                    (
                        polygon.bbox(),
                        IndexedKind::Direct {
                            uuid: (*uuid).to_string(),
                        },
                    )
                }
                Element::Path { points, width, .. } => {
                    let Some(uuid) = index_to_uuid.get(&elem_idx) else {
                        continue;
                    };
                    match offset_polygon(points, *width) {
                        Some(ribbon) => (
                            ribbon.bbox(),
                            IndexedKind::Direct {
                                uuid: (*uuid).to_string(),
                            },
                        ),
                        None => continue,
                    }
                }
                Element::Text {
                    text,
                    position,
                    height,
                    ..
                } => {
                    let Some(uuid) = index_to_uuid.get(&elem_idx) else {
                        continue;
                    };
                    (
                        text_bbox(text, position, *height),
                        IndexedKind::Direct {
                            uuid: (*uuid).to_string(),
                        },
                    )
                }
                Element::CellRef(cell_ref) => (
                    self.instance_bbox_cached(cell_name, elem_idx, cell_ref),
                    IndexedKind::Instance,
                ),
            };

            items.push(IndexedElement {
                element_index: elem_idx,
                kind,
                bbox,
            });
        }

        RTree::bulk_load(items)
    }
}

/// Convert a world-space query rectangle into an `rstar` envelope.
pub(super) fn query_envelope(min_x: f64, min_y: f64, max_x: f64, max_y: f64) -> AABB<[f64; 2]> {
    AABB::from_corners([min_x, min_y], [max_x, max_y])
}

/// Build an `rstar` envelope for a single point (for point hit-tests).
pub(super) fn point_envelope(x: f64, y: f64) -> AABB<[f64; 2]> {
    AABB::from_point([x, y])
}

#[cfg(test)]
mod tests {
    use crate::library::WasmLibrary;

    /// Build a library with three non-overlapping unit squares on layer 1/0
    /// at x = 0, 10, 20 (each 1x1), plus the active cell set.
    fn three_squares() -> (WasmLibrary, Vec<String>) {
        let mut lib = WasmLibrary::new("test");
        lib.add_cell("top").unwrap();
        lib.set_active_cell("top");
        let mut ids = Vec::new();
        for x in [0.0, 10.0, 20.0] {
            ids.push(lib.add_rectangle(x, 0.0, 1.0, 1.0, 1, 0).unwrap());
        }
        (lib, ids)
    }

    #[test]
    fn hit_test_point_picks_the_square_under_cursor() {
        let (lib, ids) = three_squares();

        // Inside the middle square.
        assert_eq!(lib.hit_test(10.5, 0.5).as_ref(), Some(&ids[1]));
        // Inside the first square.
        assert_eq!(lib.hit_test(0.5, 0.5).as_ref(), Some(&ids[0]));
        // Empty space between squares.
        assert_eq!(lib.hit_test(5.0, 0.5), None);
        // Far outside everything.
        assert_eq!(lib.hit_test(1000.0, 1000.0), None);
    }

    #[test]
    fn hit_test_rect_returns_all_overlapping_squares() {
        let (lib, ids) = three_squares();

        // A rect covering the first two squares but not the third.
        let mut hits = lib.hit_test_rect(-1.0, -1.0, 11.0, 2.0);
        hits.sort();
        let mut expected = vec![ids[0].clone(), ids[1].clone()];
        expected.sort();
        assert_eq!(hits, expected);

        // A rect covering all three.
        let mut all = lib.hit_test_rect(-1.0, -1.0, 21.0, 2.0);
        all.sort();
        let mut all_expected = ids.clone();
        all_expected.sort();
        assert_eq!(all, all_expected);

        // A rect in empty space hits nothing.
        assert!(lib.hit_test_rect(100.0, 100.0, 200.0, 200.0).is_empty());
    }

    #[test]
    fn hidden_layer_is_excluded_from_hit_tests() {
        let (mut lib, ids) = three_squares();

        // Sanity: visible before hiding.
        assert_eq!(lib.hit_test(0.5, 0.5).as_ref(), Some(&ids[0]));

        // Hide layer 1/0 by setting alpha to 0. Regardless of whether the index
        // is rebuilt (set_layer_color marks dirty), the narrow phase must filter
        // out the hidden layer, since visibility is not encoded in the index.
        lib.set_layer_color(1, 0, 0.0, 0.0, 0.0, 0.0);

        assert_eq!(lib.hit_test(0.5, 0.5), None);
        assert!(lib.hit_test_rect(-1.0, -1.0, 21.0, 2.0).is_empty());
    }

    #[test]
    fn index_reflects_geometry_added_after_first_query() {
        let (mut lib, _ids) = three_squares();

        // Force the index to build.
        assert!(lib.hit_test(0.5, 0.5).is_some());

        // Add a new square far away; mark_dirty must invalidate the index.
        let new_id = lib.add_rectangle(100.0, 100.0, 1.0, 1.0, 1, 0).unwrap();

        assert_eq!(lib.hit_test(100.5, 100.5).as_ref(), Some(&new_id));
    }
}

//! Shared R-tree spatial indexing utilities for DRC checks.

use rosette_core::BBox;
use rstar::{PointDistance, RTreeObject, AABB};

/// Wrapper for R-tree spatial indexing of polygons by bounding box.
///
/// Stores the polygon's position within a slice (`index`) and a global
/// identifier (`orig_index`) used for same-layer deduplication.
#[derive(Clone)]
pub(crate) struct IndexedPolygon {
    pub index: usize,
    pub orig_index: usize,
    pub bbox: BBox,
}

impl RTreeObject for IndexedPolygon {
    type Envelope = AABB<[f64; 2]>;

    fn envelope(&self) -> Self::Envelope {
        AABB::from_corners(
            [self.bbox.min().x, self.bbox.min().y],
            [self.bbox.max().x, self.bbox.max().y],
        )
    }
}

impl PointDistance for IndexedPolygon {
    fn distance_2(&self, point: &[f64; 2]) -> f64 {
        let min = self.bbox.min();
        let max = self.bbox.max();

        let dx = if point[0] < min.x {
            min.x - point[0]
        } else if point[0] > max.x {
            point[0] - max.x
        } else {
            0.0
        };

        let dy = if point[1] < min.y {
            min.y - point[1]
        } else if point[1] > max.y {
            point[1] - max.y
        } else {
            0.0
        };

        dx * dx + dy * dy
    }
}

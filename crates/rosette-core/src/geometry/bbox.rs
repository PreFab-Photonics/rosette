//! Axis-aligned bounding boxes.
//!
//! A [`BBox`] represents the smallest axis-aligned rectangle that contains
//! a set of points or geometry.

use super::{Point, Transform};
use crate::error::BBoxValidationReason;

/// An axis-aligned bounding box.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct BBox {
    min: Point,
    max: Point,
}

impl BBox {
    /// Create a bounding box from min and max points.
    pub fn new(min: Point, max: Point) -> Result<Self, BBoxValidationReason> {
        if !min.is_finite() {
            return Err(BBoxValidationReason::NonFinitePoint { point_index: 0 });
        }
        if !max.is_finite() {
            return Err(BBoxValidationReason::NonFinitePoint { point_index: 1 });
        }
        if min.x > max.x || min.y > max.y {
            return Err(BBoxValidationReason::UnorderedCorners);
        }
        Ok(Self { min, max })
    }

    /// Create a bounding box from a single point.
    pub fn from_point(point: Point) -> Result<Self, BBoxValidationReason> {
        Self::new(point, point)
    }

    /// Create a bounding box from a slice of points.
    pub fn from_points(points: &[Point]) -> Result<Self, BBoxValidationReason> {
        if points.is_empty() {
            return Err(BBoxValidationReason::EmptyPoints);
        }
        if let Some(point_index) = points.iter().position(|point| !point.is_finite()) {
            return Err(BBoxValidationReason::NonFinitePoint { point_index });
        }
        Ok(Self::from_valid_points(points))
    }

    pub(crate) fn from_valid_points(points: &[Point]) -> Self {
        debug_assert!(!points.is_empty());
        debug_assert!(points.iter().all(|point| point.is_finite()));
        let mut min_x = points[0].x;
        let mut min_y = points[0].y;
        let mut max_x = points[0].x;
        let mut max_y = points[0].y;

        for p in points.iter().skip(1) {
            min_x = min_x.min(p.x);
            min_y = min_y.min(p.y);
            max_x = max_x.max(p.x);
            max_y = max_y.max(p.y);
        }

        Self {
            min: Point::new(min_x, min_y),
            max: Point::new(max_x, max_y),
        }
    }

    /// Get the minimum corner.
    pub fn min(&self) -> Point {
        self.min
    }

    /// Get the maximum corner.
    pub fn max(&self) -> Point {
        self.max
    }

    /// Get the width.
    pub fn width(&self) -> f64 {
        self.max.x - self.min.x
    }

    /// Get the height.
    pub fn height(&self) -> f64 {
        self.max.y - self.min.y
    }

    /// Get the center point.
    pub fn center(&self) -> Point {
        fn midpoint(a: f64, b: f64) -> f64 {
            if a.signum() == b.signum() {
                a + (b - a) / 2.0
            } else {
                a / 2.0 + b / 2.0
            }
        }
        Point::new(
            midpoint(self.min.x, self.max.x),
            midpoint(self.min.y, self.max.y),
        )
    }

    /// Get the area.
    pub fn area(&self) -> f64 {
        self.width() * self.height()
    }

    /// Check if the bounding box contains a point.
    pub fn contains(&self, p: Point) -> bool {
        p.x >= self.min.x && p.x <= self.max.x && p.y >= self.min.y && p.y <= self.max.y
    }

    /// Check if this bounding box fully contains another bounding box.
    ///
    /// Returns `true` only if every point of `other` lies within `self`
    /// (inclusive of the boundary). A box always contains itself.
    pub fn contains_bbox(&self, other: &BBox) -> bool {
        other.min.x >= self.min.x
            && other.min.y >= self.min.y
            && other.max.x <= self.max.x
            && other.max.y <= self.max.y
    }

    /// Check if two bounding boxes overlap.
    pub fn overlaps(&self, other: &BBox) -> bool {
        self.min.x <= other.max.x
            && self.max.x >= other.min.x
            && self.min.y <= other.max.y
            && self.max.y >= other.min.y
    }

    /// Merge with another bounding box.
    pub fn merge(&self, other: &BBox) -> Self {
        Self {
            min: Point::new(self.min.x.min(other.min.x), self.min.y.min(other.min.y)),
            max: Point::new(self.max.x.max(other.max.x), self.max.y.max(other.max.y)),
        }
    }

    /// Expand by a point.
    pub fn expand(&self, point: Point) -> Result<Self, BBoxValidationReason> {
        if !point.is_finite() {
            return Err(BBoxValidationReason::NonFinitePoint { point_index: 0 });
        }
        Ok(Self {
            min: Point::new(self.min.x.min(point.x), self.min.y.min(point.y)),
            max: Point::new(self.max.x.max(point.x), self.max.y.max(point.y)),
        })
    }

    /// Expand by a margin on all sides.
    pub fn expand_by(&self, margin: f64) -> Result<Self, BBoxValidationReason> {
        Self::new(
            Point::new(self.min.x - margin, self.min.y - margin),
            Point::new(self.max.x + margin, self.max.y + margin),
        )
    }

    /// Try to transform this box and return its axis-aligned bounds.
    ///
    /// Returns an error if transforming any corner produces a non-finite point.
    pub fn try_transform(&self, transform: &Transform) -> Result<Self, BBoxValidationReason> {
        let corners = [
            transform.apply(self.min),
            transform.apply(Point::new(self.max.x, self.min.y)),
            transform.apply(self.max),
            transform.apply(Point::new(self.min.x, self.max.y)),
        ];
        Self::from_points(&corners)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const EPSILON: f64 = 1e-10;

    fn approx_eq(a: f64, b: f64) -> bool {
        (a - b).abs() < EPSILON
    }

    #[test]
    fn test_from_points() {
        let points = vec![
            Point::new(1.0, 2.0),
            Point::new(5.0, 3.0),
            Point::new(2.0, 7.0),
        ];
        let bbox = BBox::from_points(&points).unwrap();
        assert!(approx_eq(bbox.min().x, 1.0));
        assert!(approx_eq(bbox.min().y, 2.0));
        assert!(approx_eq(bbox.max().x, 5.0));
        assert!(approx_eq(bbox.max().y, 7.0));
    }

    #[test]
    fn test_dimensions() {
        let bbox = BBox::new(Point::new(0.0, 0.0), Point::new(10.0, 5.0)).unwrap();
        assert!(approx_eq(bbox.width(), 10.0));
        assert!(approx_eq(bbox.height(), 5.0));
        assert!(approx_eq(bbox.area(), 50.0));
    }

    #[test]
    fn validity_requires_finite_ordered_corners() {
        assert!(BBox::new(Point::origin(), Point::new(1.0, 1.0)).is_ok());
        assert_eq!(
            BBox::new(Point::new(2.0, 0.0), Point::new(1.0, 1.0)),
            Err(BBoxValidationReason::UnorderedCorners)
        );
        assert_eq!(
            BBox::new(Point::origin(), Point::new(f64::NAN, 1.0)),
            Err(BBoxValidationReason::NonFinitePoint { point_index: 1 })
        );
    }

    #[test]
    fn test_center() {
        let bbox = BBox::new(Point::new(0.0, 0.0), Point::new(10.0, 10.0)).unwrap();
        let center = bbox.center();
        assert!(approx_eq(center.x, 5.0));
        assert!(approx_eq(center.y, 5.0));
    }

    #[test]
    fn center_preserves_point_sized_subnormal_bounds() {
        let subnormal = f64::from_bits(1);
        let bbox = BBox::from_point(Point::new(subnormal, -subnormal)).unwrap();
        assert_eq!(bbox.center(), Point::new(subnormal, -subnormal));
    }

    #[test]
    fn test_contains() {
        let bbox = BBox::new(Point::new(0.0, 0.0), Point::new(10.0, 10.0)).unwrap();
        assert!(bbox.contains(Point::new(5.0, 5.0)));
        assert!(bbox.contains(Point::new(0.0, 0.0)));
        assert!(!bbox.contains(Point::new(-1.0, 5.0)));
    }

    #[test]
    fn test_overlaps() {
        let bbox1 = BBox::new(Point::new(0.0, 0.0), Point::new(10.0, 10.0)).unwrap();
        let bbox2 = BBox::new(Point::new(5.0, 5.0), Point::new(15.0, 15.0)).unwrap();
        let bbox3 = BBox::new(Point::new(20.0, 20.0), Point::new(30.0, 30.0)).unwrap();

        assert!(bbox1.overlaps(&bbox2));
        assert!(!bbox1.overlaps(&bbox3));
    }

    #[test]
    fn test_merge() {
        let bbox1 = BBox::new(Point::new(0.0, 0.0), Point::new(5.0, 5.0)).unwrap();
        let bbox2 = BBox::new(Point::new(3.0, 3.0), Point::new(10.0, 10.0)).unwrap();
        let merged = bbox1.merge(&bbox2);

        assert!(approx_eq(merged.min().x, 0.0));
        assert!(approx_eq(merged.min().y, 0.0));
        assert!(approx_eq(merged.max().x, 10.0));
        assert!(approx_eq(merged.max().y, 10.0));
    }

    #[test]
    fn test_empty_points() {
        assert_eq!(
            BBox::from_points(&[]),
            Err(BBoxValidationReason::EmptyPoints)
        );
    }

    #[test]
    fn test_transform_translate() {
        let bbox = BBox::new(Point::new(0.0, 0.0), Point::new(10.0, 5.0)).unwrap();
        let t = Transform::translate(3.0, -2.0);
        let out = bbox.try_transform(&t).unwrap();
        assert!(approx_eq(out.min().x, 3.0));
        assert!(approx_eq(out.min().y, -2.0));
        assert!(approx_eq(out.max().x, 13.0));
        assert!(approx_eq(out.max().y, 3.0));
    }

    #[test]
    fn test_transform_rotate_90() {
        // 10x5 rect at origin -> rotated 90° should become 5x10 at origin
        let bbox = BBox::new(Point::new(0.0, 0.0), Point::new(10.0, 5.0)).unwrap();
        let t = Transform::rotate(std::f64::consts::FRAC_PI_2);
        let out = bbox.try_transform(&t).unwrap();
        assert!(approx_eq(out.width(), 5.0));
        assert!(approx_eq(out.height(), 10.0));
    }

    #[test]
    fn test_transform_rotate_45_inflates() {
        // Axis-aligned unit square rotated 45° has AABB side sqrt(2).
        let bbox = BBox::new(Point::new(-0.5, -0.5), Point::new(0.5, 0.5)).unwrap();
        let t = Transform::rotate(std::f64::consts::FRAC_PI_4);
        let out = bbox.try_transform(&t).unwrap();
        let diag = std::f64::consts::SQRT_2;
        assert!(approx_eq(out.width(), diag));
        assert!(approx_eq(out.height(), diag));
    }

    #[test]
    fn try_transform_rejects_overflowed_corners() {
        let bbox = BBox::new(Point::new(1.0, 0.0), Point::new(2.0, 1.0)).unwrap();
        assert_eq!(
            bbox.try_transform(&Transform::scale(f64::MAX, 1.0))
                .unwrap_err(),
            BBoxValidationReason::NonFinitePoint { point_index: 1 }
        );
    }

    #[test]
    fn test_contains_bbox() {
        let outer = BBox::new(Point::new(0.0, 0.0), Point::new(10.0, 10.0)).unwrap();
        // Fully inside.
        assert!(
            outer.contains_bbox(&BBox::new(Point::new(2.0, 2.0), Point::new(8.0, 8.0)).unwrap())
        );
        // Equal box (boundary inclusive).
        assert!(outer.contains_bbox(&outer));
        // Touching the boundary from inside.
        assert!(
            outer.contains_bbox(&BBox::new(Point::new(0.0, 0.0), Point::new(5.0, 5.0)).unwrap())
        );
        // Sticks out on one side.
        assert!(
            !outer.contains_bbox(&BBox::new(Point::new(8.0, 8.0), Point::new(12.0, 9.0)).unwrap())
        );
        // Fully outside.
        assert!(
            !outer
                .contains_bbox(&BBox::new(Point::new(20.0, 20.0), Point::new(21.0, 21.0)).unwrap())
        );
    }
}

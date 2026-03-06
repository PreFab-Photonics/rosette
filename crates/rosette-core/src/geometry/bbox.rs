//! Axis-aligned bounding boxes.
//!
//! A [`BBox`] represents the smallest axis-aligned rectangle that contains
//! a set of points or geometry.

use super::Point;

/// An axis-aligned bounding box.
#[derive(Debug, Clone, Copy, PartialEq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct BBox {
    min: Point,
    max: Point,
}

impl BBox {
    /// Create a bounding box from min and max points.
    pub fn new(min: Point, max: Point) -> Self {
        Self { min, max }
    }

    /// Create a bounding box from a single point.
    pub fn from_point(p: Point) -> Self {
        Self { min: p, max: p }
    }

    /// Create a bounding box from a slice of points.
    ///
    /// # Panics
    /// Panics if the slice is empty.
    pub fn from_points(points: &[Point]) -> Self {
        assert!(!points.is_empty(), "Cannot create BBox from empty points");

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
        Point::new(
            (self.min.x + self.max.x) / 2.0,
            (self.min.y + self.max.y) / 2.0,
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
    pub fn expand(&self, p: Point) -> Self {
        Self {
            min: Point::new(self.min.x.min(p.x), self.min.y.min(p.y)),
            max: Point::new(self.max.x.max(p.x), self.max.y.max(p.y)),
        }
    }

    /// Expand by a margin on all sides.
    pub fn expand_by(&self, margin: f64) -> Self {
        Self {
            min: Point::new(self.min.x - margin, self.min.y - margin),
            max: Point::new(self.max.x + margin, self.max.y + margin),
        }
    }

    /// Get the intersection with another bounding box.
    ///
    /// Returns None if the boxes don't overlap.
    pub fn intersection(&self, other: &BBox) -> Option<Self> {
        if !self.overlaps(other) {
            return None;
        }
        Some(Self {
            min: Point::new(self.min.x.max(other.min.x), self.min.y.max(other.min.y)),
            max: Point::new(self.max.x.min(other.max.x), self.max.y.min(other.max.y)),
        })
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
        let bbox = BBox::from_points(&points);
        assert!(approx_eq(bbox.min().x, 1.0));
        assert!(approx_eq(bbox.min().y, 2.0));
        assert!(approx_eq(bbox.max().x, 5.0));
        assert!(approx_eq(bbox.max().y, 7.0));
    }

    #[test]
    fn test_dimensions() {
        let bbox = BBox::new(Point::new(0.0, 0.0), Point::new(10.0, 5.0));
        assert!(approx_eq(bbox.width(), 10.0));
        assert!(approx_eq(bbox.height(), 5.0));
        assert!(approx_eq(bbox.area(), 50.0));
    }

    #[test]
    fn test_center() {
        let bbox = BBox::new(Point::new(0.0, 0.0), Point::new(10.0, 10.0));
        let center = bbox.center();
        assert!(approx_eq(center.x, 5.0));
        assert!(approx_eq(center.y, 5.0));
    }

    #[test]
    fn test_contains() {
        let bbox = BBox::new(Point::new(0.0, 0.0), Point::new(10.0, 10.0));
        assert!(bbox.contains(Point::new(5.0, 5.0)));
        assert!(bbox.contains(Point::new(0.0, 0.0)));
        assert!(!bbox.contains(Point::new(-1.0, 5.0)));
    }

    #[test]
    fn test_overlaps() {
        let bbox1 = BBox::new(Point::new(0.0, 0.0), Point::new(10.0, 10.0));
        let bbox2 = BBox::new(Point::new(5.0, 5.0), Point::new(15.0, 15.0));
        let bbox3 = BBox::new(Point::new(20.0, 20.0), Point::new(30.0, 30.0));

        assert!(bbox1.overlaps(&bbox2));
        assert!(!bbox1.overlaps(&bbox3));
    }

    #[test]
    fn test_merge() {
        let bbox1 = BBox::new(Point::new(0.0, 0.0), Point::new(5.0, 5.0));
        let bbox2 = BBox::new(Point::new(3.0, 3.0), Point::new(10.0, 10.0));
        let merged = bbox1.merge(&bbox2);

        assert!(approx_eq(merged.min().x, 0.0));
        assert!(approx_eq(merged.min().y, 0.0));
        assert!(approx_eq(merged.max().x, 10.0));
        assert!(approx_eq(merged.max().y, 10.0));
    }

    #[test]
    #[should_panic]
    fn test_empty_points() {
        BBox::from_points(&[]);
    }
}

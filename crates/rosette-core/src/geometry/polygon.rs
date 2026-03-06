//! Polygons for layout geometry.
//!
//! A [`Polygon`] is a closed shape defined by a sequence of vertices.

use super::{BBox, Point, Transform, Vector2};

/// A closed polygon defined by vertices.
///
/// Vertices are stored in order (typically counter-clockwise for positive area).
/// The polygon is implicitly closed (last vertex connects to first).
#[derive(Debug, Clone, PartialEq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Polygon {
    vertices: Vec<Point>,
}

impl Polygon {
    /// Create a polygon from vertices.
    ///
    /// # Panics
    /// Panics if fewer than 3 vertices are provided.
    pub fn new(vertices: Vec<Point>) -> Self {
        assert!(vertices.len() >= 3, "Polygon requires at least 3 vertices");
        Self { vertices }
    }

    /// Create a rectangle from origin point, width, and height.
    ///
    /// The rectangle extends in positive X and Y directions from the origin.
    pub fn rect(origin: Point, width: f64, height: f64) -> Self {
        Self::new(vec![
            origin,
            Point::new(origin.x + width, origin.y),
            Point::new(origin.x + width, origin.y + height),
            Point::new(origin.x, origin.y + height),
        ])
    }

    /// Create a centered rectangle.
    pub fn rect_centered(center: Point, width: f64, height: f64) -> Self {
        let half_w = width / 2.0;
        let half_h = height / 2.0;
        Self::new(vec![
            Point::new(center.x - half_w, center.y - half_h),
            Point::new(center.x + half_w, center.y - half_h),
            Point::new(center.x + half_w, center.y + half_h),
            Point::new(center.x - half_w, center.y + half_h),
        ])
    }

    /// Create a regular polygon with n sides.
    ///
    /// Centered at the given point with the specified radius.
    pub fn regular(center: Point, radius: f64, sides: usize) -> Self {
        assert!(sides >= 3, "Regular polygon requires at least 3 sides");
        let angle_step = std::f64::consts::TAU / sides as f64;
        let vertices: Vec<Point> = (0..sides)
            .map(|i| {
                let angle = angle_step * i as f64;
                Point::new(
                    center.x + radius * angle.cos(),
                    center.y + radius * angle.sin(),
                )
            })
            .collect();
        Self::new(vertices)
    }

    /// Get the vertices.
    pub fn vertices(&self) -> &[Point] {
        &self.vertices
    }

    /// Get mutable vertices.
    pub fn vertices_mut(&mut self) -> &mut Vec<Point> {
        &mut self.vertices
    }

    /// Number of vertices.
    pub fn len(&self) -> usize {
        self.vertices.len()
    }

    /// Check if polygon has no vertices (always false for valid polygon).
    pub fn is_empty(&self) -> bool {
        self.vertices.is_empty()
    }

    /// Calculate the signed area.
    ///
    /// Positive for counter-clockwise winding, negative for clockwise.
    pub fn signed_area(&self) -> f64 {
        let n = self.vertices.len();
        let mut area = 0.0;
        for i in 0..n {
            let j = (i + 1) % n;
            area += self.vertices[i].x * self.vertices[j].y;
            area -= self.vertices[j].x * self.vertices[i].y;
        }
        area / 2.0
    }

    /// Calculate the absolute area.
    pub fn area(&self) -> f64 {
        self.signed_area().abs()
    }

    /// Calculate the centroid (center of mass).
    pub fn centroid(&self) -> Point {
        let n = self.vertices.len();
        let mut cx = 0.0;
        let mut cy = 0.0;
        let mut area = 0.0;

        for i in 0..n {
            let j = (i + 1) % n;
            let cross =
                self.vertices[i].x * self.vertices[j].y - self.vertices[j].x * self.vertices[i].y;
            cx += (self.vertices[i].x + self.vertices[j].x) * cross;
            cy += (self.vertices[i].y + self.vertices[j].y) * cross;
            area += cross;
        }

        area /= 2.0;
        let factor = 1.0 / (6.0 * area);
        Point::new(cx * factor, cy * factor)
    }

    /// Calculate the bounding box.
    pub fn bbox(&self) -> BBox {
        BBox::from_points(&self.vertices)
    }

    /// Apply a transformation to all vertices.
    pub fn transform(&self, t: &Transform) -> Self {
        Self {
            vertices: self.vertices.iter().map(|p| t.apply(*p)).collect(),
        }
    }

    /// Translate by a vector.
    pub fn translate(&self, v: Vector2) -> Self {
        Self {
            vertices: self.vertices.iter().map(|p| p.translate(v)).collect(),
        }
    }

    /// Rotate around the origin.
    pub fn rotate(&self, angle: f64) -> Self {
        Self {
            vertices: self.vertices.iter().map(|p| p.rotate(angle)).collect(),
        }
    }

    /// Rotate around a point.
    pub fn rotate_around(&self, center: Point, angle: f64) -> Self {
        Self {
            vertices: self
                .vertices
                .iter()
                .map(|p| p.rotate_around(center, angle))
                .collect(),
        }
    }

    /// Scale relative to the origin.
    pub fn scale(&self, sx: f64, sy: f64) -> Self {
        Self {
            vertices: self.vertices.iter().map(|p| p.scale(sx, sy)).collect(),
        }
    }

    /// Mirror across the X axis.
    pub fn mirror_x(&self) -> Self {
        Self {
            vertices: self.vertices.iter().map(|p| p.mirror_x()).collect(),
        }
    }

    /// Mirror across the Y axis.
    pub fn mirror_y(&self) -> Self {
        Self {
            vertices: self.vertices.iter().map(|p| p.mirror_y()).collect(),
        }
    }

    /// Check if a point is inside the polygon using ray casting algorithm.
    ///
    /// Returns true if the point is inside the polygon.
    /// Points exactly on the boundary may return either true or false.
    pub fn contains(&self, point: Point) -> bool {
        let mut inside = false;
        let n = self.vertices.len();
        let mut j = n - 1;

        for i in 0..n {
            let vi = &self.vertices[i];
            let vj = &self.vertices[j];

            // Check if horizontal ray from point crosses this edge
            if ((vi.y > point.y) != (vj.y > point.y))
                && (point.x < (vj.x - vi.x) * (point.y - vi.y) / (vj.y - vi.y) + vi.x)
            {
                inside = !inside;
            }
            j = i;
        }
        inside
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
    fn test_rect() {
        let rect = Polygon::rect(Point::origin(), 10.0, 5.0);
        assert_eq!(rect.len(), 4);
        assert!(approx_eq(rect.area(), 50.0));
    }

    #[test]
    fn test_rect_centered() {
        let rect = Polygon::rect_centered(Point::origin(), 10.0, 5.0);
        let centroid = rect.centroid();
        assert!(approx_eq(centroid.x, 0.0));
        assert!(approx_eq(centroid.y, 0.0));
    }

    #[test]
    fn test_regular_polygon() {
        let square = Polygon::regular(Point::origin(), 1.0, 4);
        assert_eq!(square.len(), 4);
    }

    #[test]
    fn test_bbox() {
        let rect = Polygon::rect(Point::new(1.0, 2.0), 10.0, 5.0);
        let bbox = rect.bbox();
        assert!(approx_eq(bbox.min().x, 1.0));
        assert!(approx_eq(bbox.min().y, 2.0));
        assert!(approx_eq(bbox.max().x, 11.0));
        assert!(approx_eq(bbox.max().y, 7.0));
    }

    #[test]
    fn test_translate() {
        let rect = Polygon::rect(Point::origin(), 10.0, 5.0);
        let translated = rect.translate(Vector2::new(5.0, 5.0));
        let bbox = translated.bbox();
        assert!(approx_eq(bbox.min().x, 5.0));
        assert!(approx_eq(bbox.min().y, 5.0));
    }

    #[test]
    #[should_panic]
    fn test_too_few_vertices() {
        Polygon::new(vec![Point::origin(), Point::new(1.0, 0.0)]);
    }

    #[test]
    fn test_contains_point_inside() {
        let rect = Polygon::rect(Point::origin(), 10.0, 10.0);
        assert!(rect.contains(Point::new(5.0, 5.0)));
        assert!(rect.contains(Point::new(1.0, 1.0)));
        assert!(rect.contains(Point::new(9.0, 9.0)));
    }

    #[test]
    fn test_contains_point_outside() {
        let rect = Polygon::rect(Point::origin(), 10.0, 10.0);
        assert!(!rect.contains(Point::new(-1.0, 5.0)));
        assert!(!rect.contains(Point::new(11.0, 5.0)));
        assert!(!rect.contains(Point::new(5.0, -1.0)));
        assert!(!rect.contains(Point::new(5.0, 11.0)));
        assert!(!rect.contains(Point::new(15.0, 15.0)));
    }

    #[test]
    fn test_contains_concave_polygon() {
        // L-shaped polygon
        let l_shape = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(10.0, 0.0),
            Point::new(10.0, 5.0),
            Point::new(5.0, 5.0),
            Point::new(5.0, 10.0),
            Point::new(0.0, 10.0),
        ]);
        // Inside the L
        assert!(l_shape.contains(Point::new(2.5, 2.5)));
        assert!(l_shape.contains(Point::new(2.5, 7.5)));
        // Outside (in the "cut out" part)
        assert!(!l_shape.contains(Point::new(7.5, 7.5)));
        // Outside completely
        assert!(!l_shape.contains(Point::new(15.0, 5.0)));
    }
}

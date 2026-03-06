//! Affine transformations for 2D geometry.
//!
//! A [`Transform`] represents a 2D affine transformation that can be applied
//! to points and polygons.

use super::Point;

/// A 2D affine transformation.
///
/// Represented as a 3x3 matrix in the form:
/// ```text
/// | a  b  tx |
/// | c  d  ty |
/// | 0  0  1  |
/// ```
///
/// Applied to a point (x, y) as:
/// ```text
/// x' = a*x + b*y + tx
/// y' = c*x + d*y + ty
/// ```
#[derive(Debug, Clone, Copy, PartialEq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Transform {
    /// Matrix element \[0,0\]
    pub a: f64,
    /// Matrix element \[0,1\]
    pub b: f64,
    /// Matrix element \[1,0\]
    pub c: f64,
    /// Matrix element \[1,1\]
    pub d: f64,
    /// Translation X
    pub tx: f64,
    /// Translation Y
    pub ty: f64,
}

impl Transform {
    /// Create a new transform from matrix elements.
    pub fn new(a: f64, b: f64, c: f64, d: f64, tx: f64, ty: f64) -> Self {
        Self { a, b, c, d, tx, ty }
    }

    /// Identity transform (no change).
    pub fn identity() -> Self {
        Self {
            a: 1.0,
            b: 0.0,
            c: 0.0,
            d: 1.0,
            tx: 0.0,
            ty: 0.0,
        }
    }

    /// Translation transform.
    pub fn translate(tx: f64, ty: f64) -> Self {
        Self {
            a: 1.0,
            b: 0.0,
            c: 0.0,
            d: 1.0,
            tx,
            ty,
        }
    }

    /// Rotation transform (angle in radians).
    pub fn rotate(angle: f64) -> Self {
        let cos = angle.cos();
        let sin = angle.sin();
        Self {
            a: cos,
            b: -sin,
            c: sin,
            d: cos,
            tx: 0.0,
            ty: 0.0,
        }
    }

    /// Uniform scale transform.
    pub fn scale_uniform(s: f64) -> Self {
        Self::scale(s, s)
    }

    /// Non-uniform scale transform.
    pub fn scale(sx: f64, sy: f64) -> Self {
        Self {
            a: sx,
            b: 0.0,
            c: 0.0,
            d: sy,
            tx: 0.0,
            ty: 0.0,
        }
    }

    /// Mirror across the X axis (flip Y coordinates).
    pub fn mirror_x() -> Self {
        Self {
            a: 1.0,
            b: 0.0,
            c: 0.0,
            d: -1.0,
            tx: 0.0,
            ty: 0.0,
        }
    }

    /// Mirror across the Y axis (flip X coordinates).
    pub fn mirror_y() -> Self {
        Self {
            a: -1.0,
            b: 0.0,
            c: 0.0,
            d: 1.0,
            tx: 0.0,
            ty: 0.0,
        }
    }

    /// Compose two transforms (self * other).
    ///
    /// The resulting transform applies `other` first, then `self`.
    pub fn then(&self, other: &Transform) -> Self {
        Self {
            a: self.a * other.a + self.b * other.c,
            b: self.a * other.b + self.b * other.d,
            c: self.c * other.a + self.d * other.c,
            d: self.c * other.b + self.d * other.d,
            tx: self.a * other.tx + self.b * other.ty + self.tx,
            ty: self.c * other.tx + self.d * other.ty + self.ty,
        }
    }

    /// Apply the transform to a point.
    pub fn apply(&self, p: Point) -> Point {
        Point {
            x: self.a * p.x + self.b * p.y + self.tx,
            y: self.c * p.x + self.d * p.y + self.ty,
        }
    }

    /// Apply only the linear part of the transform to a vector (no translation).
    ///
    /// This is useful for transforming direction vectors, which should not be
    /// affected by the translation component.
    pub fn apply_linear(&self, v: super::Vector2) -> super::Vector2 {
        super::Vector2 {
            x: self.a * v.x + self.b * v.y,
            y: self.c * v.x + self.d * v.y,
        }
    }

    /// Compute the inverse transform.
    ///
    /// Returns None if the transform is not invertible (determinant is zero).
    pub fn inverse(&self) -> Option<Self> {
        let det = self.a * self.d - self.b * self.c;
        if det.abs() < 1e-15 {
            return None;
        }
        let inv_det = 1.0 / det;
        Some(Self {
            a: self.d * inv_det,
            b: -self.b * inv_det,
            c: -self.c * inv_det,
            d: self.a * inv_det,
            tx: (self.b * self.ty - self.d * self.tx) * inv_det,
            ty: (self.c * self.tx - self.a * self.ty) * inv_det,
        })
    }

    /// Get the determinant of the linear part.
    pub fn determinant(&self) -> f64 {
        self.a * self.d - self.b * self.c
    }

    /// Check if this is a reflection (negative determinant).
    pub fn is_reflection(&self) -> bool {
        self.determinant() < 0.0
    }

    /// Extract the rotation angle from the transform (in radians).
    ///
    /// This assumes the transform is a composition of rotation, scale, and translation.
    /// For transforms with non-uniform scale or reflection, the result may not be meaningful.
    pub fn rotation(&self) -> f64 {
        self.c.atan2(self.a)
    }

    /// Extract the translation component.
    pub fn translation(&self) -> (f64, f64) {
        (self.tx, self.ty)
    }
}

impl Default for Transform {
    fn default() -> Self {
        Self::identity()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::f64::consts::PI;

    const EPSILON: f64 = 1e-10;

    fn approx_eq(a: f64, b: f64) -> bool {
        (a - b).abs() < EPSILON
    }

    fn point_approx_eq(p1: Point, p2: Point) -> bool {
        approx_eq(p1.x, p2.x) && approx_eq(p1.y, p2.y)
    }

    #[test]
    fn test_identity() {
        let t = Transform::identity();
        let p = Point::new(3.0, 4.0);
        assert_eq!(t.apply(p), p);
    }

    #[test]
    fn test_translate() {
        let t = Transform::translate(5.0, 10.0);
        let p = Point::new(1.0, 2.0);
        let result = t.apply(p);
        assert_eq!(result, Point::new(6.0, 12.0));
    }

    #[test]
    fn test_rotate() {
        let t = Transform::rotate(PI / 2.0);
        let p = Point::new(1.0, 0.0);
        let result = t.apply(p);
        assert!(point_approx_eq(result, Point::new(0.0, 1.0)));
    }

    #[test]
    fn test_scale() {
        let t = Transform::scale(2.0, 3.0);
        let p = Point::new(1.0, 2.0);
        let result = t.apply(p);
        assert_eq!(result, Point::new(2.0, 6.0));
    }

    #[test]
    fn test_compose() {
        let t1 = Transform::translate(1.0, 0.0);
        let t2 = Transform::scale(2.0, 2.0);
        let composed = t2.then(&t1);
        let p = Point::origin();
        let result = composed.apply(p);
        // First translate (0,0) -> (1,0), then scale -> (2,0)
        assert_eq!(result, Point::new(2.0, 0.0));
    }

    #[test]
    fn test_inverse() {
        let t = Transform::translate(5.0, 10.0);
        let inv = t.inverse().unwrap();
        let p = Point::new(1.0, 2.0);
        let transformed = t.apply(p);
        let back = inv.apply(transformed);
        assert!(point_approx_eq(back, p));
    }

    #[test]
    fn test_mirror_reflection() {
        let t = Transform::mirror_x();
        assert!(t.is_reflection());

        let t2 = Transform::identity();
        assert!(!t2.is_reflection());
    }

    #[test]
    fn test_apply_linear() {
        use super::super::Vector2;

        // Rotation should rotate vector without translation
        let t = Transform::rotate(PI / 2.0).then(&Transform::translate(100.0, 200.0));
        let v = Vector2::unit_x();
        let result = t.apply_linear(v);
        assert!(approx_eq(result.x, 0.0));
        assert!(approx_eq(result.y, 1.0));

        // Mirror should flip vector
        let t_mirror = Transform::mirror_y();
        let v2 = Vector2::new(1.0, 1.0);
        let result2 = t_mirror.apply_linear(v2);
        assert!(approx_eq(result2.x, -1.0));
        assert!(approx_eq(result2.y, 1.0));
    }
}

//! 2D points and vectors.
//!
//! [`Point`] represents a position in 2D space.
//! [`Vector2`] represents a displacement or direction.

use std::ops::{Add, Mul, Neg, Sub};

/// A 2D point representing a position in space.
#[derive(Debug, Clone, Copy, PartialEq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

impl Point {
    /// Create a new point.
    pub fn new(x: f64, y: f64) -> Self {
        Self { x, y }
    }

    /// The origin point (0, 0).
    pub fn origin() -> Self {
        Self { x: 0.0, y: 0.0 }
    }

    /// Convert to a vector from the origin.
    pub fn to_vector(self) -> Vector2 {
        Vector2 {
            x: self.x,
            y: self.y,
        }
    }

    /// Distance to another point.
    pub fn distance_to(self, other: Point) -> f64 {
        let dx = other.x - self.x;
        let dy = other.y - self.y;
        (dx * dx + dy * dy).sqrt()
    }

    /// Translate by a vector.
    pub fn translate(self, v: Vector2) -> Self {
        Self {
            x: self.x + v.x,
            y: self.y + v.y,
        }
    }

    /// Rotate around the origin by angle (in radians).
    pub fn rotate(self, angle: f64) -> Self {
        let cos = angle.cos();
        let sin = angle.sin();
        Self {
            x: self.x * cos - self.y * sin,
            y: self.x * sin + self.y * cos,
        }
    }

    /// Rotate around a center point by angle (in radians).
    pub fn rotate_around(self, center: Point, angle: f64) -> Self {
        let translated = Self::new(self.x - center.x, self.y - center.y);
        let rotated = translated.rotate(angle);
        Self::new(rotated.x + center.x, rotated.y + center.y)
    }

    /// Scale relative to the origin.
    pub fn scale(self, sx: f64, sy: f64) -> Self {
        Self {
            x: self.x * sx,
            y: self.y * sy,
        }
    }

    /// Mirror across the X axis (flip Y).
    pub fn mirror_x(self) -> Self {
        Self {
            x: self.x,
            y: -self.y,
        }
    }

    /// Mirror across the Y axis (flip X).
    pub fn mirror_y(self) -> Self {
        Self {
            x: -self.x,
            y: self.y,
        }
    }
}

impl Add<Vector2> for Point {
    type Output = Point;

    fn add(self, v: Vector2) -> Point {
        self.translate(v)
    }
}

impl Sub<Point> for Point {
    type Output = Vector2;

    fn sub(self, other: Point) -> Vector2 {
        Vector2 {
            x: self.x - other.x,
            y: self.y - other.y,
        }
    }
}

/// A 2D vector representing displacement or direction.
#[derive(Debug, Clone, Copy, PartialEq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Vector2 {
    pub x: f64,
    pub y: f64,
}

impl Vector2 {
    /// Create a new vector.
    pub fn new(x: f64, y: f64) -> Self {
        Self { x, y }
    }

    /// Zero vector.
    pub fn zero() -> Self {
        Self { x: 0.0, y: 0.0 }
    }

    /// Unit vector in X direction.
    pub fn unit_x() -> Self {
        Self { x: 1.0, y: 0.0 }
    }

    /// Unit vector in Y direction.
    pub fn unit_y() -> Self {
        Self { x: 0.0, y: 1.0 }
    }

    /// Create a unit vector from an angle (in radians).
    pub fn from_angle(angle: f64) -> Self {
        Self {
            x: angle.cos(),
            y: angle.sin(),
        }
    }

    /// Length of the vector.
    pub fn length(self) -> f64 {
        (self.x * self.x + self.y * self.y).sqrt()
    }

    /// Squared length (avoids sqrt).
    pub fn length_squared(self) -> f64 {
        self.x * self.x + self.y * self.y
    }

    /// Normalize to unit length.
    pub fn normalize(self) -> Self {
        let len = self.length();
        if len == 0.0 {
            self
        } else {
            Self {
                x: self.x / len,
                y: self.y / len,
            }
        }
    }

    /// Dot product.
    pub fn dot(self, other: Vector2) -> f64 {
        self.x * other.x + self.y * other.y
    }

    /// Cross product (returns scalar z-component).
    pub fn cross(self, other: Vector2) -> f64 {
        self.x * other.y - self.y * other.x
    }

    /// Perpendicular vector (90 degrees counter-clockwise).
    pub fn perpendicular(self) -> Self {
        Self {
            x: -self.y,
            y: self.x,
        }
    }

    /// Angle of the vector (in radians, from positive X axis).
    pub fn angle(self) -> f64 {
        self.y.atan2(self.x)
    }

    /// Rotate by angle (in radians).
    pub fn rotate(self, angle: f64) -> Self {
        let cos = angle.cos();
        let sin = angle.sin();
        Self {
            x: self.x * cos - self.y * sin,
            y: self.x * sin + self.y * cos,
        }
    }
}

impl Add for Vector2 {
    type Output = Vector2;

    fn add(self, other: Vector2) -> Vector2 {
        Vector2 {
            x: self.x + other.x,
            y: self.y + other.y,
        }
    }
}

impl Sub for Vector2 {
    type Output = Vector2;

    fn sub(self, other: Vector2) -> Vector2 {
        Vector2 {
            x: self.x - other.x,
            y: self.y - other.y,
        }
    }
}

impl Mul<f64> for Vector2 {
    type Output = Vector2;

    fn mul(self, scalar: f64) -> Vector2 {
        Vector2 {
            x: self.x * scalar,
            y: self.y * scalar,
        }
    }
}

impl Neg for Vector2 {
    type Output = Vector2;

    fn neg(self) -> Vector2 {
        Vector2 {
            x: -self.x,
            y: -self.y,
        }
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

    #[test]
    fn test_point_new() {
        let p = Point::new(3.0, 4.0);
        assert_eq!(p.x, 3.0);
        assert_eq!(p.y, 4.0);
    }

    #[test]
    fn test_point_origin() {
        let p = Point::origin();
        assert_eq!(p.x, 0.0);
        assert_eq!(p.y, 0.0);
    }

    #[test]
    fn test_point_distance() {
        let p1 = Point::origin();
        let p2 = Point::new(3.0, 4.0);
        assert!(approx_eq(p1.distance_to(p2), 5.0));
    }

    #[test]
    fn test_point_rotate() {
        let p = Point::new(1.0, 0.0);
        let rotated = p.rotate(PI / 2.0);
        assert!(approx_eq(rotated.x, 0.0));
        assert!(approx_eq(rotated.y, 1.0));
    }

    #[test]
    fn test_vector_length() {
        let v = Vector2::new(3.0, 4.0);
        assert!(approx_eq(v.length(), 5.0));
    }

    #[test]
    fn test_vector_normalize() {
        let v = Vector2::new(3.0, 4.0).normalize();
        assert!(approx_eq(v.length(), 1.0));
    }

    #[test]
    fn test_vector_dot() {
        let v1 = Vector2::new(1.0, 0.0);
        let v2 = Vector2::new(0.0, 1.0);
        assert!(approx_eq(v1.dot(v2), 0.0));
    }

    #[test]
    fn test_vector_perpendicular() {
        let v = Vector2::new(1.0, 0.0);
        let perp = v.perpendicular();
        assert!(approx_eq(perp.x, 0.0));
        assert!(approx_eq(perp.y, 1.0));
    }
}

//! Connection ports for photonic components.
//!
//! A [`Port`] represents a named connection point with position and direction,
//! used for connecting components together.

use crate::geometry::{Point, Transform, Vector2};

/// A connection port on a component.
///
/// Ports define where components can connect to each other. They have:
/// - A name for identification
/// - A position in space
/// - A direction (unit vector pointing outward from the component)
/// - An optional width
#[derive(Debug, Clone, PartialEq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Port {
    /// Name of the port (e.g., "in", "out", "opt1").
    pub name: String,
    /// Position of the port center.
    pub position: Point,
    /// Direction vector (unit vector pointing outward).
    pub direction: Vector2,
    /// Width of the port (e.g., waveguide width).
    pub width: Option<f64>,
}

impl Port {
    /// Create a new port.
    pub fn new(name: impl Into<String>, position: Point, direction: Vector2) -> Self {
        Self {
            name: name.into(),
            position,
            direction: direction.normalize(),
            width: None,
        }
    }

    /// Create a new port with width.
    pub fn with_width(
        name: impl Into<String>,
        position: Point,
        direction: Vector2,
        width: f64,
    ) -> Self {
        Self {
            name: name.into(),
            position,
            direction: direction.normalize(),
            width: Some(width),
        }
    }

    /// Set the width.
    pub fn set_width(mut self, width: f64) -> Self {
        self.width = Some(width);
        self
    }

    /// Get the angle of the direction (in radians).
    pub fn angle(&self) -> f64 {
        self.direction.angle()
    }

    /// Get the opposite direction (pointing into the component).
    pub fn inward_direction(&self) -> Vector2 {
        -self.direction
    }

    /// Translate the port by a vector.
    pub fn translate(&self, v: Vector2) -> Self {
        Self {
            name: self.name.clone(),
            position: self.position.translate(v),
            direction: self.direction,
            width: self.width,
        }
    }

    /// Rotate the port around the origin.
    pub fn rotate(&self, angle: f64) -> Self {
        Self {
            name: self.name.clone(),
            position: self.position.rotate(angle),
            direction: self.direction.rotate(angle),
            width: self.width,
        }
    }

    /// Rotate the port around a center point.
    pub fn rotate_around(&self, center: Point, angle: f64) -> Self {
        Self {
            name: self.name.clone(),
            position: self.position.rotate_around(center, angle),
            direction: self.direction.rotate(angle),
            width: self.width,
        }
    }

    /// Mirror the port across the X axis.
    pub fn mirror_x(&self) -> Self {
        Self {
            name: self.name.clone(),
            position: self.position.mirror_x(),
            direction: Vector2::new(self.direction.x, -self.direction.y),
            width: self.width,
        }
    }

    /// Mirror the port across the Y axis.
    pub fn mirror_y(&self) -> Self {
        Self {
            name: self.name.clone(),
            position: self.position.mirror_y(),
            direction: Vector2::new(-self.direction.x, self.direction.y),
            width: self.width,
        }
    }

    /// Check if this port can connect to another port.
    ///
    /// Ports can connect if they are at the same position and have opposite directions.
    pub fn can_connect_to(&self, other: &Port, tolerance: f64) -> bool {
        let distance = self.position.distance_to(other.position);
        if distance > tolerance {
            return false;
        }

        // Check if directions are opposite (dot product should be -1)
        let dot = self.direction.dot(other.direction);
        dot < -0.99 // Allow small tolerance for floating point
    }

    /// Apply a transform to this port.
    ///
    /// The position is fully transformed, while the direction only has the
    /// linear part of the transform applied (rotation/scale/mirror, no translation).
    pub fn transform(&self, t: &Transform) -> Self {
        Self {
            name: self.name.clone(),
            position: t.apply(self.position),
            direction: t.apply_linear(self.direction).normalize(),
            width: self.width,
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
    fn test_new() {
        let port = Port::new("in", Point::origin(), Vector2::unit_x());
        assert_eq!(port.name, "in");
        assert_eq!(port.position, Point::origin());
        assert!(approx_eq(port.direction.length(), 1.0));
    }

    #[test]
    fn test_with_width() {
        let port = Port::with_width("out", Point::new(10.0, 0.0), Vector2::unit_x(), 0.5);
        assert_eq!(port.width, Some(0.5));
    }

    #[test]
    fn test_normalize_direction() {
        let port = Port::new("test", Point::origin(), Vector2::new(10.0, 0.0));
        assert!(approx_eq(port.direction.length(), 1.0));
    }

    #[test]
    fn test_rotate() {
        let port = Port::new("in", Point::new(1.0, 0.0), Vector2::unit_x());
        let rotated = port.rotate(PI / 2.0);
        assert!(approx_eq(rotated.position.x, 0.0));
        assert!(approx_eq(rotated.position.y, 1.0));
        assert!(approx_eq(rotated.direction.x, 0.0));
        assert!(approx_eq(rotated.direction.y, 1.0));
    }

    #[test]
    fn test_can_connect() {
        let port1 = Port::new("out", Point::origin(), Vector2::unit_x());
        let port2 = Port::new("in", Point::origin(), -Vector2::unit_x());
        assert!(port1.can_connect_to(&port2, 0.001));

        let port3 = Port::new("in", Point::new(1.0, 0.0), -Vector2::unit_x());
        assert!(!port1.can_connect_to(&port3, 0.001));
    }

    #[test]
    fn test_transform() {
        use crate::geometry::Transform;

        let port = Port::with_width("opt", Point::new(10.0, 0.0), Vector2::unit_x(), 0.5);

        // Test translation
        let t_translate = Transform::translate(5.0, 10.0);
        let transformed = port.transform(&t_translate);
        assert!(approx_eq(transformed.position.x, 15.0));
        assert!(approx_eq(transformed.position.y, 10.0));
        assert!(approx_eq(transformed.direction.x, 1.0)); // Direction unchanged
        assert!(approx_eq(transformed.direction.y, 0.0));

        // Test rotation (90 degrees)
        let t_rotate = Transform::rotate(PI / 2.0);
        let rotated = port.transform(&t_rotate);
        assert!(approx_eq(rotated.position.x, 0.0));
        assert!(approx_eq(rotated.position.y, 10.0));
        assert!(approx_eq(rotated.direction.x, 0.0));
        assert!(approx_eq(rotated.direction.y, 1.0));

        // Test combined translate + rotate
        let t_combined = Transform::rotate(PI / 2.0).then(&Transform::translate(100.0, 0.0));
        let combined = port.transform(&t_combined);
        // First translate (10,0) -> (110, 0), then rotate -> (0, 110)
        assert!(approx_eq(combined.position.x, 0.0));
        assert!(approx_eq(combined.position.y, 110.0));
        assert!(approx_eq(combined.direction.x, 0.0));
        assert!(approx_eq(combined.direction.y, 1.0));

        // Width should be preserved
        assert_eq!(combined.width, Some(0.5));
    }
}

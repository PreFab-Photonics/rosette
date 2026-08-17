//! Connection ports for photonic components.
//!
//! A [`Port`] represents a named connection point with position and direction,
//! used for connecting components together.

use crate::error::PortValidationReason;
use crate::geometry::{Point, Transform, Vector2};

const DIRECTION_UNIT_TOLERANCE: f64 = 1e-9;

/// A connection port on a component.
///
/// Ports define where components can connect to each other. They have:
/// - A name for identification
/// - A position in space
/// - A direction (unit vector pointing outward from the component)
/// - An optional width
#[derive(Debug, Clone, PartialEq)]
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
    fn from_parts(
        name: impl Into<String>,
        position: Point,
        direction: Vector2,
        width: Option<f64>,
    ) -> Self {
        let name = name.into();
        assert!(!name.is_empty(), "Port name cannot be empty");
        assert!(position.is_finite(), "Port position must be finite");
        assert!(direction.is_finite(), "Port direction must be finite");
        let direction_length = direction.length();
        assert!(direction_length != 0.0, "Port direction cannot be zero");
        assert!(
            direction_length.is_finite(),
            "Port direction must have finite length"
        );
        if let Some(width) = width {
            assert!(width.is_finite(), "Port width must be finite");
            assert!(width > 0.0, "Port width must be positive");
        }
        Self {
            name,
            position,
            direction: Vector2::new(
                direction.x / direction_length,
                direction.y / direction_length,
            ),
            width,
        }
    }

    pub(crate) fn validation_error(&self) -> Option<PortValidationReason> {
        if self.name.is_empty() {
            return Some(PortValidationReason::EmptyName);
        }
        if !self.position.is_finite() {
            return Some(PortValidationReason::NonFinitePosition);
        }
        if !self.direction.is_finite() {
            return Some(PortValidationReason::NonFiniteDirection);
        }
        if self.direction.is_zero() {
            return Some(PortValidationReason::ZeroDirection);
        }
        let direction_length = self.direction.length();
        if !direction_length.is_finite()
            || (direction_length - 1.0).abs() > DIRECTION_UNIT_TOLERANCE
        {
            return Some(PortValidationReason::DirectionNotUnit);
        }
        if let Some(width) = self.width {
            if !width.is_finite() {
                return Some(PortValidationReason::NonFiniteWidth);
            }
            if width <= 0.0 {
                return Some(PortValidationReason::NonPositiveWidth);
            }
        }
        None
    }

    /// Create a new port.
    pub fn new(name: impl Into<String>, position: Point, direction: Vector2) -> Self {
        Self::from_parts(name, position, direction, None)
    }

    /// Create a new port with width.
    pub fn with_width(
        name: impl Into<String>,
        position: Point,
        direction: Vector2,
        width: f64,
    ) -> Self {
        Self::from_parts(name, position, direction, Some(width))
    }

    /// Get the angle of the direction (in radians).
    pub fn angle(&self) -> f64 {
        self.direction.angle()
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

    /// Try to apply a transform to this port.
    ///
    /// Returns `None` if the transformed position or direction is non-finite,
    /// or if the linear transform collapses the direction to zero.
    pub fn try_transform(&self, t: &Transform) -> Option<Self> {
        let position = t.apply(self.position);
        let direction = t.apply_linear(self.direction);
        let direction_length = direction.length();
        if !position.is_finite()
            || !direction.is_finite()
            || direction_length == 0.0
            || !direction_length.is_finite()
        {
            return None;
        }
        let transformed = Self {
            name: self.name.clone(),
            position,
            direction: Vector2::new(
                direction.x / direction_length,
                direction.y / direction_length,
            ),
            width: self.width,
        };
        transformed
            .validation_error()
            .is_none()
            .then_some(transformed)
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
        let rotated = port.try_transform(&Transform::rotate(PI / 2.0)).unwrap();
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
        let transformed = port.try_transform(&t_translate).unwrap();
        assert!(approx_eq(transformed.position.x, 15.0));
        assert!(approx_eq(transformed.position.y, 10.0));
        assert!(approx_eq(transformed.direction.x, 1.0)); // Direction unchanged
        assert!(approx_eq(transformed.direction.y, 0.0));

        // Test rotation (90 degrees)
        let t_rotate = Transform::rotate(PI / 2.0);
        let rotated = port.try_transform(&t_rotate).unwrap();
        assert!(approx_eq(rotated.position.x, 0.0));
        assert!(approx_eq(rotated.position.y, 10.0));
        assert!(approx_eq(rotated.direction.x, 0.0));
        assert!(approx_eq(rotated.direction.y, 1.0));

        // Test combined translate + rotate
        let t_combined = Transform::rotate(PI / 2.0).then(&Transform::translate(100.0, 0.0));
        let combined = port.try_transform(&t_combined).unwrap();
        // First translate (10,0) -> (110, 0), then rotate -> (0, 110)
        assert!(approx_eq(combined.position.x, 0.0));
        assert!(approx_eq(combined.position.y, 110.0));
        assert!(approx_eq(combined.direction.x, 0.0));
        assert!(approx_eq(combined.direction.y, 1.0));

        // Width should be preserved
        assert_eq!(combined.width, Some(0.5));
    }

    #[test]
    fn constructors_reject_invalid_fields() {
        assert!(
            std::panic::catch_unwind(|| {
                Port::new("", Point::origin(), Vector2::unit_x());
            })
            .is_err()
        );
        assert!(
            std::panic::catch_unwind(|| {
                Port::new("p", Point::new(f64::NAN, 0.0), Vector2::unit_x());
            })
            .is_err()
        );
        assert!(
            std::panic::catch_unwind(|| {
                Port::new("p", Point::origin(), Vector2::new(0.0, 0.0));
            })
            .is_err()
        );
        assert!(
            std::panic::catch_unwind(|| {
                Port::new("p", Point::origin(), Vector2::new(f64::INFINITY, 0.0));
            })
            .is_err()
        );
        assert!(
            std::panic::catch_unwind(|| {
                Port::new("p", Point::origin(), Vector2::new(f64::MAX, f64::MAX));
            })
            .is_err()
        );
        for width in [0.0, -1.0, f64::NAN, f64::INFINITY] {
            assert!(
                std::panic::catch_unwind(|| {
                    Port::with_width("p", Point::origin(), Vector2::unit_x(), width);
                })
                .is_err()
            );
        }
    }

    #[test]
    fn builders_and_transforms_preserve_port_validity() {
        let port = Port::with_width("p", Point::origin(), Vector2::new(3.0, 4.0), 2.0);
        assert!(port.validation_error().is_none());
        assert!(
            port.try_transform(&Transform::rotate(0.7))
                .unwrap()
                .validation_error()
                .is_none()
        );
        assert!(
            port.try_transform(&Transform::scale(2.0, -3.0))
                .unwrap()
                .validation_error()
                .is_none()
        );
        assert!(port.try_transform(&Transform::scale(0.0, 0.0)).is_none());
    }

    #[test]
    fn try_transform_handles_extreme_and_nonuniform_transforms() {
        let port = Port::new("p", Point::new(2.0, 1.0), Vector2::new(1.0, 1.0));
        assert!(
            port.try_transform(&Transform::scale(f64::MAX, 1.0))
                .is_none()
        );

        let transformed = Port::new("p", Point::origin(), Vector2::new(1.0, 1.0))
            .try_transform(&Transform::scale(f64::MAX, 2.0))
            .unwrap();
        assert!(transformed.validation_error().is_none());
        assert_eq!(transformed.direction.x, 1.0);
        assert!(transformed.direction.y.abs() < 1e-300);

        let transformed = port.try_transform(&Transform::scale(2.0, -3.0)).unwrap();
        assert!(transformed.validation_error().is_none());
        assert!(port.try_transform(&Transform::scale(0.0, 0.0)).is_none());
    }
}

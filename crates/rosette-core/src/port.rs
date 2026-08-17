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
    name: String,
    position: Point,
    direction: Vector2,
    width: Option<f64>,
}

impl Port {
    fn from_parts(
        name: impl Into<String>,
        position: Point,
        direction: Vector2,
        width: Option<f64>,
    ) -> Result<Self, PortValidationReason> {
        let name = name.into();
        if name.is_empty() {
            return Err(PortValidationReason::EmptyName);
        }
        if !position.is_finite() {
            return Err(PortValidationReason::NonFinitePosition);
        }
        if !direction.is_finite() {
            return Err(PortValidationReason::NonFiniteDirection);
        }
        let direction_length = direction.length();
        if direction_length == 0.0 {
            return Err(PortValidationReason::ZeroDirection);
        }
        if !direction_length.is_finite() {
            return Err(PortValidationReason::DirectionNotUnit);
        }
        let normalized = Vector2::new(
            direction.x / direction_length,
            direction.y / direction_length,
        );
        let normalized_length = normalized.length();
        if normalized_length == 0.0 || !normalized_length.is_finite() {
            return Err(PortValidationReason::DirectionNotUnit);
        }
        if let Some(width) = width {
            if !width.is_finite() {
                return Err(PortValidationReason::NonFiniteWidth);
            }
            if width <= 0.0 {
                return Err(PortValidationReason::NonPositiveWidth);
            }
        }
        let port = Self {
            name,
            position,
            direction: Vector2::new(
                normalized.x / normalized_length,
                normalized.y / normalized_length,
            ),
            width,
        };
        port.validate()?;
        Ok(port)
    }

    /// Validate the stored port fields.
    pub fn validate(&self) -> Result<(), PortValidationReason> {
        if self.name.is_empty() {
            return Err(PortValidationReason::EmptyName);
        }
        if !self.position.is_finite() {
            return Err(PortValidationReason::NonFinitePosition);
        }
        if !self.direction.is_finite() {
            return Err(PortValidationReason::NonFiniteDirection);
        }
        if self.direction.is_zero() {
            return Err(PortValidationReason::ZeroDirection);
        }
        let direction_length = self.direction.length();
        if !direction_length.is_finite()
            || (direction_length - 1.0).abs() > DIRECTION_UNIT_TOLERANCE
        {
            return Err(PortValidationReason::DirectionNotUnit);
        }
        if let Some(width) = self.width {
            if !width.is_finite() {
                return Err(PortValidationReason::NonFiniteWidth);
            }
            if width <= 0.0 {
                return Err(PortValidationReason::NonPositiveWidth);
            }
        }
        Ok(())
    }

    /// Create a new port.
    pub fn new(
        name: impl Into<String>,
        position: Point,
        direction: Vector2,
    ) -> Result<Self, PortValidationReason> {
        Self::from_parts(name, position, direction, None)
    }

    /// Create a new port with width.
    pub fn with_width(
        name: impl Into<String>,
        position: Point,
        direction: Vector2,
        width: f64,
    ) -> Result<Self, PortValidationReason> {
        Self::from_parts(name, position, direction, Some(width))
    }

    /// Get the port name.
    pub fn name(&self) -> &str {
        &self.name
    }

    /// Get the port center position.
    pub fn position(&self) -> Point {
        self.position
    }

    /// Get the normalized outward direction.
    pub fn direction(&self) -> Vector2 {
        self.direction
    }

    /// Get the optional port width.
    pub fn width(&self) -> Option<f64> {
        self.width
    }

    /// Set the port name.
    pub fn set_name(&mut self, name: impl Into<String>) -> Result<(), PortValidationReason> {
        let name = name.into();
        if name.is_empty() {
            return Err(PortValidationReason::EmptyName);
        }
        self.name = name;
        Ok(())
    }

    /// Set the port center position.
    pub fn set_position(&mut self, position: Point) -> Result<(), PortValidationReason> {
        if !position.is_finite() {
            return Err(PortValidationReason::NonFinitePosition);
        }
        self.position = position;
        Ok(())
    }

    /// Set and normalize the outward direction.
    pub fn set_direction(&mut self, direction: Vector2) -> Result<(), PortValidationReason> {
        let normalized = Self::from_parts("direction", Point::origin(), direction, None)?.direction;
        self.direction = normalized;
        Ok(())
    }

    /// Set or clear the optional port width.
    pub fn set_width(&mut self, width: Option<f64>) -> Result<(), PortValidationReason> {
        if let Some(width) = width {
            if !width.is_finite() {
                return Err(PortValidationReason::NonFiniteWidth);
            }
            if width <= 0.0 {
                return Err(PortValidationReason::NonPositiveWidth);
            }
        }
        self.width = width;
        Ok(())
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
    pub fn try_transform(&self, t: &Transform) -> Result<Self, PortValidationReason> {
        let position = t.apply(self.position);
        let direction = t.apply_linear(self.direction);
        Self::from_parts(self.name.clone(), position, direction, self.width)
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
        let port = Port::new("in", Point::origin(), Vector2::unit_x()).unwrap();
        assert_eq!(port.name(), "in");
        assert_eq!(port.position(), Point::origin());
        assert!(approx_eq(port.direction().length(), 1.0));
    }

    #[test]
    fn test_with_width() {
        let port = Port::with_width("out", Point::new(10.0, 0.0), Vector2::unit_x(), 0.5).unwrap();
        assert_eq!(port.width(), Some(0.5));
    }

    #[test]
    fn test_normalize_direction() {
        let port = Port::new("test", Point::origin(), Vector2::new(10.0, 0.0)).unwrap();
        assert!(approx_eq(port.direction().length(), 1.0));
    }

    #[test]
    fn normalization_handles_minimum_subnormal_components() {
        let component = f64::from_bits(1);
        let port = Port::new("test", Point::origin(), Vector2::new(component, component)).unwrap();

        assert!(approx_eq(port.direction().length(), 1.0));
        assert!(approx_eq(
            port.direction().x,
            std::f64::consts::FRAC_1_SQRT_2
        ));
        assert!(approx_eq(
            port.direction().y,
            std::f64::consts::FRAC_1_SQRT_2
        ));
    }

    #[test]
    fn test_rotate() {
        let port = Port::new("in", Point::new(1.0, 0.0), Vector2::unit_x()).unwrap();
        let rotated = port.try_transform(&Transform::rotate(PI / 2.0)).unwrap();
        assert!(approx_eq(rotated.position().x, 0.0));
        assert!(approx_eq(rotated.position().y, 1.0));
        assert!(approx_eq(rotated.direction().x, 0.0));
        assert!(approx_eq(rotated.direction().y, 1.0));
    }

    #[test]
    fn test_can_connect() {
        let port1 = Port::new("out", Point::origin(), Vector2::unit_x()).unwrap();
        let port2 = Port::new("in", Point::origin(), -Vector2::unit_x()).unwrap();
        assert!(port1.can_connect_to(&port2, 0.001));

        let port3 = Port::new("in", Point::new(1.0, 0.0), -Vector2::unit_x()).unwrap();
        assert!(!port1.can_connect_to(&port3, 0.001));
    }

    #[test]
    fn test_transform() {
        use crate::geometry::Transform;

        let port = Port::with_width("opt", Point::new(10.0, 0.0), Vector2::unit_x(), 0.5).unwrap();

        // Test translation
        let t_translate = Transform::translate(5.0, 10.0);
        let transformed = port.try_transform(&t_translate).unwrap();
        assert!(approx_eq(transformed.position().x, 15.0));
        assert!(approx_eq(transformed.position().y, 10.0));
        assert!(approx_eq(transformed.direction().x, 1.0)); // Direction unchanged
        assert!(approx_eq(transformed.direction().y, 0.0));

        // Test rotation (90 degrees)
        let t_rotate = Transform::rotate(PI / 2.0);
        let rotated = port.try_transform(&t_rotate).unwrap();
        assert!(approx_eq(rotated.position().x, 0.0));
        assert!(approx_eq(rotated.position().y, 10.0));
        assert!(approx_eq(rotated.direction().x, 0.0));
        assert!(approx_eq(rotated.direction().y, 1.0));

        // Test combined translate + rotate
        let t_combined = Transform::rotate(PI / 2.0).then(&Transform::translate(100.0, 0.0));
        let combined = port.try_transform(&t_combined).unwrap();
        // First translate (10,0) -> (110, 0), then rotate -> (0, 110)
        assert!(approx_eq(combined.position().x, 0.0));
        assert!(approx_eq(combined.position().y, 110.0));
        assert!(approx_eq(combined.direction().x, 0.0));
        assert!(approx_eq(combined.direction().y, 1.0));

        // Width should be preserved
        assert_eq!(combined.width(), Some(0.5));
    }

    #[test]
    fn constructors_reject_invalid_fields() {
        assert_eq!(
            Port::new("", Point::origin(), Vector2::unit_x()),
            Err(PortValidationReason::EmptyName)
        );
        assert_eq!(
            Port::new("p", Point::new(f64::NAN, 0.0), Vector2::unit_x()),
            Err(PortValidationReason::NonFinitePosition)
        );
        assert_eq!(
            Port::new("p", Point::origin(), Vector2::new(0.0, 0.0)),
            Err(PortValidationReason::ZeroDirection)
        );
        assert_eq!(
            Port::new("p", Point::origin(), Vector2::new(f64::INFINITY, 0.0)),
            Err(PortValidationReason::NonFiniteDirection)
        );
        assert_eq!(
            Port::new("p", Point::origin(), Vector2::new(f64::MAX, f64::MAX)),
            Err(PortValidationReason::DirectionNotUnit)
        );
        assert_eq!(
            Port::with_width("p", Point::origin(), Vector2::unit_x(), 0.0),
            Err(PortValidationReason::NonPositiveWidth)
        );
        assert_eq!(
            Port::with_width("p", Point::origin(), Vector2::unit_x(), -1.0),
            Err(PortValidationReason::NonPositiveWidth)
        );
        assert_eq!(
            Port::with_width("p", Point::origin(), Vector2::unit_x(), f64::NAN),
            Err(PortValidationReason::NonFiniteWidth)
        );
        assert_eq!(
            Port::with_width("p", Point::origin(), Vector2::unit_x(), f64::INFINITY),
            Err(PortValidationReason::NonFiniteWidth)
        );
    }

    #[test]
    fn validate_reports_corrupted_private_state() {
        let valid = Port::with_width("p", Point::origin(), Vector2::unit_x(), 1.0).unwrap();

        let mut port = valid.clone();
        port.name.clear();
        assert_eq!(port.validate(), Err(PortValidationReason::EmptyName));

        let mut port = valid.clone();
        port.position.x = f64::NAN;
        assert_eq!(
            port.validate(),
            Err(PortValidationReason::NonFinitePosition)
        );

        let mut port = valid.clone();
        port.direction = Vector2::new(f64::NAN, 0.0);
        assert_eq!(
            port.validate(),
            Err(PortValidationReason::NonFiniteDirection)
        );

        let mut port = valid.clone();
        port.direction = Vector2::new(0.0, 0.0);
        assert_eq!(port.validate(), Err(PortValidationReason::ZeroDirection));

        let mut port = valid.clone();
        port.direction = Vector2::new(2.0, 0.0);
        assert_eq!(port.validate(), Err(PortValidationReason::DirectionNotUnit));

        let mut port = valid.clone();
        port.width = Some(f64::NAN);
        assert_eq!(port.validate(), Err(PortValidationReason::NonFiniteWidth));

        let mut port = valid;
        port.width = Some(0.0);
        assert_eq!(port.validate(), Err(PortValidationReason::NonPositiveWidth));
    }

    #[test]
    fn builders_and_transforms_preserve_port_validity() {
        let port = Port::with_width("p", Point::origin(), Vector2::new(3.0, 4.0), 2.0).unwrap();
        assert_eq!(port.validate(), Ok(()));
        assert!(
            port.try_transform(&Transform::rotate(0.7))
                .unwrap()
                .validate()
                .is_ok()
        );
        assert!(
            port.try_transform(&Transform::scale(2.0, -3.0))
                .unwrap()
                .validate()
                .is_ok()
        );
        assert_eq!(
            port.try_transform(&Transform::scale(0.0, 0.0)),
            Err(PortValidationReason::ZeroDirection)
        );
    }

    #[test]
    fn try_transform_handles_extreme_and_nonuniform_transforms() {
        let port = Port::new("p", Point::new(2.0, 1.0), Vector2::new(1.0, 1.0)).unwrap();
        assert_eq!(
            port.try_transform(&Transform::scale(f64::MAX, 1.0))
                .unwrap_err(),
            PortValidationReason::NonFinitePosition
        );

        let transformed = Port::new("p", Point::origin(), Vector2::new(1.0, 1.0))
            .unwrap()
            .try_transform(&Transform::scale(f64::MAX, 2.0))
            .unwrap();
        assert_eq!(transformed.validate(), Ok(()));
        assert_eq!(transformed.direction().x, 1.0);
        assert!(transformed.direction().y.abs() < 1e-300);

        let transformed = port.try_transform(&Transform::scale(2.0, -3.0)).unwrap();
        assert_eq!(transformed.validate(), Ok(()));
        assert_eq!(
            port.try_transform(&Transform::scale(0.0, 0.0)),
            Err(PortValidationReason::ZeroDirection)
        );
    }
}

//! Port-based connections for linking components.
//!
//! This module provides utilities for connecting components together by
//! aligning their ports.

use crate::cell::CellRef;
use crate::geometry::Transform;
use crate::port::Port;

use super::Component;

/// Calculate the transform needed to connect a component's port to a target port.
///
/// This aligns the component so that its `component_port` matches the position
/// of `target_port` with opposite directions (so they face each other).
///
/// # Arguments
/// * `component_port` - The port on the component to be placed
/// * `target_port` - The port to connect to
///
/// # Returns
/// A transform that, when applied to the component, aligns the ports.
///
/// # Example
///
/// ```
/// use rosette_core::component::connect_transform;
/// use rosette_core::{Point, Vector2, Port};
///
/// // Simulate a waveguide output at (10, 0) facing +X
/// let out_port = Port::with_width("out", Point::new(10.0, 0.0), Vector2::unit_x(), 0.5);
///
/// // Simulate a waveguide input at origin facing -X
/// let in_port = Port::with_width("in", Point::new(0.0, 0.0), -Vector2::unit_x(), 0.5);
///
/// // Calculate transform to connect in_port to out_port
/// let transform = connect_transform(&in_port, &out_port);
///
/// // Apply transform to get the aligned input port position
/// let aligned_pos = transform.apply(in_port.position);
/// assert!((aligned_pos.x - out_port.position.x).abs() < 1e-6);
/// assert!((aligned_pos.y - out_port.position.y).abs() < 1e-6);
/// ```
pub fn connect_transform(component_port: &Port, target_port: &Port) -> Transform {
    // 1. First rotate the component so ports face each other
    //    Component port direction should equal -target_port direction after rotation
    let component_angle = component_port.direction.angle();
    let target_angle = target_port.direction.angle();

    // We want component_port.direction to point opposite to target_port.direction
    // So we rotate by: (target_angle + PI) - component_angle
    let rotation = target_angle + std::f64::consts::PI - component_angle;

    // 2. Then translate so ports align
    // After rotation, find where the component port would be
    let rotated_port_pos = component_port.position.rotate(rotation);

    // Translation needed to move rotated port to target position
    let translation = target_port.position - rotated_port_pos;

    Transform::translate(translation.x, translation.y).then(&Transform::rotate(rotation))
}

/// Place a component by connecting one of its ports to a target port.
///
/// Returns a CellRef with the appropriate transform applied.
///
/// # Arguments
/// * `component` - The component to place
/// * `cell_name` - Name for the cell reference
/// * `component_port_name` - Name of the port on the component to align
/// * `target_port` - The port to connect to
pub fn place_at_port<C: Component>(
    component: &C,
    cell_name: impl Into<String>,
    component_port_name: &str,
    target_port: &Port,
) -> Option<CellRef> {
    let component_port = component.port(component_port_name)?;
    let transform = connect_transform(&component_port, target_port);
    Some(CellRef::with_transform(cell_name, transform))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{Point, Vector2};

    const EPSILON: f64 = 1e-6;

    fn approx_eq(a: f64, b: f64) -> bool {
        (a - b).abs() < EPSILON
    }

    #[test]
    fn test_connect_transform_simple() {
        // Simulate two waveguides: wg1 (length 10) and wg2 (length 5)
        // wg1 ports: in at (0,0) facing -X, out at (10,0) facing +X
        // wg2 ports: in at (0,0) facing -X, out at (5,0) facing +X
        let wg1_out = Port::with_width("out", Point::new(10.0, 0.0), Vector2::unit_x(), 0.5);
        let wg2_in = Port::with_width("in", Point::new(0.0, 0.0), -Vector2::unit_x(), 0.5);

        let transform = connect_transform(&wg2_in, &wg1_out);

        // After transform, wg2's input should be at wg1's output
        let aligned_pos = transform.apply(wg2_in.position);
        assert!(approx_eq(aligned_pos.x, wg1_out.position.x));
        assert!(approx_eq(aligned_pos.y, wg1_out.position.y));

        // Directions should be opposite
        let aligned_dir = wg2_in.direction.rotate(transform.rotation());
        assert!(approx_eq(aligned_dir.x, -wg1_out.direction.x));
        assert!(approx_eq(aligned_dir.y, -wg1_out.direction.y));
    }

    #[test]
    fn test_connect_transform_with_rotation() {
        // Test connecting ports at different angles
        // target_port at (10, 0) facing +Y (90 degrees)
        let target_port = Port::with_width("out", Point::new(10.0, 0.0), Vector2::unit_y(), 0.5);
        // component_port at origin facing -X (180 degrees) - standard waveguide input
        let component_port = Port::with_width("in", Point::new(0.0, 0.0), -Vector2::unit_x(), 0.5);

        let transform = connect_transform(&component_port, &target_port);

        // After transform, component's port should be at target position
        let aligned_pos = transform.apply(component_port.position);
        assert!(approx_eq(aligned_pos.x, target_port.position.x));
        assert!(approx_eq(aligned_pos.y, target_port.position.y));

        // Directions should be opposite (facing each other)
        let aligned_dir = component_port.direction.rotate(transform.rotation());
        assert!(approx_eq(aligned_dir.x, -target_port.direction.x));
        assert!(approx_eq(aligned_dir.y, -target_port.direction.y));
    }
}

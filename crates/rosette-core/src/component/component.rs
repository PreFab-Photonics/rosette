//! The Component trait for photonic building blocks.
//!
//! All photonic components implement this trait, which provides a consistent
//! interface for generating geometry and accessing connection ports.

use crate::cell::Cell;
use crate::geometry::BBox;
use crate::layer::Layer;
use crate::port::Port;

/// A photonic component that generates layout geometry.
///
/// Components are the building blocks of photonic circuits. Each component:
/// - Has a unique name
/// - Generates geometry on one or more layers
/// - Exposes ports for connecting to other components
///
/// **Note:** This trait is primarily used internally by the Route component.
/// User-facing components are implemented in Python (see `rosette.components`).
pub trait Component {
    /// Get the name of this component type (e.g., "waveguide", "bend").
    fn name(&self) -> &str;

    /// Get all ports defined by this component.
    fn ports(&self) -> Vec<Port>;

    /// Get a port by name.
    fn port(&self, name: &str) -> Option<Port> {
        self.ports().into_iter().find(|p| p.name == name)
    }

    /// Get the bounding box of the component geometry.
    fn bbox(&self) -> BBox;

    /// Convert the component to a Cell with geometry on the specified layer.
    fn to_cell(&self, layer: Layer) -> Cell;

    /// Get the length of the component along its path (if applicable).
    ///
    /// For waveguides and bends, this is the optical path length.
    /// Returns `None` for components without a meaningful path length.
    fn path_length(&self) -> Option<f64> {
        None
    }
}

/// Builder pattern helpers for component configuration.
pub trait ComponentBuilder: Sized {
    /// Set the waveguide width.
    fn with_width(self, width: f64) -> Self;
}

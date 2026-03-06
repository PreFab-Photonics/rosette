//! Core component infrastructure for photonic layout.
//!
//! This module provides the core infrastructure for building photonic layouts:
//!
//! - [`Component`]: The core trait that all components implement
//! - [`connect_transform`]: Calculate transforms to connect ports
//! - [`Route`]: Flexible waveguide routing between ports
//!
//! **Note:** Photonic components (waveguides, bends, MMIs, etc.) are now
//! implemented in Python as user-customizable code. See `rosette.components`
//! in Python for the component library.

#[allow(clippy::module_inception)]
mod component;
mod connection;
mod route;

pub use component::{Component, ComponentBuilder};
pub use connection::{connect_transform, place_at_port};
pub use route::{Route, RouteResult, Waypoint};

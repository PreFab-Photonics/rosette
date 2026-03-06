//! # rosette-core
//!
//! Core geometry types and data structures for photonic layout.
//!
//! ## Modules
//!
//! - [`geometry`]: 2D geometry primitives (Point, Polygon, Transform, BBox) and utilities
//! - [`layer`]: Layer definitions for GDS
//! - [`port`]: Connection ports for components
//! - [`cell`]: Cell hierarchy and references
//! - [`component`]: Core component infrastructure (Route, connect_transform)
//! - [`flatten`]: Library flattening for rendering
//!
//! **Note:** Photonic components (waveguides, bends, MMIs, etc.) are implemented
//! in Python as user-customizable code. See `rosette.components`.

pub mod cell;
pub mod component;
pub mod flatten;
pub mod geometry;
pub mod layer;
pub mod port;

// Re-export primary types at crate root for convenience
pub use cell::{Cell, CellMetadata, CellRef, Library, PathEndType, Repetition};
pub use component::{
    Component, ComponentBuilder, Route, RouteResult, Waypoint, connect_transform, place_at_port,
};
pub use flatten::{FlatGeometry, FlatPolygon, flatten_cell, flatten_library};
pub use geometry::{
    BBox,
    Point,
    Polygon,
    Transform,
    Vector2,
    // Utility functions for component authoring
    arc_points,
    fresnel_c,
    fresnel_s,
    offset_polygon,
    offset_polygon_varying,
    path_length,
};
pub use layer::Layer;
pub use port::Port;

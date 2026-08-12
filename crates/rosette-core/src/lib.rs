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
//! - [`component`]: Core component connection utilities
//!
//! ## Key types
//!
//! | Type | Description |
//! |------|-------------|
//! | [`Point`] | 2D coordinate (x, y) |
//! | [`Polygon`] | Closed polygon defined by vertices |
//! | [`Transform`] | Affine transformation (translate, rotate, scale, mirror) |
//! | [`BBox`] | Axis-aligned bounding box |
//! | [`Layer`] | GDS layer number and datatype |
//! | [`Port`] | Named connection point with position and direction |
//! | [`Cell`] | Container for geometry, can reference other cells |
//! | [`CellRef`] | Reference to another cell with a transformation |
//!
//! **Note:** Photonic components (waveguides, bends, MMIs, etc.) are implemented
//! in Python as user-customizable code. See `rosette.components`.

pub mod cell;
pub mod component;
pub mod error;
pub mod geometry;
pub mod hierarchy;
pub mod layer;
pub mod path;
pub mod port;

// Re-export primary types at crate root for convenience
pub use cell::{BendInfo, Cell, CellRef, DuplicatePolicy, Library, PathEndType, Repetition};
pub use component::connect_transform;
pub use error::LibraryError;
pub use geometry::{
    BBox,
    Point,
    Polygon,
    Region,
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

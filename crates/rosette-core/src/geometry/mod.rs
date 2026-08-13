//! Geometry primitives for 2D layout.
//!
//! This module contains the fundamental geometric types:
//! - [`Point`] and [`Vector2`]: 2D coordinates and displacement vectors
//! - [`Polygon`]: Closed polygon defined by vertices
//! - [`Transform`]: Affine transformations
//! - [`BBox`]: Axis-aligned bounding boxes
//!
//! And utility functions for component authoring:
//! - [`arc_points`]: Generate points along a circular arc
//! - [`path_length`]: Calculate the length of a polyline path
//! - [`fresnel_c`], [`fresnel_s`]: Fresnel integrals for Euler bends
//!
//! Boolean shape operations (via the `geo` crate):
//! - [`Polygon::union`], [`Polygon::subtract`], [`Polygon::intersect`], [`Polygon::xor`]

pub mod bbox;
pub mod boolean_ops;
pub mod point;
pub mod polygon;
pub mod transform;
pub mod utils;

pub use bbox::BBox;
pub use boolean_ops::Region;
pub use point::{Point, Vector2};
pub use polygon::Polygon;
pub use transform::Transform;
pub use utils::{arc_points, fresnel_c, fresnel_s, path_length};

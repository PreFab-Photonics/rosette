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
//! - [`offset_polygon`]: Create a polygon from a centerline and width
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
pub use boolean_ops::{polygon_from_geo, polygon_to_geo, polygons_from_geo_multi};
pub use point::{Point, Vector2};
pub use polygon::Polygon;
pub use transform::Transform;
pub use utils::{
    arc_points, fresnel_c, fresnel_s, offset_polygon, offset_polygon_varying, path_length,
};

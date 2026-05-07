//! DRC check implementations.

mod acute_angle;
mod angle;
mod area;
mod density;
mod edge_length;
mod enclosure;
mod grid;
mod max_width;
mod not_inside;
mod overlap;
mod self_intersection;
mod spacing;
pub(crate) mod spatial;
pub(crate) mod width;

pub use acute_angle::check_acute_angle;
pub use angle::check_angles;
pub use area::check_area;
pub use density::{check_density, compute_region_bbox};
pub use edge_length::check_edge_length;
pub use enclosure::check_enclosure_bulk;
pub use grid::check_snap_to_grid;
pub use max_width::check_max_width;
pub use not_inside::check_not_inside;
pub use overlap::{check_forbid_overlap_bulk, check_require_overlap_bulk};
pub use self_intersection::check_self_intersection;
pub use spacing::check_spacing;
pub use width::check_width;

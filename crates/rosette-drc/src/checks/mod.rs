//! DRC check implementations.

mod angle;
mod area;
mod edge_length;
mod enclosure;
mod max_width;
mod overlap;
mod self_intersection;
mod spacing;
pub(crate) mod width;

pub use angle::check_angles;
pub use area::check_area;
pub use edge_length::check_edge_length;
pub use enclosure::check_enclosure;
pub use max_width::check_max_width;
pub use overlap::{check_forbid_overlap, check_forbid_overlap_bulk, check_require_overlap};
pub use self_intersection::check_self_intersection;
pub use spacing::check_spacing;
pub use width::check_width;

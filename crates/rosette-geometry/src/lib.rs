//! Boolean and topological geometry operations for Rosette layout primitives.
//!
//! [`Region`] preserves holes and disconnected components while operations are
//! composed, then explicitly lowers them to core's single-ring
//! [`Polygon`](rosette_core::Polygon) representation for layout storage.

mod region;

pub use region::Region;

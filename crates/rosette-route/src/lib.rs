//! Photonic routing algorithms for Rosette.
//!
//! [`Route`] builds waveguide geometry between ports while keeping routing
//! policy outside `rosette-core`'s atomic layout model.

mod route;

pub use route::{BendInfo, BendProfile, Route, RouteAnnotations, RouteBuildError, RouteResult};

//! Design checks for photonic layouts.
//!
//! Unified check system that validates photonic designs for correctness
//! and design rule compliance. Includes:
//!
//! - **Connectivity** — verifies port connections, width matching, angle alignment
//! - **Bend radius** — flags bends below a configured minimum radius
//!
//! # Example
//!
//! ```
//! use rosette_core::{Cell, Port, Point, Vector2};
//! use rosette_checks::{ChecksConfig, RouteAnnotationMap, run_checks};
//!
//! let mut cell = Cell::new("test").unwrap();
//! cell.add_port(Port::with_width("in", Point::origin(), -Vector2::unit_x(), 0.5).unwrap()).unwrap();
//! cell.add_port(Port::with_width("out", Point::new(10.0, 0.0), Vector2::unit_x(), 0.5).unwrap()).unwrap();
//!
//! let config = ChecksConfig::default();
//! let result = run_checks(&cell, &config, None, &RouteAnnotationMap::new());
//! if result.passed() {
//!     println!("All checks passed!");
//! }
//! ```

mod bend_radius;
mod config;
mod connectivity;
mod runner;
mod violation;

pub use bend_radius::RouteAnnotationMap;
pub use config::ChecksConfig;
pub use runner::{ChecksResult, ChecksStats, run_checks};
pub use violation::{CheckViolation, CheckViolationType, Severity};

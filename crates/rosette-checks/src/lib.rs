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
//! use rosette_checks::{ChecksConfig, run_checks};
//!
//! let mut cell = Cell::new("test");
//! cell.add_port(Port::with_width("in", Point::origin(), -Vector2::unit_x(), 0.5));
//! cell.add_port(Port::with_width("out", Point::new(10.0, 0.0), Vector2::unit_x(), 0.5));
//!
//! let config = ChecksConfig::default();
//! let result = run_checks(&cell, &config, None);
//! if result.passed() {
//!     println!("All checks passed!");
//! }
//! ```

pub mod bend_radius;
pub mod config;
pub mod connectivity;
pub mod runner;
pub mod violation;

pub use config::ChecksConfig;
pub use runner::{ChecksResult, ChecksStats, run_checks};
pub use violation::{CheckViolation, CheckViolationType, Severity};

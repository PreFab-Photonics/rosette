//! Connectivity checking for photonic layouts.
//!
//! Verifies that component ports are properly connected by checking:
//! - **Unconnected ports** — every non-external port has a partner
//! - **Width mismatch** — connected ports have matching widths
//! - **Angle mismatch** — connected ports are properly anti-parallel
//!
//! Ports on the top-level cell are treated as external I/O and are
//! exempt from unconnected-port checks.
//!
//! # Example
//!
//! ```
//! use rosette_core::{Cell, Port, Point, Vector2};
//! use rosette_connectivity::{ConnectivityConfig, run_connectivity};
//!
//! let mut cell = Cell::new("test");
//! cell.add_port(Port::with_width("in", Point::origin(), -Vector2::unit_x(), 0.5));
//! cell.add_port(Port::with_width("out", Point::new(10.0, 0.0), Vector2::unit_x(), 0.5));
//!
//! let config = ConnectivityConfig::default();
//! let result = run_connectivity(&cell, &config, None);
//! if result.passed() {
//!     println!("Connectivity check passed!");
//! }
//! ```

mod config;
mod runner;
mod violation;

pub use config::ConnectivityConfig;
pub use runner::{ConnectivityResult, ConnectivityStats, run_connectivity};
pub use violation::{ConnViolation, ConnViolationType, Severity};

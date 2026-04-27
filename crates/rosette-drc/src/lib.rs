//! Design Rule Checking (DRC) for photonic layouts.
//!
//! This crate provides configurable rule checking for:
//! - Minimum width
//! - Maximum width (single-mode waveguide enforcement)
//! - Minimum spacing
//! - Minimum area
//! - Minimum edge length (lithography resolution)
//! - Snap-to-grid (manufacturing grid alignment)
//! - Enclosure
//! - Overlap (required/forbidden)
//! - Edge angles
//! - Self-intersection detection
//!
//! # Example
//!
//! ```
//! use rosette_core::{Cell, Layer, Point, Polygon};
//! use rosette_drc::{DrcRules, run_drc};
//!
//! let mut cell = Cell::new("test");
//! cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 10.0), Layer::new(1, 0));
//!
//! let rules = DrcRules::new()
//!     .min_width(Layer::new(1, 0), 0.1, Some("M1.W.1"))
//!     .min_spacing(Layer::new(1, 0), Layer::new(1, 0), 0.15, None)
//!     .min_area(Layer::new(1, 0), 0.01, None);
//!
//! let result = run_drc(&cell, &rules, None);
//! if result.passed() {
//!     println!("DRC passed!");
//! } else {
//!     for v in &result.violations {
//!         println!("Violation: {}", v.message);
//!     }
//! }
//! ```

mod checks;
mod rules;
mod runner;
mod violation;

pub use rules::{DrcRules, Rule};
pub use runner::{DrcResult, DrcRunner, DrcStats, run_drc};
pub use violation::{DrcViolation, RuleType, Severity};

//! # rosette-io
//!
//! File I/O for photonic layout.
//!
//! ## Supported Formats
//!
//! - [`gds`]: GDS II binary format (read & write)
//! - [`json`]: JSON format for web viewer communication
//!
//! ## GDS unit conventions
//!
//! - Coordinates are stored as integers (database units).
//! - Default unit: 1 database unit = 1 nanometer.
//! - User units: 1 micrometer = 1000 database units.

pub mod gds;
pub mod json;

pub use gds::{GdsError, read, read_bytes, write, write_bytes, write_library};
pub use json::JsonError;

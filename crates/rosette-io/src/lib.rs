//! # rosette-io
//!
//! File I/O for photonic layout.
//!
//! ## Supported Formats
//!
//! - [`gds`]: GDS II binary format (read & write)
//! - [`json`]: JSON format for web viewer communication

pub mod gds;
pub mod json;

pub use gds::{read, read_bytes, write, write_bytes, write_library, GdsError};
pub use json::JsonError;

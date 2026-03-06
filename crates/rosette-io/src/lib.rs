//! # rosette-io
//!
//! File I/O for photonic layout.
//!
//! ## Supported Formats
//!
//! - [`gds`]: GDS II binary format
//! - [`json`]: JSON format for web viewer communication

pub mod gds;
pub mod json;

pub use gds::{GdsError, write, write_library};
pub use json::JsonError;

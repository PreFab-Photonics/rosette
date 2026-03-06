//! JSON format support for rosette designs.
//!
//! This module provides serialization and deserialization of rosette [`Library`]
//! structures to/from JSON format. This is used internally by `rosette serve`
//! to communicate designs to the web viewer.
//!
//! ## Example
//!
//! ```no_run
//! use rosette_core::{Cell, Layer, Point, Polygon, Library};
//! use rosette_io::json;
//!
//! let mut cell = Cell::new("top");
//! cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0), Layer::new(1, 0));
//!
//! let mut library = Library::new("design");
//! library.add_cell(cell);
//!
//! // Write to file
//! json::write("design.json", &library).unwrap();
//!
//! // Or get as string
//! let json_str = json::to_string(&library).unwrap();
//! ```

mod reader;
mod writer;

pub use reader::{from_string, read};
pub use writer::{to_string, write};

use thiserror::Error;

/// Errors that can occur during JSON I/O.
#[derive(Error, Debug)]
pub enum JsonError {
    /// I/O error reading or writing file.
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),

    /// JSON serialization error.
    #[error("JSON serialization error: {0}")]
    Serialize(#[from] serde_json::Error),
}

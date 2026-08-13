//! JSON format support for rosette designs.
//!
//! This module owns the versioned `rosette-layout` persistence contract and
//! converts it to and from validated [`LayoutDocument`] values. Schema V1 uses
//! micrometers with a Y-up coordinate axis and is used internally by
//! `rosette serve` to communicate designs to the web viewer.
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
//! let document = json::LayoutDocument::from_library(library).unwrap();
//! json::write("design.json", &document).unwrap();
//!
//! // Or get as string
//! let json_str = json::to_string(&document).unwrap();
//! ```

mod document;
mod dto;
mod reader;
mod writer;

pub use document::{
    BendAnnotation, CellAnnotations, DrcAnnotations, EditorAnnotations, LayoutDocument,
    RouteAnnotations,
};
pub use dto::{FORMAT, SCHEMA_VERSION};
pub use reader::{from_string, read};
pub use writer::{to_string, to_string_compact, write};

use thiserror::Error;

/// Errors that can occur during JSON I/O.
#[derive(Error, Debug)]
pub enum JsonError {
    /// I/O error reading or writing file.
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),

    /// JSON encoding or decoding error.
    #[error("JSON error: {0}")]
    Json(#[from] serde_json::Error),

    /// The document is not a Rosette layout document.
    #[error("unsupported JSON format {0:?}")]
    UnsupportedFormat(String),

    /// The document uses a schema version this build cannot read.
    #[error("unsupported Rosette layout schema version {0}")]
    UnsupportedSchema(u32),

    /// The document uses unsupported coordinate conventions.
    #[error("unsupported coordinate system: unit={unit:?}, y_axis={y_axis:?}")]
    UnsupportedCoordinateSystem { unit: String, y_axis: String },

    /// A decoded document cannot be converted into a valid core model.
    #[error("invalid document at {path}: {message}")]
    InvalidDocument { path: String, message: String },

    /// Library data violates core local model invariants.
    #[error("invalid library: {0}")]
    InvalidLibrary(#[from] rosette_core::LibraryError),
}

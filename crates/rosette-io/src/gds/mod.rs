//! GDS II format support.
//!
//! GDS II (Graphic Data System) is a binary file format for IC layout data.
//!
//! ## Quick Start
//!
//! ```no_run
//! use rosette_core::{Cell, Layer, Point, Polygon};
//! use rosette_io::gds;
//!
//! // Write
//! let mut cell = Cell::new("TOP");
//! cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0), Layer::new(1, 0));
//! gds::write("output.gds", &cell).unwrap();
//!
//! // Read
//! let lib = gds::read("output.gds").unwrap();
//! ```

mod reader;
pub(crate) mod writer;

pub use reader::{read, read_bytes};
pub use writer::{GdsError, write, write_library};

//! JSON writer for rosette libraries.

use super::JsonError;
use rosette_core::Library;
use std::fs::File;
use std::io::BufWriter;
use std::path::Path;

/// Write a library to a JSON file.
///
/// The JSON format preserves the full library structure including:
/// - All cells with their elements (polygons, paths, cell references, text)
/// - Ports on each cell
/// - Cell metadata (e.g., path length)
///
/// # Arguments
/// * `path` - Path to the output JSON file
/// * `library` - The library to serialize
///
/// # Errors
/// Returns an error if the file cannot be created or written.
pub fn write(path: impl AsRef<Path>, library: &Library) -> Result<(), JsonError> {
    let file = File::create(path)?;
    let writer = BufWriter::new(file);
    serde_json::to_writer_pretty(writer, library)?;
    Ok(())
}

/// Serialize a library to a pretty-printed JSON string.
///
/// # Arguments
/// * `library` - The library to serialize
///
/// # Returns
/// A pretty-printed JSON string representation of the library.
///
/// # Errors
/// Returns an error if serialization fails.
pub fn to_string(library: &Library) -> Result<String, JsonError> {
    Ok(serde_json::to_string_pretty(library)?)
}

/// Serialize a library to a compact JSON string (no extra whitespace).
///
/// Same as [`to_string`] but produces minimal JSON, suitable for wire
/// transfer (e.g., SSE events from `rosette serve`).
///
/// # Arguments
/// * `library` - The library to serialize
///
/// # Returns
/// A compact JSON string representation of the library.
///
/// # Errors
/// Returns an error if serialization fails.
pub fn to_string_compact(library: &Library) -> Result<String, JsonError> {
    Ok(serde_json::to_string(library)?)
}

#[cfg(test)]
mod tests {
    use super::*;
    use rosette_core::{Cell, Layer, Point, Polygon, Port, Vector2};

    #[test]
    fn test_to_string_simple() {
        let mut cell = Cell::new("test");
        cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0), Layer::new(1, 0));

        let mut library = Library::new("test_lib");
        library.add_cell(cell).unwrap();

        let json = to_string(&library).unwrap();
        assert!(json.contains("\"name\":"));
        assert!(json.contains("test_lib"));
        assert!(json.contains("test"));
    }

    #[test]
    fn test_to_string_with_ports() {
        let mut cell = Cell::new("with_ports");
        cell.add_polygon(Polygon::rect(Point::origin(), 100.0, 0.5), Layer::new(1, 0));
        cell.add_port(Port::with_width(
            "in",
            Point::origin(),
            -Vector2::unit_x(),
            0.5,
        ));
        cell.add_port(Port::with_width(
            "out",
            Point::new(100.0, 0.0),
            Vector2::unit_x(),
            0.5,
        ));

        let mut library = Library::new("test");
        library.add_cell(cell).unwrap();

        let json = to_string(&library).unwrap();
        assert!(json.contains("\"in\""));
        assert!(json.contains("\"out\""));
    }

    #[test]
    fn test_to_string_compact() {
        let mut cell = Cell::new("test");
        cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0), Layer::new(1, 0));

        let mut library = Library::new("test_lib");
        library.add_cell(cell).unwrap();

        let compact = to_string_compact(&library).unwrap();
        let pretty = to_string(&library).unwrap();

        // Compact has no newlines; pretty does
        assert!(!compact.contains('\n'));
        assert!(pretty.contains('\n'));

        // Both contain the same data
        assert!(compact.contains("test_lib"));
        assert!(compact.contains("\"name\""));

        // Compact is shorter
        assert!(compact.len() < pretty.len());
    }
}

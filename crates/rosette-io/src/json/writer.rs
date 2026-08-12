//! JSON writer for rosette libraries.

use super::JsonError;
use rosette_core::Library;
use std::fs::File;
use std::io::{BufWriter, Write};
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
    library.validate()?;
    let file = File::create(path)?;
    write_buffered(file, library)?;
    Ok(())
}

fn write_buffered(writer: impl Write, library: &Library) -> Result<(), JsonError> {
    let mut writer = BufWriter::new(writer);
    serde_json::to_writer_pretty(&mut writer, library)?;
    writer.flush()?;
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
    library.validate()?;
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
    library.validate()?;
    Ok(serde_json::to_string(library)?)
}

#[cfg(test)]
mod tests {
    use super::*;
    use rosette_core::{Cell, Layer, Point, Polygon, Port, Vector2};
    use std::fs;

    struct DelayedWriteFailure;

    impl Write for DelayedWriteFailure {
        fn write(&mut self, _buf: &[u8]) -> std::io::Result<usize> {
            Err(std::io::Error::other("delayed write failed"))
        }

        fn flush(&mut self) -> std::io::Result<()> {
            Ok(())
        }
    }

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

    #[test]
    fn propagates_errors_when_flushing_buffered_json() {
        let library = Library::new("test");
        assert!(matches!(
            write_buffered(DelayedWriteFailure, &library),
            Err(JsonError::Io(_))
        ));
    }

    #[test]
    fn validates_before_serializing_or_truncating_a_file() {
        let mut cell = Cell::new("cell");
        cell.add_path_simple(
            vec![Point::origin(), Point::new(1.0, 0.0)],
            0.5,
            Layer::new(1, 0),
        );
        let mut valid = Library::new("test");
        valid.add_cell(cell).unwrap();
        let mut value = serde_json::to_value(valid).unwrap();
        value["cells"][0]["elements"][0]["Path"]["points"] = serde_json::json!([]);
        let invalid: Library = serde_json::from_value(value).unwrap();

        assert!(matches!(
            to_string(&invalid),
            Err(JsonError::InvalidLibrary(_))
        ));
        assert!(matches!(
            to_string_compact(&invalid),
            Err(JsonError::InvalidLibrary(_))
        ));

        let path = std::env::temp_dir().join(format!(
            "rosette-json-validation-{}.json",
            std::process::id()
        ));
        fs::write(&path, b"existing").unwrap();
        assert!(matches!(
            write(&path, &invalid),
            Err(JsonError::InvalidLibrary(_))
        ));
        assert_eq!(fs::read(&path).unwrap(), b"existing");
        fs::remove_file(path).unwrap();
    }
}

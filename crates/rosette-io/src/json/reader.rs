//! JSON reader for rosette libraries.

use super::JsonError;
use rosette_core::Library;
use std::fs::File;
use std::io::BufReader;
use std::path::Path;

/// Read a library from a JSON file.
///
/// # Arguments
/// * `path` - Path to the JSON file
///
/// # Returns
/// The deserialized library.
///
/// # Errors
/// Returns an error if the file cannot be read or parsed.
pub fn read(path: impl AsRef<Path>) -> Result<Library, JsonError> {
    let file = File::open(path)?;
    let reader = BufReader::new(file);
    let library = serde_json::from_reader(reader)?;
    Ok(library)
}

/// Deserialize a library from a JSON string.
///
/// # Arguments
/// * `json` - JSON string to parse
///
/// # Returns
/// The deserialized library.
///
/// # Errors
/// Returns an error if the JSON is invalid or doesn't match the expected structure.
pub fn from_string(json: &str) -> Result<Library, JsonError> {
    Ok(serde_json::from_str(json)?)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::json::to_string;
    use rosette_core::{Cell, Layer, Point, Polygon, Port, Vector2};

    #[test]
    fn test_round_trip() {
        // Create a library
        let mut cell = Cell::new("test_cell");
        cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0), Layer::new(1, 0));
        cell.add_polygon(
            Polygon::rect(Point::new(20.0, 0.0), 5.0, 10.0),
            Layer::new(2, 1),
        );
        cell.add_port(Port::with_width(
            "opt1",
            Point::origin(),
            -Vector2::unit_x(),
            0.5,
        ));

        let mut library = Library::new("test_lib");
        library.add_cell(cell);

        // Serialize
        let json = to_string(&library).unwrap();

        // Deserialize
        let restored = from_string(&json).unwrap();

        // Verify
        assert_eq!(restored.name(), "test_lib");
        assert_eq!(restored.cells().len(), 1);

        let cell = restored.cell("test_cell").unwrap();
        assert_eq!(cell.polygon_count(), 2);
        assert_eq!(cell.ports().len(), 1);
        assert_eq!(cell.ports()[0].name, "opt1");
    }

    #[test]
    fn test_round_trip_with_paths() {
        use rosette_core::cell::PathEndType;

        let mut cell = Cell::new("with_path");
        cell.add_path(
            vec![
                Point::origin(),
                Point::new(100.0, 0.0),
                Point::new(100.0, 50.0),
            ],
            0.5,
            Layer::new(1, 0),
            PathEndType::Flush,
        );

        let mut library = Library::new("test");
        library.add_cell(cell);

        let json = to_string(&library).unwrap();
        let restored = from_string(&json).unwrap();

        let cell = restored.cell("with_path").unwrap();
        assert_eq!(cell.path_count(), 1);
    }

    #[test]
    fn test_round_trip_with_cell_refs() {
        use rosette_core::CellRef;

        // Child cell
        let mut child = Cell::new("child");
        child.add_polygon(Polygon::rect(Point::origin(), 5.0, 5.0), Layer::new(1, 0));

        // Parent cell with reference
        let mut parent = Cell::new("parent");
        parent.add_ref(CellRef::new("child").at(10.0, 20.0));

        let mut library = Library::new("test");
        library.add_cell(child);
        library.add_cell(parent);

        let json = to_string(&library).unwrap();
        let restored = from_string(&json).unwrap();

        assert_eq!(restored.cells().len(), 2);
        assert!(restored.cell("child").is_some());
        assert!(restored.cell("parent").is_some());

        let parent = restored.cell("parent").unwrap();
        assert_eq!(parent.ref_count(), 1);
    }
}

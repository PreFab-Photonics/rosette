//! JSON reader for rosette libraries.

use super::{JsonError, LayoutDocument, dto::DocumentDto};
use std::path::Path;

/// Read a layout document from a JSON file.
///
/// # Arguments
/// * `path` - Path to the JSON file
///
/// # Returns
/// The deserialized layout document.
///
/// # Errors
/// Returns an error if the file cannot be read or parsed.
pub fn read(path: impl AsRef<Path>) -> Result<LayoutDocument, JsonError> {
    from_string(&std::fs::read_to_string(path)?)
}

/// Deserialize a layout document from a JSON string.
///
/// # Arguments
/// * `json` - JSON string to parse
///
/// # Returns
/// The deserialized layout document.
///
/// # Errors
/// Returns an error if the JSON is invalid or doesn't match the expected structure.
pub fn from_string(json: &str) -> Result<LayoutDocument, JsonError> {
    DocumentDto::decode(json)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::json::to_string;
    use rosette_core::{Cell, Layer, Library, Point, Polygon, Port, Vector2};

    fn document(library: Library) -> LayoutDocument {
        LayoutDocument::from_library(library).unwrap()
    }

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
        library.add_cell(cell).unwrap();

        // Serialize
        let json = to_string(&document(library)).unwrap();

        // Deserialize
        let restored = from_string(&json).unwrap();

        // Verify
        assert_eq!(restored.library().name(), "test_lib");
        assert_eq!(restored.library().cells().len(), 1);

        let cell = restored.library().cell("test_cell").unwrap();
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
        library.add_cell(cell).unwrap();

        let json = to_string(&document(library)).unwrap();
        let restored = from_string(&json).unwrap();

        let cell = restored.library().cell("with_path").unwrap();
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
        library.add_cell(child).unwrap();
        library.add_cell(parent).unwrap();

        let json = to_string(&document(library)).unwrap();
        let restored = from_string(&json).unwrap();

        assert_eq!(restored.library().cells().len(), 2);
        assert!(restored.library().cell("child").is_some());
        assert!(restored.library().cell("parent").is_some());

        let parent = restored.library().cell("parent").unwrap();
        assert_eq!(parent.ref_count(), 1);
    }

    #[test]
    fn rejects_empty_and_duplicate_cell_identities() {
        let mut library = Library::new("test");
        library.add_cell(Cell::new("cell")).unwrap();
        let value: serde_json::Value =
            serde_json::from_str(&to_string(&document(library)).unwrap()).unwrap();

        let mut empty = value.clone();
        empty["library"]["cells"][0]["name"] = serde_json::Value::String(String::new());
        assert!(matches!(
            from_string(&serde_json::to_string(&empty).unwrap()),
            Err(JsonError::InvalidDocument { .. })
        ));

        let mut duplicate = value;
        let duplicate_cell = duplicate["library"]["cells"][0].clone();
        duplicate["library"]["cells"]
            .as_array_mut()
            .unwrap()
            .push(duplicate_cell);
        assert!(matches!(
            from_string(&serde_json::to_string(&duplicate).unwrap()),
            Err(JsonError::InvalidLibrary(
                rosette_core::LibraryError::AlreadyExists { .. }
            ))
        ));
    }

    #[test]
    fn rejects_locally_invalid_cell_contents_after_deserialization() {
        let mut cell = Cell::new("cell");
        cell.add_path_simple(
            vec![Point::origin(), Point::new(1.0, 0.0)],
            0.5,
            Layer::new(1, 0),
        );
        let mut library = Library::new("test");
        library.add_cell(cell).unwrap();
        let mut value: serde_json::Value =
            serde_json::from_str(&to_string(&document(library)).unwrap()).unwrap();
        value["library"]["cells"][0]["elements"][0]["points"] = serde_json::json!([]);

        assert!(matches!(
            from_string(&serde_json::to_string(&value).unwrap()),
            Err(JsonError::InvalidDocument { .. })
        ));
    }

    #[test]
    fn dispatches_format_and_schema_before_decoding_the_payload() {
        let value: serde_json::Value =
            serde_json::from_str(&to_string(&document(Library::new("test"))).unwrap()).unwrap();

        let mut wrong_format = value.clone();
        wrong_format["format"] = serde_json::json!("other-layout");
        assert!(matches!(
            from_string(&serde_json::to_string(&wrong_format).unwrap()),
            Err(JsonError::UnsupportedFormat(format)) if format == "other-layout"
        ));

        let mut wrong_coordinates = value.clone();
        wrong_coordinates["coordinate_system"]["unit"] = serde_json::json!("nm");
        assert!(matches!(
            from_string(&serde_json::to_string(&wrong_coordinates).unwrap()),
            Err(JsonError::UnsupportedCoordinateSystem { unit, y_axis })
                if unit == "nm" && y_axis == "up"
        ));

        let mut future = value;
        future["schema"] = serde_json::json!(2);
        future["future_field"] = serde_json::json!({ "shape": "unknown" });
        assert!(matches!(
            from_string(&serde_json::to_string(&future).unwrap()),
            Err(JsonError::UnsupportedSchema(2))
        ));
    }

    #[test]
    fn rejects_unversioned_json_and_missing_top_cells() {
        assert!(matches!(
            from_string(r#"{"name":"legacy","cells":[]}"#),
            Err(JsonError::Json(_))
        ));

        let mut value: serde_json::Value =
            serde_json::from_str(&to_string(&document(Library::new("test"))).unwrap()).unwrap();
        value["library"]["top_cell"] = serde_json::json!("missing");
        assert!(matches!(
            from_string(&serde_json::to_string(&value).unwrap()),
            Err(JsonError::InvalidLibrary(
                rosette_core::LibraryError::CellNotFound { .. }
            ))
        ));
    }

    #[test]
    fn rejects_duplicate_fields_without_collapsing_the_document() {
        let json = to_string(&document(Library::new("test"))).unwrap();
        let duplicate = json.replacen(r#""name": "test""#, r#""name": "first", "name": "test""#, 1);

        assert!(matches!(from_string(&duplicate), Err(JsonError::Json(_))));
    }
}

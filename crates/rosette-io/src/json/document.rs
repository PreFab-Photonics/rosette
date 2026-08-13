use std::collections::HashMap;

use rosette_core::{BBox, Library, Point};

use super::JsonError;

/// A validated `rosette-layout` document.
///
/// Feature annotations are stored separately from the format-neutral core
/// library and keyed by cell name.
#[derive(Debug, Clone)]
pub struct LayoutDocument {
    library: Library,
    annotations: HashMap<String, CellAnnotations>,
}

/// Persisted feature annotations for one cell.
#[derive(Debug, Clone, PartialEq, Default)]
pub struct CellAnnotations {
    pub route: RouteAnnotations,
    pub drc: DrcAnnotations,
    pub editor: EditorAnnotations,
}

/// Persisted routing annotations for one cell.
#[derive(Debug, Clone, PartialEq, Default)]
pub struct RouteAnnotations {
    pub path_length: Option<f64>,
    pub bends: Vec<BendAnnotation>,
    pub warnings: Vec<String>,
}

/// Persisted information about one routed bend.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct BendAnnotation {
    pub radius: f64,
    pub position: Point,
    pub requested_radius: Option<f64>,
}

/// Persisted design-rule-checking annotations for one cell.
#[derive(Debug, Clone, PartialEq, Default)]
pub struct DrcAnnotations {
    pub skip: bool,
    pub waive_regions: Vec<BBox>,
}

/// Persisted editor annotations for one cell.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct EditorAnnotations {
    pub origin: Point,
}

impl Default for EditorAnnotations {
    fn default() -> Self {
        Self {
            origin: Point::origin(),
        }
    }
}

impl LayoutDocument {
    /// Create a document with default annotations for every library cell.
    ///
    /// # Errors
    /// Returns an error when the core library is invalid.
    pub fn from_library(library: Library) -> Result<Self, JsonError> {
        let annotations = library
            .cells()
            .iter()
            .map(|cell| (cell.name().to_string(), CellAnnotations::default()))
            .collect();
        Self::from_parts(library, annotations)
    }

    /// Create a document from a library and its cell-name-keyed annotations.
    ///
    /// The annotation table must contain exactly one entry for every cell.
    ///
    /// # Errors
    /// Returns an error when the library, annotation keys, or annotation
    /// values are invalid.
    pub fn from_parts(
        library: Library,
        annotations: HashMap<String, CellAnnotations>,
    ) -> Result<Self, JsonError> {
        let document = Self {
            library,
            annotations,
        };
        document.validate()?;
        Ok(document)
    }

    /// Return the core library.
    pub fn library(&self) -> &Library {
        &self.library
    }

    /// Return the cell-name-keyed annotation table.
    pub fn annotations(&self) -> &HashMap<String, CellAnnotations> {
        &self.annotations
    }

    /// Return the mutable cell-name-keyed annotation table.
    ///
    /// Call [`Self::validate`] after changing keys or values. JSON writers
    /// always validate before serializing.
    pub fn annotations_mut(&mut self) -> &mut HashMap<String, CellAnnotations> {
        &mut self.annotations
    }

    /// Consume the document and return its library and annotation table.
    pub fn into_parts(self) -> (Library, HashMap<String, CellAnnotations>) {
        (self.library, self.annotations)
    }

    /// Validate the core library and every persisted annotation.
    ///
    /// # Errors
    /// Returns an error for invalid library contents, missing or unknown cell
    /// keys, non-finite coordinates and scalars, or unordered waiver regions.
    pub fn validate(&self) -> Result<(), JsonError> {
        self.library.validate()?;

        for cell in self.library.cells() {
            if !self.annotations.contains_key(cell.name()) {
                return Err(invalid(
                    "annotations",
                    &format!("missing annotations for cell {:?}", cell.name()),
                ));
            }
        }
        for name in self.annotations.keys() {
            if !self.library.contains(name) {
                return Err(invalid(
                    "annotations",
                    &format!("annotations reference unknown cell {name:?}"),
                ));
            }
        }

        for (name, annotations) in &self.annotations {
            annotations.validate(&format!("annotations[{name:?}]"))?;
        }
        Ok(())
    }
}

impl CellAnnotations {
    pub(crate) fn validate(&self, path: &str) -> Result<(), JsonError> {
        self.route.validate(&format!("{path}.route"))?;
        self.drc.validate(&format!("{path}.drc"))?;
        self.editor.validate(&format!("{path}.editor"))
    }
}

impl RouteAnnotations {
    fn validate(&self, path: &str) -> Result<(), JsonError> {
        if let Some(path_length) = self.path_length {
            ensure_finite(path_length, &format!("{path}.path_length"))?;
        }
        for (index, bend) in self.bends.iter().enumerate() {
            bend.validate(&format!("{path}.bends[{index}]"))?;
        }
        Ok(())
    }
}

impl BendAnnotation {
    fn validate(&self, path: &str) -> Result<(), JsonError> {
        ensure_finite(self.radius, &format!("{path}.radius"))?;
        ensure_point(self.position, &format!("{path}.position"))?;
        if let Some(requested_radius) = self.requested_radius {
            ensure_finite(requested_radius, &format!("{path}.requested_radius"))?;
        }
        Ok(())
    }
}

impl DrcAnnotations {
    fn validate(&self, path: &str) -> Result<(), JsonError> {
        for (index, region) in self.waive_regions.iter().enumerate() {
            if !region.is_valid() {
                return Err(invalid(
                    &format!("{path}.waive_regions[{index}]"),
                    "bounding-box corners must be finite and ordered",
                ));
            }
        }
        Ok(())
    }
}

impl EditorAnnotations {
    fn validate(&self, path: &str) -> Result<(), JsonError> {
        ensure_point(self.origin, &format!("{path}.origin"))
    }
}

fn ensure_finite(value: f64, path: &str) -> Result<(), JsonError> {
    value
        .is_finite()
        .then_some(())
        .ok_or_else(|| invalid(path, "value must be finite"))
}

fn ensure_point(point: Point, path: &str) -> Result<(), JsonError> {
    point
        .is_finite()
        .then_some(())
        .ok_or_else(|| invalid(path, "point must be finite"))
}

fn invalid(path: &str, message: &str) -> JsonError {
    JsonError::InvalidDocument {
        path: path.to_string(),
        message: message.to_string(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rosette_core::Cell;

    #[test]
    fn from_library_builds_v1_defaults_for_every_cell() {
        let mut library = Library::new("test");
        library.add_cell(Cell::new("cell")).unwrap();

        let document = LayoutDocument::from_library(library).unwrap();
        assert_eq!(
            document.annotations().get("cell"),
            Some(&CellAnnotations::default())
        );
        assert_eq!(
            document.annotations()["cell"].editor.origin,
            Point::origin()
        );
    }

    #[test]
    fn from_parts_validates_keys_and_values() {
        let mut library = Library::new("test");
        library.add_cell(Cell::new("cell")).unwrap();

        assert!(matches!(
            LayoutDocument::from_parts(library.clone(), HashMap::new()),
            Err(JsonError::InvalidDocument { .. })
        ));

        let mut annotations = HashMap::from([("cell".to_string(), CellAnnotations::default())]);
        annotations.get_mut("cell").unwrap().editor.origin.x = f64::NAN;
        assert!(matches!(
            LayoutDocument::from_parts(library, annotations),
            Err(JsonError::InvalidDocument { .. })
        ));
    }
}

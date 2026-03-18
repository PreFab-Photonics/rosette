//! Cell hierarchy for layout.
//!
//! A [`Cell`] is a container for geometry that can reference other cells,
//! enabling hierarchical layout design.

use crate::error::{CellNameError, validate_cell_name};
use crate::geometry::{BBox, Point, Polygon, Transform};
use crate::layer::Layer;
use crate::port::Port;

/// GDS path end type.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum PathEndType {
    /// Flush (square) ends at path endpoints.
    #[default]
    Flush = 0,
    /// Round ends.
    Round = 1,
    /// Square ends extending half-width past endpoints.
    HalfWidthExtension = 2,
}

/// An element within a cell.
#[derive(Debug, Clone)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum Element {
    /// A polygon on a specific layer.
    Polygon { polygon: Polygon, layer: Layer },
    /// A reference to another cell.
    CellRef(CellRef),
    /// A path (centerline with width) on a specific layer.
    Path {
        /// Points along the path centerline.
        points: Vec<Point>,
        /// Width of the path.
        width: f64,
        /// Layer for the path.
        layer: Layer,
        /// Path end type.
        end_type: PathEndType,
    },
    /// A text label on a specific layer.
    Text {
        /// The text string.
        text: String,
        /// Position of the text.
        position: Point,
        /// Layer for the text.
        layer: Layer,
        /// Text height in user units (default: 1.0).
        height: f64,
    },
}

impl Element {
    /// Get the layer of this element, if it has one.
    ///
    /// Returns `None` for `CellRef` elements which don't have a layer.
    pub fn layer(&self) -> Option<Layer> {
        match self {
            Element::Polygon { layer, .. }
            | Element::Path { layer, .. }
            | Element::Text { layer, .. } => Some(*layer),
            Element::CellRef(_) => None,
        }
    }
}

/// Grid repetition parameters for array references (AREF).
///
/// Defines an NxM rectangular grid of copies with configurable spacing
/// along column and row directions. Spacing is in the *parent cell's*
/// coordinate system (already accounts for the CellRef transform).
#[derive(Debug, Clone, Copy, PartialEq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Repetition {
    /// Number of columns (copies along the column direction). Must be >= 1.
    pub columns: u16,
    /// Number of rows (copies along the row direction). Must be >= 1.
    pub rows: u16,
    /// Spacing between columns (X-direction in local CellRef space).
    pub col_spacing: f64,
    /// Spacing between rows (Y-direction in local CellRef space).
    pub row_spacing: f64,
}

impl Repetition {
    /// Create a new rectangular grid repetition.
    pub fn new(columns: u16, rows: u16, col_spacing: f64, row_spacing: f64) -> Self {
        Self {
            columns: columns.max(1),
            rows: rows.max(1),
            col_spacing,
            row_spacing,
        }
    }

    /// Whether this is a trivial (non-arrayed) single instance.
    pub fn is_single(&self) -> bool {
        self.columns <= 1 && self.rows <= 1
    }

    /// Total number of copies in the array.
    pub fn count(&self) -> usize {
        self.columns as usize * self.rows as usize
    }
}

/// A reference to another cell with transformation.
#[derive(Debug, Clone)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct CellRef {
    /// Name of the referenced cell.
    pub cell_name: String,
    /// Transformation applied to the referenced cell.
    pub transform: Transform,
    /// Optional array repetition. When `None`, this is a single instance (SREF).
    /// When `Some`, this is an array reference (AREF) with grid repetition.
    pub repetition: Option<Repetition>,
}

impl CellRef {
    /// Create a new cell reference.
    pub fn new(cell_name: impl Into<String>) -> Self {
        Self {
            cell_name: cell_name.into(),
            transform: Transform::identity(),
            repetition: None,
        }
    }

    /// Create a cell reference with transformation.
    pub fn with_transform(cell_name: impl Into<String>, transform: Transform) -> Self {
        Self {
            cell_name: cell_name.into(),
            transform,
            repetition: None,
        }
    }

    /// Set the position (translation).
    pub fn at(mut self, x: f64, y: f64) -> Self {
        self.transform = Transform::translate(x, y).then(&self.transform);
        self
    }

    /// Rotate by angle (in radians).
    ///
    /// Rotation is applied after any previous transformations.
    pub fn rotate(mut self, angle: f64) -> Self {
        self.transform = Transform::rotate(angle).then(&self.transform);
        self
    }

    /// Mirror across X axis.
    pub fn mirror_x(mut self) -> Self {
        self.transform = Transform::mirror_x().then(&self.transform);
        self
    }

    /// Mirror across Y axis.
    pub fn mirror_y(mut self) -> Self {
        self.transform = Transform::mirror_y().then(&self.transform);
        self
    }

    /// Scale uniformly.
    pub fn scale(mut self, s: f64) -> Self {
        self.transform = Transform::scale_uniform(s).then(&self.transform);
        self
    }

    /// Set array repetition parameters.
    pub fn array(mut self, columns: u16, rows: u16, col_spacing: f64, row_spacing: f64) -> Self {
        self.repetition = Some(Repetition::new(columns, rows, col_spacing, row_spacing));
        self
    }
}

/// Metadata associated with a cell.
#[derive(Debug, Clone, Default)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct CellMetadata {
    /// Total optical path length (if built from a Route).
    pub path_length: Option<f64>,
}

/// A cell containing geometry and references to other cells.
#[derive(Debug, Clone)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Cell {
    /// Name of the cell.
    name: String,
    /// Elements in the cell.
    elements: Vec<Element>,
    /// Ports defined on the cell.
    ports: Vec<Port>,
    /// Optional metadata (path length, etc.)
    metadata: CellMetadata,
    /// Cell origin point, used as the reference for cell instancing.
    origin: Point,
}

impl Cell {
    /// Create a new empty cell.
    pub fn new(name: impl Into<String>) -> Self {
        Self {
            name: name.into(),
            elements: Vec::new(),
            ports: Vec::new(),
            metadata: CellMetadata::default(),
            origin: Point::origin(),
        }
    }

    /// Get the cell name.
    pub fn name(&self) -> &str {
        &self.name
    }

    /// Set the cell name.
    ///
    /// # Errors
    /// Returns [`CellNameError`] if the name is empty, too long, or contains
    /// non-printable-ASCII characters.
    pub fn set_name(&mut self, name: impl Into<String>) -> Result<(), CellNameError> {
        let name = name.into();
        validate_cell_name(&name)?;
        self.name = name;
        Ok(())
    }

    /// Set the cell name without validation.
    ///
    /// This is used internally when the name is already known to be valid
    /// (e.g., when reading from a GDS file where the name passed through
    /// the original writer's validation, or during rename propagation where
    /// the name was already validated).
    pub(crate) fn set_name_unchecked(&mut self, name: impl Into<String>) {
        self.name = name.into();
    }

    /// Get the cell origin.
    pub fn origin(&self) -> Point {
        self.origin
    }

    /// Set the cell origin.
    pub fn set_origin(&mut self, origin: Point) {
        self.origin = origin;
    }

    /// Get all elements.
    pub fn elements(&self) -> &[Element] {
        &self.elements
    }

    /// Get all ports.
    pub fn ports(&self) -> &[Port] {
        &self.ports
    }

    /// Get a port by name.
    pub fn port(&self, name: &str) -> Option<&Port> {
        self.ports.iter().find(|p| p.name == name)
    }

    /// Get cell metadata.
    pub fn metadata(&self) -> &CellMetadata {
        &self.metadata
    }

    /// Get mutable cell metadata.
    pub fn metadata_mut(&mut self) -> &mut CellMetadata {
        &mut self.metadata
    }

    /// Set the path length metadata.
    pub fn set_path_length(&mut self, length: f64) {
        self.metadata.path_length = Some(length);
    }

    /// Get the path length metadata.
    pub fn path_length(&self) -> Option<f64> {
        self.metadata.path_length
    }

    /// Add a polygon to the cell.
    pub fn add_polygon(&mut self, polygon: Polygon, layer: impl Into<Layer>) {
        self.elements.push(Element::Polygon {
            polygon,
            layer: layer.into(),
        });
    }

    /// Add a cell reference.
    pub fn add_ref(&mut self, cell_ref: CellRef) {
        self.elements.push(Element::CellRef(cell_ref));
    }

    /// Add a path (centerline with width) to the cell.
    ///
    /// Paths are an alternative to polygons for representing waveguides and
    /// similar structures. They store a centerline and width, which can be
    /// more compact than storing the full polygon outline.
    pub fn add_path(
        &mut self,
        points: Vec<Point>,
        width: f64,
        layer: impl Into<Layer>,
        end_type: PathEndType,
    ) {
        self.elements.push(Element::Path {
            points,
            width,
            layer: layer.into(),
            end_type,
        });
    }

    /// Add a path with default (flush) end type.
    pub fn add_path_simple(&mut self, points: Vec<Point>, width: f64, layer: impl Into<Layer>) {
        self.add_path(points, width, layer, PathEndType::default());
    }

    /// Add a text label to the cell.
    ///
    /// Text labels are useful for debugging and documentation but are
    /// typically not fabricated.
    pub fn add_text(&mut self, text: impl Into<String>, position: Point, layer: impl Into<Layer>) {
        self.add_text_with_height(text, position, layer, 1.0);
    }

    /// Add a text label with specified height.
    ///
    /// Text labels are useful for debugging and documentation but are
    /// typically not fabricated.
    pub fn add_text_with_height(
        &mut self,
        text: impl Into<String>,
        position: Point,
        layer: impl Into<Layer>,
        height: f64,
    ) {
        self.elements.push(Element::Text {
            text: text.into(),
            position,
            layer: layer.into(),
            height,
        });
    }

    /// Add a port.
    pub fn add_port(&mut self, port: Port) {
        self.ports.push(port);
    }

    /// Get all polygons (without cell references).
    pub fn polygons(&self) -> impl Iterator<Item = (&Polygon, &Layer)> {
        self.elements.iter().filter_map(|e| match e {
            Element::Polygon { polygon, layer } => Some((polygon, layer)),
            _ => None,
        })
    }

    /// Get all cell references.
    pub fn cell_refs(&self) -> impl Iterator<Item = &CellRef> {
        self.elements.iter().filter_map(|e| match e {
            Element::CellRef(r) => Some(r),
            _ => None,
        })
    }

    /// Get all paths.
    pub fn paths(&self) -> impl Iterator<Item = (&Vec<Point>, f64, &Layer, PathEndType)> {
        self.elements.iter().filter_map(|e| match e {
            Element::Path {
                points,
                width,
                layer,
                end_type,
            } => Some((points, *width, layer, *end_type)),
            _ => None,
        })
    }

    /// Get all text labels.
    pub fn texts(&self) -> impl Iterator<Item = (&str, Point, &Layer, f64)> {
        self.elements.iter().filter_map(|e| match e {
            Element::Text {
                text,
                position,
                layer,
                height,
            } => Some((text.as_str(), *position, layer, *height)),
            _ => None,
        })
    }

    /// Calculate the bounding box of all polygons in this cell.
    ///
    /// Note: This does not include cell references (would require resolving them).
    pub fn bbox(&self) -> Option<BBox> {
        let mut result: Option<BBox> = None;
        for (polygon, _) in self.polygons() {
            let poly_bbox = polygon.bbox();
            result = Some(match result {
                Some(existing) => existing.merge(&poly_bbox),
                None => poly_bbox,
            });
        }
        result
    }

    /// Count the number of polygons.
    pub fn polygon_count(&self) -> usize {
        self.elements
            .iter()
            .filter(|e| matches!(e, Element::Polygon { .. }))
            .count()
    }

    /// Count the number of cell references.
    pub fn ref_count(&self) -> usize {
        self.elements
            .iter()
            .filter(|e| matches!(e, Element::CellRef(_)))
            .count()
    }

    /// Count the number of paths.
    pub fn path_count(&self) -> usize {
        self.elements
            .iter()
            .filter(|e| matches!(e, Element::Path { .. }))
            .count()
    }

    /// Count the number of text labels.
    pub fn text_count(&self) -> usize {
        self.elements
            .iter()
            .filter(|e| matches!(e, Element::Text { .. }))
            .count()
    }

    /// Check if the cell is empty.
    pub fn is_empty(&self) -> bool {
        self.elements.is_empty()
    }

    /// Remove an element by index.
    ///
    /// Returns the removed element, or None if index is out of bounds.
    /// Note: This shifts all subsequent element indices down by one.
    pub fn remove_element(&mut self, index: usize) -> Option<Element> {
        if index < self.elements.len() {
            Some(self.elements.remove(index))
        } else {
            None
        }
    }

    /// Get mutable access to elements.
    pub fn elements_mut(&mut self) -> &mut Vec<Element> {
        &mut self.elements
    }

    /// Remove all CellRef elements that reference the given cell name.
    pub fn remove_refs_by_name(&mut self, name: &str) {
        self.elements
            .retain(|e| !matches!(e, Element::CellRef(r) if r.cell_name == name));
    }
}

/// A library containing multiple cells.
#[derive(Debug, Clone, Default)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Library {
    /// Name of the library.
    name: String,
    /// Cells in the library.
    cells: Vec<Cell>,
}

impl Library {
    /// Create a new library.
    pub fn new(name: impl Into<String>) -> Self {
        Self {
            name: name.into(),
            cells: Vec::new(),
        }
    }

    /// Get the library name.
    pub fn name(&self) -> &str {
        &self.name
    }

    /// Get all cells.
    pub fn cells(&self) -> &[Cell] {
        &self.cells
    }

    /// Get all cells mutably.
    pub fn cells_mut(&mut self) -> &mut [Cell] {
        &mut self.cells
    }

    /// Add a cell to the library.
    ///
    /// # Errors
    /// Returns [`CellNameError::AlreadyExists`] if a cell with the same name
    /// already exists, or a validation error if the cell name is invalid.
    pub fn add_cell(&mut self, cell: Cell) -> Result<(), CellNameError> {
        validate_cell_name(cell.name())?;
        if self.cells.iter().any(|c| c.name() == cell.name()) {
            return Err(CellNameError::AlreadyExists {
                name: cell.name().to_string(),
            });
        }
        self.cells.push(cell);
        Ok(())
    }

    /// Add a cell to the library, skipping duplicates silently.
    ///
    /// Unlike [`add_cell`], this does not return an error for duplicate names;
    /// it silently skips them. This is useful when building hierarchies where
    /// shared cells may be added multiple times.
    ///
    /// # Errors
    /// Returns a validation error if the cell name is invalid.
    pub fn add_cell_dedup(&mut self, cell: Cell) -> Result<(), CellNameError> {
        validate_cell_name(cell.name())?;
        if !self.cells.iter().any(|c| c.name() == cell.name()) {
            self.cells.push(cell);
        }
        Ok(())
    }

    /// Check if the library contains a cell with the given name.
    pub fn contains(&self, name: &str) -> bool {
        self.cells.iter().any(|c| c.name() == name)
    }

    /// Get a cell by name.
    pub fn cell(&self, name: &str) -> Option<&Cell> {
        self.cells.iter().find(|c| c.name() == name)
    }

    /// Get a mutable cell by name.
    pub fn cell_mut(&mut self, name: &str) -> Option<&mut Cell> {
        self.cells.iter_mut().find(|c| c.name() == name)
    }

    /// Get the top cell (last added, typically the main design).
    pub fn top_cell(&self) -> Option<&Cell> {
        self.cells.last()
    }

    /// Rename a cell in the library.
    ///
    /// Returns `true` if the cell was found and renamed, `false` if
    /// no cell with `old_name` exists.
    /// Also updates any `CellRef` elements in other cells that reference the
    /// old name.
    ///
    /// # Errors
    /// Returns [`CellNameError`] if the new name is invalid or already taken
    /// by a different cell.
    pub fn rename_cell(&mut self, old_name: &str, new_name: &str) -> Result<bool, CellNameError> {
        validate_cell_name(new_name)?;

        // Prevent rename to an existing name (unless it's the same cell)
        if old_name != new_name && self.contains(new_name) {
            return Err(CellNameError::AlreadyExists {
                name: new_name.to_string(),
            });
        }
        let mut found = false;
        for cell in &mut self.cells {
            if cell.name() == old_name {
                // Name already validated above, skip re-validation
                cell.set_name_unchecked(new_name);
                found = true;
            }
            // Update CellRef elements that reference the old name
            for element in &mut cell.elements {
                if let Element::CellRef(cell_ref) = element
                    && cell_ref.cell_name == old_name
                {
                    cell_ref.cell_name = new_name.to_string();
                }
            }
        }
        Ok(found)
    }

    /// Remove a cell from the library by name.
    ///
    /// Returns `true` if the cell was found and removed, `false` otherwise.
    pub fn remove_cell(&mut self, name: &str) -> bool {
        let len = self.cells.len();
        self.cells.retain(|c| c.name() != name);
        self.cells.len() < len
    }

    /// Add a cell and all its referenced cells recursively.
    ///
    /// This method takes a cell registry (a slice of available cells) and
    /// automatically adds all cells that are referenced by the given cell,
    /// recursively resolving the entire hierarchy.
    ///
    /// Cells that already exist in the library (by name) are skipped.
    /// Cells with invalid names (see [`validate_cell_name`]) are silently
    /// dropped. Callers that need validation errors should validate cell
    /// names before calling this method.
    ///
    /// # Arguments
    /// * `cell` - The cell to add (typically the top-level cell)
    /// * `available_cells` - A slice of cells that may be referenced
    ///
    /// # Example
    /// ```ignore
    /// let mut lib = Library::new("my_lib");
    /// let all_cells = vec![mmi_cell, sbend_cell, waveguide_cell, top_cell];
    /// lib.add_cell_recursive(top_cell, &all_cells);
    /// ```
    pub fn add_cell_recursive(&mut self, cell: Cell, available_cells: &[Cell]) {
        // Build a name -> cell map for lookups
        let cell_map: std::collections::HashMap<&str, &Cell> =
            available_cells.iter().map(|c| (c.name(), c)).collect();

        // Recursively collect all referenced cells
        let mut to_add: Vec<Cell> = Vec::new();
        self.collect_referenced_cells(&cell, &cell_map, &mut to_add);

        // Add all collected cells (dependencies first), skipping duplicates
        for c in to_add {
            // Ignore errors from duplicates (expected in hierarchical designs)
            let _ = self.add_cell_dedup(c);
        }

        // Add the top cell last
        let _ = self.add_cell_dedup(cell);
    }

    /// Helper to recursively collect referenced cells.
    fn collect_referenced_cells(
        &self,
        cell: &Cell,
        cell_map: &std::collections::HashMap<&str, &Cell>,
        collected: &mut Vec<Cell>,
    ) {
        for cell_ref in cell.cell_refs() {
            let ref_name = &cell_ref.cell_name;

            // Skip if already in library or already collected
            if self.contains(ref_name) || collected.iter().any(|c| c.name() == ref_name) {
                continue;
            }

            // Find the referenced cell
            if let Some(&referenced_cell) = cell_map.get(ref_name.as_str()) {
                // Recursively collect its dependencies first
                self.collect_referenced_cells(referenced_cell, cell_map, collected);
                // Then add this cell
                collected.push(referenced_cell.clone());
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::error::CellNameError;
    use crate::geometry::{Point, Vector2};

    #[test]
    fn test_cell_new() {
        let cell = Cell::new("test_cell");
        assert_eq!(cell.name(), "test_cell");
        assert!(cell.is_empty());
    }

    #[test]
    fn test_add_polygon() {
        let mut cell = Cell::new("test");
        let rect = Polygon::rect(Point::origin(), 10.0, 5.0);
        cell.add_polygon(rect, Layer::new(1, 0));
        assert_eq!(cell.polygon_count(), 1);
    }

    #[test]
    fn test_add_ref() {
        let mut cell = Cell::new("top");
        cell.add_ref(CellRef::new("sub_cell").at(10.0, 20.0));
        assert_eq!(cell.ref_count(), 1);
    }

    #[test]
    fn test_cell_ref_transform() {
        let cell_ref = CellRef::new("test")
            .at(10.0, 0.0)
            .rotate(std::f64::consts::PI / 2.0);

        // Check that transform is properly composed
        let p = cell_ref.transform.apply(Point::origin());
        // After translate(10,0) then rotate(90deg): (10,0) -> (0,10)
        assert!((p.x - 0.0).abs() < 1e-10);
        assert!((p.y - 10.0).abs() < 1e-10);
    }

    #[test]
    fn test_add_port() {
        let mut cell = Cell::new("test");
        cell.add_port(Port::new("in", Point::origin(), Vector2::unit_x()));
        cell.add_port(Port::new("out", Point::new(10.0, 0.0), Vector2::unit_x()));

        assert_eq!(cell.ports().len(), 2);
        assert!(cell.port("in").is_some());
        assert!(cell.port("out").is_some());
        assert!(cell.port("nonexistent").is_none());
    }

    #[test]
    fn test_bbox() {
        let mut cell = Cell::new("test");
        cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0), 1);
        cell.add_polygon(Polygon::rect(Point::new(20.0, 0.0), 5.0, 10.0), 1);

        let bbox = cell.bbox().unwrap();
        assert!((bbox.min().x - 0.0).abs() < 1e-10);
        assert!((bbox.min().y - 0.0).abs() < 1e-10);
        assert!((bbox.max().x - 25.0).abs() < 1e-10);
        assert!((bbox.max().y - 10.0).abs() < 1e-10);
    }

    #[test]
    fn test_library() {
        let mut lib = Library::new("test_lib");

        let mut cell1 = Cell::new("cell1");
        cell1.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0), 1);

        let mut cell2 = Cell::new("cell2");
        cell2.add_ref(CellRef::new("cell1"));

        lib.add_cell(cell1).unwrap();
        lib.add_cell(cell2).unwrap();

        assert_eq!(lib.cells().len(), 2);
        assert!(lib.cell("cell1").is_some());
        assert!(lib.cell("cell2").is_some());
        assert_eq!(lib.top_cell().unwrap().name(), "cell2");
    }

    #[test]
    fn test_add_cell_duplicate_rejected() {
        let mut lib = Library::new("test_lib");
        lib.add_cell(Cell::new("cell1")).unwrap();
        let err = lib.add_cell(Cell::new("cell1")).unwrap_err();
        assert!(matches!(err, CellNameError::AlreadyExists { .. }));
    }

    #[test]
    fn test_add_cell_invalid_name_rejected() {
        let mut lib = Library::new("test_lib");
        let cell = Cell::new("has space");
        let err = lib.add_cell(cell).unwrap_err();
        assert!(matches!(err, CellNameError::InvalidCharacter { .. }));
    }

    #[test]
    fn test_rename_cell_validates() {
        let mut lib = Library::new("test_lib");
        lib.add_cell(Cell::new("cell1")).unwrap();

        // Valid rename
        assert!(lib.rename_cell("cell1", "cell2").unwrap());

        // Rename to invalid name
        let err = lib.rename_cell("cell2", "has space").unwrap_err();
        assert!(matches!(err, CellNameError::InvalidCharacter { .. }));

        // Rename to too-long name
        let long = "a".repeat(33);
        let err = lib.rename_cell("cell2", &long).unwrap_err();
        assert!(matches!(err, CellNameError::TooLong { .. }));
    }

    #[test]
    fn test_rename_cell_duplicate_rejected() {
        let mut lib = Library::new("test_lib");
        lib.add_cell(Cell::new("cell1")).unwrap();
        lib.add_cell(Cell::new("cell2")).unwrap();

        let err = lib.rename_cell("cell1", "cell2").unwrap_err();
        assert!(matches!(err, CellNameError::AlreadyExists { .. }));
    }

    #[test]
    fn test_rename_cell_same_name_ok() {
        let mut lib = Library::new("test_lib");
        lib.add_cell(Cell::new("cell1")).unwrap();

        // Renaming to same name should succeed (no-op)
        assert!(lib.rename_cell("cell1", "cell1").unwrap());
    }

    #[test]
    fn test_add_path() {
        let mut cell = Cell::new("test");
        let points = vec![
            Point::new(0.0, 0.0),
            Point::new(10.0, 0.0),
            Point::new(10.0, 10.0),
        ];
        cell.add_path(points.clone(), 0.5, Layer::new(1, 0), PathEndType::Flush);

        assert_eq!(cell.path_count(), 1);

        let paths: Vec<_> = cell.paths().collect();
        assert_eq!(paths.len(), 1);
        assert_eq!(paths[0].0.len(), 3);
        assert!((paths[0].1 - 0.5).abs() < 1e-10);
        assert_eq!(paths[0].2.number, 1);
        assert_eq!(paths[0].3, PathEndType::Flush);
    }

    #[test]
    fn test_add_path_simple() {
        let mut cell = Cell::new("test");
        let points = vec![Point::new(0.0, 0.0), Point::new(100.0, 0.0)];
        cell.add_path_simple(points, 1.0, 1);

        assert_eq!(cell.path_count(), 1);
    }

    #[test]
    fn test_path_end_types() {
        let mut cell = Cell::new("test");
        let points = vec![Point::new(0.0, 0.0), Point::new(10.0, 0.0)];

        cell.add_path(points.clone(), 0.5, 1, PathEndType::Flush);
        cell.add_path(points.clone(), 0.5, 1, PathEndType::Round);
        cell.add_path(points.clone(), 0.5, 1, PathEndType::HalfWidthExtension);

        assert_eq!(cell.path_count(), 3);
    }

    #[test]
    fn test_add_text() {
        let mut cell = Cell::new("test");
        cell.add_text("Hello", Point::new(5.0, 5.0), Layer::new(10, 0));

        assert_eq!(cell.text_count(), 1);

        let texts: Vec<_> = cell.texts().collect();
        assert_eq!(texts.len(), 1);
        assert_eq!(texts[0].0, "Hello");
        assert!((texts[0].1.x - 5.0).abs() < 1e-10);
        assert!((texts[0].1.y - 5.0).abs() < 1e-10);
        assert_eq!(texts[0].2.number, 10);
        assert!((texts[0].3 - 1.0).abs() < 1e-10); // default height
    }

    #[test]
    fn test_add_text_with_height() {
        let mut cell = Cell::new("test");
        cell.add_text_with_height("Big", Point::new(0.0, 0.0), Layer::new(10, 0), 5.0);

        let texts: Vec<_> = cell.texts().collect();
        assert_eq!(texts.len(), 1);
        assert!((texts[0].3 - 5.0).abs() < 1e-10);
    }

    #[test]
    fn test_mixed_elements() {
        let mut cell = Cell::new("test");

        // Add various element types
        cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0), 1);
        cell.add_ref(CellRef::new("other"));
        cell.add_path_simple(vec![Point::origin(), Point::new(10.0, 0.0)], 0.5, 1);
        cell.add_text("Label", Point::new(5.0, 5.0), 10);

        assert_eq!(cell.polygon_count(), 1);
        assert_eq!(cell.ref_count(), 1);
        assert_eq!(cell.path_count(), 1);
        assert_eq!(cell.text_count(), 1);
        assert_eq!(cell.elements().len(), 4);
    }

    #[test]
    fn test_remove_element() {
        let mut cell = Cell::new("test");
        cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0), 1);
        cell.add_polygon(Polygon::rect(Point::new(20.0, 0.0), 5.0, 5.0), 1);
        cell.add_polygon(Polygon::rect(Point::new(30.0, 0.0), 3.0, 3.0), 1);

        assert_eq!(cell.polygon_count(), 3);

        // Remove middle element
        let removed = cell.remove_element(1);
        assert!(removed.is_some());
        assert_eq!(cell.polygon_count(), 2);

        // Remove first element
        let removed = cell.remove_element(0);
        assert!(removed.is_some());
        assert_eq!(cell.polygon_count(), 1);

        // Try to remove out of bounds
        let removed = cell.remove_element(10);
        assert!(removed.is_none());
        assert_eq!(cell.polygon_count(), 1);
    }
}

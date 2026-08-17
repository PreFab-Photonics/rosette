//! Cell hierarchy for layout.
//!
//! A [`Cell`] is a container for geometry that can reference other cells,
//! enabling hierarchical layout design.

use crate::error::{
    CellRefValidationReason, CellValidationError, LibraryError, PathValidationReason,
    PolygonValidationReason, RepetitionValidationReason, TextValidationReason,
};
use crate::geometry::{BBox, Point, Polygon, Transform, Vector2};
use crate::layer::Layer;
use crate::path::stroke_path;
use crate::port::Port;
use std::collections::{HashMap, HashSet};

/// GDS path end type.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
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
/// Defines an N×M grid of copies placed along two arbitrary lattice
/// vectors. The vectors are *pitches* (center-to-center displacement
/// between adjacent copies) expressed in the CellRef's local
/// coordinate space — i.e. before the CellRef's own transform is
/// applied. The CellRef's linear transform (rotation, mirror, scale)
/// then rotates/scales those pitch vectors into the parent cell's
/// frame.
///
/// The vectors may be arbitrary — they need not be orthogonal, allowing
/// hex packings or skewed test arrays. For axis-aligned rectangular
/// grids (the common case), use [`Repetition::new`] with scalar
/// spacings; it is a convenience over [`Repetition::new_vectors`] that
/// builds `col_vector = (col_spacing, 0)` and
/// `row_vector = (0, row_spacing)`.
///
/// Pitch, not gap: to tile copies edge-to-edge in a rectangular grid,
/// pass `col_spacing = child_bbox.width` (not `0`), and analogously
/// for rows.
///
/// Negative spacings (or negative vector components) are permitted
/// and place copies in the opposite direction along that axis, which
/// is well-defined in GDS AREFs. For example, `col_spacing = -10.0`
/// lays copies out along local −X rather than local +X.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Repetition {
    /// Number of columns (copies along `col_vector`). Must be >= 1.
    pub columns: u16,
    /// Number of rows (copies along `row_vector`). Must be >= 1.
    pub rows: u16,
    /// Column displacement vector: local-space pitch between adjacent
    /// copies along the column direction.
    pub col_vector: Vector2,
    /// Row displacement vector: local-space pitch between adjacent
    /// copies along the row direction.
    pub row_vector: Vector2,
}

impl Repetition {
    pub(crate) fn validation_error(&self) -> Option<RepetitionValidationReason> {
        if self.columns == 0 {
            return Some(RepetitionValidationReason::ZeroColumns);
        }
        if self.rows == 0 {
            return Some(RepetitionValidationReason::ZeroRows);
        }
        if !self.col_vector.is_finite() {
            return Some(RepetitionValidationReason::NonFiniteColumnVector);
        }
        if !self.row_vector.is_finite() {
            return Some(RepetitionValidationReason::NonFiniteRowVector);
        }
        None
    }

    /// Create a new axis-aligned rectangular grid repetition.
    ///
    /// Equivalent to
    /// [`new_vectors`](Self::new_vectors)`(columns, rows,
    /// Vector2::new(col_spacing, 0.0), Vector2::new(0.0, row_spacing))`.
    pub fn new(columns: u16, rows: u16, col_spacing: f64, row_spacing: f64) -> Self {
        Self::new_vectors(
            columns,
            rows,
            Vector2::new(col_spacing, 0.0),
            Vector2::new(0.0, row_spacing),
        )
    }

    /// Create a new grid repetition from arbitrary column and row vectors.
    ///
    /// Use this for hex packings or any skewed / non-orthogonal lattice.
    /// Vectors are defined in the CellRef's local (pre-transform) space.
    pub fn new_vectors(columns: u16, rows: u16, col_vector: Vector2, row_vector: Vector2) -> Self {
        let repetition = Self {
            columns,
            rows,
            col_vector,
            row_vector,
        };
        assert!(
            repetition.validation_error().is_none(),
            "Repetition dimensions must be nonzero and vectors must be finite"
        );
        repetition
    }

    /// Whether this is a trivial (non-arrayed) single instance.
    pub fn is_single(&self) -> bool {
        self.columns <= 1 && self.rows <= 1
    }

    /// Total number of copies in the array.
    pub fn count(&self) -> usize {
        self.columns as usize * self.rows as usize
    }

    /// Offset of the copy at grid position `(col, row)` in the
    /// CellRef's local coordinate space.
    pub fn copy_offset(&self, col: u16, row: u16) -> Vector2 {
        self.col_vector * col as f64 + self.row_vector * row as f64
    }
}

/// A reference to another cell with transformation.
#[derive(Debug, Clone)]
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
    pub(crate) fn validation_error(&self) -> Option<CellRefValidationReason> {
        if self.cell_name.is_empty() {
            return Some(CellRefValidationReason::EmptyTarget);
        }
        if !self.transform.is_finite() {
            return Some(CellRefValidationReason::NonFiniteTransform);
        }
        if !self.transform.is_invertible() {
            return Some(CellRefValidationReason::SingularTransform);
        }
        None
    }

    fn assert_valid(&self) {
        assert!(
            self.validation_error().is_none(),
            "CellRef requires a nonempty target and a finite, invertible transform"
        );
        assert!(
            self.repetition
                .is_none_or(|repetition| repetition.validation_error().is_none()),
            "CellRef repetition must have nonzero dimensions and finite vectors"
        );
    }

    /// Create a new cell reference.
    pub fn new(cell_name: impl Into<String>) -> Self {
        let cell_ref = Self {
            cell_name: cell_name.into(),
            transform: Transform::identity(),
            repetition: None,
        };
        cell_ref.assert_valid();
        cell_ref
    }

    /// Create a cell reference with transformation.
    pub fn with_transform(cell_name: impl Into<String>, transform: Transform) -> Self {
        let cell_ref = Self {
            cell_name: cell_name.into(),
            transform,
            repetition: None,
        };
        cell_ref.assert_valid();
        cell_ref
    }

    /// Set the position (translation).
    pub fn at(mut self, x: f64, y: f64) -> Self {
        self.assert_valid();
        assert!(
            x.is_finite() && y.is_finite(),
            "CellRef position must be finite"
        );
        self.transform = Transform::translate(x, y).then(&self.transform);
        self.assert_valid();
        self
    }

    /// Rotate by angle (in radians).
    ///
    /// Rotation is applied after any previous transformations.
    pub fn rotate(mut self, angle: f64) -> Self {
        self.assert_valid();
        assert!(angle.is_finite(), "CellRef rotation must be finite");
        self.transform = Transform::rotate(angle).then(&self.transform);
        self.assert_valid();
        self
    }

    /// Mirror across X axis.
    pub fn mirror_x(mut self) -> Self {
        self.assert_valid();
        self.transform = Transform::mirror_x().then(&self.transform);
        self.assert_valid();
        self
    }

    /// Mirror across Y axis.
    pub fn mirror_y(mut self) -> Self {
        self.assert_valid();
        self.transform = Transform::mirror_y().then(&self.transform);
        self.assert_valid();
        self
    }

    /// Scale uniformly.
    pub fn scale(mut self, s: f64) -> Self {
        self.assert_valid();
        assert!(
            s.is_finite() && s != 0.0,
            "CellRef scale must be finite and nonzero"
        );
        self.transform = Transform::scale_uniform(s).then(&self.transform);
        self.assert_valid();
        self
    }

    /// Set or clear the optional array repetition.
    pub fn with_repetition(mut self, repetition: Option<Repetition>) -> Self {
        self.assert_valid();
        assert!(
            repetition.is_none_or(|repetition| repetition.validation_error().is_none()),
            "CellRef repetition must have nonzero dimensions and finite vectors"
        );
        self.repetition = repetition;
        self
    }

    /// Set array repetition parameters (GDS AREF) as an axis-aligned
    /// rectangular grid.
    ///
    /// `col_spacing` and `row_spacing` are **pitches** — the
    /// center-to-center distance between adjacent copies, in the
    /// CellRef's local coordinate space. See [`Repetition`].
    ///
    /// Negative spacings are allowed and place copies in the opposite
    /// direction along that axis (e.g. `col_spacing = -10.0` lays the
    /// grid out along local −X).
    ///
    /// For hex or skewed lattices use
    /// [`array_vectors`](Self::array_vectors) instead.
    pub fn array(mut self, columns: u16, rows: u16, col_spacing: f64, row_spacing: f64) -> Self {
        self = self.with_repetition(Some(Repetition::new(
            columns,
            rows,
            col_spacing,
            row_spacing,
        )));
        self
    }

    /// Set array repetition parameters (GDS AREF) from arbitrary column
    /// and row displacement vectors.
    ///
    /// This is the lower-level constructor that allows non-orthogonal
    /// (e.g. hex) lattices. Vectors are defined in the CellRef's local
    /// (pre-transform) space. See [`Repetition`].
    pub fn array_vectors(
        mut self,
        columns: u16,
        rows: u16,
        col_vector: Vector2,
        row_vector: Vector2,
    ) -> Self {
        self = self.with_repetition(Some(Repetition::new_vectors(
            columns, rows, col_vector, row_vector,
        )));
        self
    }
}

/// A cell containing geometry and references to other cells.
#[derive(Debug, Clone)]
pub struct Cell {
    /// Name of the cell.
    name: String,
    /// Elements in the cell.
    elements: Vec<Element>,
    /// Ports defined on the cell.
    ports: Vec<Port>,
}

fn validate_element(element_index: usize, element: &Element) -> Result<(), CellValidationError> {
    match element {
        Element::Polygon { polygon, .. } => {
            if polygon.vertices().len() < 3 {
                return Err(CellValidationError::InvalidPolygon {
                    element_index,
                    reason: PolygonValidationReason::TooFewVertices {
                        count: polygon.vertices().len(),
                    },
                });
            }
            if let Some(vertex_index) = polygon
                .vertices()
                .iter()
                .position(|vertex| !vertex.is_finite())
            {
                return Err(CellValidationError::InvalidPolygon {
                    element_index,
                    reason: PolygonValidationReason::NonFiniteVertex { vertex_index },
                });
            }
        }
        Element::Path { points, width, .. } => {
            if points.len() < 2 {
                return Err(CellValidationError::InvalidPath {
                    element_index,
                    reason: PathValidationReason::TooFewPoints {
                        count: points.len(),
                    },
                });
            }
            if let Some(point_index) = points.iter().position(|point| !point.is_finite()) {
                return Err(CellValidationError::InvalidPath {
                    element_index,
                    reason: PathValidationReason::NonFinitePoint { point_index },
                });
            }
            if !width.is_finite() {
                return Err(CellValidationError::InvalidPath {
                    element_index,
                    reason: PathValidationReason::NonFiniteWidth,
                });
            }
            if *width == 0.0 {
                return Err(CellValidationError::InvalidPath {
                    element_index,
                    reason: PathValidationReason::ZeroWidth,
                });
            }
        }
        Element::CellRef(cell_ref) => {
            if let Some(reason) = cell_ref.validation_error() {
                return Err(CellValidationError::InvalidCellRef {
                    element_index,
                    reason,
                });
            }
            if let Some(reason) = cell_ref
                .repetition
                .as_ref()
                .and_then(Repetition::validation_error)
            {
                return Err(CellValidationError::InvalidRepetition {
                    element_index,
                    reason,
                });
            }
        }
        Element::Text {
            position, height, ..
        } => {
            if !position.is_finite() {
                return Err(CellValidationError::InvalidText {
                    element_index,
                    reason: TextValidationReason::NonFinitePosition,
                });
            }
            if !height.is_finite() {
                return Err(CellValidationError::InvalidText {
                    element_index,
                    reason: TextValidationReason::NonFiniteHeight,
                });
            }
            if *height <= 0.0 {
                return Err(CellValidationError::InvalidText {
                    element_index,
                    reason: TextValidationReason::NonPositiveHeight,
                });
            }
        }
    }
    Ok(())
}

fn validate_port(port_index: usize, port: &Port) -> Result<(), CellValidationError> {
    match port.validation_error() {
        Some(reason) => Err(CellValidationError::InvalidPort { port_index, reason }),
        None => Ok(()),
    }
}

impl Cell {
    /// Create a new empty cell.
    pub fn new(name: impl Into<String>) -> Self {
        Self {
            name: name.into(),
            elements: Vec::new(),
            ports: Vec::new(),
        }
    }

    /// Validate all local invariants without resolving hierarchy references.
    ///
    /// Missing reference targets and reference cycles are representable and do
    /// not make a cell locally invalid.
    pub fn validate(&self) -> Result<(), CellValidationError> {
        if self.name.is_empty() {
            return Err(CellValidationError::EmptyCellName);
        }
        for (element_index, element) in self.elements.iter().enumerate() {
            validate_element(element_index, element)?;
        }

        let mut port_names = HashMap::with_capacity(self.ports.len());
        for (port_index, port) in self.ports.iter().enumerate() {
            validate_port(port_index, port)?;
            if let Some(first_index) = port_names.insert(port.name.as_str(), port_index) {
                return Err(CellValidationError::DuplicatePortName {
                    name: port.name.clone(),
                    first_index,
                    duplicate_index: port_index,
                });
            }
        }

        Ok(())
    }

    /// Get the cell name.
    pub fn name(&self) -> &str {
        &self.name
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

    /// Add a polygon to the cell.
    pub fn add_polygon(&mut self, polygon: Polygon, layer: impl Into<Layer>) {
        let element = Element::Polygon {
            polygon,
            layer: layer.into(),
        };
        validate_element(self.elements.len(), &element).expect("invalid polygon element");
        self.elements.push(element);
    }

    /// Add a cell reference.
    pub fn add_ref(&mut self, cell_ref: CellRef) {
        let element = Element::CellRef(cell_ref);
        validate_element(self.elements.len(), &element).expect("invalid cell reference");
        self.elements.push(element);
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
        let element = Element::Path {
            points,
            width,
            layer: layer.into(),
            end_type,
        };
        validate_element(self.elements.len(), &element).expect("invalid path element");
        self.elements.push(element);
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
        let element = Element::Text {
            text: text.into(),
            position,
            layer: layer.into(),
            height,
        };
        validate_element(self.elements.len(), &element).expect("invalid text element");
        self.elements.push(element);
    }

    /// Add a port.
    pub fn add_port(&mut self, port: Port) {
        validate_port(self.ports.len(), &port).expect("invalid port");
        assert!(
            self.ports.iter().all(|existing| existing.name != port.name),
            "Port names must be unique within a cell"
        );
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

    /// Calculate the bounding box of the geometry directly stored in this cell.
    ///
    /// Includes polygons and paths. Does **not** resolve cell references
    /// (SREFs or AREFs) — use [`crate::hierarchy::cell_bbox`] for the fully
    /// resolved bbox of a cell inside a library. Text labels are not included
    /// because their rendered extent depends on the renderer.
    pub fn bbox(&self) -> Option<BBox> {
        let mut result: Option<BBox> = None;
        for (polygon, _) in self.polygons() {
            let poly_bbox = polygon.bbox();
            result = Some(match result {
                Some(existing) => existing.merge(&poly_bbox),
                None => poly_bbox,
            });
        }
        for (points, width, _, end_type) in self.paths() {
            if let Some(ribbon) = stroke_path(points, width, end_type) {
                let path_bbox = ribbon.bbox();
                result = Some(match result {
                    Some(existing) => existing.merge(&path_bbox),
                    None => path_bbox,
                });
            }
        }
        result
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

    /// Transactionally edit one element.
    ///
    /// The original element is left untouched if validation fails or `edit`
    /// panics.
    pub fn edit_element<R>(
        &mut self,
        index: usize,
        edit: impl FnOnce(&mut Element) -> R,
    ) -> Result<R, CellValidationError> {
        let Some(element) = self.elements.get(index) else {
            return Err(CellValidationError::ElementIndexOutOfBounds {
                index,
                len: self.elements.len(),
            });
        };
        let mut candidate = element.clone();
        let result = edit(&mut candidate);
        validate_element(index, &candidate)?;
        self.elements[index] = candidate;
        Ok(result)
    }

    /// Transactionally edit all elements without changing their cardinality.
    ///
    /// The originals are left untouched if validation fails or `edit` panics.
    pub fn edit_elements<R>(
        &mut self,
        edit: impl FnOnce(&mut [Element]) -> R,
    ) -> Result<R, CellValidationError> {
        let mut candidates = self.elements.clone();
        let result = edit(&mut candidates);
        for (element_index, element) in candidates.iter().enumerate() {
            validate_element(element_index, element)?;
        }
        self.elements = candidates;
        Ok(result)
    }

    /// Transactionally edit every port without changing port cardinality.
    ///
    /// The originals are left untouched if any candidate is invalid or if
    /// the edit creates duplicate names.
    pub fn edit_ports<R>(
        &mut self,
        edit: impl FnOnce(&mut [Port]) -> R,
    ) -> Result<R, CellValidationError> {
        let mut candidates = self.ports.clone();
        let result = edit(&mut candidates);
        let mut names = HashMap::with_capacity(candidates.len());
        for (port_index, port) in candidates.iter().enumerate() {
            validate_port(port_index, port)?;
            if let Some(first_index) = names.insert(port.name.as_str(), port_index) {
                return Err(CellValidationError::DuplicatePortName {
                    name: port.name.clone(),
                    first_index,
                    duplicate_index: port_index,
                });
            }
        }
        self.ports = candidates;
        Ok(result)
    }

    /// Remove every element from this cell.
    pub fn clear_elements(&mut self) {
        self.elements.clear();
    }
}

/// A library containing multiple cells.
#[derive(Debug, Clone, Default)]
pub struct Library {
    /// Name of the library.
    name: String,
    /// Cells in the library.
    cells: Vec<Cell>,
    /// Explicit entry cell selected by the caller.
    ///
    /// Versioned persistence belongs to `rosette-io`.
    explicit_top: Option<String>,
}

/// How insertion handles a cell whose identity already exists.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum DuplicatePolicy {
    /// Reject the insertion.
    Error,
    /// Keep the existing definition and ignore the incoming definition.
    KeepExisting,
}

impl Library {
    /// Create a new library.
    pub fn new(name: impl Into<String>) -> Self {
        Self {
            name: name.into(),
            cells: Vec::new(),
            explicit_top: None,
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

    /// Transactionally update every cell without exposing mutable identities.
    ///
    /// Cell identities are restored after each edit. No changes are committed
    /// if any candidate is invalid or `edit` panics.
    pub fn edit_cells(&mut self, mut edit: impl FnMut(&mut Cell)) -> Result<(), LibraryError> {
        let mut candidates = self.cells.clone();
        for candidate in &mut candidates {
            let identity = candidate.name.clone();
            edit(candidate);
            candidate.set_name_unchecked(identity);
        }
        for candidate in &candidates {
            candidate
                .validate()
                .map_err(|source| LibraryError::InvalidCell {
                    name: candidate.name.clone(),
                    source,
                })?;
        }
        let mut names = HashSet::with_capacity(candidates.len());
        for candidate in &candidates {
            if !names.insert(candidate.name()) {
                return Err(LibraryError::AlreadyExists {
                    name: candidate.name().to_string(),
                });
            }
        }
        self.cells = candidates;
        Ok(())
    }

    /// Insert a cell using an explicit duplicate policy.
    ///
    /// # Errors
    /// Returns [`LibraryError::AlreadyExists`] if a cell with the same name
    /// already exists, or [`LibraryError::InvalidCell`] for malformed input.
    pub fn insert_cell(
        &mut self,
        cell: Cell,
        duplicates: DuplicatePolicy,
    ) -> Result<bool, LibraryError> {
        cell.validate()
            .map_err(|source| LibraryError::InvalidCell {
                name: cell.name.clone(),
                source,
            })?;
        if self.cells.iter().any(|c| c.name() == cell.name()) {
            return match duplicates {
                DuplicatePolicy::Error => Err(LibraryError::AlreadyExists {
                    name: cell.name().to_string(),
                }),
                DuplicatePolicy::KeepExisting => Ok(false),
            };
        }
        self.cells.push(cell);
        Ok(true)
    }

    /// Add a cell to the library, rejecting duplicate identities.
    ///
    /// This convenience method is equivalent to
    /// `insert_cell(cell, DuplicatePolicy::Error)`.
    pub fn add_cell(&mut self, cell: Cell) -> Result<(), LibraryError> {
        self.insert_cell(cell, DuplicatePolicy::Error).map(|_| ())
    }

    /// Check if the library contains a cell with the given name.
    pub fn contains(&self, name: &str) -> bool {
        self.cells.iter().any(|c| c.name() == name)
    }

    /// Get a cell by name.
    pub fn cell(&self, name: &str) -> Option<&Cell> {
        self.cells.iter().find(|c| c.name() == name)
    }

    /// Transactionally update one cell without exposing its mutable identity.
    ///
    /// The original is left untouched if the candidate is invalid or `edit`
    /// panics.
    pub fn edit_cell<R>(
        &mut self,
        name: &str,
        edit: impl FnOnce(&mut Cell) -> R,
    ) -> Result<R, LibraryError> {
        let index = self
            .cells
            .iter()
            .position(|cell| cell.name() == name)
            .ok_or_else(|| LibraryError::CellNotFound {
                name: name.to_string(),
            })?;
        let identity = self.cells[index].name.clone();
        let mut candidate = self.cells[index].clone();
        let result = edit(&mut candidate);
        candidate.set_name_unchecked(identity.clone());
        candidate
            .validate()
            .map_err(|source| LibraryError::InvalidCell {
                name: identity,
                source,
            })?;
        self.cells[index] = candidate;
        Ok(result)
    }

    /// Validate cell identities and every cell's local invariants.
    ///
    /// This intentionally does not require reference targets to exist and does
    /// not reject hierarchy cycles.
    pub fn validate(&self) -> Result<(), LibraryError> {
        let mut names = HashSet::with_capacity(self.cells.len());
        for cell in &self.cells {
            cell.validate()
                .map_err(|source| LibraryError::InvalidCell {
                    name: cell.name.clone(),
                    source,
                })?;
            if !names.insert(cell.name()) {
                return Err(LibraryError::AlreadyExists {
                    name: cell.name().to_string(),
                });
            }
        }
        Ok(())
    }

    /// Return graph-derived root cells in deterministic library order.
    ///
    /// A root is a cell that is not referenced by any other cell in the
    /// library. Missing reference targets do not affect the result. A closed
    /// reference cycle may therefore have no roots.
    pub fn roots(&self) -> Vec<&Cell> {
        let referenced: HashSet<&str> = self
            .cells
            .iter()
            .flat_map(Cell::cell_refs)
            .map(|cell_ref| cell_ref.cell_name.as_str())
            .collect();
        self.cells
            .iter()
            .filter(|cell| !referenced.contains(cell.name()))
            .collect()
    }

    /// Get the selected top cell.
    ///
    /// An explicit selection takes precedence. Without one, the sole
    /// graph-derived root is returned; empty, multi-root, and rootless cyclic
    /// libraries return `None`.
    pub fn top_cell(&self) -> Option<&Cell> {
        if let Some(name) = &self.explicit_top {
            return self.cell(name);
        }
        let mut roots = self.roots().into_iter();
        let root = roots.next()?;
        roots.next().is_none().then_some(root)
    }

    /// Get the explicitly selected top cell, if any.
    pub fn explicit_top_cell(&self) -> Option<&Cell> {
        self.explicit_top
            .as_deref()
            .and_then(|name| self.cell(name))
    }

    /// Select an existing cell as the library's top entry cell.
    ///
    /// The selected cell may be a non-root when callers intentionally want to
    /// operate on a hierarchy subtree.
    pub fn set_top_cell(&mut self, name: &str) -> Result<(), LibraryError> {
        if !self.contains(name) {
            return Err(LibraryError::CellNotFound {
                name: name.to_string(),
            });
        }
        self.explicit_top = Some(name.to_string());
        Ok(())
    }

    /// Clear the explicit top selection and restore unique-root inference.
    pub fn clear_top_cell(&mut self) {
        self.explicit_top = None;
    }

    /// Rename a cell in the library.
    ///
    /// Returns `true` if the cell was found and renamed, `false` if
    /// no cell with `old_name` exists.
    /// Also updates any `CellRef` elements in other cells that reference the
    /// old name.
    ///
    /// # Errors
    /// Returns [`LibraryError`] if the new identity is empty or already taken.
    pub fn rename_cell(&mut self, old_name: &str, new_name: &str) -> Result<bool, LibraryError> {
        if new_name.is_empty() {
            return Err(LibraryError::EmptyCellName);
        }
        if !self.contains(old_name) {
            return Ok(false);
        }

        // Prevent rename to an existing name (unless it's the same cell)
        if old_name != new_name && self.contains(new_name) {
            return Err(LibraryError::AlreadyExists {
                name: new_name.to_string(),
            });
        }
        for cell in &mut self.cells {
            if cell.name() == old_name {
                // Name already validated above, skip re-validation
                cell.set_name_unchecked(new_name);
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
        if self.explicit_top.as_deref() == Some(old_name) {
            self.explicit_top = Some(new_name.to_string());
        }
        Ok(true)
    }

    /// Remove an unreferenced cell from the library by name.
    ///
    /// References owned by the removed cell itself do not prevent removal.
    ///
    /// # Errors
    /// Returns [`LibraryError::CellReferenced`] when another cell references
    /// the requested cell.
    pub fn remove_cell(&mut self, name: &str) -> Result<bool, LibraryError> {
        if !self.contains(name) {
            return Ok(false);
        }
        let referenced_by: Vec<String> = self
            .cells
            .iter()
            .filter(|cell| cell.name() != name)
            .filter(|cell| cell.cell_refs().any(|cell_ref| cell_ref.cell_name == name))
            .map(|cell| cell.name().to_string())
            .collect();
        if !referenced_by.is_empty() {
            return Err(LibraryError::CellReferenced {
                name: name.to_string(),
                referenced_by,
            });
        }

        let len = self.cells.len();
        self.cells.retain(|c| c.name() != name);
        let removed = self.cells.len() < len;
        if removed && self.explicit_top.as_deref() == Some(name) {
            self.explicit_top = None;
        }
        Ok(removed)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::error::LibraryError;
    use crate::geometry::{Point, Vector2};
    use proptest::prelude::*;

    proptest! {
        #[test]
        fn public_builders_preserve_cell_invariants(
            x in -1.0e6_f64..1.0e6,
            y in -1.0e6_f64..1.0e6,
            size in 1.0e-6_f64..1.0e3,
            angle in -std::f64::consts::TAU..std::f64::consts::TAU,
            columns in 1_u16..64,
            rows in 1_u16..64,
            absolute_width in any::<bool>(),
        ) {
            let width = if absolute_width { -size } else { size };
            let mut cell = Cell::new("generated");
            cell.add_polygon(Polygon::rect(Point::new(x, y), size, size), 1);
            cell.add_path(
                vec![Point::new(x, y), Point::new(x + size, y)],
                width,
                1,
                PathEndType::default(),
            );
            cell.add_text_with_height("label", Point::new(x, y), 2, size);
            cell.add_port(Port::with_width(
                "port",
                Point::new(x, y),
                Vector2::new(angle.cos(), angle.sin()),
                size,
            ));
            cell.add_ref(
                CellRef::new("child")
                    .at(x, y)
                    .rotate(angle)
                    .array(columns, rows, size, -size),
            );

            prop_assert_eq!(cell.validate(), Ok(()));
        }

        #[test]
        fn invalid_element_edits_are_atomic(width in 1.0e-6_f64..1.0e6) {
            let mut cell = Cell::new("generated");
            cell.add_path(
                vec![Point::origin(), Point::new(1.0, 0.0)],
                width,
                1,
                PathEndType::default(),
            );

            let result = cell.edit_element(0, |element| {
                let Element::Path { width, .. } = element else {
                    unreachable!();
                };
                *width = 0.0;
            });

            let rejected = matches!(result, Err(CellValidationError::InvalidPath { .. }));
            prop_assert!(rejected);
            prop_assert_eq!(cell.paths().next().unwrap().1, width);
            prop_assert_eq!(cell.validate(), Ok(()));
        }

        #[test]
        fn duplicate_library_insertions_are_atomic(name in "[A-Za-z][A-Za-z0-9_]{0,31}") {
            let mut library = Library::new("generated");
            library.add_cell(Cell::new(name.clone())).unwrap();

            let result = library.add_cell(Cell::new(name.clone()));

            let rejected = matches!(result, Err(LibraryError::AlreadyExists { .. }));
            prop_assert!(rejected);
            prop_assert_eq!(library.cells().len(), 1);
            prop_assert_eq!(library.cells()[0].name(), name);
            prop_assert_eq!(library.validate(), Ok(()));
        }
    }

    #[test]
    fn test_cell_new() {
        let cell = Cell::new("test_cell");
        assert_eq!(cell.name(), "test_cell");
        assert!(cell.elements().is_empty());
    }

    #[test]
    fn cell_validation_reports_polygon_and_path_reasons() {
        let mut cell = Cell::new("");
        assert_eq!(cell.validate(), Err(CellValidationError::EmptyCellName));

        cell.name = "bad_polygon".to_string();
        cell.elements.push(Element::Polygon {
            polygon: Polygon::new_unchecked(vec![Point::origin(), Point::new(1.0, 0.0)]),
            layer: Layer::new(1, 0),
        });
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidPolygon {
                element_index: 0,
                reason: PolygonValidationReason::TooFewVertices { count: 2 }
            })
        ));

        cell.elements[0] = Element::Polygon {
            polygon: Polygon::new_unchecked(vec![
                Point::origin(),
                Point::new(1.0, 0.0),
                Point::new(f64::NAN, 1.0),
            ]),
            layer: Layer::new(1, 0),
        };
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidPolygon {
                element_index: 0,
                reason: PolygonValidationReason::NonFiniteVertex { vertex_index: 2 }
            })
        ));

        cell.elements[0] = Element::Path {
            points: vec![Point::origin()],
            width: 1.0,
            layer: Layer::new(1, 0),
            end_type: PathEndType::Flush,
        };
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidPath {
                reason: PathValidationReason::TooFewPoints { count: 1 },
                ..
            })
        ));

        let Element::Path { points, .. } = &mut cell.elements[0] else {
            unreachable!();
        };
        points.push(Point::new(f64::INFINITY, 0.0));
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidPath {
                reason: PathValidationReason::NonFinitePoint { point_index: 1 },
                ..
            })
        ));

        cell.elements[0] = Element::Path {
            points: vec![Point::origin(), Point::new(1.0, 0.0)],
            width: f64::NAN,
            layer: Layer::new(1, 0),
            end_type: PathEndType::Flush,
        };
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidPath {
                reason: PathValidationReason::NonFiniteWidth,
                ..
            })
        ));
        let Element::Path { width, .. } = &mut cell.elements[0] else {
            unreachable!();
        };
        *width = 0.0;
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidPath {
                reason: PathValidationReason::ZeroWidth,
                ..
            })
        ));
    }

    #[test]
    fn cell_validation_reports_reference_repetition_and_text_reasons() {
        let mut cell = Cell::new("test");
        cell.elements.push(Element::CellRef(CellRef {
            cell_name: String::new(),
            transform: Transform::identity(),
            repetition: None,
        }));
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidCellRef {
                reason: CellRefValidationReason::EmptyTarget,
                ..
            })
        ));

        let Element::CellRef(cell_ref) = &mut cell.elements[0] else {
            unreachable!();
        };
        cell_ref.cell_name = "target".to_string();
        cell_ref.transform.tx = f64::NAN;
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidCellRef {
                reason: CellRefValidationReason::NonFiniteTransform,
                ..
            })
        ));

        let Element::CellRef(cell_ref) = &mut cell.elements[0] else {
            unreachable!();
        };
        cell_ref.transform = Transform::scale(0.0, 1.0);
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidCellRef {
                reason: CellRefValidationReason::SingularTransform,
                ..
            })
        ));

        let Element::CellRef(cell_ref) = &mut cell.elements[0] else {
            unreachable!();
        };
        cell_ref.transform = Transform::identity();
        cell_ref.repetition = Some(Repetition {
            columns: 0,
            rows: 1,
            col_vector: Vector2::unit_x(),
            row_vector: Vector2::unit_y(),
        });
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidRepetition {
                reason: RepetitionValidationReason::ZeroColumns,
                ..
            })
        ));

        let Element::CellRef(cell_ref) = &mut cell.elements[0] else {
            unreachable!();
        };
        cell_ref.repetition = Some(Repetition {
            columns: 1,
            rows: 1,
            col_vector: Vector2::new(f64::INFINITY, 0.0),
            row_vector: Vector2::new(0.0, 0.0),
        });
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidRepetition {
                reason: RepetitionValidationReason::NonFiniteColumnVector,
                ..
            })
        ));

        cell.elements[0] = Element::Text {
            text: String::new(),
            position: Point::new(f64::NAN, 0.0),
            layer: Layer::new(1, 0),
            height: 1.0,
        };
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidText {
                reason: TextValidationReason::NonFinitePosition,
                ..
            })
        ));
        let Element::Text {
            position, height, ..
        } = &mut cell.elements[0]
        else {
            unreachable!();
        };
        *position = Point::origin();
        *height = f64::INFINITY;
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidText {
                reason: TextValidationReason::NonFiniteHeight,
                ..
            })
        ));
        let Element::Text { height, .. } = &mut cell.elements[0] else {
            unreachable!();
        };
        *height = 0.0;
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidText {
                reason: TextValidationReason::NonPositiveHeight,
                ..
            })
        ));
    }

    #[test]
    fn cell_validation_reports_port_reasons() {
        let mut cell = Cell::new("test");
        cell.ports.push(Port {
            name: String::new(),
            position: Point::origin(),
            direction: Vector2::unit_x(),
            width: None,
        });
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidPort {
                port_index: 0,
                reason: crate::error::PortValidationReason::EmptyName
            })
        ));

        cell.ports[0].name = "p".to_string();
        cell.ports[0].position.x = f64::NAN;
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidPort {
                reason: crate::error::PortValidationReason::NonFinitePosition,
                ..
            })
        ));
        cell.ports[0].position = Point::origin();
        cell.ports[0].direction = Vector2::new(f64::NAN, 0.0);
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidPort {
                reason: crate::error::PortValidationReason::NonFiniteDirection,
                ..
            })
        ));
        cell.ports[0].direction = Vector2::new(0.0, 0.0);
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidPort {
                reason: crate::error::PortValidationReason::ZeroDirection,
                ..
            })
        ));
        cell.ports[0].direction = Vector2::new(2.0, 0.0);
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidPort {
                reason: crate::error::PortValidationReason::DirectionNotUnit,
                ..
            })
        ));
        cell.ports[0].direction = Vector2::unit_x();
        cell.ports[0].width = Some(f64::NAN);
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidPort {
                reason: crate::error::PortValidationReason::NonFiniteWidth,
                ..
            })
        ));
        cell.ports[0].width = Some(0.0);
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidPort {
                reason: crate::error::PortValidationReason::NonPositiveWidth,
                ..
            })
        ));

        cell.ports[0].width = Some(1.0);
        cell.ports.push(cell.ports[0].clone());
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::DuplicatePortName {
                first_index: 0,
                duplicate_index: 1,
                ..
            })
        ));
    }

    #[test]
    fn cell_validation_accepts_intentionally_degenerate_local_geometry() {
        let mut cell = Cell::new("valid");
        cell.add_polygon(
            Polygon::new(vec![
                Point::origin(),
                Point::origin(),
                Point::new(1.0, 1.0),
                Point::new(0.0, 1.0),
                Point::new(1.0, 0.0),
            ]),
            1,
        );
        cell.add_path(
            vec![Point::origin(), Point::new(1.0, 0.0)],
            -1.0,
            1,
            PathEndType::Flush,
        );
        cell.add_text_with_height("", Point::origin(), 1, 1.0);
        cell.add_ref(CellRef::new("missing").array_vectors(
            1,
            1,
            Vector2::new(0.0, 0.0),
            Vector2::new(-1.0, 0.0),
        ));

        assert!(cell.validate().is_ok());
        assert!(Cell::new("empty_but_valid").validate().is_ok());
    }

    #[test]
    fn cell_mutators_reject_before_committing_invalid_state() {
        let mut cell = Cell::new("test");
        assert!(
            std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
                cell.add_polygon(
                    Polygon::new_unchecked(vec![
                        Point::origin(),
                        Point::new(1.0, 0.0),
                        Point::new(f64::NAN, 1.0),
                    ]),
                    1,
                );
            }))
            .is_err()
        );
        assert!(cell.elements().is_empty());

        assert!(
            std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
                cell.add_path(vec![Point::origin()], 1.0, 1, PathEndType::default());
            }))
            .is_err()
        );
        assert!(
            std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
                cell.add_text_with_height("", Point::origin(), 1, 0.0);
            }))
            .is_err()
        );
        assert!(
            std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
                cell.add_ref(CellRef {
                    cell_name: String::new(),
                    transform: Transform::identity(),
                    repetition: None,
                });
            }))
            .is_err()
        );
        assert!(cell.elements().is_empty());

        let invalid_port = Port {
            name: "p".to_string(),
            position: Point::origin(),
            direction: Vector2::new(0.0, 0.0),
            width: None,
        };
        assert!(
            std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
                cell.add_port(invalid_port);
            }))
            .is_err()
        );
        assert!(cell.ports().is_empty());
        cell.add_port(Port::new("p", Point::origin(), Vector2::unit_x()));
        assert!(
            std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
                cell.add_port(Port::new("p", Point::origin(), Vector2::unit_y()));
            }))
            .is_err()
        );
        assert_eq!(cell.ports().len(), 1);
        assert!(cell.validate().is_ok());
    }

    #[test]
    fn test_add_polygon() {
        let mut cell = Cell::new("test");
        let rect = Polygon::rect(Point::origin(), 10.0, 5.0);
        cell.add_polygon(rect, Layer::new(1, 0));
        assert_eq!(cell.polygons().count(), 1);
    }

    #[test]
    fn test_add_ref() {
        let mut cell = Cell::new("top");
        cell.add_ref(CellRef::new("sub_cell").at(10.0, 20.0));
        assert_eq!(cell.cell_refs().count(), 1);
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
    fn test_bbox_includes_paths() {
        // A cell with only a path should have a non-None bbox and cover the
        // full ribbon extent (centerline width / 2 on each side).
        let mut cell = Cell::new("test");
        cell.add_path(
            vec![Point::new(0.0, 0.0), Point::new(10.0, 0.0)],
            2.0,
            1,
            PathEndType::Flush,
        );

        let bbox = cell.bbox().unwrap();
        assert!((bbox.min().x - 0.0).abs() < 1e-10);
        assert!((bbox.min().y - (-1.0)).abs() < 1e-10);
        assert!((bbox.max().x - 10.0).abs() < 1e-10);
        assert!((bbox.max().y - 1.0).abs() < 1e-10);
    }

    #[test]
    fn test_library_cell_bbox_sref() {
        // Parent with a single SREF to a child should report the child's
        // transformed bbox — NOT None, which was the pre-fix behavior.
        let mut child = Cell::new("child");
        child.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0), 1);

        let mut parent = Cell::new("parent");
        parent.add_ref(CellRef::new("child").at(20.0, 0.0));

        let mut lib = Library::new("lib");
        lib.add_cell(child).unwrap();
        lib.add_cell(parent).unwrap();

        let bbox = crate::hierarchy::cell_bbox(&lib, "parent").unwrap();
        assert!((bbox.min().x - 20.0).abs() < 1e-10);
        assert!((bbox.min().y - 0.0).abs() < 1e-10);
        assert!((bbox.max().x - 30.0).abs() < 1e-10);
        assert!((bbox.max().y - 5.0).abs() < 1e-10);
    }

    #[test]
    fn test_library_cell_bbox_aref() {
        // A 5x3 AREF of a 10x10 child at pitch (20, 20) should cover the
        // union of every copy, not just the prototype.
        let mut child = Cell::new("unit");
        child.add_polygon(Polygon::rect(Point::origin(), 10.0, 10.0), 1);

        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("unit").array(5, 3, 20.0, 20.0));

        let mut lib = Library::new("lib");
        lib.add_cell(child).unwrap();
        lib.add_cell(top).unwrap();

        let bbox = crate::hierarchy::cell_bbox(&lib, "top").unwrap();
        // Columns 0..=4 at x-pitch 20: last column origin at 80, width 10 → max x = 90.
        // Rows    0..=2 at y-pitch 20: last row origin at 40, height 10 → max y = 50.
        assert!((bbox.min().x - 0.0).abs() < 1e-10);
        assert!((bbox.min().y - 0.0).abs() < 1e-10);
        assert!((bbox.max().x - 90.0).abs() < 1e-10);
        assert!((bbox.max().y - 50.0).abs() < 1e-10);
    }

    #[test]
    fn test_repetition_accepts_negative_spacing() {
        // Negative pitches are documented to place copies in the
        // −X / −Y direction. copy_offset() must produce correspondingly
        // negative displacements, and the resolved bbox must extend into
        // the negative quadrant.
        let rep = Repetition::new(3, 2, -10.0, -15.0);
        // Corner copy at (col=2, row=1) → (−20, −15).
        let off = rep.copy_offset(2, 1);
        assert!((off.x - (-20.0)).abs() < 1e-12);
        assert!((off.y - (-15.0)).abs() < 1e-12);

        // End-to-end: same geometry as test_library_cell_bbox_aref but with
        // negated pitches — bbox should be the mirror image about the origin.
        let mut child = Cell::new("unit");
        child.add_polygon(Polygon::rect(Point::origin(), 10.0, 10.0), 1);

        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("unit").array(5, 3, -20.0, -20.0));

        let mut lib = Library::new("lib");
        lib.add_cell(child).unwrap();
        lib.add_cell(top).unwrap();

        let bbox = crate::hierarchy::cell_bbox(&lib, "top").unwrap();
        // Columns at x-pitch −20: last origin at −80, prototype extends +10 → min x = −80, max x = 10.
        // Rows    at y-pitch −20: last origin at −40, prototype extends +10 → min y = −40, max y = 10.
        assert!((bbox.min().x - (-80.0)).abs() < 1e-10);
        assert!((bbox.min().y - (-40.0)).abs() < 1e-10);
        assert!((bbox.max().x - 10.0).abs() < 1e-10);
        assert!((bbox.max().y - 10.0).abs() < 1e-10);
    }

    #[test]
    fn repetition_and_cell_ref_constructors_reject_invalid_inputs() {
        assert!(std::panic::catch_unwind(|| Repetition::new(0, 1, 1.0, 1.0)).is_err());
        assert!(std::panic::catch_unwind(|| Repetition::new(1, 0, 1.0, 1.0)).is_err());
        assert!(std::panic::catch_unwind(|| Repetition::new(1, 1, f64::NAN, 1.0)).is_err());
        assert!(
            std::panic::catch_unwind(|| {
                Repetition::new_vectors(1, 1, Vector2::unit_x(), Vector2::new(0.0, f64::INFINITY));
            })
            .is_err()
        );

        let repetition = Repetition::new(2, 3, 0.0, -4.0);
        assert_eq!(repetition.columns, 2);
        assert_eq!(repetition.rows, 3);
        assert_eq!(repetition.col_vector, Vector2::new(0.0, 0.0));
        assert_eq!(repetition.row_vector, Vector2::new(0.0, -4.0));

        assert!(std::panic::catch_unwind(|| CellRef::new("")).is_err());
        assert!(
            std::panic::catch_unwind(|| {
                CellRef::with_transform("target", Transform::scale(0.0, 1.0));
            })
            .is_err()
        );
        assert!(
            std::panic::catch_unwind(|| {
                CellRef::with_transform("target", Transform::translate(f64::NAN, 0.0));
            })
            .is_err()
        );
        assert!(std::panic::catch_unwind(|| CellRef::new("target").scale(0.0)).is_err());
        assert!(std::panic::catch_unwind(|| CellRef::new("target").scale(f64::NAN)).is_err());
        assert!(
            CellRef::new("target")
                .scale(1e-8)
                .validation_error()
                .is_none()
        );
        assert!(std::panic::catch_unwind(|| CellRef::new("target").at(f64::NAN, 0.0)).is_err());
        assert!(std::panic::catch_unwind(|| CellRef::new("target").rotate(f64::NAN)).is_err());

        let invalid_repetition = Repetition {
            columns: 0,
            rows: 1,
            col_vector: Vector2::new(0.0, 0.0),
            row_vector: Vector2::new(0.0, 0.0),
        };
        assert!(
            std::panic::catch_unwind(|| {
                CellRef::new("target").with_repetition(Some(invalid_repetition));
            })
            .is_err()
        );
        assert!(
            CellRef::new("target")
                .with_repetition(Some(repetition))
                .with_repetition(None)
                .repetition
                .is_none()
        );
    }

    #[test]
    fn deterministic_finite_constructions_remain_valid() {
        for columns in 1..=4 {
            for rows in 1..=4 {
                for pitch in [-10.0, -0.0, 0.0, 0.25, 10.0] {
                    let repetition = Repetition::new(columns, rows, pitch, -pitch);
                    assert!(repetition.validation_error().is_none());
                }
            }
        }

        let polygon = Polygon::rect(Point::new(-2.0, -1.0), 4.0, 2.0);
        for angle in [-3.0, -0.5, 0.0, 0.5, 3.0] {
            for scale in [-10.0, -0.25, 0.25, 10.0] {
                let cell_ref = CellRef::new("target")
                    .at(angle, scale)
                    .rotate(angle)
                    .scale(scale);
                assert!(cell_ref.validation_error().is_none());
                let transformed = polygon.try_transform(&cell_ref.transform).unwrap();
                assert!(transformed.vertices().iter().all(|point| point.is_finite()));
            }
        }
    }

    #[test]
    fn test_library_cell_bbox_rotated_sref() {
        // Rotating an asymmetric child 90° should rotate the bbox too.
        // Child: 20x5 rect at origin → bbox (0,0)-(20,5).
        // Rotate 90° about origin → bbox (-5,0)-(0,20).
        let mut child = Cell::new("asym");
        child.add_polygon(Polygon::rect(Point::origin(), 20.0, 5.0), 1);

        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("asym").rotate(std::f64::consts::FRAC_PI_2));

        let mut lib = Library::new("lib");
        lib.add_cell(child).unwrap();
        lib.add_cell(top).unwrap();

        let bbox = crate::hierarchy::cell_bbox(&lib, "top").unwrap();
        assert!((bbox.min().x - (-5.0)).abs() < 1e-9);
        assert!((bbox.min().y - 0.0).abs() < 1e-9);
        assert!((bbox.max().x - 0.0).abs() < 1e-9);
        assert!((bbox.max().y - 20.0).abs() < 1e-9);
    }

    #[test]
    fn library_cell_bbox_skips_polygon_transform_overflow() {
        let mut child = Cell::new("child");
        child.add_polygon(Polygon::rect(Point::new(1.0, 0.0), 1.0, 1.0), 1);

        let mut top = Cell::new("top");
        top.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), 1);
        top.add_ref(CellRef::with_transform(
            "child",
            Transform::scale_uniform(f64::MAX),
        ));

        let mut library = Library::new("library");
        library.add_cell(child).unwrap();
        library.add_cell(top).unwrap();

        let bbox = crate::hierarchy::cell_bbox(&library, "top").unwrap();
        assert_eq!(bbox.min(), Point::origin());
        assert_eq!(bbox.max(), Point::new(1.0, 1.0));
    }

    #[test]
    fn test_library_cell_bbox_nested() {
        // Nested hierarchy: unit < group (2x1 array of unit) < top (SREF of group at offset)
        let mut unit = Cell::new("unit");
        unit.add_polygon(Polygon::rect(Point::origin(), 5.0, 5.0), 1);

        let mut group = Cell::new("group");
        group.add_ref(CellRef::new("unit").array(2, 1, 10.0, 0.0));

        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("group").at(100.0, 50.0));

        let mut lib = Library::new("lib");
        lib.add_cell(unit).unwrap();
        lib.add_cell(group).unwrap();
        lib.add_cell(top).unwrap();

        let bbox = crate::hierarchy::cell_bbox(&lib, "top").unwrap();
        // group bbox: (0,0)-(15,5). Shifted by (100,50) → (100,50)-(115,55).
        assert!((bbox.min().x - 100.0).abs() < 1e-10);
        assert!((bbox.min().y - 50.0).abs() < 1e-10);
        assert!((bbox.max().x - 115.0).abs() < 1e-10);
        assert!((bbox.max().y - 55.0).abs() < 1e-10);
    }

    #[test]
    fn test_library_cell_bbox_mixed_local_and_ref() {
        // A cell that has both its own polygon and a ref should union them.
        let mut child = Cell::new("child");
        child.add_polygon(Polygon::rect(Point::origin(), 10.0, 10.0), 1);

        let mut top = Cell::new("top");
        top.add_polygon(Polygon::rect(Point::new(-5.0, -5.0), 5.0, 5.0), 1);
        top.add_ref(CellRef::new("child").at(20.0, 0.0));

        let mut lib = Library::new("lib");
        lib.add_cell(child).unwrap();
        lib.add_cell(top).unwrap();

        let bbox = crate::hierarchy::cell_bbox(&lib, "top").unwrap();
        assert!((bbox.min().x - (-5.0)).abs() < 1e-10);
        assert!((bbox.min().y - (-5.0)).abs() < 1e-10);
        assert!((bbox.max().x - 30.0).abs() < 1e-10);
        assert!((bbox.max().y - 10.0).abs() < 1e-10);
    }

    #[test]
    fn test_library_cell_bbox_rotated_aref_pitch_is_local() {
        // Regression test for ROS-517.
        //
        // An AREF's `col_spacing`/`row_spacing` is a pitch vector in the
        // CellRef's *local* (pre-transform) space. When the CellRef itself
        // carries a rotation, the pitch vector must be rotated into world
        // space — it is NOT a parent-frame translation. This must match the
        // GDS writer, which maps local `(col_spacing, 0)` and
        // `(0, row_spacing)` through the CellRef's linear transform.
        //
        // Setup: 2×1 array of a 5×5 child, pitch (10, 0), rotated 90° ccw.
        //
        // Local copies: (0,0)→(5,5) and (10,0)→(15,5) → local union (0,0)-(15,5).
        // Rotated 90° ccw about origin ((x,y)→(-y,x)):
        //   (0,0)   → ( 0,  0)
        //   (15,0)  → ( 0, 15)
        //   (15,5)  → (-5, 15)
        //   (0,5)   → (-5,  0)
        // World bbox: (-5, 0) .. (0, 15).
        //
        // If the translation were applied in the parent frame (the old buggy
        // behavior), copy 1 would land at parent (10, 0) and the bbox would
        // extend to x=10, which is what this test guards against.
        let mut unit = Cell::new("unit");
        unit.add_polygon(Polygon::rect(Point::origin(), 5.0, 5.0), 1);

        let mut top = Cell::new("top");
        top.add_ref(
            CellRef::new("unit")
                .rotate(std::f64::consts::FRAC_PI_2)
                .array(2, 1, 10.0, 0.0),
        );

        let mut lib = Library::new("lib");
        lib.add_cell(unit).unwrap();
        lib.add_cell(top).unwrap();

        let bbox = crate::hierarchy::cell_bbox(&lib, "top").unwrap();
        assert!(
            (bbox.min().x - (-5.0)).abs() < 1e-9,
            "min.x = {}",
            bbox.min().x
        );
        assert!(
            (bbox.min().y - 0.0).abs() < 1e-9,
            "min.y = {}",
            bbox.min().y
        );
        assert!(
            (bbox.max().x - 0.0).abs() < 1e-9,
            "max.x = {}",
            bbox.max().x
        );
        assert!(
            (bbox.max().y - 15.0).abs() < 1e-9,
            "max.y = {}",
            bbox.max().y
        );
    }

    #[test]
    fn test_hex_packed_aref_bbox() {
        // ROS-512: verify that a hex-packed AREF (non-orthogonal lattice
        // vectors) flattens to the expected bounding box.
        //
        // Setup: 3×2 grid of 1×1 unit cells with flat-top hex packing.
        //   col_vector = (pitch, 0)
        //   row_vector = (pitch/2, pitch * sqrt(3)/2)
        // Copies at grid (c, r) land at c * col + r * row:
        //   (0,0)→(0,        0      )
        //   (1,0)→(10,       0      )
        //   (2,0)→(20,       0      )
        //   (0,1)→(5,        8.6603 )
        //   (1,1)→(15,       8.6603 )
        //   (2,1)→(25,       8.6603 )
        // Each unit cell occupies (0,0)-(1,1), so the union bbox is
        //   (0, 0) .. (26, 9.6603).
        let mut unit = Cell::new("unit");
        unit.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), 1);

        let pitch: f64 = 10.0;
        let row_y = pitch * (3.0_f64).sqrt() / 2.0;

        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("unit").array_vectors(
            3,
            2,
            Vector2::new(pitch, 0.0),
            Vector2::new(pitch / 2.0, row_y),
        ));

        let mut lib = Library::new("lib");
        lib.add_cell(unit).unwrap();
        lib.add_cell(top).unwrap();

        let bbox = crate::hierarchy::cell_bbox(&lib, "top").unwrap();
        assert!(
            (bbox.min().x - 0.0).abs() < 1e-10,
            "min.x = {}",
            bbox.min().x
        );
        assert!(
            (bbox.min().y - 0.0).abs() < 1e-10,
            "min.y = {}",
            bbox.min().y
        );
        assert!(
            (bbox.max().x - (2.0 * pitch + pitch / 2.0 + 1.0)).abs() < 1e-10,
            "max.x = {}",
            bbox.max().x
        );
        assert!(
            (bbox.max().y - (row_y + 1.0)).abs() < 1e-10,
            "max.y = {}",
            bbox.max().y
        );
    }

    #[test]
    fn test_library_cell_bbox_missing_cell() {
        let lib = Library::new("lib");
        assert!(crate::hierarchy::cell_bbox(&lib, "does_not_exist").is_none());
    }

    #[test]
    fn test_library_cell_bbox_ref_to_missing_child() {
        // A CellRef to a cell not in the library is silently skipped (matches
        // the existing flatten.rs behavior).
        let mut top = Cell::new("top");
        top.add_polygon(Polygon::rect(Point::origin(), 10.0, 10.0), 1);
        top.add_ref(CellRef::new("nonexistent"));

        let mut lib = Library::new("lib");
        lib.add_cell(top).unwrap();

        let bbox = crate::hierarchy::cell_bbox(&lib, "top").unwrap();
        assert!((bbox.max().x - 10.0).abs() < 1e-10);
    }

    #[test]
    fn test_library_cell_bbox_cycle_guard() {
        // A cell that references itself should not cause infinite recursion;
        // cycle-breaking returns the bbox of the non-cyclic geometry.
        let mut cell = Cell::new("self_ref");
        cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 10.0), 1);
        cell.add_ref(CellRef::new("self_ref").at(50.0, 0.0));

        let mut lib = Library::new("lib");
        lib.add_cell(cell).unwrap();

        let bbox = crate::hierarchy::cell_bbox(&lib, "self_ref").unwrap();
        // Top-level call pushes "self_ref" onto the visited stack before
        // iterating refs. The nested CellRef("self_ref") hits the cycle
        // guard immediately and returns None, so we only see the direct
        // polygon of the top level — no infinite recursion.
        assert!((bbox.min().x - 0.0).abs() < 1e-10);
        assert!((bbox.max().x - 10.0).abs() < 1e-10);
    }

    #[test]
    fn roots_and_top_are_independent_of_insertion_order() {
        let mut child = Cell::new("child");
        child.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), 1);
        let mut parent = Cell::new("parent");
        parent.add_ref(CellRef::new("child"));
        let independent = Cell::new("independent");

        let mut library = Library::new("test");
        library.add_cell(parent).unwrap();
        library.add_cell(independent).unwrap();
        library.add_cell(child).unwrap();

        assert_eq!(
            library
                .roots()
                .iter()
                .map(|cell| cell.name())
                .collect::<Vec<_>>(),
            vec!["parent", "independent"]
        );
        assert!(library.top_cell().is_none());

        library.set_top_cell("parent").unwrap();
        assert_eq!(library.top_cell().unwrap().name(), "parent");
        assert_eq!(library.explicit_top_cell().unwrap().name(), "parent");
        library.clear_top_cell();
        assert!(library.top_cell().is_none());
    }

    #[test]
    fn unique_root_is_inferred_and_explicit_top_tracks_rename() {
        let mut child = Cell::new("child");
        child.add_ref(CellRef::new("leaf"));
        let mut library = Library::new("test");
        library.add_cell(child).unwrap();
        library.add_cell(Cell::new("leaf")).unwrap();

        assert_eq!(library.top_cell().unwrap().name(), "child");
        library.set_top_cell("leaf").unwrap();
        library.rename_cell("leaf", "renamed").unwrap();
        assert_eq!(library.top_cell().unwrap().name(), "renamed");

        let error = library.set_top_cell("missing").unwrap_err();
        assert!(matches!(error, LibraryError::CellNotFound { .. }));
        assert_eq!(library.top_cell().unwrap().name(), "renamed");
    }

    #[test]
    fn controlled_edits_preserve_library_identities() {
        let mut library = Library::new("test");
        library.add_cell(Cell::new("A")).unwrap();
        library.add_cell(Cell::new("B")).unwrap();
        library.set_top_cell("A").unwrap();

        library
            .edit_cell("A", |cell| *cell = Cell::new("B"))
            .unwrap();
        library
            .edit_cells(|cell| *cell = Cell::new("replacement"))
            .unwrap();

        assert_eq!(
            library
                .cells()
                .iter()
                .map(|cell| cell.name())
                .collect::<Vec<_>>(),
            vec!["A", "B"]
        );
        assert_eq!(library.top_cell().unwrap().name(), "A");
        library.validate().unwrap();
    }

    #[test]
    fn controlled_edits_restore_identity_during_unwind() {
        let mut library = Library::new("test");
        library.add_cell(Cell::new("original")).unwrap();

        let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
            let _ = library.edit_cell("original", |cell| {
                *cell = Cell::new("replacement");
                panic!("stop edit");
            });
        }));

        assert!(result.is_err());
        assert!(library.contains("original"));
        library.validate().unwrap();
    }

    #[test]
    fn cell_element_edits_are_transactional() {
        let mut cell = Cell::new("test");
        cell.add_path(
            vec![Point::origin(), Point::new(1.0, 0.0)],
            1.0,
            1,
            PathEndType::default(),
        );
        cell.add_text_with_height("label", Point::origin(), 1, 1.0);

        let error = cell
            .edit_element(0, |element| {
                let Element::Path { width, .. } = element else {
                    unreachable!();
                };
                *width = 0.0;
            })
            .unwrap_err();
        assert!(matches!(
            error,
            CellValidationError::InvalidPath {
                element_index: 0,
                reason: PathValidationReason::ZeroWidth
            }
        ));
        assert_eq!(cell.paths().next().unwrap().1, 1.0);

        let panic = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
            let _ = cell.edit_element(0, |element| {
                let Element::Path { width, .. } = element else {
                    unreachable!();
                };
                *width = 2.0;
                panic!("abort");
            });
        }));
        assert!(panic.is_err());
        assert_eq!(cell.paths().next().unwrap().1, 1.0);

        let error = cell
            .edit_elements(|elements| {
                let Element::Path { width, .. } = &mut elements[0] else {
                    unreachable!();
                };
                *width = 3.0;
                let Element::Text { height, .. } = &mut elements[1] else {
                    unreachable!();
                };
                *height = -1.0;
            })
            .unwrap_err();
        assert!(matches!(error, CellValidationError::InvalidText { .. }));
        assert_eq!(cell.paths().next().unwrap().1, 1.0);
        assert_eq!(cell.texts().next().unwrap().3, 1.0);

        let panic = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
            let _ = cell.edit_elements(|elements| {
                elements.swap(0, 1);
                panic!("abort");
            });
        }));
        assert!(panic.is_err());
        assert!(matches!(cell.elements()[0], Element::Path { .. }));
        assert_eq!(cell.elements().len(), 2);

        assert_eq!(
            cell.edit_element(5, |_| {}),
            Err(CellValidationError::ElementIndexOutOfBounds { index: 5, len: 2 })
        );
        cell.clear_elements();
        assert!(cell.elements().is_empty());
    }

    #[test]
    fn port_edits_are_transactional() {
        let mut cell = Cell::new("test");
        cell.add_port(Port::new("in", Point::origin(), Vector2::unit_x()));
        cell.add_port(Port::new("out", Point::new(1.0, 0.0), Vector2::unit_x()));

        let error = cell
            .edit_ports(|ports| ports[0].direction = Vector2::new(0.0, 0.0))
            .unwrap_err();
        assert!(matches!(error, CellValidationError::InvalidPort { .. }));
        assert_eq!(cell.ports()[0].direction, Vector2::unit_x());

        let error = cell
            .edit_ports(|ports| ports[1].name = "in".to_string())
            .unwrap_err();
        assert!(matches!(
            error,
            CellValidationError::DuplicatePortName { .. }
        ));
        assert_eq!(cell.ports()[1].name, "out");
    }

    #[test]
    fn library_edits_roll_back_validation_failures_and_panics() {
        let mut a = Cell::new("A");
        a.add_text_with_height("original", Point::origin(), 1, 1.0);
        let mut library = Library::new("test");
        library.add_cell(a).unwrap();
        library.add_cell(Cell::new("B")).unwrap();

        let error = library
            .edit_cell("A", |cell| {
                cell.elements.push(Element::Path {
                    points: vec![Point::origin()],
                    width: 1.0,
                    layer: Layer::new(1, 0),
                    end_type: PathEndType::Flush,
                });
            })
            .unwrap_err();
        assert!(matches!(
            error,
            LibraryError::InvalidCell {
                name,
                source: CellValidationError::InvalidPath { .. }
            } if name == "A"
        ));
        assert_eq!(library.cell("A").unwrap().elements().len(), 1);

        let panic = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
            let _ = library.edit_cell("A", |cell| {
                cell.clear_elements();
                panic!("abort");
            });
        }));
        assert!(panic.is_err());
        assert_eq!(library.cell("A").unwrap().texts().count(), 1);

        let error = library
            .edit_cells(|cell| {
                cell.add_text_with_height("candidate-only", Point::origin(), 1, 1.0);
                if cell.name() == "B" {
                    cell.elements.push(Element::Text {
                        text: String::new(),
                        position: Point::origin(),
                        layer: Layer::new(1, 0),
                        height: 0.0,
                    });
                }
            })
            .unwrap_err();
        assert!(matches!(error, LibraryError::InvalidCell { name, .. } if name == "B"));
        assert_eq!(library.cell("A").unwrap().texts().count(), 1);
        assert_eq!(library.cell("B").unwrap().texts().count(), 0);

        let panic = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
            let _ = library.edit_cells(|cell| {
                cell.clear_elements();
                if cell.name() == "B" {
                    panic!("abort");
                }
            });
        }));
        assert!(panic.is_err());
        assert_eq!(library.cell("A").unwrap().texts().count(), 1);

        assert!(matches!(
            library.edit_cell("missing", |_| {}).unwrap_err(),
            LibraryError::CellNotFound { name } if name == "missing"
        ));
    }

    #[test]
    fn library_validation_is_local_and_insertions_are_atomic() {
        let mut a = Cell::new("A");
        a.add_ref(CellRef::new("B"));
        let mut b = Cell::new("B");
        b.add_ref(CellRef::new("A"));
        b.add_ref(CellRef::new("missing"));
        let mut library = Library::new("test");
        library.add_cell(a).unwrap();
        library.add_cell(b).unwrap();
        assert!(library.validate().is_ok());

        let error = library.add_cell(Cell::new("")).unwrap_err();
        assert!(matches!(
            error,
            LibraryError::InvalidCell {
                name,
                source: CellValidationError::EmptyCellName
            } if name.is_empty()
        ));
        assert_eq!(library.cells().len(), 2);

        library.cells.push(Cell::new("A"));
        assert!(matches!(
            library.validate(),
            Err(LibraryError::AlreadyExists { name }) if name == "A"
        ));
        library.cells.pop();
    }

    #[test]
    fn renaming_a_missing_identity_does_not_rewrite_dangling_refs() {
        let mut cell = Cell::new("parent");
        cell.add_ref(CellRef::new("missing"));
        let mut library = Library::new("test");
        library.add_cell(cell).unwrap();

        assert!(!library.rename_cell("missing", "renamed").unwrap());
        assert_eq!(
            library
                .cell("parent")
                .unwrap()
                .cell_refs()
                .next()
                .unwrap()
                .cell_name,
            "missing"
        );
    }

    #[test]
    fn insert_cell_applies_duplicate_policy() {
        let mut library = Library::new("test");
        assert!(
            library
                .insert_cell(Cell::new("cell"), DuplicatePolicy::Error)
                .unwrap()
        );
        assert!(
            !library
                .insert_cell(Cell::new("cell"), DuplicatePolicy::KeepExisting)
                .unwrap()
        );
        assert!(matches!(
            library
                .insert_cell(Cell::new("cell"), DuplicatePolicy::Error)
                .unwrap_err(),
            LibraryError::AlreadyExists { .. }
        ));
        assert_eq!(library.cells().len(), 1);
    }

    #[test]
    fn removal_rejects_dangling_references() {
        let child = Cell::new("child");
        let mut parent = Cell::new("parent");
        parent.add_ref(CellRef::new("child"));
        let mut library = Library::new("test");
        library.add_cell(child).unwrap();
        library.add_cell(parent).unwrap();
        library.set_top_cell("parent").unwrap();

        let error = library.remove_cell("child").unwrap_err();
        assert!(matches!(error, LibraryError::CellReferenced { .. }));
        assert!(library.contains("child"));
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
        assert!(matches!(err, LibraryError::AlreadyExists { .. }));
    }

    #[test]
    fn test_add_cell_accepts_format_neutral_name() {
        let mut lib = Library::new("test_lib");
        let cell = Cell::new("has space");
        lib.add_cell(cell).unwrap();
        assert!(lib.contains("has space"));
    }

    #[test]
    fn test_rename_cell_enforces_nonempty_identity() {
        let mut lib = Library::new("test_lib");
        lib.add_cell(Cell::new("cell1")).unwrap();

        // Valid rename
        assert!(lib.rename_cell("cell1", "cell2").unwrap());

        assert!(lib.rename_cell("cell2", "has space").unwrap());
        let err = lib.rename_cell("has space", "").unwrap_err();
        assert_eq!(err, LibraryError::EmptyCellName);
    }

    #[test]
    fn test_rename_cell_duplicate_rejected() {
        let mut lib = Library::new("test_lib");
        lib.add_cell(Cell::new("cell1")).unwrap();
        lib.add_cell(Cell::new("cell2")).unwrap();

        let err = lib.rename_cell("cell1", "cell2").unwrap_err();
        assert!(matches!(err, LibraryError::AlreadyExists { .. }));
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

        assert_eq!(cell.paths().count(), 1);

        let paths: Vec<_> = cell.paths().collect();
        assert_eq!(paths.len(), 1);
        assert_eq!(paths[0].0.len(), 3);
        assert!((paths[0].1 - 0.5).abs() < 1e-10);
        assert_eq!(paths[0].2.number, 1);
        assert_eq!(paths[0].3, PathEndType::Flush);
    }

    #[test]
    fn test_add_path_default_end_type() {
        let mut cell = Cell::new("test");
        let points = vec![Point::new(0.0, 0.0), Point::new(100.0, 0.0)];
        cell.add_path(points, 1.0, 1, PathEndType::default());

        assert_eq!(cell.paths().count(), 1);
    }

    #[test]
    fn test_path_end_types() {
        let mut cell = Cell::new("test");
        let points = vec![Point::new(0.0, 0.0), Point::new(10.0, 0.0)];

        cell.add_path(points.clone(), 0.5, 1, PathEndType::Flush);
        cell.add_path(points.clone(), 0.5, 1, PathEndType::Round);
        cell.add_path(points.clone(), 0.5, 1, PathEndType::HalfWidthExtension);

        assert_eq!(cell.paths().count(), 3);
    }

    #[test]
    fn test_add_text_default_height() {
        let mut cell = Cell::new("test");
        cell.add_text_with_height("Hello", Point::new(5.0, 5.0), Layer::new(10, 0), 1.0);

        assert_eq!(cell.texts().count(), 1);

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
        cell.add_path(
            vec![Point::origin(), Point::new(10.0, 0.0)],
            0.5,
            1,
            PathEndType::default(),
        );
        cell.add_text_with_height("Label", Point::new(5.0, 5.0), 10, 1.0);

        assert_eq!(cell.polygons().count(), 1);
        assert_eq!(cell.cell_refs().count(), 1);
        assert_eq!(cell.paths().count(), 1);
        assert_eq!(cell.texts().count(), 1);
        assert_eq!(cell.elements().len(), 4);
    }

    #[test]
    fn test_remove_element() {
        let mut cell = Cell::new("test");
        cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0), 1);
        cell.add_polygon(Polygon::rect(Point::new(20.0, 0.0), 5.0, 5.0), 1);
        cell.add_polygon(Polygon::rect(Point::new(30.0, 0.0), 3.0, 3.0), 1);

        assert_eq!(cell.polygons().count(), 3);

        // Remove middle element
        let removed = cell.remove_element(1);
        assert!(removed.is_some());
        assert_eq!(cell.polygons().count(), 2);

        // Remove first element
        let removed = cell.remove_element(0);
        assert!(removed.is_some());
        assert_eq!(cell.polygons().count(), 1);

        // Try to remove out of bounds
        let removed = cell.remove_element(10);
        assert!(removed.is_none());
        assert_eq!(cell.polygons().count(), 1);
    }
}

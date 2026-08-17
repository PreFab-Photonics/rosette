//! Cell hierarchy for layout.
//!
//! A [`Cell`] is a container for geometry that can reference other cells,
//! enabling hierarchical layout design.

use crate::error::{
    CellEditError, CellRefError, CellRefValidationReason, CellValidationError, LibraryEditError,
    LibraryError, PathValidationReason, RepetitionValidationReason, TextValidationReason,
};
use crate::geometry::{BBox, Point, Polygon, Transform, Vector2};
use crate::layer::Layer;
use crate::path::stroke_path;
use crate::port::Port;
use std::collections::{HashMap, HashSet};

/// Geometry applied at both endpoints of a path.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Default)]
pub enum PathCap {
    /// Flush (square) ends at path endpoints.
    #[default]
    Flush,
    /// Round ends.
    Round,
    /// Square ends extending half-width past endpoints.
    HalfWidthExtension,
}

/// An element within a cell.
#[derive(Debug, Clone)]
pub enum Element {
    /// A polygon on a specific layer.
    Polygon { polygon: Polygon, layer: Layer },
    /// A reference to another cell.
    CellRef(CellRef),
    /// A path (centerline with width) on a specific layer.
    Path(PathElement),
    /// A text label on a specific layer.
    Text(TextElement),
}

impl Element {
    /// Get the layer of this element, if it has one.
    ///
    /// Returns `None` for `CellRef` elements which don't have a layer.
    pub fn layer(&self) -> Option<Layer> {
        match self {
            Element::Polygon { layer, .. }
            | Element::Path(PathElement { layer, .. })
            | Element::Text(TextElement { layer, .. }) => Some(*layer),
            Element::CellRef(_) => None,
        }
    }
}

/// A validated path element payload.
#[derive(Debug, Clone)]
pub struct PathElement {
    points: Vec<Point>,
    width: f64,
    layer: Layer,
    cap: PathCap,
}

impl PathElement {
    /// Create a path element from centerline points and width.
    pub fn new(
        points: Vec<Point>,
        width: f64,
        layer: Layer,
        cap: PathCap,
    ) -> Result<Self, PathValidationReason> {
        let path = Self {
            points,
            width,
            layer,
            cap,
        };
        path.validate()?;
        Ok(path)
    }

    /// Validate the stored path fields.
    pub fn validate(&self) -> Result<(), PathValidationReason> {
        if self.points.len() < 2 {
            return Err(PathValidationReason::TooFewPoints {
                count: self.points.len(),
            });
        }
        if let Some(point_index) = self.points.iter().position(|point| !point.is_finite()) {
            return Err(PathValidationReason::NonFinitePoint { point_index });
        }
        if !self.width.is_finite() {
            return Err(PathValidationReason::NonFiniteWidth);
        }
        if self.width == 0.0 {
            return Err(PathValidationReason::ZeroWidth);
        }
        Ok(())
    }

    /// Get the centerline points.
    pub fn points(&self) -> &[Point] {
        &self.points
    }

    /// Get the signed path width.
    pub fn width(&self) -> f64 {
        self.width
    }

    /// Get the path layer.
    pub fn layer(&self) -> Layer {
        self.layer
    }

    /// Get the path endpoint geometry.
    pub fn cap(&self) -> PathCap {
        self.cap
    }

    /// Replace the centerline points.
    pub fn set_points(&mut self, points: Vec<Point>) -> Result<(), PathValidationReason> {
        let candidate = Self::new(points, self.width, self.layer, self.cap)?;
        self.points = candidate.points;
        Ok(())
    }

    /// Replace the path width.
    pub fn set_width(&mut self, width: f64) -> Result<(), PathValidationReason> {
        let candidate = Self::new(self.points.clone(), width, self.layer, self.cap)?;
        self.width = candidate.width;
        Ok(())
    }

    /// Replace the path layer.
    pub fn set_layer(&mut self, layer: Layer) {
        self.layer = layer;
    }

    /// Replace the path endpoint geometry.
    pub fn set_cap(&mut self, cap: PathCap) {
        self.cap = cap;
    }
}

/// A validated text element payload.
#[derive(Debug, Clone)]
pub struct TextElement {
    text: String,
    position: Point,
    layer: Layer,
    height: f64,
}

impl TextElement {
    /// Create a text element.
    pub fn new(
        text: impl Into<String>,
        position: Point,
        layer: Layer,
        height: f64,
    ) -> Result<Self, TextValidationReason> {
        let text = Self {
            text: text.into(),
            position,
            layer,
            height,
        };
        text.validate()?;
        Ok(text)
    }

    /// Validate the stored text fields.
    pub fn validate(&self) -> Result<(), TextValidationReason> {
        if !self.position.is_finite() {
            return Err(TextValidationReason::NonFinitePosition);
        }
        if !self.height.is_finite() {
            return Err(TextValidationReason::NonFiniteHeight);
        }
        if self.height <= 0.0 {
            return Err(TextValidationReason::NonPositiveHeight);
        }
        Ok(())
    }

    /// Get the label text.
    pub fn text(&self) -> &str {
        &self.text
    }

    /// Get the label position.
    pub fn position(&self) -> Point {
        self.position
    }

    /// Get the label layer.
    pub fn layer(&self) -> Layer {
        self.layer
    }

    /// Get the label height.
    pub fn height(&self) -> f64 {
        self.height
    }

    /// Replace the label text.
    pub fn set_text(&mut self, text: impl Into<String>) {
        self.text = text.into();
    }

    /// Replace the label position.
    pub fn set_position(&mut self, position: Point) -> Result<(), TextValidationReason> {
        if !position.is_finite() {
            return Err(TextValidationReason::NonFinitePosition);
        }
        self.position = position;
        Ok(())
    }

    /// Replace the label layer.
    pub fn set_layer(&mut self, layer: Layer) {
        self.layer = layer;
    }

    /// Replace the label height.
    pub fn set_height(&mut self, height: f64) -> Result<(), TextValidationReason> {
        if !height.is_finite() {
            return Err(TextValidationReason::NonFiniteHeight);
        }
        if height <= 0.0 {
            return Err(TextValidationReason::NonPositiveHeight);
        }
        self.height = height;
        Ok(())
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
    columns: u16,
    rows: u16,
    col_vector: Vector2,
    row_vector: Vector2,
}

impl Repetition {
    /// Validate the stored repetition fields.
    pub fn validate(&self) -> Result<(), RepetitionValidationReason> {
        if self.columns == 0 {
            return Err(RepetitionValidationReason::ZeroColumns);
        }
        if self.rows == 0 {
            return Err(RepetitionValidationReason::ZeroRows);
        }
        if !self.col_vector.is_finite() {
            return Err(RepetitionValidationReason::NonFiniteColumnVector);
        }
        if !self.row_vector.is_finite() {
            return Err(RepetitionValidationReason::NonFiniteRowVector);
        }
        Ok(())
    }

    /// Create a new axis-aligned rectangular grid repetition.
    ///
    /// Equivalent to
    /// [`new_vectors`](Self::new_vectors)`(columns, rows,
    /// Vector2::new(col_spacing, 0.0), Vector2::new(0.0, row_spacing))`.
    pub fn new(
        columns: u16,
        rows: u16,
        col_spacing: f64,
        row_spacing: f64,
    ) -> Result<Self, RepetitionValidationReason> {
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
    pub fn new_vectors(
        columns: u16,
        rows: u16,
        col_vector: Vector2,
        row_vector: Vector2,
    ) -> Result<Self, RepetitionValidationReason> {
        let repetition = Self {
            columns,
            rows,
            col_vector,
            row_vector,
        };
        repetition.validate()?;
        Ok(repetition)
    }

    /// Get the number of columns.
    pub fn columns(&self) -> u16 {
        self.columns
    }

    /// Get the number of rows.
    pub fn rows(&self) -> u16 {
        self.rows
    }

    /// Get the column pitch vector.
    pub fn col_vector(&self) -> Vector2 {
        self.col_vector
    }

    /// Get the row pitch vector.
    pub fn row_vector(&self) -> Vector2 {
        self.row_vector
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
    cell_name: String,
    transform: Transform,
    repetition: Option<Repetition>,
}

impl CellRef {
    /// Validate the stored reference fields.
    pub fn validate(&self) -> Result<(), CellRefError> {
        if self.cell_name.is_empty() {
            return Err(CellRefValidationReason::EmptyTarget.into());
        }
        if !self.transform.is_finite() {
            return Err(CellRefValidationReason::NonFiniteTransform.into());
        }
        if !self.transform.is_invertible() {
            return Err(CellRefValidationReason::SingularTransform.into());
        }
        if let Some(repetition) = self.repetition {
            repetition.validate()?;
        }
        Ok(())
    }

    /// Create a new cell reference.
    pub fn new(cell_name: impl Into<String>) -> Result<Self, CellRefError> {
        let cell_ref = Self {
            cell_name: cell_name.into(),
            transform: Transform::identity(),
            repetition: None,
        };
        cell_ref.validate()?;
        Ok(cell_ref)
    }

    /// Create a cell reference with transformation.
    pub fn with_transform(
        cell_name: impl Into<String>,
        transform: Transform,
    ) -> Result<Self, CellRefError> {
        let cell_ref = Self {
            cell_name: cell_name.into(),
            transform,
            repetition: None,
        };
        cell_ref.validate()?;
        Ok(cell_ref)
    }

    /// Get the referenced cell name.
    pub fn cell_name(&self) -> &str {
        &self.cell_name
    }

    /// Get the reference transform.
    pub fn transform(&self) -> Transform {
        self.transform
    }

    /// Get the optional array repetition.
    pub fn repetition(&self) -> Option<Repetition> {
        self.repetition
    }

    /// Replace the reference transform.
    pub fn set_transform(&mut self, transform: Transform) -> Result<(), CellRefError> {
        let candidate = Self {
            cell_name: self.cell_name.clone(),
            transform,
            repetition: self.repetition,
        };
        candidate.validate()?;
        self.transform = transform;
        Ok(())
    }

    /// Set or clear the optional array repetition.
    pub fn set_repetition(&mut self, repetition: Option<Repetition>) {
        self.repetition = repetition;
    }

    /// Set the position (translation).
    pub fn at(mut self, x: f64, y: f64) -> Result<Self, CellRefError> {
        self.set_transform(Transform::translate(x, y).then(&self.transform))?;
        Ok(self)
    }

    /// Rotate by angle (in radians).
    ///
    /// Rotation is applied after any previous transformations.
    pub fn rotate(mut self, angle: f64) -> Result<Self, CellRefError> {
        self.set_transform(Transform::rotate(angle).then(&self.transform))?;
        Ok(self)
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
    pub fn scale(mut self, scale: f64) -> Result<Self, CellRefError> {
        self.set_transform(Transform::scale_uniform(scale).then(&self.transform))?;
        Ok(self)
    }

    /// Set or clear the optional array repetition.
    pub fn with_repetition(mut self, repetition: Option<Repetition>) -> Self {
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
    pub fn array(
        mut self,
        columns: u16,
        rows: u16,
        col_spacing: f64,
        row_spacing: f64,
    ) -> Result<Self, CellRefError> {
        self = self.with_repetition(Some(Repetition::new(
            columns,
            rows,
            col_spacing,
            row_spacing,
        )?));
        Ok(self)
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
    ) -> Result<Self, CellRefError> {
        self = self.with_repetition(Some(Repetition::new_vectors(
            columns, rows, col_vector, row_vector,
        )?));
        Ok(self)
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
            polygon
                .validate()
                .map_err(|reason| CellValidationError::InvalidPolygon {
                    element_index,
                    reason,
                })?;
        }
        Element::Path(path) => {
            path.validate()
                .map_err(|reason| CellValidationError::InvalidPath {
                    element_index,
                    reason,
                })?;
        }
        Element::CellRef(cell_ref) => {
            cell_ref.validate().map_err(|error| match error {
                CellRefError::Reference(reason) => CellValidationError::InvalidCellRef {
                    element_index,
                    reason,
                },
                CellRefError::Repetition(reason) => CellValidationError::InvalidRepetition {
                    element_index,
                    reason,
                },
            })?;
        }
        Element::Text(text) => {
            text.validate()
                .map_err(|reason| CellValidationError::InvalidText {
                    element_index,
                    reason,
                })?;
        }
    }
    Ok(())
}

fn validate_port(port_index: usize, port: &Port) -> Result<(), CellValidationError> {
    port.validate()
        .map_err(|reason| CellValidationError::InvalidPort { port_index, reason })
}

impl Cell {
    /// Create a new empty cell.
    pub fn new(name: impl Into<String>) -> Result<Self, CellValidationError> {
        let name = name.into();
        if name.is_empty() {
            return Err(CellValidationError::EmptyCellName);
        }
        Ok(Self {
            name,
            elements: Vec::new(),
            ports: Vec::new(),
        })
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
            if let Some(first_index) = port_names.insert(port.name(), port_index) {
                return Err(CellValidationError::DuplicatePortName {
                    name: port.name().to_string(),
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
        self.ports.iter().find(|port| port.name() == name)
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
        cap: PathCap,
    ) -> Result<(), CellValidationError> {
        let element_index = self.elements.len();
        let path = PathElement::new(points, width, layer.into(), cap).map_err(|reason| {
            CellValidationError::InvalidPath {
                element_index,
                reason,
            }
        })?;
        self.elements.push(Element::Path(path));
        Ok(())
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
    ) -> Result<(), CellValidationError> {
        let element_index = self.elements.len();
        let text = TextElement::new(text, position, layer.into(), height).map_err(|reason| {
            CellValidationError::InvalidText {
                element_index,
                reason,
            }
        })?;
        self.elements.push(Element::Text(text));
        Ok(())
    }

    /// Add a port.
    pub fn add_port(&mut self, port: Port) -> Result<(), CellValidationError> {
        let port_index = self.ports.len();
        validate_port(port_index, &port)?;
        if let Some(first_index) = self
            .ports
            .iter()
            .position(|existing| existing.name() == port.name())
        {
            return Err(CellValidationError::DuplicatePortName {
                name: port.name().to_string(),
                first_index,
                duplicate_index: port_index,
            });
        }
        self.ports.push(port);
        Ok(())
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
    pub fn paths(&self) -> impl Iterator<Item = (&[Point], f64, &Layer, PathCap)> {
        self.elements.iter().filter_map(|e| match e {
            Element::Path(path) => {
                Some((path.points.as_slice(), path.width, &path.layer, path.cap))
            }
            _ => None,
        })
    }

    /// Get all text labels.
    pub fn texts(&self) -> impl Iterator<Item = (&str, Point, &Layer, f64)> {
        self.elements.iter().filter_map(|e| match e {
            Element::Text(text) => {
                Some((text.text.as_str(), text.position, &text.layer, text.height))
            }
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
        for (points, width, _, cap) in self.paths() {
            if let Some(ribbon) = stroke_path(points, width, cap) {
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
    pub fn edit_element<R, E>(
        &mut self,
        index: usize,
        edit: impl FnOnce(&mut Element) -> Result<R, E>,
    ) -> Result<R, CellEditError<E>> {
        let Some(element) = self.elements.get(index) else {
            return Err(CellEditError::Validation(
                CellValidationError::ElementIndexOutOfBounds {
                    index,
                    len: self.elements.len(),
                },
            ));
        };
        let mut candidate = element.clone();
        let result = edit(&mut candidate).map_err(CellEditError::Callback)?;
        validate_element(index, &candidate).map_err(CellEditError::Validation)?;
        self.elements[index] = candidate;
        Ok(result)
    }

    /// Transactionally edit all elements without changing their cardinality.
    ///
    /// The originals are left untouched if validation fails or `edit` panics.
    pub fn edit_elements<R, E>(
        &mut self,
        edit: impl FnOnce(&mut [Element]) -> Result<R, E>,
    ) -> Result<R, CellEditError<E>> {
        let mut candidates = self.elements.clone();
        let result = edit(&mut candidates).map_err(CellEditError::Callback)?;
        for (element_index, element) in candidates.iter().enumerate() {
            validate_element(element_index, element).map_err(CellEditError::Validation)?;
        }
        self.elements = candidates;
        Ok(result)
    }

    /// Transactionally edit every port without changing port cardinality.
    ///
    /// The originals are left untouched if any candidate is invalid or if
    /// the edit creates duplicate names.
    pub fn edit_ports<R, E>(
        &mut self,
        edit: impl FnOnce(&mut [Port]) -> Result<R, E>,
    ) -> Result<R, CellEditError<E>> {
        let mut candidates = self.ports.clone();
        let result = edit(&mut candidates).map_err(CellEditError::Callback)?;
        let mut names = HashMap::with_capacity(candidates.len());
        for (port_index, port) in candidates.iter().enumerate() {
            validate_port(port_index, port).map_err(CellEditError::Validation)?;
            if let Some(first_index) = names.insert(port.name(), port_index) {
                return Err(CellEditError::Validation(
                    CellValidationError::DuplicatePortName {
                        name: port.name().to_string(),
                        first_index,
                        duplicate_index: port_index,
                    },
                ));
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
    pub fn edit_cells<E>(
        &mut self,
        mut edit: impl FnMut(&mut Cell) -> Result<(), E>,
    ) -> Result<(), LibraryEditError<E>> {
        let mut candidates = self.cells.clone();
        for candidate in &mut candidates {
            let identity = candidate.name.clone();
            edit(candidate).map_err(LibraryEditError::Callback)?;
            candidate.set_name_unchecked(identity);
        }
        for candidate in &candidates {
            candidate
                .validate()
                .map_err(|source| LibraryError::InvalidCell {
                    name: candidate.name.clone(),
                    source,
                })
                .map_err(LibraryEditError::Validation)?;
        }
        let mut names = HashSet::with_capacity(candidates.len());
        for candidate in &candidates {
            if !names.insert(candidate.name()) {
                return Err(LibraryEditError::Validation(LibraryError::AlreadyExists {
                    name: candidate.name().to_string(),
                }));
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
    pub fn edit_cell<R, E>(
        &mut self,
        name: &str,
        edit: impl FnOnce(&mut Cell) -> Result<R, E>,
    ) -> Result<R, LibraryEditError<E>> {
        let index = self
            .cells
            .iter()
            .position(|cell| cell.name() == name)
            .ok_or_else(|| {
                LibraryEditError::Validation(LibraryError::CellNotFound {
                    name: name.to_string(),
                })
            })?;
        let identity = self.cells[index].name.clone();
        let mut candidate = self.cells[index].clone();
        let result = edit(&mut candidate).map_err(LibraryEditError::Callback)?;
        candidate.set_name_unchecked(identity.clone());
        candidate
            .validate()
            .map_err(|source| LibraryError::InvalidCell {
                name: identity,
                source,
            })
            .map_err(LibraryEditError::Validation)?;
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
    use crate::error::{LibraryError, PolygonValidationReason};
    use crate::geometry::{Point, Vector2};
    use proptest::prelude::*;
    use std::convert::Infallible;

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
            let mut cell = Cell::new("generated").unwrap();
            cell.add_polygon(Polygon::rect(Point::new(x, y), size, size).unwrap(), 1);
            cell.add_path(
                vec![Point::new(x, y), Point::new(x + size, y)],
                width,
                1,
                PathCap::default(),
            ).unwrap();
            cell.add_text_with_height("label", Point::new(x, y), 2, size).unwrap();
            cell.add_port(Port::with_width(
                "port",
                Point::new(x, y),
                Vector2::new(angle.cos(), angle.sin()),
                size,
            ).unwrap()).unwrap();
            cell.add_ref(
                CellRef::new("child")
                    .unwrap()
                    .at(x, y)
                    .unwrap()
                    .rotate(angle)
                    .unwrap()
                    .array(columns, rows, size, -size)
                    .unwrap(),
            );

            prop_assert_eq!(cell.validate(), Ok(()));
        }

        #[test]
        fn invalid_element_edits_are_atomic(width in 1.0e-6_f64..1.0e6) {
            let mut cell = Cell::new("generated").unwrap();
            cell.add_path(
                vec![Point::origin(), Point::new(1.0, 0.0)],
                width,
                1,
                PathCap::default(),
            ).unwrap();

            let result = cell.edit_element(0, |element| {
                let Element::Path(path) = element else {
                    unreachable!();
                };
                path.width = 0.0;
                Ok::<_, Infallible>(())
            });

            prop_assert_eq!(
                result,
                Err(CellEditError::Validation(CellValidationError::InvalidPath {
                    element_index: 0,
                    reason: PathValidationReason::ZeroWidth,
                }))
            );
            prop_assert_eq!(cell.paths().next().unwrap().1, width);
            prop_assert_eq!(cell.validate(), Ok(()));
        }

        #[test]
        fn duplicate_library_insertions_are_atomic(name in "[A-Za-z][A-Za-z0-9_]{0,31}") {
            let mut library = Library::new("generated");
            library.add_cell(Cell::new(name.clone()).unwrap()).unwrap();

            let result = library.add_cell(Cell::new(name.clone()).unwrap());

            let rejected = matches!(result, Err(LibraryError::AlreadyExists { .. }));
            prop_assert!(rejected);
            prop_assert_eq!(library.cells().len(), 1);
            prop_assert_eq!(library.cells()[0].name(), name);
            prop_assert_eq!(library.validate(), Ok(()));
        }
    }

    #[test]
    fn test_cell_new() {
        let cell = Cell::new("test_cell").unwrap();
        assert_eq!(cell.name(), "test_cell");
        assert!(cell.elements().is_empty());
    }

    #[test]
    fn cell_validation_reports_polygon_and_path_reasons() {
        let mut cell = Cell {
            name: String::new(),
            elements: Vec::new(),
            ports: Vec::new(),
        };
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

        cell.elements[0] = Element::Path(PathElement {
            points: vec![Point::origin()],
            width: 1.0,
            layer: Layer::new(1, 0),
            cap: PathCap::Flush,
        });
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidPath {
                reason: PathValidationReason::TooFewPoints { count: 1 },
                ..
            })
        ));

        let Element::Path(path) = &mut cell.elements[0] else {
            unreachable!();
        };
        path.points.push(Point::new(f64::INFINITY, 0.0));
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidPath {
                reason: PathValidationReason::NonFinitePoint { point_index: 1 },
                ..
            })
        ));

        cell.elements[0] = Element::Path(PathElement {
            points: vec![Point::origin(), Point::new(1.0, 0.0)],
            width: f64::NAN,
            layer: Layer::new(1, 0),
            cap: PathCap::Flush,
        });
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidPath {
                reason: PathValidationReason::NonFiniteWidth,
                ..
            })
        ));
        let Element::Path(path) = &mut cell.elements[0] else {
            unreachable!();
        };
        path.width = 0.0;
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
        let mut cell = Cell::new("test").unwrap();
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

        cell.elements[0] = Element::Text(TextElement {
            text: String::new(),
            position: Point::new(f64::NAN, 0.0),
            layer: Layer::new(1, 0),
            height: 1.0,
        });
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidText {
                reason: TextValidationReason::NonFinitePosition,
                ..
            })
        ));
        let Element::Text(text) = &mut cell.elements[0] else {
            unreachable!();
        };
        text.position = Point::origin();
        text.height = f64::INFINITY;
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidText {
                reason: TextValidationReason::NonFiniteHeight,
                ..
            })
        ));
        let Element::Text(text) = &mut cell.elements[0] else {
            unreachable!();
        };
        text.height = 0.0;
        assert!(matches!(
            cell.validate(),
            Err(CellValidationError::InvalidText {
                reason: TextValidationReason::NonPositiveHeight,
                ..
            })
        ));
    }

    #[test]
    fn cell_validation_reports_duplicate_ports() {
        let mut cell = Cell::new("test").unwrap();
        cell.ports
            .push(Port::new("p", Point::origin(), Vector2::unit_x()).unwrap());
        cell.ports.push(cell.ports[0].clone());
        assert_eq!(
            cell.validate(),
            Err(CellValidationError::DuplicatePortName {
                name: "p".to_string(),
                first_index: 0,
                duplicate_index: 1,
            })
        );
    }

    #[test]
    fn cell_validation_accepts_intentionally_degenerate_local_geometry() {
        let mut cell = Cell::new("valid").unwrap();
        cell.add_polygon(
            Polygon::new(vec![
                Point::origin(),
                Point::origin(),
                Point::new(1.0, 1.0),
                Point::new(0.0, 1.0),
                Point::new(1.0, 0.0),
            ])
            .unwrap(),
            1,
        );
        cell.add_path(
            vec![Point::origin(), Point::new(1.0, 0.0)],
            -1.0,
            1,
            PathCap::Flush,
        )
        .unwrap();
        cell.add_text_with_height("", Point::origin(), 1, 1.0)
            .unwrap();
        cell.add_ref(
            CellRef::new("missing")
                .unwrap()
                .array_vectors(1, 1, Vector2::new(0.0, 0.0), Vector2::new(-1.0, 0.0))
                .unwrap(),
        );

        assert!(cell.validate().is_ok());
        assert!(Cell::new("empty_but_valid").unwrap().validate().is_ok());
    }

    #[test]
    fn fallible_cell_mutators_reject_before_committing_invalid_state() {
        let mut cell = Cell::new("test").unwrap();
        assert_eq!(
            cell.add_path(vec![Point::origin()], 1.0, 1, PathCap::default()),
            Err(CellValidationError::InvalidPath {
                element_index: 0,
                reason: PathValidationReason::TooFewPoints { count: 1 },
            })
        );
        assert!(cell.elements().is_empty());

        assert_eq!(
            cell.add_text_with_height("", Point::origin(), 1, 0.0),
            Err(CellValidationError::InvalidText {
                element_index: 0,
                reason: TextValidationReason::NonPositiveHeight,
            })
        );
        assert!(cell.elements().is_empty());

        cell.add_port(Port::new("p", Point::origin(), Vector2::unit_x()).unwrap())
            .unwrap();
        assert_eq!(
            cell.add_port(Port::new("p", Point::origin(), Vector2::unit_y()).unwrap()),
            Err(CellValidationError::DuplicatePortName {
                name: "p".to_string(),
                first_index: 0,
                duplicate_index: 1,
            })
        );
        assert_eq!(cell.ports().len(), 1);
        assert!(cell.validate().is_ok());
    }

    #[test]
    fn test_add_polygon() {
        let mut cell = Cell::new("test").unwrap();
        let rect = Polygon::rect(Point::origin(), 10.0, 5.0).unwrap();
        cell.add_polygon(rect, Layer::new(1, 0));
        assert_eq!(cell.polygons().count(), 1);
    }

    #[test]
    fn test_add_ref() {
        let mut cell = Cell::new("top").unwrap();
        cell.add_ref(CellRef::new("sub_cell").unwrap().at(10.0, 20.0).unwrap());
        assert_eq!(cell.cell_refs().count(), 1);
    }

    #[test]
    fn test_cell_ref_transform() {
        let cell_ref = CellRef::new("test")
            .unwrap()
            .at(10.0, 0.0)
            .unwrap()
            .rotate(std::f64::consts::PI / 2.0)
            .unwrap();

        // Check that transform is properly composed
        let p = cell_ref.transform().apply(Point::origin());
        // After translate(10,0) then rotate(90deg): (10,0) -> (0,10)
        assert!((p.x - 0.0).abs() < 1e-10);
        assert!((p.y - 10.0).abs() < 1e-10);
    }

    #[test]
    fn test_add_port() {
        let mut cell = Cell::new("test").unwrap();
        cell.add_port(Port::new("in", Point::origin(), Vector2::unit_x()).unwrap())
            .unwrap();
        cell.add_port(Port::new("out", Point::new(10.0, 0.0), Vector2::unit_x()).unwrap())
            .unwrap();

        assert_eq!(cell.ports().len(), 2);
        assert!(cell.port("in").is_some());
        assert!(cell.port("out").is_some());
        assert!(cell.port("nonexistent").is_none());
    }

    #[test]
    fn test_bbox() {
        let mut cell = Cell::new("test").unwrap();
        cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0).unwrap(), 1);
        cell.add_polygon(Polygon::rect(Point::new(20.0, 0.0), 5.0, 10.0).unwrap(), 1);

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
        let mut cell = Cell::new("test").unwrap();
        cell.add_path(
            vec![Point::new(0.0, 0.0), Point::new(10.0, 0.0)],
            2.0,
            1,
            PathCap::Flush,
        )
        .unwrap();

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
        let mut child = Cell::new("child").unwrap();
        child.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0).unwrap(), 1);

        let mut parent = Cell::new("parent").unwrap();
        parent.add_ref(CellRef::new("child").unwrap().at(20.0, 0.0).unwrap());

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
        let mut child = Cell::new("unit").unwrap();
        child.add_polygon(Polygon::rect(Point::origin(), 10.0, 10.0).unwrap(), 1);

        let mut top = Cell::new("top").unwrap();
        top.add_ref(
            CellRef::new("unit")
                .unwrap()
                .array(5, 3, 20.0, 20.0)
                .unwrap(),
        );

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
        let rep = Repetition::new(3, 2, -10.0, -15.0).unwrap();
        // Corner copy at (col=2, row=1) → (−20, −15).
        let off = rep.copy_offset(2, 1);
        assert!((off.x - (-20.0)).abs() < 1e-12);
        assert!((off.y - (-15.0)).abs() < 1e-12);

        // End-to-end: same geometry as test_library_cell_bbox_aref but with
        // negated pitches — bbox should be the mirror image about the origin.
        let mut child = Cell::new("unit").unwrap();
        child.add_polygon(Polygon::rect(Point::origin(), 10.0, 10.0).unwrap(), 1);

        let mut top = Cell::new("top").unwrap();
        top.add_ref(
            CellRef::new("unit")
                .unwrap()
                .array(5, 3, -20.0, -20.0)
                .unwrap(),
        );

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
        assert_eq!(
            Repetition::new(0, 1, 1.0, 1.0),
            Err(RepetitionValidationReason::ZeroColumns)
        );
        assert_eq!(
            Repetition::new(1, 0, 1.0, 1.0),
            Err(RepetitionValidationReason::ZeroRows)
        );
        assert_eq!(
            Repetition::new(1, 1, f64::NAN, 1.0),
            Err(RepetitionValidationReason::NonFiniteColumnVector)
        );
        assert_eq!(
            Repetition::new_vectors(1, 1, Vector2::unit_x(), Vector2::new(0.0, f64::INFINITY),),
            Err(RepetitionValidationReason::NonFiniteRowVector)
        );

        let repetition = Repetition::new(2, 3, 0.0, -4.0).unwrap();
        assert_eq!(repetition.columns(), 2);
        assert_eq!(repetition.rows(), 3);
        assert_eq!(repetition.col_vector(), Vector2::new(0.0, 0.0));
        assert_eq!(repetition.row_vector(), Vector2::new(0.0, -4.0));

        assert_eq!(
            CellRef::new("").unwrap_err(),
            CellRefError::Reference(CellRefValidationReason::EmptyTarget)
        );
        assert_eq!(
            CellRef::with_transform("target", Transform::scale(0.0, 1.0)).unwrap_err(),
            CellRefError::Reference(CellRefValidationReason::SingularTransform)
        );
        assert_eq!(
            CellRef::with_transform("target", Transform::translate(f64::NAN, 0.0)).unwrap_err(),
            CellRefError::Reference(CellRefValidationReason::NonFiniteTransform)
        );
        assert_eq!(
            CellRef::new("target").unwrap().scale(0.0).unwrap_err(),
            CellRefError::Reference(CellRefValidationReason::SingularTransform)
        );
        assert_eq!(
            CellRef::new("target").unwrap().scale(f64::NAN).unwrap_err(),
            CellRefError::Reference(CellRefValidationReason::NonFiniteTransform)
        );
        assert_eq!(
            CellRef::new("target")
                .unwrap()
                .scale(1e-8)
                .unwrap()
                .validate(),
            Ok(())
        );
        assert_eq!(
            CellRef::new("target")
                .unwrap()
                .at(f64::NAN, 0.0)
                .unwrap_err(),
            CellRefError::Reference(CellRefValidationReason::NonFiniteTransform)
        );
        assert_eq!(
            CellRef::new("target")
                .unwrap()
                .rotate(f64::NAN)
                .unwrap_err(),
            CellRefError::Reference(CellRefValidationReason::NonFiniteTransform)
        );
        assert!(
            CellRef::new("target")
                .unwrap()
                .with_repetition(Some(repetition))
                .with_repetition(None)
                .repetition()
                .is_none()
        );
    }

    #[test]
    fn deterministic_finite_constructions_remain_valid() {
        for columns in 1..=4 {
            for rows in 1..=4 {
                for pitch in [-10.0, -0.0, 0.0, 0.25, 10.0] {
                    let repetition = Repetition::new(columns, rows, pitch, -pitch).unwrap();
                    assert_eq!(repetition.validate(), Ok(()));
                }
            }
        }

        let polygon = Polygon::rect(Point::new(-2.0, -1.0), 4.0, 2.0).unwrap();
        for angle in [-3.0, -0.5, 0.0, 0.5, 3.0] {
            for scale in [-10.0, -0.25, 0.25, 10.0] {
                let cell_ref = CellRef::new("target")
                    .unwrap()
                    .at(angle, scale)
                    .unwrap()
                    .rotate(angle)
                    .unwrap()
                    .scale(scale)
                    .unwrap();
                assert_eq!(cell_ref.validate(), Ok(()));
                let transformed = polygon.try_transform(&cell_ref.transform()).unwrap();
                assert!(transformed.vertices().iter().all(|point| point.is_finite()));
            }
        }
    }

    #[test]
    fn test_library_cell_bbox_rotated_sref() {
        // Rotating an asymmetric child 90° should rotate the bbox too.
        // Child: 20x5 rect at origin → bbox (0,0)-(20,5).
        // Rotate 90° about origin → bbox (-5,0)-(0,20).
        let mut child = Cell::new("asym").unwrap();
        child.add_polygon(Polygon::rect(Point::origin(), 20.0, 5.0).unwrap(), 1);

        let mut top = Cell::new("top").unwrap();
        top.add_ref(
            CellRef::new("asym")
                .unwrap()
                .rotate(std::f64::consts::FRAC_PI_2)
                .unwrap(),
        );

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
        let mut child = Cell::new("child").unwrap();
        child.add_polygon(Polygon::rect(Point::new(1.0, 0.0), 1.0, 1.0).unwrap(), 1);

        let mut top = Cell::new("top").unwrap();
        top.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0).unwrap(), 1);
        top.add_ref(CellRef::with_transform("child", Transform::scale_uniform(f64::MAX)).unwrap());

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
        let mut unit = Cell::new("unit").unwrap();
        unit.add_polygon(Polygon::rect(Point::origin(), 5.0, 5.0).unwrap(), 1);

        let mut group = Cell::new("group").unwrap();
        group.add_ref(
            CellRef::new("unit")
                .unwrap()
                .array(2, 1, 10.0, 0.0)
                .unwrap(),
        );

        let mut top = Cell::new("top").unwrap();
        top.add_ref(CellRef::new("group").unwrap().at(100.0, 50.0).unwrap());

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
        let mut child = Cell::new("child").unwrap();
        child.add_polygon(Polygon::rect(Point::origin(), 10.0, 10.0).unwrap(), 1);

        let mut top = Cell::new("top").unwrap();
        top.add_polygon(Polygon::rect(Point::new(-5.0, -5.0), 5.0, 5.0).unwrap(), 1);
        top.add_ref(CellRef::new("child").unwrap().at(20.0, 0.0).unwrap());

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
        let mut unit = Cell::new("unit").unwrap();
        unit.add_polygon(Polygon::rect(Point::origin(), 5.0, 5.0).unwrap(), 1);

        let mut top = Cell::new("top").unwrap();
        top.add_ref(
            CellRef::new("unit")
                .unwrap()
                .rotate(std::f64::consts::FRAC_PI_2)
                .unwrap()
                .array(2, 1, 10.0, 0.0)
                .unwrap(),
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
        let mut unit = Cell::new("unit").unwrap();
        unit.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0).unwrap(), 1);

        let pitch: f64 = 10.0;
        let row_y = pitch * (3.0_f64).sqrt() / 2.0;

        let mut top = Cell::new("top").unwrap();
        top.add_ref(
            CellRef::new("unit")
                .unwrap()
                .array_vectors(
                    3,
                    2,
                    Vector2::new(pitch, 0.0),
                    Vector2::new(pitch / 2.0, row_y),
                )
                .unwrap(),
        );

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
        let mut top = Cell::new("top").unwrap();
        top.add_polygon(Polygon::rect(Point::origin(), 10.0, 10.0).unwrap(), 1);
        top.add_ref(CellRef::new("nonexistent").unwrap());

        let mut lib = Library::new("lib");
        lib.add_cell(top).unwrap();

        let bbox = crate::hierarchy::cell_bbox(&lib, "top").unwrap();
        assert!((bbox.max().x - 10.0).abs() < 1e-10);
    }

    #[test]
    fn test_library_cell_bbox_cycle_guard() {
        // A cell that references itself should not cause infinite recursion;
        // cycle-breaking returns the bbox of the non-cyclic geometry.
        let mut cell = Cell::new("self_ref").unwrap();
        cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 10.0).unwrap(), 1);
        cell.add_ref(CellRef::new("self_ref").unwrap().at(50.0, 0.0).unwrap());

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
        let mut child = Cell::new("child").unwrap();
        child.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0).unwrap(), 1);
        let mut parent = Cell::new("parent").unwrap();
        parent.add_ref(CellRef::new("child").unwrap());
        let independent = Cell::new("independent").unwrap();

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
        let mut child = Cell::new("child").unwrap();
        child.add_ref(CellRef::new("leaf").unwrap());
        let mut library = Library::new("test");
        library.add_cell(child).unwrap();
        library.add_cell(Cell::new("leaf").unwrap()).unwrap();

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
        library.add_cell(Cell::new("A").unwrap()).unwrap();
        library.add_cell(Cell::new("B").unwrap()).unwrap();
        library.set_top_cell("A").unwrap();

        library
            .edit_cell("A", |cell| {
                *cell = Cell::new("B").unwrap();
                Ok::<_, Infallible>(())
            })
            .unwrap();
        library
            .edit_cells(|cell| {
                *cell = Cell::new("replacement").unwrap();
                Ok::<_, Infallible>(())
            })
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
        library.add_cell(Cell::new("original").unwrap()).unwrap();

        let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
            let _ = library.edit_cell("original", |cell| -> Result<(), Infallible> {
                *cell = Cell::new("replacement").unwrap();
                panic!("stop edit");
            });
        }));

        assert!(result.is_err());
        assert!(library.contains("original"));
        library.validate().unwrap();
    }

    #[test]
    fn cell_element_edits_are_transactional() {
        let mut cell = Cell::new("test").unwrap();
        cell.add_path(
            vec![Point::origin(), Point::new(1.0, 0.0)],
            1.0,
            1,
            PathCap::default(),
        )
        .unwrap();
        cell.add_text_with_height("label", Point::origin(), 1, 1.0)
            .unwrap();

        let error = cell
            .edit_element(0, |element| {
                let Element::Path(path) = element else {
                    unreachable!();
                };
                path.width = 0.0;
                Ok::<_, Infallible>(())
            })
            .unwrap_err();
        assert!(matches!(
            error,
            CellEditError::Validation(CellValidationError::InvalidPath {
                element_index: 0,
                reason: PathValidationReason::ZeroWidth
            })
        ));
        assert_eq!(cell.paths().next().unwrap().1, 1.0);

        let panic = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
            let _ = cell.edit_element(0, |element| -> Result<(), Infallible> {
                let Element::Path(path) = element else {
                    unreachable!();
                };
                path.width = 2.0;
                panic!("abort");
            });
        }));
        assert!(panic.is_err());
        assert_eq!(cell.paths().next().unwrap().1, 1.0);

        let error = cell
            .edit_elements(|elements| {
                let Element::Path(path) = &mut elements[0] else {
                    unreachable!();
                };
                path.width = 3.0;
                let Element::Text(text) = &mut elements[1] else {
                    unreachable!();
                };
                text.height = -1.0;
                Ok::<_, Infallible>(())
            })
            .unwrap_err();
        assert!(matches!(
            error,
            CellEditError::Validation(CellValidationError::InvalidText { .. })
        ));
        assert_eq!(cell.paths().next().unwrap().1, 1.0);
        assert_eq!(cell.texts().next().unwrap().3, 1.0);

        let panic = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
            let _ = cell.edit_elements(|elements| -> Result<(), Infallible> {
                elements.swap(0, 1);
                panic!("abort");
            });
        }));
        assert!(panic.is_err());
        assert!(matches!(cell.elements()[0], Element::Path(_)));
        assert_eq!(cell.elements().len(), 2);

        assert_eq!(
            cell.edit_element(5, |_| Ok::<_, Infallible>(())),
            Err(CellEditError::Validation(
                CellValidationError::ElementIndexOutOfBounds { index: 5, len: 2 }
            ))
        );
        cell.clear_elements();
        assert!(cell.elements().is_empty());
    }

    #[test]
    fn callback_errors_roll_back_element_edits() {
        let mut cell = Cell::new("test").unwrap();
        cell.add_path(
            vec![Point::origin(), Point::new(1.0, 0.0)],
            1.0,
            1,
            PathCap::default(),
        )
        .unwrap();

        let error = cell
            .edit_element(0, |element| {
                let Element::Path(path) = element else {
                    unreachable!();
                };
                path.width = 2.0;
                Err::<(), _>("abort")
            })
            .unwrap_err();
        assert_eq!(error, CellEditError::Callback("abort"));
        assert_eq!(cell.paths().next().unwrap().1, 1.0);

        let error = cell
            .edit_elements(|elements| {
                let Element::Path(path) = &mut elements[0] else {
                    unreachable!();
                };
                path.width = 3.0;
                Err::<(), _>("abort")
            })
            .unwrap_err();
        assert_eq!(error, CellEditError::Callback("abort"));
        assert_eq!(cell.paths().next().unwrap().1, 1.0);
    }

    #[test]
    fn port_edits_are_transactional() {
        let mut cell = Cell::new("test").unwrap();
        cell.add_port(Port::new("in", Point::origin(), Vector2::unit_x()).unwrap())
            .unwrap();
        cell.add_port(Port::new("out", Point::new(1.0, 0.0), Vector2::unit_x()).unwrap())
            .unwrap();

        let error = cell
            .edit_ports(|ports| {
                ports[1].set_name("in").unwrap();
                Ok::<_, Infallible>(())
            })
            .unwrap_err();
        assert_eq!(
            error,
            CellEditError::Validation(CellValidationError::DuplicatePortName {
                name: "in".to_string(),
                first_index: 0,
                duplicate_index: 1,
            })
        );
        assert_eq!(cell.ports()[1].name(), "out");
    }

    #[test]
    fn callback_errors_roll_back_port_edits() {
        let mut cell = Cell::new("test").unwrap();
        cell.add_port(Port::new("in", Point::origin(), Vector2::unit_x()).unwrap())
            .unwrap();

        let error = cell
            .edit_ports(|ports| {
                ports[0].set_name("renamed").unwrap();
                Err::<(), _>("abort")
            })
            .unwrap_err();

        assert_eq!(error, CellEditError::Callback("abort"));
        assert_eq!(cell.ports()[0].name(), "in");
    }

    #[test]
    fn library_edits_roll_back_validation_failures_and_panics() {
        let mut a = Cell::new("A").unwrap();
        a.add_text_with_height("original", Point::origin(), 1, 1.0)
            .unwrap();
        let mut library = Library::new("test");
        library.add_cell(a).unwrap();
        library.add_cell(Cell::new("B").unwrap()).unwrap();

        let error = library
            .edit_cell("A", |cell| {
                cell.elements.push(Element::Path(PathElement {
                    points: vec![Point::origin()],
                    width: 1.0,
                    layer: Layer::new(1, 0),
                    cap: PathCap::Flush,
                }));
                Ok::<_, Infallible>(())
            })
            .unwrap_err();
        assert!(matches!(
            error,
            LibraryEditError::Validation(LibraryError::InvalidCell {
                name,
                source: CellValidationError::InvalidPath { .. }
            }) if name == "A"
        ));
        assert_eq!(library.cell("A").unwrap().elements().len(), 1);

        let panic = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
            let _ = library.edit_cell("A", |cell| -> Result<(), Infallible> {
                cell.clear_elements();
                panic!("abort");
            });
        }));
        assert!(panic.is_err());
        assert_eq!(library.cell("A").unwrap().texts().count(), 1);

        let error = library
            .edit_cells(|cell| {
                cell.add_text_with_height("candidate-only", Point::origin(), 1, 1.0)
                    .unwrap();
                if cell.name() == "B" {
                    cell.elements.push(Element::Text(TextElement {
                        text: String::new(),
                        position: Point::origin(),
                        layer: Layer::new(1, 0),
                        height: 0.0,
                    }));
                }
                Ok::<_, Infallible>(())
            })
            .unwrap_err();
        assert!(matches!(
            error,
            LibraryEditError::Validation(LibraryError::InvalidCell { name, .. }) if name == "B"
        ));
        assert_eq!(library.cell("A").unwrap().texts().count(), 1);
        assert_eq!(library.cell("B").unwrap().texts().count(), 0);

        let panic = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
            let _ = library.edit_cells(|cell| -> Result<(), Infallible> {
                cell.clear_elements();
                if cell.name() == "B" {
                    panic!("abort");
                }
                Ok(())
            });
        }));
        assert!(panic.is_err());
        assert_eq!(library.cell("A").unwrap().texts().count(), 1);

        assert!(matches!(
            library
                .edit_cell("missing", |_| Ok::<_, Infallible>(()))
                .unwrap_err(),
            LibraryEditError::Validation(LibraryError::CellNotFound { name }) if name == "missing"
        ));
    }

    #[test]
    fn callback_errors_roll_back_library_edits() {
        let mut library = Library::new("test");
        library.add_cell(Cell::new("A").unwrap()).unwrap();
        library.add_cell(Cell::new("B").unwrap()).unwrap();

        let error = library
            .edit_cell("A", |cell| {
                cell.add_text_with_height("candidate", Point::origin(), 1, 1.0)
                    .unwrap();
                Err::<(), _>("abort")
            })
            .unwrap_err();
        assert_eq!(error, LibraryEditError::Callback("abort"));
        assert_eq!(library.cell("A").unwrap().texts().count(), 0);

        let error = library
            .edit_cells(|cell| {
                cell.add_text_with_height("candidate", Point::origin(), 1, 1.0)
                    .unwrap();
                if cell.name() == "B" {
                    return Err("abort");
                }
                Ok(())
            })
            .unwrap_err();
        assert_eq!(error, LibraryEditError::Callback("abort"));
        assert_eq!(library.cell("A").unwrap().texts().count(), 0);
        assert_eq!(library.cell("B").unwrap().texts().count(), 0);
    }

    #[test]
    fn library_validation_is_local_and_insertions_are_atomic() {
        let mut a = Cell::new("A").unwrap();
        a.add_ref(CellRef::new("B").unwrap());
        let mut b = Cell::new("B").unwrap();
        b.add_ref(CellRef::new("A").unwrap());
        b.add_ref(CellRef::new("missing").unwrap());
        let mut library = Library::new("test");
        library.add_cell(a).unwrap();
        library.add_cell(b).unwrap();
        assert!(library.validate().is_ok());

        let error = library
            .add_cell(Cell {
                name: String::new(),
                elements: Vec::new(),
                ports: Vec::new(),
            })
            .unwrap_err();
        assert_eq!(
            error,
            LibraryError::InvalidCell {
                name: String::new(),
                source: CellValidationError::EmptyCellName,
            }
        );
        assert_eq!(library.cells().len(), 2);

        library.cells.push(Cell::new("A").unwrap());
        assert!(matches!(
            library.validate(),
            Err(LibraryError::AlreadyExists { name }) if name == "A"
        ));
        library.cells.pop();
    }

    #[test]
    fn renaming_a_missing_identity_does_not_rewrite_dangling_refs() {
        let mut cell = Cell::new("parent").unwrap();
        cell.add_ref(CellRef::new("missing").unwrap());
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
                .cell_name(),
            "missing"
        );
    }

    #[test]
    fn insert_cell_applies_duplicate_policy() {
        let mut library = Library::new("test");
        assert!(
            library
                .insert_cell(Cell::new("cell").unwrap(), DuplicatePolicy::Error)
                .unwrap()
        );
        assert!(
            !library
                .insert_cell(Cell::new("cell").unwrap(), DuplicatePolicy::KeepExisting)
                .unwrap()
        );
        assert!(matches!(
            library
                .insert_cell(Cell::new("cell").unwrap(), DuplicatePolicy::Error)
                .unwrap_err(),
            LibraryError::AlreadyExists { .. }
        ));
        assert_eq!(library.cells().len(), 1);
    }

    #[test]
    fn removal_rejects_dangling_references() {
        let child = Cell::new("child").unwrap();
        let mut parent = Cell::new("parent").unwrap();
        parent.add_ref(CellRef::new("child").unwrap());
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

        let mut cell1 = Cell::new("cell1").unwrap();
        cell1.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0).unwrap(), 1);

        let mut cell2 = Cell::new("cell2").unwrap();
        cell2.add_ref(CellRef::new("cell1").unwrap());

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
        lib.add_cell(Cell::new("cell1").unwrap()).unwrap();
        let err = lib.add_cell(Cell::new("cell1").unwrap()).unwrap_err();
        assert!(matches!(err, LibraryError::AlreadyExists { .. }));
    }

    #[test]
    fn test_add_cell_accepts_format_neutral_name() {
        let mut lib = Library::new("test_lib");
        let cell = Cell::new("has space").unwrap();
        lib.add_cell(cell).unwrap();
        assert!(lib.contains("has space"));
    }

    #[test]
    fn test_rename_cell_enforces_nonempty_identity() {
        let mut lib = Library::new("test_lib");
        lib.add_cell(Cell::new("cell1").unwrap()).unwrap();

        // Valid rename
        assert!(lib.rename_cell("cell1", "cell2").unwrap());

        assert!(lib.rename_cell("cell2", "has space").unwrap());
        let err = lib.rename_cell("has space", "").unwrap_err();
        assert_eq!(err, LibraryError::EmptyCellName);
    }

    #[test]
    fn test_rename_cell_duplicate_rejected() {
        let mut lib = Library::new("test_lib");
        lib.add_cell(Cell::new("cell1").unwrap()).unwrap();
        lib.add_cell(Cell::new("cell2").unwrap()).unwrap();

        let err = lib.rename_cell("cell1", "cell2").unwrap_err();
        assert!(matches!(err, LibraryError::AlreadyExists { .. }));
    }

    #[test]
    fn test_rename_cell_same_name_ok() {
        let mut lib = Library::new("test_lib");
        lib.add_cell(Cell::new("cell1").unwrap()).unwrap();

        // Renaming to same name should succeed (no-op)
        assert!(lib.rename_cell("cell1", "cell1").unwrap());
    }

    #[test]
    fn test_add_path() {
        let mut cell = Cell::new("test").unwrap();
        let points = vec![
            Point::new(0.0, 0.0),
            Point::new(10.0, 0.0),
            Point::new(10.0, 10.0),
        ];
        cell.add_path(points.clone(), 0.5, Layer::new(1, 0), PathCap::Flush)
            .unwrap();

        assert_eq!(cell.paths().count(), 1);

        let paths: Vec<_> = cell.paths().collect();
        assert_eq!(paths.len(), 1);
        assert_eq!(paths[0].0.len(), 3);
        assert!((paths[0].1 - 0.5).abs() < 1e-10);
        assert_eq!(paths[0].2.number, 1);
        assert_eq!(paths[0].3, PathCap::Flush);
    }

    #[test]
    fn test_add_path_default_cap() {
        let mut cell = Cell::new("test").unwrap();
        let points = vec![Point::new(0.0, 0.0), Point::new(100.0, 0.0)];
        cell.add_path(points, 1.0, 1, PathCap::default()).unwrap();

        assert_eq!(cell.paths().count(), 1);
    }

    #[test]
    fn test_path_caps() {
        let mut cell = Cell::new("test").unwrap();
        let points = vec![Point::new(0.0, 0.0), Point::new(10.0, 0.0)];

        cell.add_path(points.clone(), 0.5, 1, PathCap::Flush)
            .unwrap();
        cell.add_path(points.clone(), 0.5, 1, PathCap::Round)
            .unwrap();
        cell.add_path(points.clone(), 0.5, 1, PathCap::HalfWidthExtension)
            .unwrap();

        assert_eq!(cell.paths().count(), 3);
    }

    #[test]
    fn test_add_text_default_height() {
        let mut cell = Cell::new("test").unwrap();
        cell.add_text_with_height("Hello", Point::new(5.0, 5.0), Layer::new(10, 0), 1.0)
            .unwrap();

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
        let mut cell = Cell::new("test").unwrap();
        cell.add_text_with_height("Big", Point::new(0.0, 0.0), Layer::new(10, 0), 5.0)
            .unwrap();

        let texts: Vec<_> = cell.texts().collect();
        assert_eq!(texts.len(), 1);
        assert!((texts[0].3 - 5.0).abs() < 1e-10);
    }

    #[test]
    fn test_mixed_elements() {
        let mut cell = Cell::new("test").unwrap();

        // Add various element types
        cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0).unwrap(), 1);
        cell.add_ref(CellRef::new("other").unwrap());
        cell.add_path(
            vec![Point::origin(), Point::new(10.0, 0.0)],
            0.5,
            1,
            PathCap::default(),
        )
        .unwrap();
        cell.add_text_with_height("Label", Point::new(5.0, 5.0), 10, 1.0)
            .unwrap();

        assert_eq!(cell.polygons().count(), 1);
        assert_eq!(cell.cell_refs().count(), 1);
        assert_eq!(cell.paths().count(), 1);
        assert_eq!(cell.texts().count(), 1);
        assert_eq!(cell.elements().len(), 4);
    }

    #[test]
    fn test_remove_element() {
        let mut cell = Cell::new("test").unwrap();
        cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0).unwrap(), 1);
        cell.add_polygon(Polygon::rect(Point::new(20.0, 0.0), 5.0, 5.0).unwrap(), 1);
        cell.add_polygon(Polygon::rect(Point::new(30.0, 0.0), 3.0, 3.0).unwrap(), 1);

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

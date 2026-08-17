//! Format-neutral errors for the core layout model.

use std::error::Error;
use std::fmt;

/// Reason that an axis-aligned bounding box is invalid.
#[derive(Debug, Clone, thiserror::Error, PartialEq, Eq)]
pub enum BBoxValidationReason {
    /// Bounds cannot be inferred without at least one point.
    #[error("expected at least 1 point")]
    EmptyPoints,
    /// Every point used to construct bounds must be finite.
    #[error("point {point_index} is not finite")]
    NonFinitePoint { point_index: usize },
    /// Minimum coordinates must not exceed maximum coordinates.
    #[error("minimum corner exceeds maximum corner")]
    UnorderedCorners,
}

/// Reason that a polygon element is invalid.
#[derive(Debug, Clone, thiserror::Error, PartialEq, Eq)]
pub enum PolygonValidationReason {
    /// A polygon must contain at least three vertices.
    #[error("expected at least 3 vertices, found {count}")]
    TooFewVertices { count: usize },
    /// Every polygon vertex must be finite.
    #[error("vertex {vertex_index} is not finite")]
    NonFiniteVertex { vertex_index: usize },
}

/// Reason that a path element is invalid.
#[derive(Debug, Clone, thiserror::Error, PartialEq, Eq)]
pub enum PathValidationReason {
    /// A path must contain at least two centerline points.
    #[error("expected at least 2 points, found {count}")]
    TooFewPoints { count: usize },
    /// Every path point must be finite.
    #[error("point {point_index} is not finite")]
    NonFinitePoint { point_index: usize },
    /// Path width must be finite.
    #[error("width is not finite")]
    NonFiniteWidth,
    /// Path width may be negative, but not zero.
    #[error("width is zero")]
    ZeroWidth,
}

/// Reason that a cell reference is invalid.
#[derive(Debug, Clone, thiserror::Error, PartialEq, Eq)]
pub enum CellRefValidationReason {
    /// Reference targets use nonempty cell identities.
    #[error("target cell name is empty")]
    EmptyTarget,
    /// Every transform component must be finite.
    #[error("transform is not finite")]
    NonFiniteTransform,
    /// A reference transform must be invertible.
    #[error("transform is singular")]
    SingularTransform,
}

/// Reason that an array repetition is invalid.
#[derive(Debug, Clone, thiserror::Error, PartialEq, Eq)]
pub enum RepetitionValidationReason {
    /// An array must have at least one column.
    #[error("column count is zero")]
    ZeroColumns,
    /// An array must have at least one row.
    #[error("row count is zero")]
    ZeroRows,
    /// The column pitch vector must be finite.
    #[error("column vector is not finite")]
    NonFiniteColumnVector,
    /// The row pitch vector must be finite.
    #[error("row vector is not finite")]
    NonFiniteRowVector,
}

/// Error constructing or updating a cell reference.
#[derive(Debug, Clone, thiserror::Error, PartialEq, Eq)]
pub enum CellRefError {
    /// The reference target or transform is invalid.
    #[error(transparent)]
    Reference(#[from] CellRefValidationReason),
    /// The optional array repetition is invalid.
    #[error(transparent)]
    Repetition(#[from] RepetitionValidationReason),
}

/// Reason that a text element is invalid.
#[derive(Debug, Clone, thiserror::Error, PartialEq, Eq)]
pub enum TextValidationReason {
    /// Text position must be finite.
    #[error("position is not finite")]
    NonFinitePosition,
    /// Text height must be finite.
    #[error("height is not finite")]
    NonFiniteHeight,
    /// Text height must be positive.
    #[error("height is not positive")]
    NonPositiveHeight,
}

/// Reason that a port is invalid.
#[derive(Debug, Clone, thiserror::Error, PartialEq, Eq)]
pub enum PortValidationReason {
    /// Port names are nonempty identities within a cell.
    #[error("name is empty")]
    EmptyName,
    /// Port position must be finite.
    #[error("position is not finite")]
    NonFinitePosition,
    /// Port direction must be finite.
    #[error("direction is not finite")]
    NonFiniteDirection,
    /// A port direction cannot be zero.
    #[error("direction is zero")]
    ZeroDirection,
    /// Stored port directions must be approximately normalized.
    #[error("direction is not approximately unit length")]
    DirectionNotUnit,
    /// Port width must be finite when present.
    #[error("width is not finite")]
    NonFiniteWidth,
    /// Port width must be positive when present.
    #[error("width is not positive")]
    NonPositiveWidth,
}

/// A local invariant violation in a [`crate::Cell`].
#[derive(Debug, Clone, thiserror::Error, PartialEq, Eq)]
pub enum CellValidationError {
    /// Cell identities cannot be empty.
    #[error("cell name cannot be empty")]
    EmptyCellName,
    /// A polygon element is malformed.
    #[error("polygon element {element_index} is invalid: {reason}")]
    InvalidPolygon {
        element_index: usize,
        reason: PolygonValidationReason,
    },
    /// A path element is malformed.
    #[error("path element {element_index} is invalid: {reason}")]
    InvalidPath {
        element_index: usize,
        reason: PathValidationReason,
    },
    /// A cell reference is malformed.
    #[error("cell reference element {element_index} is invalid: {reason}")]
    InvalidCellRef {
        element_index: usize,
        reason: CellRefValidationReason,
    },
    /// A cell-reference repetition is malformed.
    #[error("repetition on element {element_index} is invalid: {reason}")]
    InvalidRepetition {
        element_index: usize,
        reason: RepetitionValidationReason,
    },
    /// A text element is malformed.
    #[error("text element {element_index} is invalid: {reason}")]
    InvalidText {
        element_index: usize,
        reason: TextValidationReason,
    },
    /// A port is malformed.
    #[error("port {port_index} is invalid: {reason}")]
    InvalidPort {
        port_index: usize,
        reason: PortValidationReason,
    },
    /// Port names must be unique within a cell.
    #[error("port name \"{name}\" is duplicated at indexes {first_index} and {duplicate_index}")]
    DuplicatePortName {
        name: String,
        first_index: usize,
        duplicate_index: usize,
    },
    /// A transactional element edit addressed a missing index.
    #[error("element index {index} is out of bounds for {len} elements")]
    ElementIndexOutOfBounds { index: usize, len: usize },
}

/// Error returned by a transactional cell edit.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum CellEditError<E> {
    /// The edit callback rejected the candidate.
    Callback(E),
    /// The edited candidate violates a cell invariant.
    Validation(CellValidationError),
}

impl<E: fmt::Display> fmt::Display for CellEditError<E> {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Callback(error) => write!(formatter, "cell edit failed: {error}"),
            Self::Validation(error) => error.fmt(formatter),
        }
    }
}

impl<E: Error + 'static> Error for CellEditError<E> {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        match self {
            Self::Callback(error) => Some(error),
            Self::Validation(error) => Some(error),
        }
    }
}

/// Errors that preserve library identity and uniqueness invariants.
#[derive(Debug, Clone, thiserror::Error, PartialEq, Eq)]
pub enum LibraryError {
    /// Cell names are identity keys and therefore cannot be empty.
    #[error("cell name cannot be empty")]
    EmptyCellName,

    /// A cell with this name already exists in the library.
    #[error("cell \"{name}\" already exists")]
    AlreadyExists { name: String },

    /// A requested cell is not present in the library.
    #[error("cell \"{name}\" does not exist")]
    CellNotFound { name: String },

    /// A cell violates a local core-model invariant.
    #[error("cell \"{name}\" is invalid: {source}")]
    InvalidCell {
        name: String,
        #[source]
        source: CellValidationError,
    },

    /// A cell cannot be removed while other cells reference it.
    #[error("cell \"{name}\" is referenced by {referenced_by:?}")]
    CellReferenced {
        name: String,
        referenced_by: Vec<String>,
    },
}

/// Error returned by a transactional library edit.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum LibraryEditError<E> {
    /// The edit callback rejected the candidate.
    Callback(E),
    /// The edited candidate violates a library invariant.
    Validation(LibraryError),
}

impl<E: fmt::Display> fmt::Display for LibraryEditError<E> {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Callback(error) => write!(formatter, "library edit failed: {error}"),
            Self::Validation(error) => error.fmt(formatter),
        }
    }
}

impl<E: Error + 'static> Error for LibraryEditError<E> {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        match self {
            Self::Callback(error) => Some(error),
            Self::Validation(error) => Some(error),
        }
    }
}

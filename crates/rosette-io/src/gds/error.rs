//! GDS II error types.

use thiserror::Error;

/// Why an element cannot be represented by the local model or GDS II.
#[derive(Error, Debug, Clone, PartialEq, Eq)]
pub enum GdsElementError {
    #[error("{element} is missing required {record} record")]
    MissingRequiredRecord {
        element: &'static str,
        record: &'static str,
    },

    #[error("boundary has {count} vertices after removing its closing point (expected 3..=8190)")]
    BoundaryPointCount { count: usize },

    #[error("boundary closing point does not match its first point")]
    BoundaryNotClosed,

    #[error("path has {count} points (expected 2..=8191)")]
    PathPointCount { count: usize },

    #[error("{kind} has {count} XY points (expected {expected})")]
    ReferencePointCount {
        kind: &'static str,
        count: usize,
        expected: usize,
    },

    #[error("reference target name is empty")]
    EmptyReferenceTarget,

    #[error("repetition dimensions {columns}x{rows} are outside 1..=32767")]
    RepetitionDimensions { columns: u16, rows: u16 },

    #[error("{field} is negative ({value})")]
    NegativeRecordValue { field: &'static str, value: i16 },

    #[error("XY data length {byte_count} is not a multiple of 8 bytes")]
    MalformedCoordinates { byte_count: usize },

    #[error("{field} is not finite")]
    NonFiniteValue { field: &'static str },

    #[error("{field} is outside the signed 32-bit database-unit range")]
    DatabaseUnitOutOfRange { field: &'static str },

    #[error("{field} is outside the signed 16-bit GDS range")]
    RecordValueOutOfRange { field: &'static str },

    #[error("path width becomes zero database units")]
    ZeroPathWidth,

    #[error("unsupported GDS path type {0}")]
    UnsupportedPathType(i16),

    #[error("unsupported nonzero text {record} value {value}")]
    UnsupportedTextPresentation { record: &'static str, value: i32 },

    #[error("magnification must be finite, positive, and representable as a GDS real")]
    InvalidMagnification,

    #[error("transform semantics are not representable: {0}")]
    UnsupportedTransform(#[source] GdsTransformError),

    #[error("text has {count} characters (maximum 512)")]
    TextTooLong { count: usize },
}

/// Why transform semantics cannot be represented across Rosette and GDS II.
#[derive(Error, Debug, Clone, Copy, PartialEq, Eq)]
pub enum GdsTransformError {
    #[error("components are not finite")]
    NonFinite,

    #[error("linear part is singular")]
    Singular,

    #[error("linear part contains shear or nonuniform scale")]
    NonConformal,

    #[error("uniform magnitude is outside the GDS real range")]
    MagnitudeOutOfRange,

    #[error("absolute magnification is not supported")]
    AbsoluteMagnification,

    #[error("absolute angle is not supported")]
    AbsoluteAngle,

    #[error("reserved STRANS bits are set: 0x{0:04X}")]
    ReservedBits(u16),

    #[error("text reflection is not supported")]
    TextReflection,

    #[error("text rotation is not supported")]
    TextRotation,
}

/// Errors that can occur during GDS reading or writing.
#[derive(Error, Debug)]
pub enum GdsError {
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),

    #[error("invalid GDS structure name: {0}")]
    InvalidStructureName(#[from] super::naming::GdsNameError),

    #[error("invalid library: {0}")]
    InvalidLibrary(#[from] rosette_core::LibraryError),

    #[error("invalid {cell} element {element_index}: {reason}")]
    InvalidElement {
        cell: String,
        element_index: usize,
        #[source]
        reason: GdsElementError,
    },

    #[error("invalid GDS units: {reason}")]
    InvalidUnits { reason: &'static str },

    #[error("{record} record contains {byte_count} bytes (maximum 65530)")]
    RecordTooLong {
        record: &'static str,
        byte_count: usize,
    },

    #[error("Polygon has too many vertices: {0} (max 8191)")]
    TooManyVertices(usize),

    #[error("Path has too many points: {0} (max 8191)")]
    TooManyPathPoints(usize),

    #[error("Path has too few points: {0} (minimum 2)")]
    TooFewPathPoints(usize),

    #[error("Text string too long: {0} (max 512 characters)")]
    TextTooLong(usize),

    #[error("Unexpected end of file")]
    UnexpectedEof,

    #[error("Invalid record at offset {offset}: {message}")]
    InvalidRecord { offset: usize, message: String },
}

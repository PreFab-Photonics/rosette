//! GDS II error types.

use thiserror::Error;

/// Errors that can occur during GDS reading or writing.
#[derive(Error, Debug)]
pub enum GdsError {
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Invalid cell name: {0}")]
    InvalidCellName(#[from] rosette_core::CellNameError),

    #[error("Cell name too long: {0} (max 32 characters)")]
    CellNameTooLong(String),

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

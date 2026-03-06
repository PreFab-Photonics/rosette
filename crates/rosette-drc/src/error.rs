//! DRC error types.

use rosette_core::Layer;
use thiserror::Error;

/// Errors that can occur during DRC operations.
#[derive(Error, Debug)]
pub enum DrcError {
    /// Invalid rule configuration.
    #[error("Invalid rule: {0}")]
    InvalidRule(String),

    /// Invalid parameter value.
    #[error("Invalid value for {rule}: {message}")]
    InvalidValue {
        /// Rule that has the invalid value.
        rule: String,
        /// Description of the issue.
        message: String,
    },

    /// Referenced layer not found in cell.
    #[error("Layer {0:?} not found in cell")]
    LayerNotFound(Layer),

    /// Geometry processing error.
    #[error("Geometry error: {0}")]
    GeometryError(String),
}

//! Format-neutral errors for the core layout model.

use crate::hierarchy::HierarchyIssue;

/// Errors that preserve library identity and uniqueness invariants.
#[derive(Debug, Clone, thiserror::Error, PartialEq, Eq)]
pub enum LibraryError {
    /// Cell names are identity keys and therefore cannot be empty.
    #[error("cell name cannot be empty")]
    EmptyCellName,

    /// A cell with this name already exists in the library.
    #[error("cell \"{name}\" already exists")]
    AlreadyExists { name: String },

    /// More than one candidate definition has the same identity.
    #[error("cell \"{name}\" appears more than once in the candidate registry")]
    DuplicateCandidate { name: String },

    /// A requested cell is not present in the library.
    #[error("cell \"{name}\" does not exist")]
    CellNotFound { name: String },

    /// A cell cannot be removed while other cells reference it.
    #[error("cell \"{name}\" is referenced by {referenced_by:?}")]
    CellReferenced {
        name: String,
        referenced_by: Vec<String>,
    },

    /// A recursive insertion contains missing references or cycles.
    #[error("invalid cell hierarchy: {summary}")]
    InvalidHierarchy {
        summary: String,
        issues: Vec<HierarchyIssue>,
    },
}

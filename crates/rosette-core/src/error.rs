//! Format-neutral errors for the core layout model.

/// Errors that preserve library identity and uniqueness invariants.
#[derive(Debug, Clone, thiserror::Error, PartialEq, Eq)]
pub enum LibraryError {
    /// Cell names are identity keys and therefore cannot be empty.
    #[error("cell name cannot be empty")]
    EmptyCellName,

    /// A cell with this name already exists in the library.
    #[error("cell \"{name}\" already exists")]
    AlreadyExists { name: String },
}

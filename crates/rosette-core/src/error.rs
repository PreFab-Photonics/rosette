//! Error types for rosette-core.

/// Maximum allowed length for a GDS cell name (characters).
pub const MAX_CELL_NAME_LENGTH: usize = 32;

/// Errors related to cell name validation.
///
/// Cell names must conform to the GDS II specification:
/// - Non-empty
/// - Maximum 32 characters
/// - Printable ASCII only (0x21–0x7E): no spaces, no control characters, no Unicode
#[derive(Debug, Clone, thiserror::Error)]
pub enum CellNameError {
    /// Cell name is empty (or whitespace-only after trimming).
    #[error("cell name cannot be empty")]
    Empty,

    /// Cell name exceeds the GDS II maximum of 32 characters.
    #[error("cell name \"{name}\" is too long ({len} characters, max {MAX_CELL_NAME_LENGTH})")]
    TooLong { name: String, len: usize },

    /// Cell name contains a character outside printable ASCII.
    #[error(
        "cell name contains invalid character '{ch}' — only printable ASCII is allowed (no spaces or Unicode)"
    )]
    InvalidCharacter {
        name: String,
        ch: char,
        code: u32,
        position: usize,
    },

    /// A cell with this name already exists in the library.
    #[error("cell \"{name}\" already exists")]
    AlreadyExists { name: String },
}

/// Validate a cell name against GDS II naming rules.
///
/// # Rules
/// - Must not be empty
/// - Must be at most 32 characters
/// - Must contain only printable ASCII characters (0x21–0x7E)
///   - No spaces (0x20), no control characters, no Unicode
///
/// # Examples
/// ```
/// use rosette_core::error::validate_cell_name;
///
/// assert!(validate_cell_name("my_cell").is_ok());
/// assert!(validate_cell_name("TOP").is_ok());
/// assert!(validate_cell_name("cell-1.0").is_ok());
///
/// assert!(validate_cell_name("").is_err());           // empty
/// assert!(validate_cell_name("has space").is_err());   // space
/// assert!(validate_cell_name("ñ").is_err());           // non-ASCII
/// ```
pub fn validate_cell_name(name: &str) -> Result<(), CellNameError> {
    if name.is_empty() {
        return Err(CellNameError::Empty);
    }

    let char_count = name.chars().count();
    if char_count > MAX_CELL_NAME_LENGTH {
        return Err(CellNameError::TooLong {
            name: name.to_string(),
            len: char_count,
        });
    }

    for (position, ch) in name.chars().enumerate() {
        let code = ch as u32;
        // Printable ASCII: 0x21 (!) through 0x7E (~)
        // Excludes space (0x20), DEL (0x7F), and everything else
        if !(0x21..=0x7E).contains(&code) {
            return Err(CellNameError::InvalidCharacter {
                name: name.to_string(),
                ch,
                code,
                position,
            });
        }
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_valid_names() {
        assert!(validate_cell_name("TOP").is_ok());
        assert!(validate_cell_name("my_cell").is_ok());
        assert!(validate_cell_name("cell-1.0").is_ok());
        assert!(validate_cell_name("A").is_ok());
        assert!(validate_cell_name("cell$ref").is_ok());
        assert!(validate_cell_name("!@#%^&*()").is_ok());
        // Exactly 32 characters — should be OK
        assert!(validate_cell_name("abcdefghijklmnopqrstuvwxyz123456").is_ok());
    }

    #[test]
    fn test_empty_name() {
        let err = validate_cell_name("").unwrap_err();
        assert!(matches!(err, CellNameError::Empty));
    }

    #[test]
    fn test_too_long() {
        let name = "a".repeat(33);
        let err = validate_cell_name(&name).unwrap_err();
        assert!(matches!(err, CellNameError::TooLong { len: 33, .. }));
    }

    #[test]
    fn test_boundary_length() {
        // 32 chars OK
        let name32 = "a".repeat(32);
        assert!(validate_cell_name(&name32).is_ok());

        // 33 chars fails
        let name33 = "a".repeat(33);
        assert!(validate_cell_name(&name33).is_err());
    }

    #[test]
    fn test_space_rejected() {
        let err = validate_cell_name("has space").unwrap_err();
        assert!(matches!(
            err,
            CellNameError::InvalidCharacter {
                ch: ' ',
                position: 3,
                ..
            }
        ));
    }

    #[test]
    fn test_tab_rejected() {
        let err = validate_cell_name("has\ttab").unwrap_err();
        assert!(matches!(
            err,
            CellNameError::InvalidCharacter { ch: '\t', .. }
        ));
    }

    #[test]
    fn test_newline_rejected() {
        let err = validate_cell_name("has\nnewline").unwrap_err();
        assert!(matches!(
            err,
            CellNameError::InvalidCharacter { ch: '\n', .. }
        ));
    }

    #[test]
    fn test_unicode_rejected() {
        let err = validate_cell_name("café").unwrap_err();
        assert!(matches!(
            err,
            CellNameError::InvalidCharacter {
                ch: 'é',
                position: 3,
                ..
            }
        ));
    }

    #[test]
    fn test_emoji_rejected() {
        let err = validate_cell_name("cell🔥").unwrap_err();
        assert!(matches!(
            err,
            CellNameError::InvalidCharacter { position: 4, .. }
        ));
    }

    #[test]
    fn test_null_byte_rejected() {
        let err = validate_cell_name("cell\0").unwrap_err();
        assert!(matches!(
            err,
            CellNameError::InvalidCharacter { ch: '\0', .. }
        ));
    }

    #[test]
    fn test_del_rejected() {
        // DEL is 0x7F, just above the valid range
        let err = validate_cell_name("cell\x7F").unwrap_err();
        assert!(matches!(
            err,
            CellNameError::InvalidCharacter { code: 0x7F, .. }
        ));
    }

    #[test]
    fn test_all_printable_ascii_accepted() {
        // Every printable ASCII char (0x21-0x7E) should be valid individually
        for b in 0x21u8..=0x7Eu8 {
            let ch = String::from(b as char);
            assert!(
                validate_cell_name(&ch).is_ok(),
                "char 0x{:02X} ('{}') should be valid",
                b,
                b as char
            );
        }
        // A 32-char subset should also work
        let subset: String = (0x21u8..=0x40u8).map(|b| b as char).collect();
        assert!(validate_cell_name(&subset).is_ok());
    }
}

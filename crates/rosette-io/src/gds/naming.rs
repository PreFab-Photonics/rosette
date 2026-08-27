//! GDS II structure-name validation.

/// Maximum allowed length for a GDS structure name.
pub const MAX_STRUCTURE_NAME_LENGTH: usize = 32;

/// GDS II structure-name validation errors.
#[derive(Debug, Clone, thiserror::Error, PartialEq, Eq)]
pub enum GdsNameError {
    #[error("cell name cannot be empty")]
    Empty,

    #[error("cell name \"{name}\" is too long ({len} characters, max {MAX_STRUCTURE_NAME_LENGTH})")]
    TooLong { name: String, len: usize },

    #[error(
        "cell name contains invalid character '{ch}' - only ASCII letters, digits, '_', '?', and '$' are allowed"
    )]
    InvalidCharacter {
        name: String,
        ch: char,
        code: u32,
        position: usize,
    },
}

/// Validate a structure or reference target name for GDS II output.
pub fn validate_structure_name(name: &str) -> Result<(), GdsNameError> {
    if name.is_empty() {
        return Err(GdsNameError::Empty);
    }

    let char_count = name.chars().count();
    if char_count > MAX_STRUCTURE_NAME_LENGTH {
        return Err(GdsNameError::TooLong {
            name: name.to_string(),
            len: char_count,
        });
    }

    for (position, ch) in name.chars().enumerate() {
        let code = ch as u32;
        if !ch.is_ascii_alphanumeric() && !matches!(ch, '_' | '?' | '$') {
            return Err(GdsNameError::InvalidCharacter {
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
    fn accepts_release_6_characters_up_to_32_characters() {
        assert!(validate_structure_name("TOP").is_ok());
        assert!(validate_structure_name("cell_1?$ABC").is_ok());
        assert!(validate_structure_name(&"a".repeat(32)).is_ok());
        for ch in "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_?$".chars() {
            assert!(validate_structure_name(&ch.to_string()).is_ok());
        }
    }

    #[test]
    fn rejects_empty_long_punctuation_space_and_unicode_names() {
        assert_eq!(validate_structure_name(""), Err(GdsNameError::Empty));
        assert!(matches!(
            validate_structure_name(&"a".repeat(33)),
            Err(GdsNameError::TooLong { .. })
        ));
        assert!(matches!(
            validate_structure_name("has space"),
            Err(GdsNameError::InvalidCharacter { ch: ' ', .. })
        ));
        assert!(matches!(
            validate_structure_name("café"),
            Err(GdsNameError::InvalidCharacter { ch: 'é', .. })
        ));
        for name in ["cell-1", "cell.1", "A/B", "quoted\""] {
            assert!(matches!(
                validate_structure_name(name),
                Err(GdsNameError::InvalidCharacter { .. })
            ));
        }
    }
}

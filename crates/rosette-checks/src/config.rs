//! Check configuration.

use crate::violation::Severity;

/// Configuration for design checks.
#[derive(Debug, Clone)]
pub struct ChecksConfig {
    // -- Connectivity --
    /// Maximum distance between port centres to count as connected (design units).
    position_tolerance: f64,
    /// Maximum angular deviation from anti-parallel (degrees).
    angle_tolerance: f64,
    /// Maximum absolute width difference for connected ports (design units).
    width_tolerance: f64,
    /// Whether to flag connected ports that have different widths.
    check_widths: bool,

    // -- Bend radius --
    /// Minimum allowed bend radius (design units). `None` disables the check.
    min_bend_radius: Option<f64>,

    // -- General --
    /// Default severity for violations.
    severity: Severity,
}

impl Default for ChecksConfig {
    fn default() -> Self {
        Self {
            position_tolerance: 0.001,
            angle_tolerance: 0.1,
            width_tolerance: 1e-6,
            check_widths: true,
            min_bend_radius: None,
            severity: Severity::Error,
        }
    }
}

impl ChecksConfig {
    /// Create a new config with defaults.
    pub fn new() -> Self {
        Self::default()
    }

    /// Set the position tolerance, returning an error for invalid values.
    pub fn try_with_position_tolerance(
        mut self,
        tolerance: f64,
    ) -> Result<Self, ChecksConfigError> {
        validate_nonnegative_finite("position_tolerance", tolerance)?;
        self.position_tolerance = tolerance;
        Ok(self)
    }

    /// Set the position tolerance.
    pub fn with_position_tolerance(mut self, tolerance: f64) -> Self {
        self = self
            .try_with_position_tolerance(tolerance)
            .expect("position tolerance must be finite and nonnegative");
        self
    }

    /// Set the angle tolerance, returning an error for invalid values.
    pub fn try_with_angle_tolerance(mut self, tolerance: f64) -> Result<Self, ChecksConfigError> {
        if !tolerance.is_finite() || !(0.0..=180.0).contains(&tolerance) {
            return Err(ChecksConfigError::OutOfRange {
                field: "angle_tolerance",
                requirement: "must be finite and between 0 and 180 degrees",
            });
        }
        self.angle_tolerance = tolerance;
        Ok(self)
    }

    /// Set the angle tolerance (degrees).
    pub fn with_angle_tolerance(mut self, tolerance: f64) -> Self {
        self = self
            .try_with_angle_tolerance(tolerance)
            .expect("angle tolerance must be finite and between 0 and 180 degrees");
        self
    }

    /// Set the width tolerance, returning an error for invalid values.
    pub fn try_with_width_tolerance(mut self, tolerance: f64) -> Result<Self, ChecksConfigError> {
        validate_nonnegative_finite("width_tolerance", tolerance)?;
        self.width_tolerance = tolerance;
        Ok(self)
    }

    /// Set the width tolerance.
    pub fn with_width_tolerance(mut self, tolerance: f64) -> Self {
        self = self
            .try_with_width_tolerance(tolerance)
            .expect("width tolerance must be finite and nonnegative");
        self
    }

    /// Set whether to check width matching.
    pub fn with_check_widths(mut self, check: bool) -> Self {
        self.check_widths = check;
        self
    }

    /// Set the minimum bend radius.
    pub fn with_min_bend_radius(mut self, radius: f64) -> Self {
        self = self
            .try_with_min_bend_radius(radius)
            .expect("minimum bend radius must be finite and positive");
        self
    }

    /// Set the minimum bend radius, returning an error for invalid values.
    pub fn try_with_min_bend_radius(mut self, radius: f64) -> Result<Self, ChecksConfigError> {
        if !radius.is_finite() || radius <= 0.0 {
            return Err(ChecksConfigError::OutOfRange {
                field: "min_bend_radius",
                requirement: "must be finite and positive",
            });
        }
        self.min_bend_radius = Some(radius);
        Ok(self)
    }

    /// Set the default severity.
    pub fn with_severity(mut self, severity: Severity) -> Self {
        self.severity = severity;
        self
    }

    /// Maximum distance between connected port centres.
    pub fn position_tolerance(&self) -> f64 {
        self.position_tolerance
    }

    /// Maximum angular deviation from anti-parallel, in degrees.
    pub fn angle_tolerance(&self) -> f64 {
        self.angle_tolerance
    }

    /// Maximum absolute width difference for connected ports.
    pub fn width_tolerance(&self) -> f64 {
        self.width_tolerance
    }

    /// Whether connected port widths are checked.
    pub fn check_widths(&self) -> bool {
        self.check_widths
    }

    /// Minimum allowed bend radius, if the threshold check is enabled.
    pub fn min_bend_radius(&self) -> Option<f64> {
        self.min_bend_radius
    }

    /// Severity used for configurable violations.
    pub fn severity(&self) -> Severity {
        self.severity
    }
}

/// Invalid design-check configuration.
#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
pub enum ChecksConfigError {
    /// A numeric field is outside its supported range.
    #[error("{field} {requirement}")]
    OutOfRange {
        /// Configuration field name.
        field: &'static str,
        /// Human-readable range requirement.
        requirement: &'static str,
    },
}

fn validate_nonnegative_finite(field: &'static str, value: f64) -> Result<(), ChecksConfigError> {
    if !value.is_finite() || value < 0.0 {
        return Err(ChecksConfigError::OutOfRange {
            field,
            requirement: "must be finite and nonnegative",
        });
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn fallible_builders_reject_invalid_numeric_values() {
        assert!(
            ChecksConfig::new()
                .try_with_position_tolerance(f64::NAN)
                .is_err()
        );
        assert!(ChecksConfig::new().try_with_angle_tolerance(181.0).is_err());
        assert!(ChecksConfig::new().try_with_width_tolerance(-0.1).is_err());
        assert!(
            ChecksConfig::new()
                .try_with_min_bend_radius(f64::INFINITY)
                .is_err()
        );
    }
}

//! Check configuration.

use crate::violation::Severity;

/// Configuration for design checks.
#[derive(Debug, Clone)]
pub struct ChecksConfig {
    // -- Connectivity --
    /// Maximum distance between port centres to count as connected (design units).
    pub position_tolerance: f64,
    /// Maximum angular deviation from anti-parallel (degrees).
    pub angle_tolerance: f64,
    /// Whether to flag connected ports that have different widths.
    pub check_widths: bool,

    // -- Bend radius --
    /// Minimum allowed bend radius (design units). `None` disables the check.
    pub min_bend_radius: Option<f64>,

    // -- General --
    /// Default severity for violations.
    pub severity: Severity,
}

impl Default for ChecksConfig {
    fn default() -> Self {
        Self {
            position_tolerance: 0.001,
            angle_tolerance: 0.1,
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

    /// Set the position tolerance.
    pub fn with_position_tolerance(mut self, tolerance: f64) -> Self {
        self.position_tolerance = tolerance;
        self
    }

    /// Set the angle tolerance (degrees).
    pub fn with_angle_tolerance(mut self, tolerance: f64) -> Self {
        self.angle_tolerance = tolerance;
        self
    }

    /// Set whether to check width matching.
    pub fn with_check_widths(mut self, check: bool) -> Self {
        self.check_widths = check;
        self
    }

    /// Set the minimum bend radius.
    pub fn with_min_bend_radius(mut self, radius: f64) -> Self {
        self.min_bend_radius = Some(radius);
        self
    }

    /// Set the default severity.
    pub fn with_severity(mut self, severity: Severity) -> Self {
        self.severity = severity;
        self
    }
}

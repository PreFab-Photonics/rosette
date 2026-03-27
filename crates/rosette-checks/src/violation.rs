//! Check violation types.

use rosette_core::BBox;

/// Severity level of a check violation.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Severity {
    /// Critical violation that must be fixed.
    Error,
    /// Non-critical issue that should be reviewed.
    Warning,
}

/// Type of check violation.
#[derive(Debug, Clone, PartialEq)]
pub enum CheckViolationType {
    // -- Connectivity --
    /// Port has no connection partner within tolerance.
    UnconnectedPort,
    /// Connected ports have different widths.
    WidthMismatch {
        /// Width of the first port.
        width_a: f64,
        /// Width of the second port.
        width_b: f64,
    },
    /// Connected ports deviate from perfect anti-parallel alignment.
    AngleMismatch {
        /// Actual angular deviation in degrees.
        deviation_deg: f64,
        /// Configured tolerance in degrees.
        tolerance_deg: f64,
    },

    // -- Bend radius --
    /// Bend radius is below the configured minimum.
    BendRadiusTooSmall {
        /// Actual bend radius.
        radius: f64,
        /// Configured minimum.
        min_radius: f64,
    },
    /// Bend radius was auto-reduced from the requested value.
    BendRadiusAutoReduced {
        /// Effective bend radius after auto-reduction.
        radius: f64,
        /// Originally requested radius.
        requested_radius: f64,
    },
}

/// A single check violation.
#[derive(Debug, Clone)]
pub struct CheckViolation {
    /// Type of violation with details.
    pub violation_type: CheckViolationType,
    /// Name of the relevant port or component.
    pub name: String,
    /// Hierarchy path to the violation (e.g. "mmi_1/out_2").
    pub cell_path: String,
    /// Name of the partner port (for connectivity mismatch violations).
    pub partner_name: Option<String>,
    /// Hierarchy path to the partner port.
    pub partner_path: Option<String>,
    /// Bounding box around the violation location.
    pub location: BBox,
    /// Human-readable description.
    pub message: String,
    /// Severity level.
    pub severity: Severity,
}

impl CheckViolation {
    /// Create a new violation.
    pub fn new(
        violation_type: CheckViolationType,
        name: impl Into<String>,
        cell_path: impl Into<String>,
        location: BBox,
        message: impl Into<String>,
        severity: Severity,
    ) -> Self {
        Self {
            violation_type,
            name: name.into(),
            cell_path: cell_path.into(),
            partner_name: None,
            partner_path: None,
            location,
            message: message.into(),
            severity,
        }
    }

    /// Set the partner info (for connectivity mismatch violations).
    pub fn with_partner(mut self, name: impl Into<String>, cell_path: impl Into<String>) -> Self {
        self.partner_name = Some(name.into());
        self.partner_path = Some(cell_path.into());
        self
    }
}

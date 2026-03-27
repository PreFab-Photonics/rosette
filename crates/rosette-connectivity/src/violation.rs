//! Connectivity violation types.

use rosette_core::BBox;

/// Severity level of a connectivity violation.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Severity {
    /// Critical violation that must be fixed.
    Error,
    /// Non-critical issue that should be reviewed.
    Warning,
}

/// Type of connectivity violation.
#[derive(Debug, Clone, PartialEq)]
pub enum ConnViolationType {
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
}

/// A single connectivity violation.
#[derive(Debug, Clone)]
pub struct ConnViolation {
    /// Type of violation with details.
    pub violation_type: ConnViolationType,
    /// Name of the port being flagged.
    pub port_name: String,
    /// Hierarchy path to the port (e.g. "mmi_1/out_2").
    pub cell_path: String,
    /// Name of the partner port (for mismatch violations).
    pub partner_port: Option<String>,
    /// Hierarchy path to the partner port.
    pub partner_path: Option<String>,
    /// Bounding box around the violation location.
    pub location: BBox,
    /// Human-readable description.
    pub message: String,
    /// Severity level.
    pub severity: Severity,
}

impl ConnViolation {
    /// Create a new violation.
    pub fn new(
        violation_type: ConnViolationType,
        port_name: impl Into<String>,
        cell_path: impl Into<String>,
        location: BBox,
        message: impl Into<String>,
        severity: Severity,
    ) -> Self {
        Self {
            violation_type,
            port_name: port_name.into(),
            cell_path: cell_path.into(),
            partner_port: None,
            partner_path: None,
            location,
            message: message.into(),
            severity,
        }
    }

    /// Set the partner port info (for mismatch violations).
    pub fn with_partner(
        mut self,
        port_name: impl Into<String>,
        cell_path: impl Into<String>,
    ) -> Self {
        self.partner_port = Some(port_name.into());
        self.partner_path = Some(cell_path.into());
        self
    }
}

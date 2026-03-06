//! DRC violation types.

use rosette_core::{BBox, Layer};

/// Severity level of a DRC violation.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Severity {
    /// Critical violation that must be fixed.
    Error,
    /// Non-critical issue that should be reviewed.
    Warning,
}

/// Type of DRC rule that was violated.
#[derive(Debug, Clone, PartialEq)]
pub enum RuleType {
    /// Polygon width is below minimum.
    MinWidth {
        /// Required minimum width.
        required: f64,
        /// Actual measured width.
        actual: f64,
    },
    /// Spacing between polygons is below minimum.
    MinSpacing {
        /// Required minimum spacing.
        required: f64,
        /// Actual measured spacing.
        actual: f64,
    },
    /// Polygon area is below minimum.
    MinArea {
        /// Required minimum area.
        required: f64,
        /// Actual measured area.
        actual: f64,
    },
    /// Enclosure distance is below minimum.
    Enclosure {
        /// Required minimum enclosure.
        required: f64,
        /// Actual measured enclosure.
        actual: f64,
    },
    /// Overlap exists where it is forbidden.
    ForbiddenOverlap,
    /// Required overlap is missing.
    MissingOverlap,
    /// Edge angle is not in allowed set.
    ForbiddenAngle {
        /// The forbidden angle found (degrees).
        angle_deg: f64,
        /// List of allowed angles (degrees).
        allowed: Vec<f64>,
    },
}

/// A single DRC violation.
#[derive(Debug, Clone)]
pub struct DrcViolation {
    /// Optional rule name/ID for identification.
    pub rule_name: Option<String>,
    /// Type of violation with details.
    pub rule_type: RuleType,
    /// Bounding box of the violation location.
    pub location: BBox,
    /// Primary layer involved.
    pub layer: Layer,
    /// Secondary layer (for spacing/enclosure violations).
    pub layer2: Option<Layer>,
    /// Human-readable description.
    pub message: String,
    /// Severity level.
    pub severity: Severity,
}

impl DrcViolation {
    /// Create a new violation.
    pub fn new(
        rule_type: RuleType,
        location: BBox,
        layer: Layer,
        message: impl Into<String>,
    ) -> Self {
        Self {
            rule_name: None,
            rule_type,
            location,
            layer,
            layer2: None,
            message: message.into(),
            severity: Severity::Error,
        }
    }

    /// Set the rule name.
    pub fn with_name(mut self, name: impl Into<String>) -> Self {
        self.rule_name = Some(name.into());
        self
    }

    /// Set the secondary layer.
    pub fn with_layer2(mut self, layer: Layer) -> Self {
        self.layer2 = Some(layer);
        self
    }

    /// Set the severity level.
    pub fn with_severity(mut self, severity: Severity) -> Self {
        self.severity = severity;
        self
    }
}

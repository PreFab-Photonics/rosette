//! Python bindings for design checks.

use pyo3::prelude::*;

use rosette_checks::{
    CheckViolation, CheckViolationType, ChecksConfig, ChecksResult, Severity, run_checks,
};

use crate::layout::{PyCell, PyLibrary};

/// Design check configuration.
#[pyclass(name = "ChecksConfig")]
#[derive(Clone)]
pub struct PyChecksConfig(pub ChecksConfig);

#[pymethods]
impl PyChecksConfig {
    /// Create a new checks config.
    ///
    /// Args:
    ///     position_tolerance: Max gap between port centres to count as connected (default 0.001)
    ///     angle_tolerance: Max angular deviation from anti-parallel in degrees (default 0.1)
    ///     check_widths: Whether to flag width mismatches (default True)
    ///     min_bend_radius: Minimum allowed bend radius in um, or None to skip (default None)
    ///     severity: Default severity, "error" or "warning" (default "error")
    #[new]
    #[pyo3(signature = (
        position_tolerance=0.001,
        angle_tolerance=0.1,
        check_widths=true,
        min_bend_radius=None,
        severity="error",
    ))]
    fn new(
        position_tolerance: f64,
        angle_tolerance: f64,
        check_widths: bool,
        min_bend_radius: Option<f64>,
        severity: &str,
    ) -> PyResult<Self> {
        let sev = match severity {
            "error" => Severity::Error,
            "warning" => Severity::Warning,
            _ => {
                return Err(pyo3::exceptions::PyValueError::new_err(
                    "severity must be 'error' or 'warning'",
                ));
            }
        };
        let mut config = ChecksConfig::new()
            .with_position_tolerance(position_tolerance)
            .with_angle_tolerance(angle_tolerance)
            .with_check_widths(check_widths)
            .with_severity(sev);
        if let Some(r) = min_bend_radius {
            config = config.with_min_bend_radius(r);
        }
        Ok(PyChecksConfig(config))
    }

    fn __repr__(&self) -> String {
        format!(
            "ChecksConfig(tolerance={}, angle_tol={}°, check_widths={}, min_bend_radius={:?})",
            self.0.position_tolerance,
            self.0.angle_tolerance,
            self.0.check_widths,
            self.0.min_bend_radius,
        )
    }
}

/// A single check violation.
#[pyclass(name = "CheckViolation")]
#[derive(Clone)]
pub struct PyCheckViolation(pub CheckViolation);

#[pymethods]
impl PyCheckViolation {
    /// Violation type as string.
    #[getter]
    fn violation_type(&self) -> &'static str {
        match &self.0.violation_type {
            CheckViolationType::UnconnectedPort => "unconnected_port",
            CheckViolationType::WidthMismatch { .. } => "width_mismatch",
            CheckViolationType::AngleMismatch { .. } => "angle_mismatch",
            CheckViolationType::BendRadiusTooSmall { .. } => "bend_radius_too_small",
            CheckViolationType::BendRadiusAutoReduced { .. } => "bend_radius_auto_reduced",
        }
    }

    /// Name of the relevant port or component.
    #[getter]
    fn name(&self) -> String {
        self.0.name.clone()
    }

    /// Hierarchy path (e.g. "mmi_1/out_2").
    #[getter]
    fn cell_path(&self) -> String {
        self.0.cell_path.clone()
    }

    /// Name of the partner port (for connectivity mismatch violations).
    #[getter]
    fn partner_name(&self) -> Option<String> {
        self.0.partner_name.clone()
    }

    /// Hierarchy path to the partner port.
    #[getter]
    fn partner_path(&self) -> Option<String> {
        self.0.partner_path.clone()
    }

    /// Violation message.
    #[getter]
    fn message(&self) -> String {
        self.0.message.clone()
    }

    /// Violation severity ("error" or "warning").
    #[getter]
    fn severity(&self) -> &'static str {
        match self.0.severity {
            Severity::Error => "error",
            Severity::Warning => "warning",
        }
    }

    /// Bounding box of violation as ((min_x, min_y), (max_x, max_y)).
    #[getter]
    fn bbox(&self) -> ((f64, f64), (f64, f64)) {
        let bb = &self.0.location;
        ((bb.min().x, bb.min().y), (bb.max().x, bb.max().y))
    }

    fn __repr__(&self) -> String {
        format!(
            "CheckViolation({}: {})",
            self.violation_type(),
            self.0.message
        )
    }
}

/// Result of running design checks.
#[pyclass(name = "ChecksResult")]
#[derive(Clone)]
pub struct PyChecksResult(pub ChecksResult);

#[pymethods]
impl PyChecksResult {
    /// List of violations found.
    #[getter]
    fn violations(&self) -> Vec<PyCheckViolation> {
        self.0
            .violations
            .iter()
            .cloned()
            .map(PyCheckViolation)
            .collect()
    }

    /// Number of violations.
    fn __len__(&self) -> usize {
        self.0.violations.len()
    }

    /// True if no violations were found.
    #[getter]
    fn passed(&self) -> bool {
        self.0.passed()
    }

    /// Number of ports checked.
    #[getter]
    fn ports_checked(&self) -> usize {
        self.0.stats.ports_checked
    }

    /// Number of port-to-port connections found.
    #[getter]
    fn connections_found(&self) -> usize {
        self.0.stats.connections_found
    }

    /// Number of bends checked.
    #[getter]
    fn bends_checked(&self) -> usize {
        self.0.stats.bends_checked
    }

    /// Elapsed time in milliseconds.
    #[getter]
    fn elapsed_ms(&self) -> f64 {
        self.0.stats.elapsed.as_secs_f64() * 1000.0
    }

    fn __repr__(&self) -> String {
        if self.0.passed() {
            format!(
                "ChecksResult(PASSED, {} ports, {} bends, {:.1}ms)",
                self.0.stats.ports_checked,
                self.0.stats.bends_checked,
                self.elapsed_ms()
            )
        } else {
            format!(
                "ChecksResult(FAILED, {} violations, {} ports, {} bends, {:.1}ms)",
                self.0.violations.len(),
                self.0.stats.ports_checked,
                self.0.stats.bends_checked,
                self.elapsed_ms()
            )
        }
    }
}

/// Run design checks on a cell.
#[pyfunction]
#[pyo3(name = "run_checks", signature = (cell, config=None, library=None))]
pub fn py_run_checks(
    cell: &PyCell,
    config: Option<&PyChecksConfig>,
    library: Option<&PyLibrary>,
) -> PyChecksResult {
    let default_config = ChecksConfig::default();
    let cfg = config.map(|c| &c.0).unwrap_or(&default_config);
    let lib_ref = library.map(|l| &l.0);
    let result = run_checks(&cell.0, cfg, lib_ref);
    PyChecksResult(result)
}

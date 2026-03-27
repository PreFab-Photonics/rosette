//! Python bindings for connectivity checking.

use pyo3::prelude::*;

use rosette_connectivity::{
    ConnViolation, ConnViolationType, ConnectivityConfig, ConnectivityResult, Severity,
    run_connectivity,
};

use crate::layout::{PyCell, PyLibrary};

/// Connectivity check configuration.
#[pyclass(name = "ConnectivityConfig")]
#[derive(Clone)]
pub struct PyConnectivityConfig(pub ConnectivityConfig);

#[pymethods]
impl PyConnectivityConfig {
    /// Create a new connectivity config.
    ///
    /// Args:
    ///     position_tolerance: Max gap between port centres to count as connected (default 0.001)
    ///     angle_tolerance: Max angular deviation from anti-parallel in degrees (default 0.1)
    ///     check_widths: Whether to flag width mismatches (default True)
    ///     severity: Default severity, "error" or "warning" (default "error")
    #[new]
    #[pyo3(signature = (
        position_tolerance=0.001,
        angle_tolerance=0.1,
        check_widths=true,
        severity="error",
    ))]
    fn new(
        position_tolerance: f64,
        angle_tolerance: f64,
        check_widths: bool,
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
        Ok(PyConnectivityConfig(
            ConnectivityConfig::new()
                .with_position_tolerance(position_tolerance)
                .with_angle_tolerance(angle_tolerance)
                .with_check_widths(check_widths)
                .with_severity(sev),
        ))
    }

    fn __repr__(&self) -> String {
        format!(
            "ConnectivityConfig(tolerance={}, angle_tol={}°, check_widths={})",
            self.0.position_tolerance, self.0.angle_tolerance, self.0.check_widths,
        )
    }
}

/// A single connectivity violation.
#[pyclass(name = "ConnViolation")]
#[derive(Clone)]
pub struct PyConnViolation(pub ConnViolation);

#[pymethods]
impl PyConnViolation {
    /// Violation type as string ("unconnected_port", "width_mismatch", "angle_mismatch").
    #[getter]
    fn violation_type(&self) -> &'static str {
        match &self.0.violation_type {
            ConnViolationType::UnconnectedPort => "unconnected_port",
            ConnViolationType::WidthMismatch { .. } => "width_mismatch",
            ConnViolationType::AngleMismatch { .. } => "angle_mismatch",
        }
    }

    /// Name of the port being flagged.
    #[getter]
    fn port_name(&self) -> String {
        self.0.port_name.clone()
    }

    /// Hierarchy path to the port (e.g. "mmi_1/out_2").
    #[getter]
    fn cell_path(&self) -> String {
        self.0.cell_path.clone()
    }

    /// Name of the partner port (for mismatch violations).
    #[getter]
    fn partner_port(&self) -> Option<String> {
        self.0.partner_port.clone()
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
            "ConnViolation({}: {})",
            self.violation_type(),
            self.0.message
        )
    }
}

/// Result of running a connectivity check.
#[pyclass(name = "ConnectivityResult")]
#[derive(Clone)]
pub struct PyConnectivityResult(pub ConnectivityResult);

#[pymethods]
impl PyConnectivityResult {
    /// List of violations found.
    #[getter]
    fn violations(&self) -> Vec<PyConnViolation> {
        self.0
            .violations
            .iter()
            .cloned()
            .map(PyConnViolation)
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

    /// Elapsed time in milliseconds.
    #[getter]
    fn elapsed_ms(&self) -> f64 {
        self.0.stats.elapsed.as_secs_f64() * 1000.0
    }

    fn __repr__(&self) -> String {
        if self.0.passed() {
            format!(
                "ConnectivityResult(PASSED, {} ports, {} connections, {:.1}ms)",
                self.0.stats.ports_checked,
                self.0.stats.connections_found,
                self.elapsed_ms()
            )
        } else {
            format!(
                "ConnectivityResult(FAILED, {} violations, {} ports, {:.1}ms)",
                self.0.violations.len(),
                self.0.stats.ports_checked,
                self.elapsed_ms()
            )
        }
    }
}

/// Run connectivity check on a cell.
#[pyfunction]
#[pyo3(name = "run_connectivity", signature = (cell, config=None, library=None))]
pub fn py_run_connectivity(
    cell: &PyCell,
    config: Option<&PyConnectivityConfig>,
    library: Option<&PyLibrary>,
) -> PyConnectivityResult {
    let default_config = ConnectivityConfig::default();
    let cfg = config.map(|c| &c.0).unwrap_or(&default_config);
    let lib_ref = library.map(|l| &l.0);
    let result = run_connectivity(&cell.0, cfg, lib_ref);
    PyConnectivityResult(result)
}

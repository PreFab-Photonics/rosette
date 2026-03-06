//! Python bindings for DRC.

use pyo3::prelude::*;

use rosette_drc::{DrcResult, DrcRules, DrcRunner, DrcViolation, RuleType, Severity};

use crate::extract_layer;
use crate::layout::{PyCell, PyLibrary};

/// DRC rule builder.
#[pyclass(name = "DrcRules")]
#[derive(Clone)]
pub struct PyDrcRules(pub DrcRules);

#[pymethods]
impl PyDrcRules {
    #[new]
    fn new() -> Self {
        PyDrcRules(DrcRules::new())
    }

    /// Add minimum width rule.
    #[pyo3(signature = (layer, width, name=None))]
    fn min_width(
        &self,
        layer: &Bound<'_, PyAny>,
        width: f64,
        name: Option<&str>,
    ) -> PyResult<Self> {
        let layer = extract_layer(layer)?;
        Ok(PyDrcRules(self.0.clone().min_width(layer, width, name)))
    }

    /// Add minimum spacing rule.
    #[pyo3(signature = (layer1, layer2, spacing, name=None))]
    fn min_spacing(
        &self,
        layer1: &Bound<'_, PyAny>,
        layer2: &Bound<'_, PyAny>,
        spacing: f64,
        name: Option<&str>,
    ) -> PyResult<Self> {
        let layer1 = extract_layer(layer1)?;
        let layer2 = extract_layer(layer2)?;
        Ok(PyDrcRules(
            self.0.clone().min_spacing(layer1, layer2, spacing, name),
        ))
    }

    /// Add minimum area rule.
    #[pyo3(signature = (layer, area, name=None))]
    fn min_area(&self, layer: &Bound<'_, PyAny>, area: f64, name: Option<&str>) -> PyResult<Self> {
        let layer = extract_layer(layer)?;
        Ok(PyDrcRules(self.0.clone().min_area(layer, area, name)))
    }

    /// Add enclosure rule.
    #[pyo3(signature = (inner, outer, enclosure, name=None))]
    fn min_enclosure(
        &self,
        inner: &Bound<'_, PyAny>,
        outer: &Bound<'_, PyAny>,
        enclosure: f64,
        name: Option<&str>,
    ) -> PyResult<Self> {
        let inner = extract_layer(inner)?;
        let outer = extract_layer(outer)?;
        Ok(PyDrcRules(
            self.0.clone().min_enclosure(inner, outer, enclosure, name),
        ))
    }

    /// Add required overlap rule.
    #[pyo3(signature = (layer1, layer2, name=None))]
    fn require_overlap(
        &self,
        layer1: &Bound<'_, PyAny>,
        layer2: &Bound<'_, PyAny>,
        name: Option<&str>,
    ) -> PyResult<Self> {
        let layer1 = extract_layer(layer1)?;
        let layer2 = extract_layer(layer2)?;
        Ok(PyDrcRules(
            self.0.clone().require_overlap(layer1, layer2, name),
        ))
    }

    /// Add forbidden overlap rule.
    #[pyo3(signature = (layer1, layer2, name=None))]
    fn forbid_overlap(
        &self,
        layer1: &Bound<'_, PyAny>,
        layer2: &Bound<'_, PyAny>,
        name: Option<&str>,
    ) -> PyResult<Self> {
        let layer1 = extract_layer(layer1)?;
        let layer2 = extract_layer(layer2)?;
        Ok(PyDrcRules(
            self.0.clone().forbid_overlap(layer1, layer2, name),
        ))
    }

    /// Add allowed angles rule.
    #[pyo3(signature = (layer, angles, name=None))]
    fn allowed_angles(
        &self,
        layer: &Bound<'_, PyAny>,
        angles: Vec<f64>,
        name: Option<&str>,
    ) -> PyResult<Self> {
        let layer = extract_layer(layer)?;
        Ok(PyDrcRules(
            self.0.clone().allowed_angles(layer, &angles, name),
        ))
    }

    fn __repr__(&self) -> String {
        format!("DrcRules({} rules)", self.0.rules().len())
    }
}

/// A single DRC violation.
#[pyclass(name = "DrcViolation")]
#[derive(Clone)]
pub struct PyDrcViolation(pub DrcViolation);

#[pymethods]
impl PyDrcViolation {
    /// Rule name (if provided).
    #[getter]
    fn rule_name(&self) -> Option<String> {
        self.0.rule_name.clone()
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

    /// Rule type as string.
    #[getter]
    fn rule_type(&self) -> String {
        match &self.0.rule_type {
            RuleType::MinWidth { .. } => "min_width".to_string(),
            RuleType::MinSpacing { .. } => "min_spacing".to_string(),
            RuleType::MinArea { .. } => "min_area".to_string(),
            RuleType::Enclosure { .. } => "enclosure".to_string(),
            RuleType::ForbiddenOverlap => "forbidden_overlap".to_string(),
            RuleType::MissingOverlap => "missing_overlap".to_string(),
            RuleType::ForbiddenAngle { .. } => "forbidden_angle".to_string(),
        }
    }

    /// Primary layer number.
    #[getter]
    fn layer(&self) -> (u16, u16) {
        (self.0.layer.number, self.0.layer.datatype)
    }

    /// Secondary layer (for spacing/enclosure violations).
    #[getter]
    fn layer2(&self) -> Option<(u16, u16)> {
        self.0.layer2.map(|l| (l.number, l.datatype))
    }

    /// Bounding box of violation as ((min_x, min_y), (max_x, max_y)).
    #[getter]
    fn bbox(&self) -> ((f64, f64), (f64, f64)) {
        let bb = &self.0.location;
        ((bb.min().x, bb.min().y), (bb.max().x, bb.max().y))
    }

    fn __repr__(&self) -> String {
        format!(
            "DrcViolation({}: {})",
            self.0.rule_name.as_deref().unwrap_or(&self.rule_type()),
            self.0.message
        )
    }
}

/// Result of running DRC.
#[pyclass(name = "DrcResult")]
#[derive(Clone)]
pub struct PyDrcResult(pub DrcResult);

#[pymethods]
impl PyDrcResult {
    /// List of violations found.
    #[getter]
    fn violations(&self) -> Vec<PyDrcViolation> {
        self.0
            .violations
            .iter()
            .cloned()
            .map(PyDrcViolation)
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

    /// Number of polygons checked.
    #[getter]
    fn polygons_checked(&self) -> usize {
        self.0.stats.polygons_checked
    }

    /// Number of rules checked.
    #[getter]
    fn rules_checked(&self) -> usize {
        self.0.stats.rules_checked
    }

    /// Elapsed time in milliseconds.
    #[getter]
    fn elapsed_ms(&self) -> f64 {
        self.0.stats.elapsed.as_secs_f64() * 1000.0
    }

    fn __repr__(&self) -> String {
        if self.0.passed() {
            format!(
                "DrcResult(PASSED, {} polygons, {:.1}ms)",
                self.0.stats.polygons_checked,
                self.elapsed_ms()
            )
        } else {
            format!(
                "DrcResult(FAILED, {} violations, {} polygons, {:.1}ms)",
                self.0.violations.len(),
                self.0.stats.polygons_checked,
                self.elapsed_ms()
            )
        }
    }
}

/// Run DRC on a cell.
#[pyfunction]
#[pyo3(name = "run_drc", signature = (cell, rules, library=None))]
pub fn py_run_drc(cell: &PyCell, rules: &PyDrcRules, library: Option<&PyLibrary>) -> PyDrcResult {
    let lib_ref = library.map(|l| &l.0);
    let result = DrcRunner::new(rules.0.clone()).check(&cell.0, lib_ref);
    PyDrcResult(result)
}

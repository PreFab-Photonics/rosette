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

    /// Add minimum edge length rule.
    #[pyo3(signature = (layer, length, name=None))]
    fn min_edge_length(
        &self,
        layer: &Bound<'_, PyAny>,
        length: f64,
        name: Option<&str>,
    ) -> PyResult<Self> {
        let layer = extract_layer(layer)?;
        Ok(PyDrcRules(
            self.0.clone().min_edge_length(layer, length, name),
        ))
    }

    /// Add self-intersection check.
    #[pyo3(signature = (layer, name=None))]
    fn no_self_intersection(&self, layer: &Bound<'_, PyAny>, name: Option<&str>) -> PyResult<Self> {
        let layer = extract_layer(layer)?;
        Ok(PyDrcRules(self.0.clone().no_self_intersection(layer, name)))
    }

    /// Add maximum width rule.
    #[pyo3(signature = (layer, width, name=None))]
    fn max_width(
        &self,
        layer: &Bound<'_, PyAny>,
        width: f64,
        name: Option<&str>,
    ) -> PyResult<Self> {
        let layer = extract_layer(layer)?;
        Ok(PyDrcRules(self.0.clone().max_width(layer, width, name)))
    }

    /// Add snap-to-grid check.
    #[pyo3(signature = (layer, grid_pitch, name=None))]
    fn snap_to_grid(
        &self,
        layer: &Bound<'_, PyAny>,
        grid_pitch: f64,
        name: Option<&str>,
    ) -> PyResult<Self> {
        let layer = extract_layer(layer)?;
        Ok(PyDrcRules(
            self.0.clone().snap_to_grid(layer, grid_pitch, name),
        ))
    }

    /// Add acute interior angle check.
    #[pyo3(signature = (layer, threshold_deg, name=None))]
    fn acute_angle(
        &self,
        layer: &Bound<'_, PyAny>,
        threshold_deg: f64,
        name: Option<&str>,
    ) -> PyResult<Self> {
        let layer = extract_layer(layer)?;
        Ok(PyDrcRules(self.0.clone().acute_angle(
            layer,
            threshold_deg,
            name,
        )))
    }

    /// Add not-inside / exclusion-zone rule.
    #[pyo3(signature = (inner, outer, name=None))]
    fn not_inside(
        &self,
        inner: &Bound<'_, PyAny>,
        outer: &Bound<'_, PyAny>,
        name: Option<&str>,
    ) -> PyResult<Self> {
        let inner = extract_layer(inner)?;
        let outer = extract_layer(outer)?;
        Ok(PyDrcRules(self.0.clone().not_inside(inner, outer, name)))
    }

    /// Add layer-density (CMP uniformity) check.
    ///
    /// At least one of `min` or `max` must be provided. Window/step are in
    /// design units. `region_layer` is an optional marker whose union
    /// defines the region — if not given, the bbox of all placed geometry
    /// in the design is used.
    #[pyo3(signature = (layer, window, step, min=None, max=None, region_layer=None, name=None))]
    #[allow(clippy::too_many_arguments)]
    fn density(
        &self,
        layer: &Bound<'_, PyAny>,
        window: f64,
        step: f64,
        min: Option<f64>,
        max: Option<f64>,
        region_layer: Option<&Bound<'_, PyAny>>,
        name: Option<&str>,
    ) -> PyResult<Self> {
        let layer = extract_layer(layer)?;
        if min.is_none() && max.is_none() {
            return Err(pyo3::exceptions::PyValueError::new_err(
                "density: at least one of min or max must be provided",
            ));
        }
        if window <= 0.0 {
            return Err(pyo3::exceptions::PyValueError::new_err(
                "density: window must be positive",
            ));
        }
        if step <= 0.0 {
            return Err(pyo3::exceptions::PyValueError::new_err(
                "density: step must be positive",
            ));
        }
        if let (Some(lo), Some(hi)) = (min, max)
            && lo > hi
        {
            return Err(pyo3::exceptions::PyValueError::new_err(format!(
                "density: min ({lo}) must be <= max ({hi})"
            )));
        }
        let region_layer = match region_layer {
            Some(rl) => Some(extract_layer(rl)?),
            None => None,
        };
        Ok(PyDrcRules(self.0.clone().density(
            layer,
            min,
            max,
            window,
            step,
            region_layer,
            name,
        )))
    }

    /// Set a global warning margin (in user units, typically µm).
    ///
    /// Near-threshold violations on length-based numeric rules (``min_width``,
    /// ``min_spacing``, ``min_enclosure``, ``min_edge_length``, ``max_width``)
    /// whose measured value is within ``margin`` of the required threshold
    /// are reported as ``severity == "warning"`` instead of ``"error"``.
    /// Warnings do not cause ``DrcResult.passed`` to be ``False`` and do not
    /// fail ``rosette check`` / ``rosette drc``.
    ///
    /// ``min_area`` and ``density`` are intentionally excluded (their values
    /// are not in length units) and remain strict errors.
    ///
    /// Pass ``0.0`` to disable (the default behavior — every violation is an
    /// error).
    #[pyo3(signature = (margin))]
    fn warning_margin(&self, margin: f64) -> Self {
        PyDrcRules(self.0.clone().warning_margin(margin))
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
            RuleType::MinEdgeLength { .. } => "min_edge_length".to_string(),
            RuleType::SelfIntersection => "self_intersection".to_string(),
            RuleType::MaxWidth { .. } => "max_width".to_string(),
            RuleType::OffGrid { .. } => "off_grid".to_string(),
            RuleType::AcuteAngle { .. } => "acute_angle".to_string(),
            RuleType::NotInside => "not_inside".to_string(),
            RuleType::Density { .. } => "density".to_string(),
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

    /// Name of the cell containing the first polygon (for pairwise violations).
    #[getter]
    fn cell_name(&self) -> Option<String> {
        self.0.cell_name.clone()
    }

    /// Name of the cell containing the second polygon (for pairwise violations).
    #[getter]
    fn cell_name2(&self) -> Option<String> {
        self.0.cell_name2.clone()
    }

    fn __repr__(&self) -> String {
        let cells_str = match (&self.0.cell_name, &self.0.cell_name2) {
            (Some(a), Some(b)) if a == b => format!(", within '{}'", a),
            (Some(a), Some(b)) => format!(", between '{}' and '{}'", a, b),
            _ => String::new(),
        };
        format!(
            "DrcViolation({}: {}{})",
            self.0.rule_name.as_deref().unwrap_or(&self.rule_type()),
            self.0.message,
            cells_str
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

    /// Total number of violations (errors plus warnings).
    ///
    /// Use ``error_count`` / ``warning_count`` or ``passed`` to gate
    /// pass/fail decisions — warnings do not cause ``passed`` to be
    /// ``False``.
    fn __len__(&self) -> usize {
        self.0.violations.len()
    }

    /// True if no error-severity violations were found.
    ///
    /// Warnings (see ``DrcRules.warning_margin``) do not cause this to be
    /// ``False``.
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

    /// Number of error-severity violations.
    #[getter]
    fn error_count(&self) -> usize {
        self.0.error_count()
    }

    /// Number of warning-severity violations.
    #[getter]
    fn warning_count(&self) -> usize {
        self.0.warning_count()
    }

    /// Number of violations suppressed by `drc_skip` post-filtering.
    ///
    /// A violation is suppressed if every cell it names has ``drc_skip =
    /// True`` (or is within the subtree of a trusted cell). Violations with
    /// unknown cell-name provenance are always kept.
    #[getter]
    fn suppressed_violations(&self) -> usize {
        self.0.stats.suppressed_violations
    }

    /// Number of unique cells in the skipped-cell closure for this run.
    ///
    /// This is the count of cells that either have ``drc_skip = True`` or
    /// are reachable from such a cell via ``CellRef``.
    #[getter]
    fn skipped_cells(&self) -> usize {
        self.0.stats.skipped_cells
    }

    fn __repr__(&self) -> String {
        let errors = self.0.error_count();
        let warnings = self.0.warning_count();
        let suppressed = self.0.stats.suppressed_violations;
        let suppressed_suffix = if suppressed > 0 {
            format!(", {} suppressed", suppressed)
        } else {
            String::new()
        };
        if self.0.passed() {
            if warnings == 0 {
                format!(
                    "DrcResult(PASSED, {} polygons{}, {:.1}ms)",
                    self.0.stats.polygons_checked,
                    suppressed_suffix,
                    self.elapsed_ms()
                )
            } else {
                format!(
                    "DrcResult(PASSED, {} warnings, {} polygons{}, {:.1}ms)",
                    warnings,
                    self.0.stats.polygons_checked,
                    suppressed_suffix,
                    self.elapsed_ms()
                )
            }
        } else {
            format!(
                "DrcResult(FAILED, {} errors, {} warnings, {} polygons{}, {:.1}ms)",
                errors,
                warnings,
                self.0.stats.polygons_checked,
                suppressed_suffix,
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

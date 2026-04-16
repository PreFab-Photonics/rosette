//! Python bindings for the polygon rasterizer.

use std::collections::HashMap;

use pyo3::exceptions::{PyRuntimeError, PyValueError};
use pyo3::prelude::*;
use pyo3::types::{PyBytes, PyDict};

use rosette_raster::palette::parse_hex_rgba;
use rosette_raster::{Palette, RenderError, RenderOptions, ViewTransform, render_png};

use crate::geometry::PyBBox;
use crate::layout::PyLibrary;

/// Result of a render call: PNG bytes, world↔pixel transform, layers drawn.
#[pyclass(name = "RenderResult", module = "rosette._core")]
pub struct PyRenderResult {
    png_bytes: Vec<u8>,
    view: ViewTransform,
    layers: Vec<(u16, u16)>,
}

#[pymethods]
impl PyRenderResult {
    /// PNG-encoded image bytes.
    #[getter]
    fn png<'py>(&self, py: Python<'py>) -> Bound<'py, PyBytes> {
        PyBytes::new(py, &self.png_bytes)
    }

    /// World↔pixel transform metadata as a dict — suitable for direct
    /// JSON serialization as a sidecar next to the PNG.
    ///
    /// Keys:
    /// - `scale_px_per_um` (float): pixels per micron, uniform (aspect preserved).
    /// - `offset_x_px` (float): X pixel offset added during world→pixel mapping.
    /// - `offset_y_px` (float): Y pixel offset added during world→pixel mapping (after Y-axis flip).
    /// - `canvas_px` (tuple[int, int]): final image size as `(width, height)`.
    /// - `world_bbox_um` (dict): visible region in microns, with keys
    ///   `min` and `max`, each a `(x, y)` tuple. The rendered design may
    ///   be smaller than this box due to aspect-preserving letterboxing.
    #[getter]
    fn view<'py>(&self, py: Python<'py>) -> PyResult<Bound<'py, PyDict>> {
        let d = PyDict::new(py);
        d.set_item("scale_px_per_um", self.view.scale_px_per_um as f64)?;
        d.set_item("offset_x_px", self.view.offset_x_px as f64)?;
        d.set_item("offset_y_px", self.view.offset_y_px as f64)?;
        d.set_item(
            "canvas_px",
            (self.view.canvas_px.0, self.view.canvas_px.1),
        )?;
        let bbox = PyDict::new(py);
        bbox.set_item(
            "min",
            (self.view.world_bbox.min().x, self.view.world_bbox.min().y),
        )?;
        bbox.set_item(
            "max",
            (self.view.world_bbox.max().x, self.view.world_bbox.max().y),
        )?;
        d.set_item("world_bbox_um", bbox)?;
        Ok(d)
    }

    /// `(layer, datatype)` pairs that contributed pixels, in draw order.
    #[getter]
    fn layers_rendered(&self) -> Vec<(u16, u16)> {
        self.layers.clone()
    }

    /// Convert a pixel coordinate in the rendered image back to design
    /// (micron) coordinates. Useful for mapping LLM-spotted pixel regions
    /// to actual layout positions.
    fn px_to_world(&self, px: f32, py: f32) -> (f64, f64) {
        self.view.px_to_world(px, py)
    }

    /// Convert design (micron) coordinates to pixel position in the
    /// rendered image.
    fn world_to_px(&self, x: f64, y: f64) -> (f32, f32) {
        self.view.world_to_px(x, y)
    }

    fn __repr__(&self) -> String {
        format!(
            "RenderResult({} bytes, {}x{}, {} layers)",
            self.png_bytes.len(),
            self.view.canvas_px.0,
            self.view.canvas_px.1,
            self.layers.len(),
        )
    }
}

/// Render a library to a PNG image.
///
/// Args:
///     library: The Library to render.
///     bbox: Optional explicit world-space region (microns). If omitted,
///         derived from `cell` or the full library extent.
///     cell: Render only the named cell instead of the top cell.
///     layers: Restrict rendering to these `(layer, datatype)` pairs.
///     width: Output width in pixels. Default 1024.
///     height: Output height in pixels. If None, derived from aspect ratio.
///     pad: Fractional padding around the target bbox (0.1 = 10%).
///     bg: Background color as `#RRGGBB` or `#RRGGBBAA`. Default `#1a1a1a`.
///     fill_alpha: Alpha applied to layer fill colors (0-255). Default 178 (~70%).
///     palette: Optional `{layer_number: hex_color}` overrides. Layers not
///         present fall back to the auto-assigned shared palette.
///
/// Returns:
///     RenderResult with `png` (bytes), `view` (dict), and `layers_rendered`.
#[pyfunction]
#[pyo3(
    name = "render_png",
    signature = (
        library,
        *,
        bbox=None,
        cell=None,
        layers=None,
        width=1024,
        height=None,
        pad=0.1,
        bg="#1a1a1a",
        fill_alpha=178,
        palette=None,
    ),
)]
#[allow(clippy::too_many_arguments)]
pub fn py_render_png(
    library: &PyLibrary,
    bbox: Option<&PyBBox>,
    cell: Option<String>,
    layers: Option<Vec<(u16, u16)>>,
    width: u32,
    height: Option<u32>,
    pad: f32,
    bg: &str,
    fill_alpha: u8,
    palette: Option<HashMap<u16, String>>,
) -> PyResult<PyRenderResult> {
    let background = parse_hex_rgba(bg).ok_or_else(|| {
        PyValueError::new_err(format!(
            "invalid bg color '{bg}', expected '#RRGGBB' or '#RRGGBBAA'"
        ))
    })?;

    let palette_obj = match palette {
        None => None,
        Some(map) => {
            let mut overrides: HashMap<u16, [u8; 4]> = HashMap::with_capacity(map.len());
            for (layer_num, hex) in map {
                let rgba = parse_hex_rgba(&hex).ok_or_else(|| {
                    PyValueError::new_err(format!(
                        "invalid color '{hex}' for layer {layer_num}, expected '#RRGGBB' or '#RRGGBBAA'"
                    ))
                })?;
                overrides.insert(layer_num, rgba);
            }
            Some(Palette::shared().with_overrides(overrides))
        }
    };

    let opts = RenderOptions {
        bbox: bbox.map(|b| b.0),
        cell,
        layers,
        width_px: width,
        height_px: height,
        pad,
        background,
        fill_alpha,
        palette: palette_obj,
        draw_axes: false,
    };

    let result = render_png(&library.0, &opts).map_err(map_render_error)?;

    Ok(PyRenderResult {
        png_bytes: result.png,
        view: result.view,
        layers: result.layers_rendered,
    })
}

fn map_render_error(e: RenderError) -> PyErr {
    match e {
        RenderError::CellNotFound(_)
        | RenderError::EmptyDesign
        | RenderError::InvalidCanvas { .. } => PyValueError::new_err(e.to_string()),
        RenderError::Raster(_) | RenderError::Encode(_) => PyRuntimeError::new_err(e.to_string()),
    }
}

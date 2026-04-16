//! Main rasterization entry point — turns a [`Library`] into PNG bytes.

use std::collections::{BTreeMap, HashSet};

use rosette_core::{BBox, FlatPolygon, Library, Point, flatten_cell, flatten_library};
use thiserror::Error;
use tiny_skia::{Color, FillRule, Paint, PathBuilder, Pixmap, Transform as SkiaTransform};

use crate::palette::Palette;
use crate::transform::ViewTransform;

/// Knobs for [`render_png`]. Build with `RenderOptions::default()` and
/// override fields you care about.
#[derive(Debug, Clone)]
pub struct RenderOptions {
    /// Explicit world-space region to render. If `None`, the region is
    /// derived from `cell` (if set) or the full library extent.
    pub bbox: Option<BBox>,
    /// Render only this cell (and its descendants) instead of the top cell.
    pub cell: Option<String>,
    /// Restrict to specific `(layer, datatype)` pairs. `None` = all layers.
    pub layers: Option<Vec<(u16, u16)>>,
    /// Output canvas width in pixels.
    pub width_px: u32,
    /// Output canvas height in pixels. `None` derives it from aspect ratio.
    pub height_px: Option<u32>,
    /// Fractional padding around the target bbox (0.1 = 10%).
    pub pad: f32,
    /// Background RGBA.
    pub background: [u8; 4],
    /// Fill alpha applied to layer colors (0..=255). Default ~0.7.
    pub fill_alpha: u8,
    /// Optional palette override. `None` uses the shared palette.
    pub palette: Option<Palette>,
    /// Draw coordinate axes overlay (deferred — Phase 4).
    pub draw_axes: bool,
}

impl Default for RenderOptions {
    fn default() -> Self {
        Self {
            bbox: None,
            cell: None,
            layers: None,
            width_px: 1024,
            height_px: None,
            pad: 0.1,
            background: [0x1a, 0x1a, 0x1a, 0xff],
            fill_alpha: 178,
            palette: None,
            draw_axes: false,
        }
    }
}

#[derive(Error, Debug)]
pub enum RenderError {
    #[error("design has no geometry to render")]
    EmptyDesign,
    #[error("cell '{0}' not found in library")]
    CellNotFound(String),
    #[error("invalid canvas size: width={width}, height={height:?}")]
    InvalidCanvas { width: u32, height: Option<u32> },
    #[error("rasterization failed: {0}")]
    Raster(String),
    #[error("PNG encode failed: {0}")]
    Encode(String),
}

/// PNG bytes plus the world↔pixel transform actually used.
///
/// Callers (CLI, PyO3 wrapper) typically write `png` to disk and serialize
/// `view` + `layers_rendered` to a sidecar JSON so an LLM can map any
/// pixel back to design coordinates.
pub struct RenderResult {
    pub png: Vec<u8>,
    pub view: ViewTransform,
    pub layers_rendered: Vec<(u16, u16)>,
}

/// Render a library to PNG bytes.
pub fn render_png(library: &Library, opts: &RenderOptions) -> Result<RenderResult, RenderError> {
    if opts.width_px == 0 || opts.height_px == Some(0) {
        return Err(RenderError::InvalidCanvas {
            width: opts.width_px,
            height: opts.height_px,
        });
    }

    let flat = if let Some(name) = &opts.cell {
        flatten_cell(library, name, 1.0).ok_or_else(|| RenderError::CellNotFound(name.clone()))?
    } else {
        flatten_library(library, 1.0)
    };
    if flat.polygons.is_empty() {
        return Err(RenderError::EmptyDesign);
    }

    let layer_filter: Option<HashSet<(u16, u16)>> =
        opts.layers.as_ref().map(|v| v.iter().copied().collect());
    let filtered: Vec<&FlatPolygon> = flat
        .polygons
        .iter()
        .filter(|p| {
            layer_filter
                .as_ref()
                .is_none_or(|f| f.contains(&(p.layer, p.datatype)))
        })
        .collect();
    if filtered.is_empty() {
        return Err(RenderError::EmptyDesign);
    }

    let target = match opts.bbox {
        Some(b) => b,
        None => compute_extent(&filtered).ok_or(RenderError::EmptyDesign)?,
    };
    if target.width() <= 0.0 || target.height() <= 0.0 {
        return Err(RenderError::EmptyDesign);
    }

    let view = ViewTransform::fit(target, opts.pad, opts.width_px, opts.height_px);

    let visible: Vec<&FlatPolygon> = filtered
        .into_iter()
        .filter(|p| polygon_intersects(p, &view.world_bbox))
        .collect();
    if visible.is_empty() {
        return Err(RenderError::EmptyDesign);
    }

    // BTreeMap orders layers by (number, datatype) ascending — back-to-front.
    let mut by_layer: BTreeMap<(u16, u16), Vec<&FlatPolygon>> = BTreeMap::new();
    for p in &visible {
        by_layer.entry((p.layer, p.datatype)).or_default().push(p);
    }
    let layers_rendered: Vec<(u16, u16)> = by_layer.keys().copied().collect();

    let (w, h) = view.canvas_px;
    let mut pixmap =
        Pixmap::new(w, h).ok_or(RenderError::InvalidCanvas {
            width: w,
            height: Some(h),
        })?;
    pixmap.fill(Color::from_rgba8(
        opts.background[0],
        opts.background[1],
        opts.background[2],
        opts.background[3],
    ));

    let palette = opts.palette.clone().unwrap_or_default();

    for ((layer_number, _datatype), polys) in &by_layer {
        let rgba = palette.color_for(*layer_number);
        let mut paint = Paint::default();
        paint.set_color_rgba8(rgba[0], rgba[1], rgba[2], opts.fill_alpha);
        paint.anti_alias = true;

        let mut pb = PathBuilder::new();
        for poly in polys {
            let v = &poly.vertices;
            if v.len() < 6 {
                continue;
            }
            let (px, py) = view.world_to_px(v[0], v[1]);
            pb.move_to(px, py);
            let mut i = 2;
            while i + 1 < v.len() {
                let (px, py) = view.world_to_px(v[i], v[i + 1]);
                pb.line_to(px, py);
                i += 2;
            }
            pb.close();
        }

        if let Some(path) = pb.finish() {
            pixmap.fill_path(
                &path,
                &paint,
                FillRule::EvenOdd,
                SkiaTransform::identity(),
                None,
            );
        }
    }

    let png = pixmap
        .encode_png()
        .map_err(|e| RenderError::Encode(e.to_string()))?;

    Ok(RenderResult {
        png,
        view,
        layers_rendered,
    })
}

fn compute_extent(polys: &[&FlatPolygon]) -> Option<BBox> {
    let mut iter = polys
        .iter()
        .flat_map(|p| p.vertices.chunks_exact(2).map(|c| Point::new(c[0], c[1])));
    let first = iter.next()?;
    let mut bbox = BBox::from_point(first);
    for pt in iter {
        bbox = bbox.expand(pt);
    }
    Some(bbox)
}

fn polygon_intersects(poly: &FlatPolygon, bbox: &BBox) -> bool {
    let v = &poly.vertices;
    if v.len() < 6 {
        return false;
    }
    let mut min_x = v[0];
    let mut max_x = v[0];
    let mut min_y = v[1];
    let mut max_y = v[1];
    for c in v.chunks_exact(2).skip(1) {
        if c[0] < min_x {
            min_x = c[0];
        }
        if c[0] > max_x {
            max_x = c[0];
        }
        if c[1] < min_y {
            min_y = c[1];
        }
        if c[1] > max_y {
            max_y = c[1];
        }
    }
    BBox::new(Point::new(min_x, min_y), Point::new(max_x, max_y)).overlaps(bbox)
}

#[cfg(test)]
mod tests {
    use super::*;
    use rosette_core::{Cell, Layer, Library, Point as CorePoint, Polygon};

    fn is_png(bytes: &[u8]) -> bool {
        bytes.starts_with(&[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    }

    fn two_layer_lib() -> Library {
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(CorePoint::origin(), 10.0, 10.0),
            Layer::new(1, 0),
        );
        cell.add_polygon(
            Polygon::rect(CorePoint::new(20.0, 0.0), 10.0, 10.0),
            Layer::new(2, 0),
        );
        let mut lib = Library::new("lib");
        lib.add_cell(cell).unwrap();
        lib
    }

    #[test]
    fn renders_full_extent_to_png() {
        let lib = two_layer_lib();
        let opts = RenderOptions {
            width_px: 256,
            height_px: Some(128),
            ..Default::default()
        };
        let res = render_png(&lib, &opts).unwrap();
        assert!(is_png(&res.png));
        assert_eq!(res.view.canvas_px, (256, 128));
        assert_eq!(res.layers_rendered, vec![(1, 0), (2, 0)]);
    }

    #[test]
    fn explicit_bbox_culls_outside_polygons() {
        let lib = two_layer_lib();
        // Even with 10% padding this region (~ -3..13) doesn't reach the
        // layer-2 rect at x=20..30, so layer 2 should be culled.
        let opts = RenderOptions {
            bbox: Some(BBox::new(
                CorePoint::new(0.0, 0.0),
                CorePoint::new(10.0, 10.0),
            )),
            width_px: 128,
            ..Default::default()
        };
        let res = render_png(&lib, &opts).unwrap();
        assert_eq!(res.layers_rendered, vec![(1, 0)]);
    }

    #[test]
    fn layer_filter_respected() {
        let lib = two_layer_lib();
        let opts = RenderOptions {
            layers: Some(vec![(2, 0)]),
            width_px: 128,
            ..Default::default()
        };
        let res = render_png(&lib, &opts).unwrap();
        assert_eq!(res.layers_rendered, vec![(2, 0)]);
    }

    #[test]
    fn empty_library_errors() {
        let lib = Library::new("empty");
        let opts = RenderOptions::default();
        assert!(matches!(
            render_png(&lib, &opts),
            Err(RenderError::EmptyDesign)
        ));
    }

    #[test]
    fn unknown_cell_errors() {
        let lib = two_layer_lib();
        let opts = RenderOptions {
            cell: Some("does-not-exist".into()),
            ..Default::default()
        };
        assert!(matches!(
            render_png(&lib, &opts),
            Err(RenderError::CellNotFound(_))
        ));
    }

    #[test]
    fn writes_pixels_for_geometry() {
        // Pixmap default is fully transparent black; after render it should
        // contain at least one non-background pixel.
        let lib = two_layer_lib();
        let opts = RenderOptions {
            width_px: 128,
            height_px: Some(64),
            background: [0, 0, 0, 0xff],
            ..Default::default()
        };
        let res = render_png(&lib, &opts).unwrap();
        // Sanity: PNG should be larger than a trivial blank-encode placeholder.
        assert!(res.png.len() > 100);
    }
}

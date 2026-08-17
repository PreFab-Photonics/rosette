//! World → pixel affine transform.
//!
//! World coordinates are microns with +Y pointing up (the convention used
//! throughout `rosette-core`). Image pixels have +Y pointing down, so the
//! transform includes a Y-axis flip. The transform also preserves aspect
//! ratio with letterboxing, so a square design rendered into a wide canvas
//! ends up centered with empty bands on the sides.

use rosette_core::{BBox, Point};
use thiserror::Error;

/// Error constructing a world-to-pixel view transform.
#[derive(Debug, Clone, Error, PartialEq)]
pub enum ViewTransformError {
    /// The target bounds must have finite, positive dimensions representable as `f32`.
    #[error("target bounds are not representable for rasterization")]
    InvalidTarget,
    /// Fractional padding must be finite and nonnegative.
    #[error("padding must be finite and nonnegative, got {0}")]
    InvalidPadding(f32),
    /// Canvas dimensions must be nonzero.
    #[error("canvas dimensions must be nonzero")]
    InvalidCanvas,
    /// Derived view values overflowed the raster coordinate representation.
    #[error("derived view transform is not representable")]
    Unrepresentable,
}

/// Affine transform `(x_um, y_um) → (x_px, y_px)` with metadata describing
/// the visible world region. Returned alongside the rendered PNG so callers
/// can map any pixel back to design coordinates.
#[derive(Debug, Clone, Copy)]
pub struct ViewTransform {
    /// Pixels per micron (uniform — aspect preserved).
    pub scale_px_per_um: f32,
    /// Additive offset in pixels for the X axis.
    pub offset_x_px: f32,
    /// Additive offset in pixels for the Y axis (after flip).
    pub offset_y_px: f32,
    /// Final canvas dimensions `(width, height)` in pixels.
    pub canvas_px: (u32, u32),
    /// World-space bounding box that the canvas covers (after padding).
    /// Note: aspect-preserving fit means the *rendered* design may be
    /// smaller than this box — this is the box that maps to the canvas
    /// extents along whichever axis is the binding constraint.
    pub world_bbox: BBox,
}

impl ViewTransform {
    /// Build a transform that fits `target` (with `pad` fractional padding
    /// on every side) into a canvas. If `height_px` is `None`, the height
    /// is derived from the padded target's aspect ratio.
    ///
    pub fn fit(
        target: BBox,
        pad: f32,
        width_px: u32,
        height_px: Option<u32>,
    ) -> Result<Self, ViewTransformError> {
        let target_width = target.width() as f32;
        let target_height = target.height() as f32;
        if !target_width.is_finite()
            || !target_height.is_finite()
            || target_width <= 0.0
            || target_height <= 0.0
        {
            return Err(ViewTransformError::InvalidTarget);
        }
        if !pad.is_finite() || pad < 0.0 {
            return Err(ViewTransformError::InvalidPadding(pad));
        }
        if width_px == 0 || height_px == Some(0) {
            return Err(ViewTransformError::InvalidCanvas);
        }

        let pad_x = target_width * pad;
        let pad_y = target_height * pad;
        let world_min_x = (target.min().x as f32) - pad_x;
        let world_max_x = (target.max().x as f32) + pad_x;
        let world_min_y = (target.min().y as f32) - pad_y;
        let world_max_y = (target.max().y as f32) + pad_y;
        let world_w = world_max_x - world_min_x;
        let world_h = world_max_y - world_min_y;
        if ![
            world_min_x,
            world_max_x,
            world_min_y,
            world_max_y,
            world_w,
            world_h,
        ]
        .into_iter()
        .all(f32::is_finite)
            || world_w <= 0.0
            || world_h <= 0.0
        {
            return Err(ViewTransformError::Unrepresentable);
        }

        let height_px = height_px
            .unwrap_or_else(|| (((width_px as f32) * world_h / world_w).round() as u32).max(1));

        let scale_x = (width_px as f32) / world_w;
        let scale_y = (height_px as f32) / world_h;
        let scale = scale_x.min(scale_y);

        let used_w = world_w * scale;
        let used_h = world_h * scale;
        let pad_left = ((width_px as f32) - used_w) / 2.0;
        let pad_top = ((height_px as f32) - used_h) / 2.0;

        let offset_x = pad_left - world_min_x * scale;
        let offset_y = pad_top + world_max_y * scale;
        if ![scale, offset_x, offset_y].into_iter().all(f32::is_finite) || scale <= 0.0 {
            return Err(ViewTransformError::Unrepresentable);
        }

        Ok(Self {
            scale_px_per_um: scale,
            offset_x_px: offset_x,
            offset_y_px: offset_y,
            canvas_px: (width_px, height_px),
            world_bbox: BBox::new(
                Point::new(world_min_x as f64, world_min_y as f64),
                Point::new(world_max_x as f64, world_max_y as f64),
            )
            .map_err(|_| ViewTransformError::Unrepresentable)?,
        })
    }

    /// Convert world (micron) coordinates to pixel coordinates.
    #[inline]
    pub fn world_to_px(&self, x: f64, y: f64) -> (f32, f32) {
        (
            self.scale_px_per_um * (x as f32) + self.offset_x_px,
            -self.scale_px_per_um * (y as f32) + self.offset_y_px,
        )
    }

    /// Convert pixel coordinates back to world (micron) coordinates.
    /// Useful for letting an LLM reason about a pixel position it sees
    /// in the rendered image.
    #[inline]
    pub fn px_to_world(&self, px: f32, py: f32) -> (f64, f64) {
        let x = (px - self.offset_x_px) / self.scale_px_per_um;
        let y = (self.offset_y_px - py) / self.scale_px_per_um;
        (x as f64, y as f64)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn approx(a: f32, b: f32) -> bool {
        (a - b).abs() < 1e-3
    }

    #[test]
    fn fit_preserves_aspect_with_letterbox() {
        // 10×10 world into a 200×100 canvas — wide canvas, square world.
        let target = BBox::new(Point::new(0.0, 0.0), Point::new(10.0, 10.0)).unwrap();
        let v = ViewTransform::fit(target, 0.0, 200, Some(100)).unwrap();
        assert_eq!(v.canvas_px, (200, 100));
        // Binding axis is height: 100px / 10um = 10 px/um
        assert!(approx(v.scale_px_per_um, 10.0));
    }

    #[test]
    fn world_origin_maps_to_pixel_inside_canvas() {
        let target = BBox::new(Point::new(0.0, 0.0), Point::new(10.0, 10.0)).unwrap();
        let v = ViewTransform::fit(target, 0.0, 100, Some(100)).unwrap();
        let (px, py) = v.world_to_px(0.0, 0.0);
        // World origin = bottom-left of design. After Y flip with no padding,
        // it should sit at (0, 100).
        assert!(approx(px, 0.0));
        assert!(approx(py, 100.0));
    }

    #[test]
    fn px_to_world_round_trips() {
        let target = BBox::new(Point::new(-5.0, -5.0), Point::new(5.0, 5.0)).unwrap();
        let v = ViewTransform::fit(target, 0.1, 256, Some(256)).unwrap();
        let (px, py) = v.world_to_px(2.5, -1.0);
        let (wx, wy) = v.px_to_world(px, py);
        assert!((wx - 2.5).abs() < 1e-3);
        assert!((wy - (-1.0)).abs() < 1e-3);
    }

    #[test]
    fn derived_height_matches_aspect() {
        let target = BBox::new(Point::new(0.0, 0.0), Point::new(40.0, 10.0)).unwrap();
        let v = ViewTransform::fit(target, 0.0, 400, None).unwrap();
        // 4:1 aspect → 100px tall.
        assert_eq!(v.canvas_px, (400, 100));
    }

    #[test]
    fn rejects_invalid_padding_and_unrepresentable_targets() {
        let target = BBox::new(Point::origin(), Point::new(10.0, 10.0)).unwrap();
        assert!(matches!(
            ViewTransform::fit(target, f32::NAN, 100, None),
            Err(ViewTransformError::InvalidPadding(value)) if value.is_nan()
        ));
        let extreme = BBox::new(Point::new(-f64::MAX, -1.0), Point::new(f64::MAX, 1.0)).unwrap();
        assert_eq!(
            ViewTransform::fit(extreme, 0.0, 100, None).unwrap_err(),
            ViewTransformError::InvalidTarget
        );
    }
}

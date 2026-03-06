//! Viewport state for camera control.
//!
//! Matches rosette-web's coordinate system:
//! - zoom: pixels per world unit (higher = more zoomed in)
//! - offset: screen position of world origin in pixels
//! - screenPos = worldPos * zoom + offset

/// Viewport state for camera control.
///
/// Uses rosette-web's offset-based coordinate system.
#[derive(Debug, Clone, Copy)]
pub struct Viewport {
    /// Screen position of world origin in pixels.
    pub offset_x: f64,
    pub offset_y: f64,

    /// Zoom level (pixels per world unit).
    /// Higher values = more zoomed in.
    pub zoom: f64,

    /// Canvas size in pixels.
    pub width: u32,
    pub height: u32,

    /// Theme: true = dark, false = light.
    pub dark_theme: bool,

    /// Device pixel ratio for HiDPI/retina display support.
    pub dpr: f32,
}

/// Default zoom level: 2^-6 = 0.015625 (matches rosette-web)
const DEFAULT_ZOOM: f64 = 0.015625; // 2^-6

/// Minimum zoom level to prevent grid rendering issues at extreme zoom-out.
const MIN_ZOOM: f64 = 1e-18;

impl Default for Viewport {
    fn default() -> Self {
        Self {
            offset_x: 400.0, // Will be updated when canvas size is known
            offset_y: 300.0,
            zoom: DEFAULT_ZOOM,
            width: 800,
            height: 600,
            dark_theme: true,
            dpr: 1.0,
        }
    }
}

impl Viewport {
    /// Create a new viewport with default settings.
    pub fn new() -> Self {
        Self::default()
    }

    /// Set the offset (screen position of world origin).
    pub fn set_offset(&mut self, x: f64, y: f64) {
        self.offset_x = x;
        self.offset_y = y;
    }

    /// Set the zoom level (pixels per world unit).
    pub fn set_zoom(&mut self, zoom: f64) {
        const MAX_ZOOM: f64 = 3.0;
        self.zoom = zoom.clamp(MIN_ZOOM, MAX_ZOOM);
    }

    /// Set the canvas size and optionally recenter.
    pub fn set_size(&mut self, width: u32, height: u32) {
        self.width = width;
        self.height = height;
    }

    /// Set the theme.
    pub fn set_dark_theme(&mut self, dark: bool) {
        self.dark_theme = dark;
    }

    /// Set the device pixel ratio for HiDPI/retina display support.
    pub fn set_dpr(&mut self, dpr: f32) {
        self.dpr = dpr.max(1.0);
    }

    /// Convert world coordinates to screen coordinates.
    /// screenPos = worldPos * zoom + offset
    pub fn world_to_screen(&self, world_x: f64, world_y: f64) -> (f32, f32) {
        let screen_x = world_x * self.zoom + self.offset_x;
        let screen_y = world_y * self.zoom + self.offset_y;
        (screen_x as f32, screen_y as f32)
    }

    /// Convert screen coordinates to world coordinates.
    /// worldPos = (screenPos - offset) / zoom
    pub fn screen_to_world(&self, screen_x: f64, screen_y: f64) -> (f64, f64) {
        let world_x = (screen_x - self.offset_x) / self.zoom;
        let world_y = (screen_y - self.offset_y) / self.zoom;
        (world_x, world_y)
    }

    /// Get the visible bounds in world coordinates.
    /// Matches rosette-web's getVisibleBounds function.
    pub fn visible_bounds(&self) -> (f64, f64, f64, f64) {
        // startX: -offset.x / zoom
        // endX: (width - offset.x) / zoom
        let start_x = -self.offset_x / self.zoom;
        let end_x = (self.width as f64 - self.offset_x) / self.zoom;
        let start_y = -self.offset_y / self.zoom;
        let end_y = (self.height as f64 - self.offset_y) / self.zoom;
        (start_x, start_y, end_x, end_y)
    }
}

/// GPU-compatible viewport uniform data.
///
/// This struct is designed to be uploaded directly to a GPU uniform buffer.
#[repr(C)]
#[derive(Debug, Clone, Copy, bytemuck::Pod, bytemuck::Zeroable)]
pub struct ViewportUniform {
    /// Screen position of world origin in pixels.
    pub offset: [f32; 2],
    /// Zoom level (pixels per world unit).
    pub zoom: f32,
    /// Theme: 1.0 = dark, 0.0 = light.
    pub theme: f32,
    /// Canvas size in pixels.
    pub size: [f32; 2],
    /// Device pixel ratio for HiDPI/retina display support.
    pub dpr: f32,
    /// Padding for 16-byte alignment.
    pub _padding: f32,
    /// Cell origin in world coordinates, used for crosshair positioning.
    pub crosshair_origin: [f32; 2],
    /// Padding for 16-byte alignment (total struct = 48 bytes).
    pub _padding2: [f32; 2],
}

impl ViewportUniform {
    /// Create from a viewport with the given crosshair origin in world coordinates.
    pub fn from_viewport(vp: &Viewport, crosshair_origin: [f32; 2]) -> Self {
        Self {
            offset: [vp.offset_x as f32, vp.offset_y as f32],
            zoom: vp.zoom as f32,
            theme: if vp.dark_theme { 1.0 } else { 0.0 },
            size: [vp.width as f32, vp.height as f32],
            dpr: vp.dpr,
            _padding: 0.0,
            crosshair_origin,
            _padding2: [0.0, 0.0],
        }
    }
}

impl From<&Viewport> for ViewportUniform {
    fn from(vp: &Viewport) -> Self {
        Self::from_viewport(vp, [0.0, 0.0])
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_world_to_screen_origin() {
        let vp = Viewport {
            offset_x: 400.0,
            offset_y: 300.0,
            zoom: 1.0,
            width: 800,
            height: 600,
            dark_theme: true,
            dpr: 1.0,
        };

        // World origin (0,0) should map to offset position
        let (sx, sy) = vp.world_to_screen(0.0, 0.0);
        assert_eq!(sx, 400.0);
        assert_eq!(sy, 300.0);
    }

    #[test]
    fn test_screen_to_world_roundtrip() {
        let vp = Viewport {
            offset_x: 400.0,
            offset_y: 300.0,
            zoom: 0.5,
            width: 800,
            height: 600,
            dark_theme: true,
            dpr: 1.0,
        };

        let (wx, wy) = vp.screen_to_world(100.0, 200.0);
        let (sx, sy) = vp.world_to_screen(wx, wy);

        assert!((sx - 100.0).abs() < 0.001);
        assert!((sy - 200.0).abs() < 0.001);
    }
}

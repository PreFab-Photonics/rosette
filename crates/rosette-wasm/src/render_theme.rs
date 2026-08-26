//! Concrete colors and opacity used by the renderer.

/// Validate finite color components and clamp them to the GPU color range.
pub(crate) fn normalize_color<const N: usize>(color: [f32; N]) -> Option<[f32; N]> {
    if color.iter().any(|value| !value.is_finite()) {
        return None;
    }
    Some(color.map(|value| value.clamp(0.0, 1.0)))
}

/// Renderer-owned theme values, independent of camera state.
#[derive(Debug, Clone, Copy, PartialEq)]
pub(crate) struct RenderTheme {
    pub(crate) canvas_background: [f32; 4],
    pub(crate) grid_color: [f32; 4],
    pub(crate) grid_opacity: f32,
}

impl RenderTheme {
    /// Create a theme from finite color components, clamped to the RGBA range.
    pub(crate) fn new(
        canvas_background: [f32; 4],
        grid_color: [f32; 4],
        grid_opacity: f32,
    ) -> Option<Self> {
        if !grid_opacity.is_finite() {
            return None;
        }

        Some(Self {
            canvas_background: normalize_color(canvas_background)?,
            grid_color: normalize_color(grid_color)?,
            grid_opacity: grid_opacity.clamp(0.0, 1.0),
        })
    }

    /// Convert the configured canvas background to a wgpu clear color.
    pub(crate) fn background_color(&self) -> wgpu::Color {
        wgpu::Color {
            r: self.canvas_background[0] as f64,
            g: self.canvas_background[1] as f64,
            b: self.canvas_background[2] as f64,
            a: self.canvas_background[3] as f64,
        }
    }
}

impl Default for RenderTheme {
    fn default() -> Self {
        Self {
            canvas_background: [0.07, 0.07, 0.07, 1.0],
            grid_color: [1.0, 1.0, 1.0, 1.0],
            grid_opacity: 0.5,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn defaults_match_existing_dark_renderer() {
        let theme = RenderTheme::default();

        assert_eq!(theme.canvas_background, [0.07, 0.07, 0.07, 1.0]);
        assert_eq!(theme.grid_color, [1.0, 1.0, 1.0, 1.0]);
        assert_eq!(theme.grid_opacity, 0.5);
        assert_eq!(
            theme.background_color(),
            wgpu::Color {
                r: 0.07_f32 as f64,
                g: 0.07_f32 as f64,
                b: 0.07_f32 as f64,
                a: 1.0,
            }
        );
    }

    #[test]
    fn finite_theme_values_are_clamped() {
        let theme = RenderTheme::new([-1.0, 0.25, 1.5, 0.75], [0.1, 2.0, 0.3, -0.5], 1.25).unwrap();

        assert_eq!(theme.canvas_background, [0.0, 0.25, 1.0, 0.75]);
        assert_eq!(theme.grid_color, [0.1, 1.0, 0.3, 0.0]);
        assert_eq!(theme.grid_opacity, 1.0);
    }

    #[test]
    fn finite_rgb_and_rgba_colors_are_clamped() {
        assert_eq!(normalize_color([-1.0, 0.25, 2.0]), Some([0.0, 0.25, 1.0]));
        assert_eq!(
            normalize_color([0.1, 0.2, 0.3, 1.5]),
            Some([0.1, 0.2, 0.3, 1.0])
        );
    }

    #[test]
    fn color_validation_rejects_non_finite_updates_atomically() {
        assert_eq!(normalize_color([0.1, f32::NAN, 2.0]), None);
        assert_eq!(normalize_color([0.1, 0.2, f32::INFINITY, 1.0]), None);
    }

    #[test]
    fn non_finite_theme_values_are_rejected() {
        assert!(RenderTheme::new([0.0, f32::NAN, 0.0, 1.0], [1.0, 1.0, 1.0, 1.0], 0.5,).is_none());
        assert!(
            RenderTheme::new([0.0, 0.0, 0.0, 1.0], [1.0, 1.0, f32::INFINITY, 1.0], 0.5,).is_none()
        );
        assert!(
            RenderTheme::new(
                [0.0, 0.0, 0.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                f32::NEG_INFINITY,
            )
            .is_none()
        );
    }
}

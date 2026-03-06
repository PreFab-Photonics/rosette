//! Grid rendering utilities.
//!
//! Implements a dot-based grid matching rosette-web:
//! - gridSize = 50 world units between points at zoom=1
//! - Major/minor points (every 5th point is emphasized)
//! - LOD-aware rendering (skip points when zoomed out)
//! - Smooth fade transitions between zoom levels

/// Grid configuration matching rosette-web exactly.
pub struct GridConfig {
    /// Base grid spacing in world units. Default: 50 (matches rosette-web)
    pub grid_size: f64,
    /// Spacing multiplier. Default: 1
    pub base_spacing: f64,
    /// Padding in world units for grid calculation.
    pub padding: f64,
    /// Major point interval (every Nth point).
    pub major_interval: u32,
    /// Minor point base opacity (0.0 - 1.0).
    pub minor_opacity: f32,
    /// Major point base opacity (0.0 - 1.0).
    pub major_opacity: f32,
}

impl Default for GridConfig {
    fn default() -> Self {
        Self {
            grid_size: 50.0,    // Matches rosette-web gridSize
            base_spacing: 1.0,  // Matches rosette-web gridBaseSpacing
            padding: 100.0,     // gridSize * 2
            major_interval: 5,  // Every 5th point is major
            minor_opacity: 0.8, // Matches rosette-web gridPointOpacity.minor
            major_opacity: 0.8, // Matches rosette-web gridPointOpacity.major
        }
    }
}

/// Calculate the skip factor for LOD-based grid rendering.
///
/// Uses base-5 logarithmic scaling to match rosette-web behavior.
/// At lower zoom levels, we skip more grid points.
///
/// Returns 1, 5, 25, 125, ... based on zoom level.
///
/// rosette-web formula:
/// ```js
/// if (zoom >= 1) return 1;
/// const zoomLevel = Math.floor(Math.log(1 / zoom) / Math.log(5));
/// return Math.pow(5, zoomLevel);
/// ```
pub fn calculate_skip_factor(zoom: f64) -> u64 {
    if zoom >= 1.0 {
        return 1;
    }

    // Use u64 to support much higher skip factors without overflow
    // 5^26 ≈ 1.5e18, which is well within u64 range
    let zoom_level = (1.0 / zoom).log(5.0).floor() as i32;
    let capped_level = zoom_level.clamp(0, 26) as u32;
    5_u64.pow(capped_level)
}

/// Calculate fade opacity for smooth transitions between LOD levels.
///
/// Grid points fade in/out as zoom approaches thresholds.
///
/// rosette-web formula:
/// ```js
/// if (zoom >= 1) return 1;
/// const currentLevel = Math.log(1 / zoom) / Math.log(5);
/// const nextThreshold = Math.ceil(currentLevel);
/// const fadeProgress = nextThreshold - currentLevel;
/// return Math.min(1, fadeProgress * 0.8);
/// ```
pub fn calculate_fade_opacity(zoom: f64) -> f32 {
    if zoom >= 1.0 {
        return 1.0;
    }
    if zoom <= 0.0 {
        return 0.0;
    }

    let current_level = (1.0 / zoom).log(5.0);
    // Guard against NaN/Inf from extreme zoom values
    if !current_level.is_finite() {
        return 0.5;
    }
    let next_threshold = current_level.ceil();
    let fade_progress = next_threshold - current_level;

    (fade_progress * 0.8).min(1.0) as f32
}

/// Calculate grid range for a dimension.
///
/// Based on rosette-web's getGridRange function, but with aligned end
/// to ensure full coverage at large skip factors.
///
/// rosette-web formula aligns only start:
/// ```js
/// const spacing = gridSize * skipFactor * gridBaseSpacing;
/// const start = Math.floor((visibleStart - gridPadding) / gridSize) * gridSize;
/// const end = Math.ceil((visibleEnd + gridPadding) / gridSize) * gridSize;
/// const alignedStart = Math.floor(start / spacing) * spacing;
/// return { start: alignedStart, end, spacing };
/// ```
///
/// We also align the end to spacing to ensure the grid covers the full visible area
/// when spacing is much larger than grid_size.
pub fn calculate_grid_range(
    visible_start: f64,
    visible_end: f64,
    skip_factor: u64,
    config: &GridConfig,
) -> (f64, f64, f64) {
    let spacing = config.grid_size * skip_factor as f64 * config.base_spacing;
    let start = ((visible_start - config.padding) / config.grid_size).floor() * config.grid_size;
    let end = ((visible_end + config.padding) / config.grid_size).ceil() * config.grid_size;
    let aligned_start = (start / spacing).floor() * spacing;
    // Also align end to spacing to ensure full coverage
    let aligned_end = (end / spacing).ceil() * spacing;
    (aligned_start, aligned_end, spacing)
}

/// Crosshair configuration matching rosette-web.
/// Note: These values are currently defined in the shader for simplicity.
/// This struct is kept for future configurability.
#[allow(dead_code)]
pub struct CrosshairConfig {
    /// Size of the crosshair arms in pixels. Default: 6
    pub size: f32,
    /// Line thickness in pixels. Default: 1
    pub thickness: f32,
    /// Shadow blur radius. Default: 4
    pub shadow_blur: f32,
}

impl Default for CrosshairConfig {
    fn default() -> Self {
        Self {
            size: 6.0,        // Matches rosette-web crosshairSize
            thickness: 1.0,   // Matches rosette-web crosshairThickness
            shadow_blur: 4.0, // Matches rosette-web crosshairColors.shadowBlur
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_skip_factor() {
        // zoom >= 1 -> skip 1
        assert_eq!(calculate_skip_factor(1.0), 1_u64);
        assert_eq!(calculate_skip_factor(2.0), 1_u64);

        // zoom < 1 but >= 0.2 -> skip 1
        assert_eq!(calculate_skip_factor(0.5), 1_u64);
        assert_eq!(calculate_skip_factor(0.2), 1_u64);

        // zoom < 0.2 (1/5) -> skip 5
        assert_eq!(calculate_skip_factor(0.19), 5_u64);
        assert_eq!(calculate_skip_factor(0.1), 5_u64);
        assert_eq!(calculate_skip_factor(0.05), 5_u64);

        // zoom < 0.04 (1/25) -> skip 25
        assert_eq!(calculate_skip_factor(0.03), 25_u64);
        assert_eq!(calculate_skip_factor(0.01), 25_u64);
    }

    #[test]
    fn test_skip_factor_extreme_zoom() {
        // At extremely low zoom (10000mm view), skip factor should be very high
        // zoom = 0.0001 -> log(10000)/log(5) ≈ 5.72 -> skip = 5^5 = 3125
        assert_eq!(calculate_skip_factor(0.0001), 3125_u64);

        // zoom = 0.00001 -> log(100000)/log(5) ≈ 7.15 -> skip = 5^7 = 78125
        assert_eq!(calculate_skip_factor(0.00001), 78125_u64);
    }

    #[test]
    fn test_fade_opacity() {
        let opacity_high_zoom = calculate_fade_opacity(1.0);
        assert_eq!(opacity_high_zoom, 1.0);

        let opacity_low_zoom = calculate_fade_opacity(0.1);
        assert!(opacity_low_zoom > 0.0);
        assert!(opacity_low_zoom <= 1.0);
    }

    #[test]
    fn test_grid_range_covers_visible_area() {
        let config = GridConfig::default();

        // Test at high skip factor where spacing >> grid_size
        // This was the bug: end wasn't aligned to spacing, causing partial coverage
        let skip_factor = 625_u64; // spacing = 50 * 625 = 31250
        let (start, end, spacing) = calculate_grid_range(-10000.0, 10000.0, skip_factor, &config);

        assert_eq!(spacing, 31250.0);

        // Start should be aligned to spacing (floor)
        assert!(start <= -10000.0);
        assert_eq!(start % spacing, 0.0);

        // End should be aligned to spacing (ceil) and extend beyond visible area
        assert!(end >= 10000.0);
        assert_eq!(end % spacing, 0.0);

        // Grid should fully cover visible area
        // Count how many points would be generated
        let mut count = 0;
        let mut x = start;
        while x <= end {
            if x >= -10000.0 && x <= 10000.0 {
                count += 1;
            }
            x += spacing;
        }
        // Should have at least one point in visible area
        assert!(
            count >= 1,
            "Grid should cover visible area, but got {} points",
            count
        );
    }
}

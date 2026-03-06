//! WGSL shader sources.
//!
//! Shaders are embedded at compile time using `include_str!`.

/// Grid dot rendering shader.
pub const GRID_SHADER: &str = include_str!("grid.wgsl");

/// Origin crosshair rendering shader.
pub const CROSSHAIR_SHADER: &str = include_str!("crosshair.wgsl");

/// Laser pointer trail rendering shader.
pub const LASER_SHADER: &str = include_str!("laser.wgsl");

/// Filled polygon rendering shader.
pub const POLYGON_SHADER: &str = include_str!("polygon.wgsl");

/// Polygon outline rendering shader (selection/hover).
pub const OUTLINE_SHADER: &str = include_str!("outline.wgsl");

/// Default border rendering shader (per-segment color).
pub const BORDER_SHADER: &str = include_str!("border.wgsl");

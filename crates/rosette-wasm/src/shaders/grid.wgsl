// Grid shader for rosette-wasm
//
// Renders grid dots as instanced quads.
//
// Grid points store SCREEN positions (not world positions) to maintain
// precision at any zoom level. The world-to-screen transformation is
// done on the CPU in f64, keeping all GPU values small.

struct Viewport {
    offset: vec2<f32>,          // Screen position of world origin (unused for grid, kept for crosshair)
    zoom: f32,                  // Pixels per world unit (unused for grid, kept for crosshair)
    theme: f32,                 // 0.0 = light, 1.0 = dark
    size: vec2<f32>,            // Canvas size in pixels
    dpr: f32,                   // Device pixel ratio for HiDPI/retina support
    _padding: f32,
    crosshair_origin: vec2<f32>, // Cell origin in world coordinates
    _padding2: vec2<f32>,
}

@group(0) @binding(0) var<uniform> viewport: Viewport;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) opacity: f32,
    @location(1) local_pos: vec2<f32>,
}

// Quad vertices (triangle strip)
const QUAD_VERTICES: array<vec2<f32>, 4> = array<vec2<f32>, 4>(
    vec2<f32>(-0.5, -0.5),
    vec2<f32>(0.5, -0.5),
    vec2<f32>(-0.5, 0.5),
    vec2<f32>(0.5, 0.5),
);

// Base grid point size in CSS pixels (matches rosette-web GRID_POINT_SIZE = 2)
const BASE_POINT_SIZE: f32 = 2.0;

@vertex
fn vs_main(
    @builtin(vertex_index) vertex_idx: u32,
    @location(0) screen_pos: vec2<f32>,
    @location(1) opacity: f32,
) -> VertexOutput {
    let quad_pos = QUAD_VERTICES[vertex_idx];

    // Scale point size by DPR to maintain consistent visual size on HiDPI displays
    let point_size = BASE_POINT_SIZE * viewport.dpr;

    // Screen position is pre-computed on CPU in f64 for precision
    // Add quad offset (in pixels)
    let final_pos = screen_pos + quad_pos * point_size;

    // Convert to NDC (-1 to 1)
    let ndc = vec2<f32>(
        (final_pos.x / viewport.size.x) * 2.0 - 1.0,
        1.0 - (final_pos.y / viewport.size.y) * 2.0  // Flip Y for screen coords
    );

    var out: VertexOutput;
    out.position = vec4<f32>(ndc, 0.0, 1.0);
    out.opacity = opacity;
    out.local_pos = quad_pos;
    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    // Calculate distance from center for square dots
    // Using max of abs for square shape (like rosette-web's ctx.rect)
    let dist = max(abs(in.local_pos.x), abs(in.local_pos.y));

    if dist > 0.5 {
        return vec4<f32>(0.0, 0.0, 0.0, 0.0);
    }

    // Theme-based color: white on dark, black on light
    let base_color = select(vec3<f32>(0.0, 0.0, 0.0), vec3<f32>(1.0, 1.0, 1.0), viewport.theme > 0.5);

    return vec4<f32>(base_color, in.opacity);
}

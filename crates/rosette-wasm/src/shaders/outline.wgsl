// Outline shader for rosette-wasm
//
// Renders polygon outlines as thick line segments with rounded joins.
// Uses instanced quads to draw each edge with configurable width.
// Supports inner contrast stroke for visibility on any background.
//
// IMPORTANT: Segment points are already in SCREEN coordinates (pixels)
// for precision. This avoids f32 precision issues in world-to-screen transform.

struct Viewport {
    offset: vec2<f32>,          // Screen position of world origin (unused - already in screen coords)
    zoom: f32,                  // Pixels per world unit (unused - already in screen coords)
    theme: f32,                 // 0.0 = light, 1.0 = dark
    size: vec2<f32>,            // Canvas size in pixels
    dpr: f32,                   // Device pixel ratio for HiDPI/retina support
    _padding: f32,
    crosshair_origin: vec2<f32>, // Cell origin in world coordinates
    _padding2: vec2<f32>,
}

struct OutlineUniforms {
    color: vec4<f32>,           // Outline color (RGBA)
    line_width: f32,            // Line width in pixels
    _padding: vec3<f32>,
}

@group(0) @binding(0) var<uniform> viewport: Viewport;
@group(0) @binding(1) var<uniform> outline: OutlineUniforms;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) local_pos: vec2<f32>,
    @location(1) segment_length: f32,
}

// Quad vertices for thick line segment rendering - centered on edge
const QUAD_VERTICES: array<vec2<f32>, 4> = array<vec2<f32>, 4>(
    vec2<f32>(0.0, -0.5),   // Start, inner
    vec2<f32>(1.0, -0.5),   // End, inner
    vec2<f32>(0.0, 0.5),    // Start, outer
    vec2<f32>(1.0, 0.5),    // End, outer
);

@vertex
fn vs_main(
    @builtin(vertex_index) vertex_idx: u32,
    @location(0) seg_p0: vec2<f32>,
    @location(1) seg_p1: vec2<f32>,
) -> VertexOutput {
    // Points are already in screen coordinates (computed on CPU with f64 precision)
    let screen_p0 = seg_p0;
    let screen_p1 = seg_p1;

    let delta = screen_p1 - screen_p0;
    let segment_length = length(delta);

    // Calculate direction and perpendicular vectors
    var dir: vec2<f32>;
    var perp: vec2<f32>;
    if segment_length < 0.001 {
        dir = vec2<f32>(1.0, 0.0);
        perp = vec2<f32>(0.0, 1.0);
    } else {
        dir = delta / segment_length;
        perp = vec2<f32>(-dir.y, dir.x);
    }

    let quad_pos = QUAD_VERTICES[vertex_idx];
    let total_width = outline.line_width;

    // Extend at ends for rounded joins/caps
    let extension = total_width * 0.5;
    let along = mix(-extension, segment_length + extension, quad_pos.x);
    // Centered on edge: quad_pos.y is -0.5 to 0.5
    let across = quad_pos.y * total_width;

    let screen_pos = screen_p0 + dir * along + perp * across;

    // Convert to NDC
    let ndc = vec2<f32>(
        (screen_pos.x / viewport.size.x) * 2.0 - 1.0,
        1.0 - (screen_pos.y / viewport.size.y) * 2.0
    );

    var out: VertexOutput;
    out.position = vec4<f32>(ndc, 0.0, 1.0);
    out.local_pos = vec2<f32>(along, across);
    out.segment_length = segment_length;
    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let half_width = outline.line_width * 0.5;

    // Distance from line center (with rounded caps)
    var dist: f32;
    if in.local_pos.x < 0.0 {
        // In the start cap region
        dist = length(in.local_pos);
    } else if in.local_pos.x > in.segment_length {
        // In the end cap region
        dist = length(vec2<f32>(in.local_pos.x - in.segment_length, in.local_pos.y));
    } else {
        // In the body - perpendicular distance only
        dist = abs(in.local_pos.y);
    }

    // Discard outside line width
    if dist > half_width {
        return vec4<f32>(0.0, 0.0, 0.0, 0.0);
    }

    // Simple solid color stroke
    return outline.color;
}

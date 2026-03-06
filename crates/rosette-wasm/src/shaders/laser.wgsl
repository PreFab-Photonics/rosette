// Laser pointer shader for rosette-wasm
//
// Renders laser trail as thick line segments with glow effect.
// Points are in screen coordinates (computed on CPU).
// Each line segment is rendered as an instanced quad.

struct Viewport {
    offset: vec2<f32>,          // Screen position of world origin (unused)
    zoom: f32,                  // Pixels per world unit (unused)
    theme: f32,                 // 0.0 = light, 1.0 = dark (unused for laser)
    size: vec2<f32>,            // Canvas size in pixels
    dpr: f32,                   // Device pixel ratio for HiDPI/retina support
    _padding: f32,
    crosshair_origin: vec2<f32>, // Cell origin in world coordinates
    _padding2: vec2<f32>,
}

struct LaserUniforms {
    color: vec3<f32>,       // Laser color (RGB)
    opacity: f32,           // Overall opacity (for fade animation)
    line_width: f32,        // Line thickness in pixels
    glow_size: f32,         // Glow radius in pixels
    _padding: vec2<f32>,
}

struct LaserPoint {
    screen_pos: vec2<f32>,  // Screen position in pixels
    _padding: vec2<f32>,
}

@group(0) @binding(0) var<uniform> viewport: Viewport;
@group(0) @binding(1) var<uniform> laser: LaserUniforms;
@group(0) @binding(2) var<storage, read> points: array<LaserPoint>;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) local_pos: vec2<f32>,      // Position within quad
    @location(1) segment_length: f32,        // Length of this segment
}

// Quad vertices (triangle strip) - used to create thick line segments
const QUAD_VERTICES: array<vec2<f32>, 4> = array<vec2<f32>, 4>(
    vec2<f32>(0.0, -0.5),   // Start, bottom
    vec2<f32>(1.0, -0.5),   // End, bottom
    vec2<f32>(0.0, 0.5),    // Start, top
    vec2<f32>(1.0, 0.5),    // End, top
);

@vertex
fn vs_main(
    @builtin(vertex_index) vertex_idx: u32,
    @builtin(instance_index) instance_idx: u32,
) -> VertexOutput {
    // Each instance draws a line segment between points[i] and points[i+1]
    let p0 = points[instance_idx].screen_pos;
    let p1 = points[instance_idx + 1u].screen_pos;

    // Calculate segment direction and perpendicular
    let delta = p1 - p0;
    let segment_length = length(delta);
    
    // Handle zero-length segments
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
    
    // Total width includes glow
    let total_width = laser.line_width + laser.glow_size * 2.0;
    
    // Extend segment slightly at ends for rounded caps
    let cap_extension = total_width * 0.5;
    
    // Calculate screen position
    // quad_pos.x: 0 = start, 1 = end (along segment)
    // quad_pos.y: -0.5 to 0.5 (perpendicular to segment)
    let along = mix(-cap_extension, segment_length + cap_extension, quad_pos.x);
    let across = quad_pos.y * total_width;
    
    let screen_pos = p0 + dir * along + perp * across;

    // Convert to NDC
    let ndc = vec2<f32>(
        (screen_pos.x / viewport.size.x) * 2.0 - 1.0,
        1.0 - (screen_pos.y / viewport.size.y) * 2.0
    );

    var out: VertexOutput;
    out.position = vec4<f32>(ndc, 0.0, 1.0);
    // Store local position for fragment shader (for distance calculations)
    out.local_pos = vec2<f32>(along, across);
    out.segment_length = segment_length;
    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let half_line = laser.line_width * 0.5;
    
    // Calculate distance from the line center
    var dist_from_line: f32;
    
    if in.local_pos.x < 0.0 {
        // In the start cap region - distance from start point
        dist_from_line = length(in.local_pos);
    } else if in.local_pos.x > in.segment_length {
        // In the end cap region - distance from end point
        dist_from_line = length(vec2<f32>(in.local_pos.x - in.segment_length, in.local_pos.y));
    } else {
        // In the body - perpendicular distance only
        dist_from_line = abs(in.local_pos.y);
    }

    // Discard pixels outside glow radius
    let max_dist = half_line + laser.glow_size;
    if dist_from_line > max_dist {
        return vec4<f32>(0.0, 0.0, 0.0, 0.0);
    }

    // Calculate alpha based on distance
    var alpha: f32;
    if dist_from_line <= half_line {
        // Inside core line - full opacity
        alpha = 1.0;
    } else {
        // In glow region - soft falloff
        let glow_dist = dist_from_line - half_line;
        let normalized = glow_dist / laser.glow_size;
        // Steep falloff with low max alpha for subtle glow
        let glow_alpha = (1.0 - normalized) * (1.0 - normalized);
        alpha = glow_alpha * 0.4;
    }

    // Apply overall opacity (for fade animation)
    alpha *= laser.opacity;

    return vec4<f32>(laser.color, alpha);
}

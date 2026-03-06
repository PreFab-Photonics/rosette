// Border shader for rosette-wasm
//
// Renders polygon borders as thin line segments with per-segment colors.
// Used for default shape borders (darkened fill color).
//
// Segment points are in WORLD coordinates. The shader transforms them to
// screen space using the viewport uniform. This allows borders to be cached
// and only regenerated when shapes change, not on every pan/zoom.

struct Viewport {
    offset: vec2<f32>,          // Screen position of world origin
    zoom: f32,                  // Pixels per world unit
    theme: f32,                 // 0.0 = light, 1.0 = dark
    size: vec2<f32>,            // Canvas size in pixels
    dpr: f32,                   // Device pixel ratio for HiDPI/retina support
    _padding: f32,
    crosshair_origin: vec2<f32>, // Cell origin in world coordinates
    _padding2: vec2<f32>,
}

struct BorderUniforms {
    line_width: f32,        // Line width in pixels
    _pad1: f32,
    _pad2: f32,
    _pad3: f32,
}

struct ColoredSegment {
    p0: vec2<f32>,      // Start point (WORLD coords)
    p1: vec2<f32>,      // End point (WORLD coords)
    color: vec4<f32>,   // RGBA color for this segment
}

@group(0) @binding(0) var<uniform> viewport: Viewport;
@group(0) @binding(1) var<uniform> border: BorderUniforms;
@group(0) @binding(2) var<storage, read> segments: array<ColoredSegment>;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) local_pos: vec2<f32>,
    @location(1) segment_length: f32,
    @location(2) color: vec4<f32>,
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
    @builtin(instance_index) instance_idx: u32,
) -> VertexOutput {
    let seg = segments[instance_idx];

    // Transform world coordinates to screen coordinates
    // screen = world * zoom + offset
    let screen_p0 = seg.p0 * viewport.zoom + viewport.offset;
    let screen_p1 = seg.p1 * viewport.zoom + viewport.offset;

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
    let total_width = border.line_width;

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
    out.color = seg.color;
    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let half_width = border.line_width * 0.5;

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

    // Use per-segment color
    return in.color;
}

// Polygon shader for rosette-wasm
//
// Renders filled polygons using triangulated vertices.
// Vertices store WORLD positions and are transformed to screen space in the shader.
// Supports fill patterns: solid (0), hatched (1), crosshatched (2), dotted (3).

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

struct VertexInput {
    @location(0) position: vec2<f32>,       // World position
    @location(1) color: vec4<f32>,          // RGBA color
    @location(2) fill_pattern: u32,         // 0=solid, 1=hatched, 2=crosshatched, 3=dotted
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4<f32>,
    @location(1) screen_pos: vec2<f32>,     // Screen position for pattern computation
    @location(2) @interpolate(flat) fill_pattern: u32,
}

@group(0) @binding(0) var<uniform> viewport: Viewport;

@vertex
fn vs_main(in: VertexInput) -> VertexOutput {
    // Transform world position to screen position
    // screenPos = worldPos * zoom + offset
    let screen_pos = in.position * viewport.zoom + viewport.offset;

    // Convert to NDC (-1 to 1)
    let ndc = vec2<f32>(
        (screen_pos.x / viewport.size.x) * 2.0 - 1.0,
        1.0 - (screen_pos.y / viewport.size.y) * 2.0  // Flip Y for screen coords
    );

    var out: VertexOutput;
    out.position = vec4<f32>(ndc, 0.0, 1.0);
    out.color = in.color;
    out.screen_pos = screen_pos;
    out.fill_pattern = in.fill_pattern;
    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    // Solid fill (pattern 0) - return color directly
    if in.fill_pattern == 0u {
        return in.color;
    }

    // Pattern spacing in screen pixels (consistent regardless of zoom).
    // Scale by DPR so patterns look the same size on retina displays.
    let spacing = 8.0 * viewport.dpr;
    let line_width = 1.5 * viewport.dpr;

    // Use screen position for pattern computation so patterns are
    // fixed in screen space (don't scale/move with zoom/pan).
    let sp = in.screen_pos;

    if in.fill_pattern == 1u {
        // Hatched: diagonal lines from top-left to bottom-right
        // Double-modulo to handle negative screen coordinates correctly
        let d = ((sp.x + sp.y) % spacing + spacing) % spacing;
        let dist = min(d, spacing - d);
        if dist > line_width {
            discard;
        }
        return in.color;
    }

    if in.fill_pattern == 2u {
        // Crosshatched: two sets of diagonal lines
        let d1 = ((sp.x + sp.y) % spacing + spacing) % spacing;
        let dist1 = min(d1, spacing - d1);
        let d2 = ((sp.x - sp.y) % spacing + spacing) % spacing;
        let dist2 = min(d2, spacing - d2);
        if dist1 > line_width && dist2 > line_width {
            discard;
        }
        return in.color;
    }

    if in.fill_pattern == 3u {
        // Dotted: regular grid of dots
        let dot_spacing = spacing * 1.5;
        let dot_radius = 2.0 * viewport.dpr;
        let gx = (sp.x % dot_spacing + dot_spacing) % dot_spacing;
        let gy = (sp.y % dot_spacing + dot_spacing) % dot_spacing;
        let cx = dot_spacing * 0.5;
        let cy = dot_spacing * 0.5;
        let dx = gx - cx;
        let dy = gy - cy;
        if (dx * dx + dy * dy) > (dot_radius * dot_radius) {
            discard;
        }
        return in.color;
    }

    // Fallback: solid
    return in.color;
}

// Polygon shader for rosette-wasm
//
// Renders filled polygons using triangulated vertices.
// Vertices store WORLD positions and are transformed to screen space in the shader.

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
    @location(0) position: vec2<f32>,  // World position
    @location(1) color: vec4<f32>,     // RGBA color
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4<f32>,
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
    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    return in.color;
}

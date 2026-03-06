// Crosshair shader for rosette-wasm
//
// Renders the origin crosshair:
// - 9px arm length, 1px thickness
// - color = rgba(51, 192, 51, 0.8)

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

@group(0) @binding(0) var<uniform> viewport: Viewport;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) local_pos: vec2<f32>,
    @location(1) instance_type: f32, // 0 = horizontal, 1 = vertical
}

// Crosshair configuration (base sizes in CSS pixels)
const BASE_CROSSHAIR_SIZE: f32 = 9.0;      // Arm length in CSS pixels
const BASE_CROSSHAIR_THICKNESS: f32 = 1.0; // Line thickness in CSS pixels

// Vertices for a single arm quad (centered at origin)
const ARM_VERTICES: array<vec2<f32>, 4> = array<vec2<f32>, 4>(
    vec2<f32>(-0.5, -0.5),
    vec2<f32>(0.5, -0.5),
    vec2<f32>(-0.5, 0.5),
    vec2<f32>(0.5, 0.5),
);

@vertex
fn vs_main(
    @builtin(vertex_index) vertex_idx: u32,
    @builtin(instance_index) instance_idx: u32,
) -> VertexOutput {
    let quad_pos = ARM_VERTICES[vertex_idx % 4];
    let instance_type = f32(instance_idx);

    // Scale by DPR for HiDPI displays
    let crosshair_size = BASE_CROSSHAIR_SIZE * viewport.dpr;
    let crosshair_thickness = BASE_CROSSHAIR_THICKNESS * viewport.dpr;

    // Origin position in screen space: cell_origin * zoom + offset
    // Round to nearest pixel to avoid subpixel blurring
    let origin = floor(viewport.crosshair_origin * viewport.zoom + viewport.offset) + 0.5;

    // Size of the quad
    let arm_length = crosshair_size * 2.0;
    let arm_width = crosshair_thickness;

    var size: vec2<f32>;
    if instance_idx == 0u {
        // Horizontal arm
        size = vec2<f32>(arm_length, arm_width);
    } else {
        // Vertical arm
        size = vec2<f32>(arm_width, arm_length);
    }

    let screen_pos = origin + quad_pos * size;

    // Convert to NDC
    let ndc = vec2<f32>(
        (screen_pos.x / viewport.size.x) * 2.0 - 1.0,
        1.0 - (screen_pos.y / viewport.size.y) * 2.0
    );

    var out: VertexOutput;
    out.position = vec4<f32>(ndc, 0.0, 1.0);
    out.local_pos = quad_pos * size;
    out.instance_type = instance_type;
    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    // Crosshair color: rgba(51, 192, 51, ...) = rgb(0.2, 0.75, 0.2)
    let color = vec3<f32>(0.2, 0.75, 0.2);

    // Scale thresholds by DPR (local_pos is already in physical pixels)
    let crosshair_size = BASE_CROSSHAIR_SIZE * viewport.dpr;
    let crosshair_thickness = BASE_CROSSHAIR_THICKNESS * viewport.dpr;

    // Calculate distance from the line center for arms
    var dist: f32;
    var arm_dist: f32;
    if in.instance_type > 0.5 {
        // Vertical arm
        dist = abs(in.local_pos.x);
        arm_dist = abs(in.local_pos.y);
    } else {
        // Horizontal arm
        dist = abs(in.local_pos.y);
        arm_dist = abs(in.local_pos.x);
    }

    // Core line check
    let half_thickness = crosshair_thickness / 2.0;
    let in_line = dist <= half_thickness && arm_dist <= crosshair_size;

    if in_line {
        // Solid line: rgba(51, 192, 51, 0.8)
        return vec4<f32>(color, 0.8);
    }
    
    // Fully transparent outside (no blur/shadow)
    return vec4<f32>(0.0, 0.0, 0.0, 0.0);
}

//! GPU renderer using wgpu.
//!
//! The [`WasmRenderer`] manages the WebGPU context and render pipelines
//! for drawing the grid, crosshair, laser pointer, and shapes.

use crate::grid::{
    GridConfig, calculate_fade_opacity, calculate_grid_range, calculate_skip_factor,
};
use crate::library::WasmLibrary;
use crate::shaders;
use crate::shapes::{ColoredSegment, OutlineSegment, OutlineUniform, PolygonVertex, ShapeManager};
use crate::viewport::{Viewport, ViewportUniform};
use wasm_bindgen::prelude::*;
use web_sys::HtmlCanvasElement;

/// Maximum number of outline segments for selection/hover buffers.
const MAX_OUTLINE_SEGMENTS: usize = 25_000;

/// Initial buffer capacities (conservative defaults).
/// Buffers will grow dynamically if these are exceeded.
const INITIAL_POLYGON_VERTICES: usize = 100_000;
const INITIAL_POLYGON_INDICES: usize = 300_000;
const INITIAL_BORDER_SEGMENTS: usize = 50_000;

/// Growth factor when reallocating buffers (2x = double the size).
const BUFFER_GROWTH_FACTOR: usize = 2;

/// Maximum allowed buffer sizes to prevent runaway allocation.
/// These are set high enough to handle very large designs.
const MAX_POLYGON_VERTICES: usize = 10_000_000; // 10M vertices (~240MB)
const MAX_POLYGON_INDICES: usize = 30_000_000; // 30M indices (~120MB)
const MAX_BORDER_SEGMENTS: usize = 5_000_000; // 5M segments (~160MB)

/// Error type for renderer operations.
#[derive(Debug, thiserror::Error)]
pub enum RendererError {
    #[error("Failed to get canvas element: {0}")]
    CanvasNotFound(String),
    #[error("Failed to get GPU adapter")]
    AdapterNotFound,
    #[error("Failed to create GPU device: {0}")]
    DeviceCreationFailed(String),
    #[error("Failed to create surface")]
    SurfaceCreationFailed,
}

/// GPU-compatible grid point data.
/// Screen positions are computed on the CPU in f64 for precision at any scale.
#[repr(C)]
#[derive(Debug, Clone, Copy, bytemuck::Pod, bytemuck::Zeroable)]
struct GridPointGpu {
    screen_pos: [f32; 2], // Screen position in pixels (always small, fits f32)
    opacity: f32,
    _padding: f32,
}

/// GPU-compatible laser segment data (vertex instance buffer).
/// Each instance represents a line segment between two consecutive trail points.
#[repr(C)]
#[derive(Debug, Clone, Copy, bytemuck::Pod, bytemuck::Zeroable)]
struct LaserSegmentGpu {
    p0: [f32; 2], // Start screen position in pixels
    p1: [f32; 2], // End screen position in pixels
}

/// GPU-compatible laser uniform data.
#[repr(C)]
#[derive(Debug, Clone, Copy, bytemuck::Pod, bytemuck::Zeroable)]
struct LaserUniformGpu {
    color: [f32; 3], // RGB color
    opacity: f32,    // Overall opacity (for fade)
    line_width: f32, // Line thickness in pixels
    glow_size: f32,  // Glow radius in pixels
    _padding: [f32; 2],
}

impl Default for LaserUniformGpu {
    fn default() -> Self {
        Self {
            // Red color matching rosette-web (#ff0000)
            color: [1.0, 0.0, 0.0],
            opacity: 0.9,
            line_width: 1.5,
            glow_size: 4.0,
            _padding: [0.0, 0.0],
        }
    }
}

/// GPU-compatible uniform data for default border rendering.
#[repr(C)]
#[derive(Debug, Clone, Copy, bytemuck::Pod, bytemuck::Zeroable)]
struct BorderUniformGpu {
    line_width: f32,
    _padding: [f32; 3],
}

impl Default for BorderUniformGpu {
    fn default() -> Self {
        Self {
            line_width: 2.0,
            _padding: [0.0, 0.0, 0.0],
        }
    }
}

/// WebAssembly renderer with wgpu backend.
///
/// Manages GPU resources and provides methods for rendering
/// the layout canvas with grid, crosshair, laser pointer, and shapes.
#[wasm_bindgen]
pub struct WasmRenderer {
    device: wgpu::Device,
    queue: wgpu::Queue,
    surface: wgpu::Surface<'static>,
    surface_config: wgpu::SurfaceConfiguration,
    viewport: Viewport,
    viewport_buffer: wgpu::Buffer,
    viewport_bind_group: wgpu::BindGroup,
    grid_pipeline: wgpu::RenderPipeline,
    grid_points_buffer: wgpu::Buffer,
    grid_bind_group: wgpu::BindGroup,
    crosshair_pipeline: wgpu::RenderPipeline,
    grid_point_count: u32,
    grid_config: GridConfig,
    grid_visible: bool,

    // Laser pointer rendering
    laser_pipeline: wgpu::RenderPipeline,
    laser_segments_buffer: wgpu::Buffer,
    laser_uniform_buffer: wgpu::Buffer,
    laser_bind_group: wgpu::BindGroup,
    laser_segment_count: u32,
    laser_uniform: LaserUniformGpu,

    // Polygon/shape rendering
    polygon_pipeline: wgpu::RenderPipeline,
    polygon_vertex_buffer: wgpu::Buffer,
    polygon_index_buffer: wgpu::Buffer,
    polygon_bind_group: wgpu::BindGroup,
    polygon_index_count: u32,
    shape_manager: ShapeManager,

    // Preview shape rendering (separate buffer to avoid retriangulating all shapes)
    preview_vertex_buffer: wgpu::Buffer,
    preview_index_buffer: wgpu::Buffer,
    preview_index_count: u32,

    // Outline rendering (selection/hover)
    // Completely separate buffers and bind groups to avoid any buffer sharing issues
    outline_pipeline: wgpu::RenderPipeline,
    selection_uniform_buffer: wgpu::Buffer,
    /// Current selection outline color (RGBA).
    selection_color: [f32; 4],
    selection_segment_buffer: wgpu::Buffer,
    selection_bind_group: wgpu::BindGroup,
    selection_segment_count: u32,
    hover_uniform_buffer: wgpu::Buffer,
    /// Current hover outline color (RGBA).
    hover_color: [f32; 4],
    hover_segment_buffer: wgpu::Buffer,
    hover_bind_group: wgpu::BindGroup,
    hover_segment_count: u32,

    // Default border rendering (darkened fill color)
    border_pipeline: wgpu::RenderPipeline,
    #[allow(dead_code)]
    border_uniform_buffer: wgpu::Buffer,
    border_segment_buffer: wgpu::Buffer,
    border_bind_group: wgpu::BindGroup,
    border_segment_count: u32,

    // Preview border rendering (separate from main borders to avoid O(n) regen on mouse move)
    preview_border_segment_buffer: wgpu::Buffer,
    preview_border_bind_group: wgpu::BindGroup,
    preview_border_segment_count: u32,

    /// Cached instance bounding boxes in world coordinates.
    /// Maps CellRef element index → [minX, minY, maxX, maxY].
    /// Used to generate outline segments for selected/hovered instances.
    instance_bboxes: Vec<(usize, [f64; 4])>,

    // Buffer capacity tracking for dynamic reallocation
    polygon_vertex_capacity: usize,
    polygon_index_capacity: usize,
    border_segment_capacity: usize,

    // Bind group layout kept for potential future use (border segments are vertex instance buffers)
    #[allow(dead_code)]
    border_bind_group_layout: wgpu::BindGroupLayout,

    // Dirty tracking for efficient rendering
    /// Whether any state has changed requiring a re-render.
    needs_render: bool,
    /// Whether grid points need to be recalculated.
    grid_dirty: bool,
    /// Whether selection/hover outlines need recalculation due to viewport change.
    /// (These are still in screen coordinates for consistent line width)
    outlines_viewport_dirty: bool,
    /// Whether default borders need recalculation (only when shapes change).
    /// Borders are in world coordinates, so they don't need to update on pan/zoom.
    borders_dirty: bool,
    /// Last viewport state to detect changes.
    last_viewport_state: (f64, f64, f64, bool), // (offset_x, offset_y, zoom, dark_theme)

    /// Cell origin in world coordinates for crosshair positioning.
    crosshair_origin: [f32; 2],

    // NOTE: View frustum culling fields removed as optimization.
    // We now triangulate all shapes once and let the GPU clip.
    // Keeping these as dead code in case culling is re-enabled for very large scenes.
    #[allow(dead_code)]
    last_cull_zoom: f64,
    #[allow(dead_code)]
    last_cull_bounds: [f64; 4],
}

#[wasm_bindgen]
impl WasmRenderer {
    /// Create a new renderer attached to a canvas element.
    ///
    /// # Arguments
    /// * `canvas_id` - The DOM id of the canvas element.
    ///
    /// # Errors
    /// Returns an error if WebGPU is not supported or initialization fails.
    #[wasm_bindgen]
    pub async fn create(canvas_id: &str) -> Result<WasmRenderer, JsValue> {
        Self::new_internal(canvas_id)
            .await
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }

    async fn new_internal(canvas_id: &str) -> Result<Self, RendererError> {
        // Get canvas element
        let window = web_sys::window().ok_or(RendererError::CanvasNotFound(
            "No window object".to_string(),
        ))?;
        let document = window.document().ok_or(RendererError::CanvasNotFound(
            "No document object".to_string(),
        ))?;
        let canvas = document.get_element_by_id(canvas_id).ok_or_else(|| {
            RendererError::CanvasNotFound(format!("Canvas '{}' not found", canvas_id))
        })?;
        let canvas: HtmlCanvasElement = canvas
            .dyn_into()
            .map_err(|_| RendererError::CanvasNotFound("Element is not a canvas".to_string()))?;

        // Get canvas size - use width/height attributes if client size is 0
        let mut width = canvas.client_width() as u32;
        let mut height = canvas.client_height() as u32;

        // Fallback to canvas attributes
        if width == 0 {
            width = canvas.width();
        }
        if height == 0 {
            height = canvas.height();
        }

        // Ensure minimum size
        if width == 0 {
            width = 800;
        }
        if height == 0 {
            height = 600;
        }

        // Set canvas internal resolution
        canvas.set_width(width);
        canvas.set_height(height);

        // Create wgpu instance with WebGPU backend (falls back to WebGL2)
        let instance = wgpu::Instance::new(wgpu::InstanceDescriptor {
            backends: wgpu::Backends::BROWSER_WEBGPU | wgpu::Backends::GL,
            ..Default::default()
        });

        // Create surface from canvas
        let surface = instance
            .create_surface(wgpu::SurfaceTarget::Canvas(canvas))
            .map_err(|_| RendererError::SurfaceCreationFailed)?;

        // Request adapter
        let adapter = instance
            .request_adapter(&wgpu::RequestAdapterOptions {
                power_preference: wgpu::PowerPreference::LowPower,
                compatible_surface: Some(&surface),
                force_fallback_adapter: false,
            })
            .await
            .ok_or(RendererError::AdapterNotFound)?;

        // Request device
        let (device, queue) = adapter
            .request_device(
                &wgpu::DeviceDescriptor {
                    label: Some("rosette-device"),
                    required_features: wgpu::Features::empty(),
                    required_limits: {
                        let mut limits = wgpu::Limits::downlevel_webgl2_defaults();
                        // Use the adapter's actual max texture size to support
                        // high-DPI / Retina displays (default WebGL2 limit is 2048,
                        // but most GPUs support 4096–16384).
                        let adapter_limits = adapter.limits();
                        limits.max_texture_dimension_2d = adapter_limits.max_texture_dimension_2d;
                        limits
                    },
                    memory_hints: wgpu::MemoryHints::default(),
                },
                None,
            )
            .await
            .map_err(|e| RendererError::DeviceCreationFailed(e.to_string()))?;

        // Configure surface
        let surface_caps = surface.get_capabilities(&adapter);
        // Prefer non-sRGB format: all colors in the app (clear color, layer colors,
        // selection colors) are specified in sRGB space already. Using a non-sRGB
        // surface avoids double gamma encoding that would make everything look washed out.
        let surface_format = surface_caps
            .formats
            .iter()
            .find(|f| !f.is_srgb())
            .copied()
            .unwrap_or(surface_caps.formats[0]);

        // Clamp surface dimensions to the GPU's max texture size (older GPUs
        // may only support 2048, while HiDPI canvases can exceed that).
        let max_dim = device.limits().max_texture_dimension_2d;
        let width = width.min(max_dim);
        let height = height.min(max_dim);

        let surface_config = wgpu::SurfaceConfiguration {
            usage: wgpu::TextureUsages::RENDER_ATTACHMENT,
            format: surface_format,
            width,
            height,
            present_mode: wgpu::PresentMode::AutoVsync,
            alpha_mode: surface_caps.alpha_modes[0],
            view_formats: vec![],
            desired_maximum_frame_latency: 2,
        };
        surface.configure(&device, &surface_config);

        // Create viewport
        let mut viewport = Viewport::new();
        viewport.set_size(width, height);

        // Create viewport uniform buffer
        let viewport_uniform = ViewportUniform::from(&viewport);
        let viewport_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("viewport-uniform"),
            size: std::mem::size_of::<ViewportUniform>() as u64,
            usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });
        queue.write_buffer(&viewport_buffer, 0, bytemuck::bytes_of(&viewport_uniform));

        // Create grid points buffer (will be updated each frame)
        let max_grid_points = 100_000u64;
        let grid_points_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("grid-points"),
            size: max_grid_points * std::mem::size_of::<GridPointGpu>() as u64,
            usage: wgpu::BufferUsages::VERTEX | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });

        // Create bind group layout for viewport (shared) - stored for buffer reallocation
        let viewport_bind_group_layout =
            device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
                label: Some("viewport-bind-group-layout"),
                entries: &[wgpu::BindGroupLayoutEntry {
                    binding: 0,
                    visibility: wgpu::ShaderStages::VERTEX | wgpu::ShaderStages::FRAGMENT,
                    ty: wgpu::BindingType::Buffer {
                        ty: wgpu::BufferBindingType::Uniform,
                        has_dynamic_offset: false,
                        min_binding_size: None,
                    },
                    count: None,
                }],
            });

        let viewport_bind_group = device.create_bind_group(&wgpu::BindGroupDescriptor {
            label: Some("viewport-bind-group"),
            layout: &viewport_bind_group_layout,
            entries: &[wgpu::BindGroupEntry {
                binding: 0,
                resource: viewport_buffer.as_entire_binding(),
            }],
        });

        // Create grid bind group layout (viewport only - points are now vertex instance buffers)
        let grid_bind_group_layout =
            device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
                label: Some("grid-bind-group-layout"),
                entries: &[wgpu::BindGroupLayoutEntry {
                    binding: 0,
                    visibility: wgpu::ShaderStages::VERTEX | wgpu::ShaderStages::FRAGMENT,
                    ty: wgpu::BindingType::Buffer {
                        ty: wgpu::BufferBindingType::Uniform,
                        has_dynamic_offset: false,
                        min_binding_size: None,
                    },
                    count: None,
                }],
            });

        let grid_bind_group = device.create_bind_group(&wgpu::BindGroupDescriptor {
            label: Some("grid-bind-group"),
            layout: &grid_bind_group_layout,
            entries: &[wgpu::BindGroupEntry {
                binding: 0,
                resource: viewport_buffer.as_entire_binding(),
            }],
        });

        // Create grid pipeline
        let grid_shader = device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: Some("grid-shader"),
            source: wgpu::ShaderSource::Wgsl(shaders::GRID_SHADER.into()),
        });

        let grid_pipeline_layout = device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
            label: Some("grid-pipeline-layout"),
            bind_group_layouts: &[&grid_bind_group_layout],
            push_constant_ranges: &[],
        });

        let grid_pipeline = device.create_render_pipeline(&wgpu::RenderPipelineDescriptor {
            label: Some("grid-pipeline"),
            layout: Some(&grid_pipeline_layout),
            vertex: wgpu::VertexState {
                module: &grid_shader,
                entry_point: Some("vs_main"),
                buffers: &[wgpu::VertexBufferLayout {
                    array_stride: std::mem::size_of::<GridPointGpu>() as u64,
                    step_mode: wgpu::VertexStepMode::Instance,
                    attributes: &[
                        wgpu::VertexAttribute {
                            format: wgpu::VertexFormat::Float32x2,
                            offset: 0,
                            shader_location: 0, // screen_pos
                        },
                        wgpu::VertexAttribute {
                            format: wgpu::VertexFormat::Float32,
                            offset: 8,
                            shader_location: 1, // opacity
                        },
                    ],
                }],
                compilation_options: wgpu::PipelineCompilationOptions::default(),
            },
            fragment: Some(wgpu::FragmentState {
                module: &grid_shader,
                entry_point: Some("fs_main"),
                targets: &[Some(wgpu::ColorTargetState {
                    format: surface_format,
                    blend: Some(wgpu::BlendState::ALPHA_BLENDING),
                    write_mask: wgpu::ColorWrites::ALL,
                })],
                compilation_options: wgpu::PipelineCompilationOptions::default(),
            }),
            primitive: wgpu::PrimitiveState {
                topology: wgpu::PrimitiveTopology::TriangleStrip,
                strip_index_format: None,
                front_face: wgpu::FrontFace::Ccw,
                cull_mode: None,
                polygon_mode: wgpu::PolygonMode::Fill,
                unclipped_depth: false,
                conservative: false,
            },
            depth_stencil: None,
            multisample: wgpu::MultisampleState::default(),
            multiview: None,
            cache: None,
        });

        // Create crosshair pipeline
        let crosshair_shader = device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: Some("crosshair-shader"),
            source: wgpu::ShaderSource::Wgsl(shaders::CROSSHAIR_SHADER.into()),
        });

        let crosshair_pipeline_layout =
            device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
                label: Some("crosshair-pipeline-layout"),
                bind_group_layouts: &[&viewport_bind_group_layout],
                push_constant_ranges: &[],
            });

        let crosshair_pipeline = device.create_render_pipeline(&wgpu::RenderPipelineDescriptor {
            label: Some("crosshair-pipeline"),
            layout: Some(&crosshair_pipeline_layout),
            vertex: wgpu::VertexState {
                module: &crosshair_shader,
                entry_point: Some("vs_main"),
                buffers: &[],
                compilation_options: wgpu::PipelineCompilationOptions::default(),
            },
            fragment: Some(wgpu::FragmentState {
                module: &crosshair_shader,
                entry_point: Some("fs_main"),
                targets: &[Some(wgpu::ColorTargetState {
                    format: surface_format,
                    blend: Some(wgpu::BlendState::ALPHA_BLENDING),
                    write_mask: wgpu::ColorWrites::ALL,
                })],
                compilation_options: wgpu::PipelineCompilationOptions::default(),
            }),
            primitive: wgpu::PrimitiveState {
                topology: wgpu::PrimitiveTopology::TriangleStrip,
                strip_index_format: None,
                front_face: wgpu::FrontFace::Ccw,
                cull_mode: None,
                polygon_mode: wgpu::PolygonMode::Fill,
                unclipped_depth: false,
                conservative: false,
            },
            depth_stencil: None,
            multisample: wgpu::MultisampleState::default(),
            multiview: None,
            cache: None,
        });

        // Create laser pointer pipeline
        let max_laser_segments = 10000u64;
        let laser_segments_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("laser-segments"),
            size: max_laser_segments * std::mem::size_of::<LaserSegmentGpu>() as u64,
            usage: wgpu::BufferUsages::VERTEX | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });

        let laser_uniform = LaserUniformGpu::default();
        let laser_uniform_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("laser-uniform"),
            size: std::mem::size_of::<LaserUniformGpu>() as u64,
            usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });
        queue.write_buffer(&laser_uniform_buffer, 0, bytemuck::bytes_of(&laser_uniform));

        let laser_bind_group_layout =
            device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
                label: Some("laser-bind-group-layout"),
                entries: &[
                    // Viewport uniform
                    wgpu::BindGroupLayoutEntry {
                        binding: 0,
                        visibility: wgpu::ShaderStages::VERTEX | wgpu::ShaderStages::FRAGMENT,
                        ty: wgpu::BindingType::Buffer {
                            ty: wgpu::BufferBindingType::Uniform,
                            has_dynamic_offset: false,
                            min_binding_size: None,
                        },
                        count: None,
                    },
                    // Laser uniform
                    wgpu::BindGroupLayoutEntry {
                        binding: 1,
                        visibility: wgpu::ShaderStages::VERTEX | wgpu::ShaderStages::FRAGMENT,
                        ty: wgpu::BindingType::Buffer {
                            ty: wgpu::BufferBindingType::Uniform,
                            has_dynamic_offset: false,
                            min_binding_size: None,
                        },
                        count: None,
                    },
                ],
            });

        let laser_bind_group = device.create_bind_group(&wgpu::BindGroupDescriptor {
            label: Some("laser-bind-group"),
            layout: &laser_bind_group_layout,
            entries: &[
                wgpu::BindGroupEntry {
                    binding: 0,
                    resource: viewport_buffer.as_entire_binding(),
                },
                wgpu::BindGroupEntry {
                    binding: 1,
                    resource: laser_uniform_buffer.as_entire_binding(),
                },
            ],
        });

        let laser_shader = device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: Some("laser-shader"),
            source: wgpu::ShaderSource::Wgsl(shaders::LASER_SHADER.into()),
        });

        let laser_pipeline_layout =
            device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
                label: Some("laser-pipeline-layout"),
                bind_group_layouts: &[&laser_bind_group_layout],
                push_constant_ranges: &[],
            });

        let laser_pipeline = device.create_render_pipeline(&wgpu::RenderPipelineDescriptor {
            label: Some("laser-pipeline"),
            layout: Some(&laser_pipeline_layout),
            vertex: wgpu::VertexState {
                module: &laser_shader,
                entry_point: Some("vs_main"),
                buffers: &[wgpu::VertexBufferLayout {
                    array_stride: std::mem::size_of::<LaserSegmentGpu>() as u64,
                    step_mode: wgpu::VertexStepMode::Instance,
                    attributes: &[
                        wgpu::VertexAttribute {
                            format: wgpu::VertexFormat::Float32x2,
                            offset: 0,
                            shader_location: 0, // p0
                        },
                        wgpu::VertexAttribute {
                            format: wgpu::VertexFormat::Float32x2,
                            offset: 8,
                            shader_location: 1, // p1
                        },
                    ],
                }],
                compilation_options: wgpu::PipelineCompilationOptions::default(),
            },
            fragment: Some(wgpu::FragmentState {
                module: &laser_shader,
                entry_point: Some("fs_main"),
                targets: &[Some(wgpu::ColorTargetState {
                    format: surface_format,
                    blend: Some(wgpu::BlendState::ALPHA_BLENDING),
                    write_mask: wgpu::ColorWrites::ALL,
                })],
                compilation_options: wgpu::PipelineCompilationOptions::default(),
            }),
            primitive: wgpu::PrimitiveState {
                topology: wgpu::PrimitiveTopology::TriangleStrip,
                strip_index_format: None,
                front_face: wgpu::FrontFace::Ccw,
                cull_mode: None,
                polygon_mode: wgpu::PolygonMode::Fill,
                unclipped_depth: false,
                conservative: false,
            },
            depth_stencil: None,
            multisample: wgpu::MultisampleState::default(),
            multiview: None,
            cache: None,
        });

        // Create polygon pipeline for shape rendering
        // Use initial capacities - buffers will grow dynamically if needed
        let polygon_vertex_capacity = INITIAL_POLYGON_VERTICES;
        let polygon_index_capacity = INITIAL_POLYGON_INDICES;

        let polygon_vertex_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("polygon-vertices"),
            size: (polygon_vertex_capacity * std::mem::size_of::<PolygonVertex>()) as u64,
            usage: wgpu::BufferUsages::VERTEX | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });

        let polygon_index_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("polygon-indices"),
            size: (polygon_index_capacity * std::mem::size_of::<u32>()) as u64,
            usage: wgpu::BufferUsages::INDEX | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });

        let polygon_bind_group = device.create_bind_group(&wgpu::BindGroupDescriptor {
            label: Some("polygon-bind-group"),
            layout: &viewport_bind_group_layout,
            entries: &[wgpu::BindGroupEntry {
                binding: 0,
                resource: viewport_buffer.as_entire_binding(),
            }],
        });

        // Preview buffers (small — typically a single rectangle or polygon being drawn)
        let preview_vertex_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("preview-vertices"),
            size: (1024 * std::mem::size_of::<PolygonVertex>()) as u64,
            usage: wgpu::BufferUsages::VERTEX | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });
        let preview_index_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("preview-indices"),
            size: (3072 * std::mem::size_of::<u32>()) as u64,
            usage: wgpu::BufferUsages::INDEX | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });

        let polygon_shader = device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: Some("polygon-shader"),
            source: wgpu::ShaderSource::Wgsl(shaders::POLYGON_SHADER.into()),
        });

        let polygon_pipeline_layout =
            device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
                label: Some("polygon-pipeline-layout"),
                bind_group_layouts: &[&viewport_bind_group_layout],
                push_constant_ranges: &[],
            });

        // Vertex buffer layout for polygon vertices
        let polygon_vertex_layout = wgpu::VertexBufferLayout {
            array_stride: std::mem::size_of::<PolygonVertex>() as u64,
            step_mode: wgpu::VertexStepMode::Vertex,
            attributes: &[
                // position: vec2<f32>
                wgpu::VertexAttribute {
                    format: wgpu::VertexFormat::Float32x2,
                    offset: 0,
                    shader_location: 0,
                },
                // color: vec4<f32>
                wgpu::VertexAttribute {
                    format: wgpu::VertexFormat::Float32x4,
                    offset: 8,
                    shader_location: 1,
                },
                // fill_pattern: u32
                wgpu::VertexAttribute {
                    format: wgpu::VertexFormat::Uint32,
                    offset: 24,
                    shader_location: 2,
                },
            ],
        };

        let polygon_pipeline = device.create_render_pipeline(&wgpu::RenderPipelineDescriptor {
            label: Some("polygon-pipeline"),
            layout: Some(&polygon_pipeline_layout),
            vertex: wgpu::VertexState {
                module: &polygon_shader,
                entry_point: Some("vs_main"),
                buffers: &[polygon_vertex_layout],
                compilation_options: wgpu::PipelineCompilationOptions::default(),
            },
            fragment: Some(wgpu::FragmentState {
                module: &polygon_shader,
                entry_point: Some("fs_main"),
                targets: &[Some(wgpu::ColorTargetState {
                    format: surface_format,
                    // OPTIMIZATION: Disable alpha blending to avoid overdraw performance issues.
                    // With many overlapping shapes, alpha blending causes each pixel to be
                    // processed multiple times. Without blending, the GPU can use early-Z
                    // rejection to skip occluded fragments.
                    blend: None,
                    write_mask: wgpu::ColorWrites::ALL,
                })],
                compilation_options: wgpu::PipelineCompilationOptions::default(),
            }),
            primitive: wgpu::PrimitiveState {
                topology: wgpu::PrimitiveTopology::TriangleList,
                strip_index_format: None,
                front_face: wgpu::FrontFace::Ccw,
                cull_mode: None,
                polygon_mode: wgpu::PolygonMode::Fill,
                unclipped_depth: false,
                conservative: false,
            },
            depth_stencil: None,
            multisample: wgpu::MultisampleState::default(),
            multiview: None,
            cache: None,
        });

        // Create outline pipeline for selection/hover rendering
        // Create completely separate buffers for selection and hover to avoid any sharing issues
        let max_outline_segments = MAX_OUTLINE_SEGMENTS as u64;

        // Selection buffers
        let selection_uniform_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("selection-uniform"),
            size: std::mem::size_of::<OutlineUniform>() as u64,
            usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });

        let selection_segment_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("selection-segments"),
            size: max_outline_segments * std::mem::size_of::<OutlineSegment>() as u64,
            usage: wgpu::BufferUsages::VERTEX | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });

        // Hover buffers
        let hover_uniform_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("hover-uniform"),
            size: std::mem::size_of::<OutlineUniform>() as u64,
            usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });

        let hover_segment_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("hover-segments"),
            size: max_outline_segments * std::mem::size_of::<OutlineSegment>() as u64,
            usage: wgpu::BufferUsages::VERTEX | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });

        // Initialize uniforms with default values
        let selection_uniform = OutlineUniform::selection(true);
        queue.write_buffer(
            &selection_uniform_buffer,
            0,
            bytemuck::bytes_of(&selection_uniform),
        );
        let hover_uniform = OutlineUniform::hover(true);
        queue.write_buffer(&hover_uniform_buffer, 0, bytemuck::bytes_of(&hover_uniform));

        let outline_bind_group_layout =
            device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
                label: Some("outline-bind-group-layout"),
                entries: &[
                    // Viewport uniform
                    wgpu::BindGroupLayoutEntry {
                        binding: 0,
                        visibility: wgpu::ShaderStages::VERTEX | wgpu::ShaderStages::FRAGMENT,
                        ty: wgpu::BindingType::Buffer {
                            ty: wgpu::BufferBindingType::Uniform,
                            has_dynamic_offset: false,
                            min_binding_size: None,
                        },
                        count: None,
                    },
                    // Outline uniform
                    wgpu::BindGroupLayoutEntry {
                        binding: 1,
                        visibility: wgpu::ShaderStages::VERTEX | wgpu::ShaderStages::FRAGMENT,
                        ty: wgpu::BindingType::Buffer {
                            ty: wgpu::BufferBindingType::Uniform,
                            has_dynamic_offset: false,
                            min_binding_size: None,
                        },
                        count: None,
                    },
                ],
            });

        // Selection bind group (uses selection uniform; segments are vertex instance buffers)
        let selection_bind_group = device.create_bind_group(&wgpu::BindGroupDescriptor {
            label: Some("selection-bind-group"),
            layout: &outline_bind_group_layout,
            entries: &[
                wgpu::BindGroupEntry {
                    binding: 0,
                    resource: viewport_buffer.as_entire_binding(),
                },
                wgpu::BindGroupEntry {
                    binding: 1,
                    resource: selection_uniform_buffer.as_entire_binding(),
                },
            ],
        });

        // Hover bind group (uses hover uniform; segments are vertex instance buffers)
        let hover_bind_group = device.create_bind_group(&wgpu::BindGroupDescriptor {
            label: Some("hover-bind-group"),
            layout: &outline_bind_group_layout,
            entries: &[
                wgpu::BindGroupEntry {
                    binding: 0,
                    resource: viewport_buffer.as_entire_binding(),
                },
                wgpu::BindGroupEntry {
                    binding: 1,
                    resource: hover_uniform_buffer.as_entire_binding(),
                },
            ],
        });

        let outline_shader = device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: Some("outline-shader"),
            source: wgpu::ShaderSource::Wgsl(shaders::OUTLINE_SHADER.into()),
        });

        let outline_pipeline_layout =
            device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
                label: Some("outline-pipeline-layout"),
                bind_group_layouts: &[&outline_bind_group_layout],
                push_constant_ranges: &[],
            });

        let outline_pipeline = device.create_render_pipeline(&wgpu::RenderPipelineDescriptor {
            label: Some("outline-pipeline"),
            layout: Some(&outline_pipeline_layout),
            vertex: wgpu::VertexState {
                module: &outline_shader,
                entry_point: Some("vs_main"),
                buffers: &[wgpu::VertexBufferLayout {
                    array_stride: std::mem::size_of::<OutlineSegment>() as u64,
                    step_mode: wgpu::VertexStepMode::Instance,
                    attributes: &[
                        wgpu::VertexAttribute {
                            format: wgpu::VertexFormat::Float32x2,
                            offset: 0,
                            shader_location: 0, // p0
                        },
                        wgpu::VertexAttribute {
                            format: wgpu::VertexFormat::Float32x2,
                            offset: 8,
                            shader_location: 1, // p1
                        },
                    ],
                }],
                compilation_options: wgpu::PipelineCompilationOptions::default(),
            },
            fragment: Some(wgpu::FragmentState {
                module: &outline_shader,
                entry_point: Some("fs_main"),
                targets: &[Some(wgpu::ColorTargetState {
                    format: surface_format,
                    blend: Some(wgpu::BlendState::ALPHA_BLENDING),
                    write_mask: wgpu::ColorWrites::ALL,
                })],
                compilation_options: wgpu::PipelineCompilationOptions::default(),
            }),
            primitive: wgpu::PrimitiveState {
                topology: wgpu::PrimitiveTopology::TriangleStrip,
                strip_index_format: None,
                front_face: wgpu::FrontFace::Ccw,
                cull_mode: None,
                polygon_mode: wgpu::PolygonMode::Fill,
                unclipped_depth: false,
                conservative: false,
            },
            depth_stencil: None,
            multisample: wgpu::MultisampleState::default(),
            multiview: None,
            cache: None,
        });

        // Create default border pipeline (per-segment colored borders)
        // Use initial capacity - buffer will grow dynamically if needed
        let border_segment_capacity = INITIAL_BORDER_SEGMENTS;

        let border_uniform = BorderUniformGpu::default();
        let border_uniform_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("border-uniform"),
            size: std::mem::size_of::<BorderUniformGpu>() as u64,
            usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });
        queue.write_buffer(
            &border_uniform_buffer,
            0,
            bytemuck::bytes_of(&border_uniform),
        );

        let border_segment_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("border-segments"),
            size: (border_segment_capacity * std::mem::size_of::<ColoredSegment>()) as u64,
            usage: wgpu::BufferUsages::VERTEX | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });

        let border_bind_group_layout =
            device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
                label: Some("border-bind-group-layout"),
                entries: &[
                    // Viewport uniform
                    wgpu::BindGroupLayoutEntry {
                        binding: 0,
                        visibility: wgpu::ShaderStages::VERTEX | wgpu::ShaderStages::FRAGMENT,
                        ty: wgpu::BindingType::Buffer {
                            ty: wgpu::BufferBindingType::Uniform,
                            has_dynamic_offset: false,
                            min_binding_size: None,
                        },
                        count: None,
                    },
                    // Border uniform
                    wgpu::BindGroupLayoutEntry {
                        binding: 1,
                        visibility: wgpu::ShaderStages::VERTEX | wgpu::ShaderStages::FRAGMENT,
                        ty: wgpu::BindingType::Buffer {
                            ty: wgpu::BufferBindingType::Uniform,
                            has_dynamic_offset: false,
                            min_binding_size: None,
                        },
                        count: None,
                    },
                ],
            });

        let border_bind_group = device.create_bind_group(&wgpu::BindGroupDescriptor {
            label: Some("border-bind-group"),
            layout: &border_bind_group_layout,
            entries: &[
                wgpu::BindGroupEntry {
                    binding: 0,
                    resource: viewport_buffer.as_entire_binding(),
                },
                wgpu::BindGroupEntry {
                    binding: 1,
                    resource: border_uniform_buffer.as_entire_binding(),
                },
            ],
        });

        // Preview border buffer (small fixed-size buffer for preview shape borders)
        // Max ~100 segments is more than enough for any preview shape.
        const PREVIEW_BORDER_CAPACITY: usize = 128;
        let preview_border_segment_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("preview-border-segments"),
            size: (PREVIEW_BORDER_CAPACITY * std::mem::size_of::<ColoredSegment>()) as u64,
            usage: wgpu::BufferUsages::VERTEX | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });

        let preview_border_bind_group = device.create_bind_group(&wgpu::BindGroupDescriptor {
            label: Some("preview-border-bind-group"),
            layout: &border_bind_group_layout,
            entries: &[
                wgpu::BindGroupEntry {
                    binding: 0,
                    resource: viewport_buffer.as_entire_binding(),
                },
                wgpu::BindGroupEntry {
                    binding: 1,
                    resource: border_uniform_buffer.as_entire_binding(),
                },
            ],
        });

        let border_shader = device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: Some("border-shader"),
            source: wgpu::ShaderSource::Wgsl(shaders::BORDER_SHADER.into()),
        });

        let border_pipeline_layout =
            device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
                label: Some("border-pipeline-layout"),
                bind_group_layouts: &[&border_bind_group_layout],
                push_constant_ranges: &[],
            });

        let border_pipeline = device.create_render_pipeline(&wgpu::RenderPipelineDescriptor {
            label: Some("border-pipeline"),
            layout: Some(&border_pipeline_layout),
            vertex: wgpu::VertexState {
                module: &border_shader,
                entry_point: Some("vs_main"),
                buffers: &[wgpu::VertexBufferLayout {
                    array_stride: std::mem::size_of::<ColoredSegment>() as u64,
                    step_mode: wgpu::VertexStepMode::Instance,
                    attributes: &[
                        wgpu::VertexAttribute {
                            format: wgpu::VertexFormat::Float32x2,
                            offset: 0,
                            shader_location: 0, // p0
                        },
                        wgpu::VertexAttribute {
                            format: wgpu::VertexFormat::Float32x2,
                            offset: 8,
                            shader_location: 1, // p1
                        },
                        wgpu::VertexAttribute {
                            format: wgpu::VertexFormat::Float32x4,
                            offset: 16,
                            shader_location: 2, // color
                        },
                    ],
                }],
                compilation_options: wgpu::PipelineCompilationOptions::default(),
            },
            fragment: Some(wgpu::FragmentState {
                module: &border_shader,
                entry_point: Some("fs_main"),
                targets: &[Some(wgpu::ColorTargetState {
                    format: surface_format,
                    blend: Some(wgpu::BlendState::ALPHA_BLENDING),
                    write_mask: wgpu::ColorWrites::ALL,
                })],
                compilation_options: wgpu::PipelineCompilationOptions::default(),
            }),
            primitive: wgpu::PrimitiveState {
                topology: wgpu::PrimitiveTopology::TriangleStrip,
                strip_index_format: None,
                front_face: wgpu::FrontFace::Ccw,
                cull_mode: None,
                polygon_mode: wgpu::PolygonMode::Fill,
                unclipped_depth: false,
                conservative: false,
            },
            depth_stencil: None,
            multisample: wgpu::MultisampleState::default(),
            multiview: None,
            cache: None,
        });

        Ok(Self {
            device,
            queue,
            surface,
            surface_config,
            viewport,
            viewport_buffer,
            viewport_bind_group,
            grid_pipeline,
            grid_points_buffer,
            grid_bind_group,
            crosshair_pipeline,
            grid_point_count: 0,
            grid_config: GridConfig::default(),
            grid_visible: true,
            // Laser pointer
            laser_pipeline,
            laser_segments_buffer,
            laser_uniform_buffer,
            laser_bind_group,
            laser_segment_count: 0,
            laser_uniform,
            // Polygon/shape rendering
            polygon_pipeline,
            polygon_vertex_buffer,
            polygon_index_buffer,
            polygon_bind_group,
            polygon_index_count: 0,
            shape_manager: ShapeManager::new(),
            // Preview shape rendering (separate buffer)
            preview_vertex_buffer,
            preview_index_buffer,
            preview_index_count: 0,
            // Outline rendering (completely separate buffers for selection vs hover)
            outline_pipeline,
            selection_uniform_buffer,
            selection_color: [0.267, 1.0, 0.267, 1.0], // Bright green #44ff44
            selection_segment_buffer,
            selection_bind_group,
            selection_segment_count: 0,
            hover_uniform_buffer,
            hover_color: [1.0, 1.0, 1.0, 1.0], // White (for dark mode default)
            hover_segment_buffer,
            hover_bind_group,
            hover_segment_count: 0,
            // Default border rendering
            border_pipeline,
            border_uniform_buffer,
            border_segment_buffer,
            border_bind_group,
            border_segment_count: 0,
            // Preview border rendering (separate to avoid O(n) regen on mouse move)
            preview_border_segment_buffer,
            preview_border_bind_group,
            preview_border_segment_count: 0,
            instance_bboxes: Vec::new(),
            // Buffer capacity tracking for dynamic reallocation
            polygon_vertex_capacity,
            polygon_index_capacity,
            border_segment_capacity,
            // Bind group layout for border buffer reallocation
            border_bind_group_layout,
            // Start dirty to ensure first frame renders
            needs_render: true,
            grid_dirty: true,
            outlines_viewport_dirty: true,
            borders_dirty: true,
            last_viewport_state: (0.0, 0.0, 0.0, true),
            crosshair_origin: [0.0, 0.0],
            // View frustum culling - start with values that force initial cull
            last_cull_zoom: 0.0,
            last_cull_bounds: [0.0, 0.0, 0.0, 0.0],
        })
    }

    /// Render the current view.
    ///
    /// Returns early if nothing has changed since last render.
    pub fn render(&mut self) {
        // Skip rendering if nothing has changed
        if !self.needs_render {
            return;
        }

        // Update viewport uniform
        let viewport_uniform =
            ViewportUniform::from_viewport(&self.viewport, self.crosshair_origin);
        self.queue.write_buffer(
            &self.viewport_buffer,
            0,
            bytemuck::bytes_of(&viewport_uniform),
        );

        // Update grid points only if grid is dirty
        if self.grid_dirty {
            self.update_grid_points();
            self.grid_dirty = false;
        }

        // Update polygon buffers if main shapes changed
        if self.shape_manager.is_dirty() {
            self.update_polygon_buffers();
            self.shape_manager.mark_clean();
            // Borders also need regeneration when shapes change
            self.borders_dirty = true;
        }

        // Update preview buffers separately (cheap — only one shape)
        if self.shape_manager.is_preview_dirty() {
            self.update_preview_buffers();
            self.shape_manager.mark_preview_clean();
        }

        // Update preview border buffer separately (cheap — only preview shape borders).
        // This avoids iterating all shapes when only the preview changed.
        if self.shape_manager.preview_borders_dirty() {
            self.update_preview_border_buffers();
            self.shape_manager.mark_preview_borders_clean();
        }

        // Update default border buffers when shapes or selection/hover changes (not on pan/zoom!)
        // Borders are in world coordinates, transformed to screen in the shader.
        // Regeneration is needed on selection/hover change because borders exclude selected shapes.
        if self.borders_dirty || self.shape_manager.outlines_dirty() {
            self.update_border_buffers();
            self.borders_dirty = false;
        }

        // Update selection/hover outline buffers if selection/hover changed OR viewport changed
        // (these are still in screen coordinates for consistent line width on selection box)
        if self.shape_manager.outlines_dirty() || self.outlines_viewport_dirty {
            self.update_selection_hover_buffers();
            self.shape_manager.mark_outlines_clean();
            self.outlines_viewport_dirty = false;
        }

        // Get surface texture
        let output = match self.surface.get_current_texture() {
            Ok(t) => t,
            Err(e) => {
                log::error!("Failed to get surface texture: {:?}", e);
                return;
            }
        };

        let view = output
            .texture
            .create_view(&wgpu::TextureViewDescriptor::default());

        let mut encoder = self
            .device
            .create_command_encoder(&wgpu::CommandEncoderDescriptor {
                label: Some("render-encoder"),
            });

        {
            // Background color based on theme (matches rosette-web)
            let clear_color = if self.viewport.dark_theme {
                wgpu::Color {
                    r: 0.07,
                    g: 0.07,
                    b: 0.07,
                    a: 1.0,
                }
            } else {
                wgpu::Color {
                    r: 1.0,
                    g: 1.0,
                    b: 1.0,
                    a: 1.0,
                }
            };

            let mut render_pass = encoder.begin_render_pass(&wgpu::RenderPassDescriptor {
                label: Some("render-pass"),
                color_attachments: &[Some(wgpu::RenderPassColorAttachment {
                    view: &view,
                    resolve_target: None,
                    ops: wgpu::Operations {
                        load: wgpu::LoadOp::Clear(clear_color),
                        store: wgpu::StoreOp::Store,
                    },
                })],
                depth_stencil_attachment: None,
                timestamp_writes: None,
                occlusion_query_set: None,
            });

            // Draw grid points
            if self.grid_visible && self.grid_point_count > 0 {
                render_pass.set_pipeline(&self.grid_pipeline);
                render_pass.set_bind_group(0, &self.grid_bind_group, &[]);
                render_pass.set_vertex_buffer(0, self.grid_points_buffer.slice(..));
                render_pass.draw(0..4, 0..self.grid_point_count);
            }

            // Draw crosshair (2 instances: horizontal arm, vertical arm)
            render_pass.set_pipeline(&self.crosshair_pipeline);
            render_pass.set_bind_group(0, &self.viewport_bind_group, &[]);
            render_pass.draw(0..4, 0..2);

            // Draw polygons/shapes (main buffer)
            if self.polygon_index_count > 0 {
                render_pass.set_pipeline(&self.polygon_pipeline);
                render_pass.set_bind_group(0, &self.polygon_bind_group, &[]);
                render_pass.set_vertex_buffer(0, self.polygon_vertex_buffer.slice(..));
                render_pass.set_index_buffer(
                    self.polygon_index_buffer.slice(..),
                    wgpu::IndexFormat::Uint32,
                );
                render_pass.draw_indexed(0..self.polygon_index_count, 0, 0..1);
            }

            // Draw preview shape (separate buffer — same pipeline, avoids retriangulating main shapes)
            if self.preview_index_count > 0 {
                render_pass.set_pipeline(&self.polygon_pipeline);
                render_pass.set_bind_group(0, &self.polygon_bind_group, &[]);
                render_pass.set_vertex_buffer(0, self.preview_vertex_buffer.slice(..));
                render_pass.set_index_buffer(
                    self.preview_index_buffer.slice(..),
                    wgpu::IndexFormat::Uint32,
                );
                render_pass.draw_indexed(0..self.preview_index_count, 0, 0..1);
            }

            // Draw default borders (darkened fill color, for non-selected/hovered shapes)
            if self.border_segment_count > 0 {
                render_pass.set_pipeline(&self.border_pipeline);
                render_pass.set_bind_group(0, &self.border_bind_group, &[]);
                render_pass.set_vertex_buffer(0, self.border_segment_buffer.slice(..));
                render_pass.draw(0..4, 0..self.border_segment_count);
            }

            // Draw preview borders (separate buffer, avoids O(n) regen of main borders on mouse move)
            if self.preview_border_segment_count > 0 {
                render_pass.set_pipeline(&self.border_pipeline);
                render_pass.set_bind_group(0, &self.preview_border_bind_group, &[]);
                render_pass.set_vertex_buffer(0, self.preview_border_segment_buffer.slice(..));
                render_pass.draw(0..4, 0..self.preview_border_segment_count);
            }

            // Draw selection outlines
            if self.selection_segment_count > 0 {
                render_pass.set_pipeline(&self.outline_pipeline);
                render_pass.set_bind_group(0, &self.selection_bind_group, &[]);
                render_pass.set_vertex_buffer(0, self.selection_segment_buffer.slice(..));
                render_pass.draw(0..4, 0..self.selection_segment_count);
            }

            // Draw hover outline (on top of selection)
            if self.hover_segment_count > 0 {
                render_pass.set_pipeline(&self.outline_pipeline);
                render_pass.set_bind_group(0, &self.hover_bind_group, &[]);
                render_pass.set_vertex_buffer(0, self.hover_segment_buffer.slice(..));
                render_pass.draw(0..4, 0..self.hover_segment_count);
            }

            // Draw laser pointer trail
            if self.laser_segment_count > 0 && self.laser_uniform.opacity > 0.0 {
                render_pass.set_pipeline(&self.laser_pipeline);
                render_pass.set_bind_group(0, &self.laser_bind_group, &[]);
                render_pass.set_vertex_buffer(0, self.laser_segments_buffer.slice(..));
                render_pass.draw(0..4, 0..self.laser_segment_count);
            }
        }

        self.queue.submit(std::iter::once(encoder.finish()));
        output.present();

        // Clear dirty flag after successful render
        self.needs_render = false;
    }

    // ==================== Dynamic Buffer Management ====================

    /// Calculate the new buffer capacity when growth is needed.
    /// Uses exponential growth to minimize reallocations.
    fn calculate_new_capacity(current: usize, required: usize, max: usize) -> usize {
        let mut new_capacity = current;
        while new_capacity < required && new_capacity < max {
            new_capacity = (new_capacity * BUFFER_GROWTH_FACTOR).min(max);
        }
        new_capacity
    }

    /// Reallocate polygon vertex buffer if needed.
    /// Returns true if reallocation occurred.
    fn ensure_polygon_vertex_capacity(&mut self, required: usize) -> bool {
        if required <= self.polygon_vertex_capacity {
            return false;
        }

        if required > MAX_POLYGON_VERTICES {
            log::error!(
                "Polygon vertex count ({}) exceeds maximum allowed ({}). Design is too complex.",
                required,
                MAX_POLYGON_VERTICES
            );
            return false;
        }

        let new_capacity = Self::calculate_new_capacity(
            self.polygon_vertex_capacity,
            required,
            MAX_POLYGON_VERTICES,
        );

        log::info!(
            "Reallocating polygon vertex buffer: {} -> {} vertices ({:.1} MB)",
            self.polygon_vertex_capacity,
            new_capacity,
            (new_capacity * std::mem::size_of::<PolygonVertex>()) as f64 / (1024.0 * 1024.0)
        );

        // Create new buffer
        self.polygon_vertex_buffer = self.device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("polygon-vertices"),
            size: (new_capacity * std::mem::size_of::<PolygonVertex>()) as u64,
            usage: wgpu::BufferUsages::VERTEX | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });

        self.polygon_vertex_capacity = new_capacity;
        true
    }

    /// Reallocate polygon index buffer if needed.
    /// Returns true if reallocation occurred.
    fn ensure_polygon_index_capacity(&mut self, required: usize) -> bool {
        if required <= self.polygon_index_capacity {
            return false;
        }

        if required > MAX_POLYGON_INDICES {
            log::error!(
                "Polygon index count ({}) exceeds maximum allowed ({}). Design is too complex.",
                required,
                MAX_POLYGON_INDICES
            );
            return false;
        }

        let new_capacity = Self::calculate_new_capacity(
            self.polygon_index_capacity,
            required,
            MAX_POLYGON_INDICES,
        );

        log::info!(
            "Reallocating polygon index buffer: {} -> {} indices ({:.1} MB)",
            self.polygon_index_capacity,
            new_capacity,
            (new_capacity * std::mem::size_of::<u32>()) as f64 / (1024.0 * 1024.0)
        );

        // Create new buffer
        self.polygon_index_buffer = self.device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("polygon-indices"),
            size: (new_capacity * std::mem::size_of::<u32>()) as u64,
            usage: wgpu::BufferUsages::INDEX | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });

        self.polygon_index_capacity = new_capacity;
        true
    }

    /// Reallocate border segment buffer if needed.
    /// Returns true if reallocation occurred.
    fn ensure_border_segment_capacity(&mut self, required: usize) -> bool {
        if required <= self.border_segment_capacity {
            return false;
        }

        if required > MAX_BORDER_SEGMENTS {
            log::error!(
                "Border segment count ({}) exceeds maximum allowed ({}). Design is too complex.",
                required,
                MAX_BORDER_SEGMENTS
            );
            return false;
        }

        let new_capacity = Self::calculate_new_capacity(
            self.border_segment_capacity,
            required,
            MAX_BORDER_SEGMENTS,
        );

        log::info!(
            "Reallocating border segment buffer: {} -> {} segments ({:.1} MB)",
            self.border_segment_capacity,
            new_capacity,
            (new_capacity * std::mem::size_of::<ColoredSegment>()) as f64 / (1024.0 * 1024.0)
        );

        // Create new vertex buffer (no bind group recreation needed - vertex buffers
        // are set directly in the render pass, not through bind groups)
        self.border_segment_buffer = self.device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("border-segments"),
            size: (new_capacity * std::mem::size_of::<ColoredSegment>()) as u64,
            usage: wgpu::BufferUsages::VERTEX | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });

        self.border_segment_capacity = new_capacity;
        true
    }

    // ==================== Buffer Update Methods ====================

    /// Update polygon vertex and index buffers from shape manager.
    ///
    /// OPTIMIZATION: Triangulates ALL shapes once and caches the result.
    /// The GPU handles clipping for shapes outside the viewport automatically.
    /// This avoids expensive re-triangulation on every pan/zoom operation.
    ///
    /// Buffers are dynamically reallocated if the geometry exceeds current capacity.
    fn update_polygon_buffers(&mut self) {
        // Triangulate all shapes - GPU will clip what's outside viewport
        let (vertices, indices) = self.shape_manager.triangulate();

        // Ensure vertex buffer capacity (reallocates if needed)
        if vertices.len() > self.polygon_vertex_capacity {
            if !self.ensure_polygon_vertex_capacity(vertices.len()) {
                // Failed to allocate - truncate to fit
                log::warn!(
                    "Truncating {} vertices to fit buffer capacity {}",
                    vertices.len(),
                    self.polygon_vertex_capacity
                );
            }
        }

        // Ensure index buffer capacity (reallocates if needed)
        if indices.len() > self.polygon_index_capacity {
            if !self.ensure_polygon_index_capacity(indices.len()) {
                // Failed to allocate - will truncate indices
                log::warn!(
                    "Truncating {} indices to fit buffer capacity {}",
                    indices.len(),
                    self.polygon_index_capacity
                );
            }
        }

        // Check if we must truncate vertices (indicates design exceeds maximum limits)
        let must_truncate_vertices = vertices.len() > self.polygon_vertex_capacity;
        let must_truncate_indices = indices.len() > self.polygon_index_capacity;

        // If vertices must be truncated, skip rendering entirely to avoid
        // indices referencing non-existent vertices (would cause visual garbage)
        if must_truncate_vertices {
            log::error!(
                "Design too large: {} vertices exceeds maximum capacity {}. Skipping render.",
                vertices.len(),
                self.polygon_vertex_capacity
            );
            self.polygon_index_count = 0;
            return;
        }

        // Write vertex data
        if !vertices.is_empty() {
            self.queue.write_buffer(
                &self.polygon_vertex_buffer,
                0,
                bytemuck::cast_slice(&vertices),
            );
        }

        // Truncate indices if needed (safe since all vertices are present)
        let indices_to_write = if must_truncate_indices {
            log::warn!(
                "Truncating {} indices to fit buffer capacity {}",
                indices.len(),
                self.polygon_index_capacity
            );
            &indices[..self.polygon_index_capacity]
        } else {
            &indices[..]
        };

        if !indices_to_write.is_empty() {
            self.queue.write_buffer(
                &self.polygon_index_buffer,
                0,
                bytemuck::cast_slice(indices_to_write),
            );
        }

        self.polygon_index_count = indices_to_write.len() as u32;
    }

    /// Update preview vertex and index buffers from shape manager.
    ///
    /// OPTIMIZATION: The preview shape (rectangle/polygon being drawn) is
    /// triangulated and uploaded to its own GPU buffer. This avoids
    /// retriangulating all main shapes on every mouse-move during drawing.
    fn update_preview_buffers(&mut self) {
        let (vertices, indices) = self.shape_manager.triangulate_preview();

        if vertices.is_empty() || indices.is_empty() {
            self.preview_index_count = 0;
            return;
        }

        // Preview buffer capacities (must match the sizes in the constructor)
        const PREVIEW_VERTEX_CAPACITY: usize = 1024;
        const PREVIEW_INDEX_CAPACITY: usize = 3072;

        // Guard against overflow — preview shapes are normally small (4-100 vertices),
        // but a complex polygon could exceed the fixed buffer. Truncate safely.
        if vertices.len() > PREVIEW_VERTEX_CAPACITY || indices.len() > PREVIEW_INDEX_CAPACITY {
            log::warn!(
                "Preview shape too large ({} verts, {} indices), truncating to fit buffer",
                vertices.len(),
                indices.len(),
            );
            // Skip rendering rather than writing past buffer bounds
            self.preview_index_count = 0;
            return;
        }

        self.queue.write_buffer(
            &self.preview_vertex_buffer,
            0,
            bytemuck::cast_slice(&vertices),
        );
        self.queue.write_buffer(
            &self.preview_index_buffer,
            0,
            bytemuck::cast_slice(&indices),
        );
        self.preview_index_count = indices.len() as u32;
    }

    /// Update default border segment buffers from shape manager.
    ///
    /// OPTIMIZATION: Borders are now in WORLD coordinates, transformed to screen
    /// in the shader. This means we only need to regenerate borders when shapes
    /// change, NOT on every pan/zoom. This is a major performance win for scenes
    /// with many shapes.
    ///
    /// Buffers are dynamically reallocated if the geometry exceeds current capacity.
    fn update_border_buffers(&mut self) {
        // Get default border segments (darkened fill color for non-selected/hovered shapes)
        // These are in world coordinates - shader will transform to screen
        let border_segments = self.shape_manager.get_default_border_segments();

        // Ensure buffer capacity (reallocates if needed)
        if border_segments.len() > self.border_segment_capacity {
            if !self.ensure_border_segment_capacity(border_segments.len()) {
                // Failed to allocate - will truncate
                log::warn!(
                    "Truncating {} border segments to fit buffer capacity {}",
                    border_segments.len(),
                    self.border_segment_capacity
                );
            }
        }

        // Write data (truncate if still over capacity after failed reallocation)
        let segments_to_write = if border_segments.len() <= self.border_segment_capacity {
            &border_segments[..]
        } else {
            &border_segments[..self.border_segment_capacity]
        };

        self.border_segment_count = segments_to_write.len() as u32;
        if !segments_to_write.is_empty() {
            self.queue.write_buffer(
                &self.border_segment_buffer,
                0,
                bytemuck::cast_slice(segments_to_write),
            );
        }
    }

    /// Update preview border segment buffer.
    ///
    /// Only processes the preview shape and origin cross — does NOT iterate
    /// all main shapes. This makes preview border updates O(1) instead of O(n).
    fn update_preview_border_buffers(&mut self) {
        let segments = self.shape_manager.get_preview_border_segments();

        // Preview border buffer has fixed capacity (128 segments).
        const PREVIEW_BORDER_CAPACITY: usize = 128;
        let count = segments.len().min(PREVIEW_BORDER_CAPACITY);

        self.preview_border_segment_count = count as u32;
        if count > 0 {
            self.queue.write_buffer(
                &self.preview_border_segment_buffer,
                0,
                bytemuck::cast_slice(&segments[..count]),
            );
        }
    }

    /// Update selection and hover outline segment buffers.
    ///
    /// These remain in screen coordinates for consistent line width appearance.
    /// They need to update on viewport changes (pan/zoom).
    fn update_selection_hover_buffers(&mut self) {
        let zoom = self.viewport.zoom;
        let offset_x = self.viewport.offset_x;
        let offset_y = self.viewport.offset_y;

        // Get selection segments from shape polygons
        let mut selection_segments = self
            .shape_manager
            .get_selection_segments(zoom, offset_x, offset_y);

        // Append instance bbox outline segments for selected ref UUIDs
        let selected_ids = self.shape_manager.get_selection();
        self.append_instance_bbox_outlines(
            &selected_ids,
            zoom,
            offset_x,
            offset_y,
            &mut selection_segments,
        );

        if selection_segments.len() > MAX_OUTLINE_SEGMENTS {
            selection_segments.truncate(MAX_OUTLINE_SEGMENTS);
        }
        self.selection_segment_count = selection_segments.len() as u32;
        if !selection_segments.is_empty() {
            self.queue.write_buffer(
                &self.selection_segment_buffer,
                0,
                bytemuck::cast_slice(&selection_segments),
            );
        }

        // Get hover segments from shape polygons
        let mut hover_segments = self
            .shape_manager
            .get_hover_segments(zoom, offset_x, offset_y);

        // Append instance bbox outline segments for hovered ref UUIDs
        let hovered_ids = self.shape_manager.get_hover_ids();
        self.append_instance_bbox_outlines(
            &hovered_ids,
            zoom,
            offset_x,
            offset_y,
            &mut hover_segments,
        );

        if hover_segments.len() > MAX_OUTLINE_SEGMENTS {
            hover_segments.truncate(MAX_OUTLINE_SEGMENTS);
        }
        self.hover_segment_count = hover_segments.len() as u32;
        if !hover_segments.is_empty() {
            self.queue.write_buffer(
                &self.hover_segment_buffer,
                0,
                bytemuck::cast_slice(&hover_segments),
            );
        }
    }

    /// Append bounding box outline segments for any instance ref UUIDs found in `ids`.
    ///
    /// Parses each ID for the "ref:" prefix, extracts the CellRef element index,
    /// looks up the cached bbox, and generates 4 screen-space outline segments.
    fn append_instance_bbox_outlines(
        &self,
        ids: &[String],
        zoom: f64,
        offset_x: f64,
        offset_y: f64,
        segments: &mut Vec<OutlineSegment>,
    ) {
        // Collect unique CellRef element indices from the IDs
        let mut seen_indices: std::collections::HashSet<usize> = std::collections::HashSet::new();

        for id in ids {
            if let Some(rest) = id.strip_prefix("ref:") {
                if let Some(idx_str) = rest.split(':').next() {
                    if let Ok(elem_idx) = idx_str.parse::<usize>() {
                        seen_indices.insert(elem_idx);
                    }
                }
            }
        }

        if seen_indices.is_empty() {
            return;
        }

        // For each matched instance, generate 4 bbox outline segments
        for &(elem_idx, bbox) in &self.instance_bboxes {
            if !seen_indices.contains(&elem_idx) {
                continue;
            }

            let [min_x, min_y, max_x, max_y] = bbox;

            // Convert world corners to screen coordinates
            let sx0 = (min_x * zoom + offset_x) as f32;
            let sy0 = (min_y * zoom + offset_y) as f32;
            let sx1 = (max_x * zoom + offset_x) as f32;
            let sy1 = (max_y * zoom + offset_y) as f32;

            // Bottom edge
            segments.push(OutlineSegment {
                p0: [sx0, sy0],
                p1: [sx1, sy0],
            });
            // Right edge
            segments.push(OutlineSegment {
                p0: [sx1, sy0],
                p1: [sx1, sy1],
            });
            // Top edge
            segments.push(OutlineSegment {
                p0: [sx1, sy1],
                p1: [sx0, sy1],
            });
            // Left edge
            segments.push(OutlineSegment {
                p0: [sx0, sy1],
                p1: [sx0, sy0],
            });
        }
    }

    /// Update the grid points buffer based on current viewport.
    ///
    /// Computes screen positions on CPU in f64 for precision at any scale.
    /// Only the final screen positions (which are always small) are sent to GPU.
    fn update_grid_points(&mut self) {
        // Use CSS zoom (not physical zoom) for LOD calculations
        // Physical zoom = CSS zoom * DPR, so we divide by DPR to get CSS zoom
        let css_zoom = self.viewport.zoom / self.viewport.dpr as f64;
        let mut skip_factor = calculate_skip_factor(css_zoom);
        let fade_opacity = calculate_fade_opacity(css_zoom);

        // Get visible bounds in world coordinates
        let (start_x, start_y, end_x, end_y) = self.viewport.visible_bounds();

        // Estimate point count and increase skip factor if needed to stay under buffer limit
        // This ensures the grid always covers the full visible area
        let max_points: usize = 100_000;
        loop {
            let (x_start, x_end, x_spacing) =
                calculate_grid_range(start_x, end_x, skip_factor, &self.grid_config);
            let (y_start, y_end, y_spacing) =
                calculate_grid_range(start_y, end_y, skip_factor, &self.grid_config);

            // Estimate number of points (add 1 to handle edge cases)
            let x_count = ((x_end - x_start) / x_spacing).ceil() as usize + 1;
            let y_count = ((y_end - y_start) / y_spacing).ceil() as usize + 1;
            let estimated_points = x_count.saturating_mul(y_count);

            if estimated_points <= max_points {
                break;
            }

            // Increase skip factor by 5x and try again
            skip_factor = skip_factor.saturating_mul(5);

            // Safety: prevent infinite loop at extreme values
            if skip_factor > 5_u64.pow(26) {
                break;
            }
        }

        // Calculate grid ranges with final skip factor
        let (x_start, x_end, x_spacing) =
            calculate_grid_range(start_x, end_x, skip_factor, &self.grid_config);
        let (y_start, y_end, y_spacing) =
            calculate_grid_range(start_y, end_y, skip_factor, &self.grid_config);

        let mut points = Vec::new();

        // Viewport transform parameters (f64 for precision)
        let zoom = self.viewport.zoom;
        let offset_x = self.viewport.offset_x;
        let offset_y = self.viewport.offset_y;

        // Iterate over grid points
        // Compute screen positions on CPU in f64, then cast to f32
        // Screen positions are always within canvas size, so f32 is sufficient
        let mut world_x = x_start;
        while world_x <= x_end {
            let mut world_y = y_start;
            while world_y <= y_end {
                // Skip cell origin (crosshair is drawn there)
                let origin_x = self.crosshair_origin[0] as f64;
                let origin_y = self.crosshair_origin[1] as f64;
                if (world_x - origin_x).abs() < 1e-10 && (world_y - origin_y).abs() < 1e-10 {
                    world_y += y_spacing;
                    continue;
                }

                // Determine if this is a major point (every 5th in both directions)
                let grid_index_x = (world_x / x_spacing).round() as i64;
                let grid_index_y = (world_y / y_spacing).round() as i64;
                let is_major = grid_index_x % self.grid_config.major_interval as i64 == 0
                    && grid_index_y % self.grid_config.major_interval as i64 == 0;

                // Calculate opacity matching rosette-web
                let theme_opacity = if self.viewport.dark_theme { 0.5 } else { 0.8 };
                let base_opacity = if is_major {
                    self.grid_config.major_opacity * theme_opacity
                } else {
                    self.grid_config.minor_opacity * fade_opacity * theme_opacity
                };

                // Compute screen position in f64 for precision
                // screenPos = worldPos * zoom + offset
                let screen_x = world_x * zoom + offset_x;
                let screen_y = world_y * zoom + offset_y;

                points.push(GridPointGpu {
                    screen_pos: [screen_x as f32, screen_y as f32],
                    opacity: base_opacity,
                    _padding: 0.0,
                });

                // Safety check: stop if we somehow exceed buffer
                if points.len() >= max_points {
                    break;
                }

                world_y += y_spacing;
            }
            if points.len() >= max_points {
                break;
            }
            world_x += x_spacing;
        }

        self.grid_point_count = points.len() as u32;

        if !points.is_empty() {
            self.queue
                .write_buffer(&self.grid_points_buffer, 0, bytemuck::cast_slice(&points));
        }
    }

    /// Set the viewport transformation using offset-based coordinates.
    ///
    /// # Arguments
    /// * `offset_x` - Screen X position of world origin in pixels.
    /// * `offset_y` - Screen Y position of world origin in pixels.
    /// * `zoom` - Zoom level (pixels per world unit).
    pub fn set_viewport(&mut self, offset_x: f64, offset_y: f64, zoom: f64) {
        let new_state = (offset_x, offset_y, zoom, self.viewport.dark_theme);

        // Only mark dirty if something actually changed
        if new_state != self.last_viewport_state {
            self.viewport.set_offset(offset_x, offset_y);
            self.viewport.set_zoom(zoom);
            self.last_viewport_state = new_state;
            self.needs_render = true;
            self.grid_dirty = true;
            self.outlines_viewport_dirty = true;

            // NOTE: We no longer trigger polygon re-triangulation on viewport changes.
            // Polygons are triangulated once when shapes change, and the GPU clips
            // shapes outside the viewport automatically. This is a major performance
            // win for scenes with many shapes.
        }
    }

    /// Set the crosshair origin in world coordinates.
    ///
    /// The crosshair is rendered at this position instead of world (0,0).
    /// Used to visualize the cell origin for instancing.
    pub fn set_crosshair_origin(&mut self, x: f64, y: f64) {
        let new_origin = [x as f32, y as f32];
        if new_origin != self.crosshair_origin {
            self.crosshair_origin = new_origin;
            self.needs_render = true;
            self.grid_dirty = true; // Grid needs to skip the new origin point
        }
    }

    /// Handle canvas resize.
    ///
    /// # Arguments
    /// * `width` - New width in pixels.
    /// * `height` - New height in pixels.
    pub fn resize(&mut self, width: u32, height: u32) {
        if width == 0 || height == 0 {
            return;
        }

        // Clamp to GPU's max texture size (older GPUs may only support 2048)
        let max_dim = self.device.limits().max_texture_dimension_2d;
        let width = width.min(max_dim);
        let height = height.min(max_dim);

        self.viewport.set_size(width, height);
        self.surface_config.width = width;
        self.surface_config.height = height;
        self.surface.configure(&self.device, &self.surface_config);

        // Resize always requires re-render (visible area changed)
        self.needs_render = true;
        self.grid_dirty = true;
        self.outlines_viewport_dirty = true;
    }

    /// Set the color theme.
    ///
    /// # Arguments
    /// * `dark` - true for dark theme, false for light theme.
    pub fn set_theme(&mut self, dark: bool) {
        if self.viewport.dark_theme != dark {
            self.viewport.set_dark_theme(dark);
            // Update last state to include new theme
            self.last_viewport_state.3 = dark;
            self.needs_render = true;
            self.grid_dirty = true; // Grid opacity depends on theme
        }
    }

    /// Set the selection outline color.
    ///
    /// # Arguments
    /// * `r`, `g`, `b`, `a` - RGBA color values (0.0-1.0 range).
    pub fn set_selection_color(&mut self, r: f32, g: f32, b: f32, a: f32) {
        self.selection_color = [r, g, b, a];
        let selection_uniform = OutlineUniform {
            color: self.selection_color,
            line_width: 2.0 * self.viewport.dpr,
            _padding1: [0.0, 0.0, 0.0],
            _padding2: [0.0, 0.0, 0.0, 0.0],
        };
        self.queue.write_buffer(
            &self.selection_uniform_buffer,
            0,
            bytemuck::bytes_of(&selection_uniform),
        );
        self.needs_render = true;
    }

    /// Set the device pixel ratio for HiDPI/retina display support.
    ///
    /// This scales UI elements like grid dots to maintain consistent
    /// visual size across different display densities.
    ///
    /// # Arguments
    /// * `dpr` - Device pixel ratio (typically 1.0 for standard displays, 2.0 for retina).
    pub fn set_dpr(&mut self, dpr: f32) {
        if (self.viewport.dpr - dpr).abs() > 0.001 {
            self.viewport.set_dpr(dpr);
            self.needs_render = true;
            self.grid_dirty = true; // Grid point size depends on DPR
            self.outlines_viewport_dirty = true; // Outline/border widths depend on DPR

            // Update border uniform with DPR-scaled line width
            let border_uniform = BorderUniformGpu {
                line_width: 2.0 * dpr,
                _padding: [0.0, 0.0, 0.0],
            };
            self.queue.write_buffer(
                &self.border_uniform_buffer,
                0,
                bytemuck::bytes_of(&border_uniform),
            );

            // Update selection uniform with DPR-scaled line width
            let selection_uniform = OutlineUniform {
                color: self.selection_color,
                line_width: 2.0 * dpr,
                _padding1: [0.0, 0.0, 0.0],
                _padding2: [0.0, 0.0, 0.0, 0.0],
            };
            self.queue.write_buffer(
                &self.selection_uniform_buffer,
                0,
                bytemuck::bytes_of(&selection_uniform),
            );

            // Update hover uniform with DPR-scaled line width
            let hover_uniform = OutlineUniform {
                color: self.hover_color,
                line_width: 2.0 * dpr,
                _padding1: [0.0, 0.0, 0.0],
                _padding2: [0.0, 0.0, 0.0, 0.0],
            };
            self.queue.write_buffer(
                &self.hover_uniform_buffer,
                0,
                bytemuck::bytes_of(&hover_uniform),
            );
        }
    }

    /// Set grid visibility.
    ///
    /// When hidden, grid points are not drawn but are still computed
    /// so toggling back on is instantaneous.
    ///
    /// # Arguments
    /// * `visible` - Whether the grid should be rendered.
    pub fn set_grid_visible(&mut self, visible: bool) {
        if self.grid_visible != visible {
            self.grid_visible = visible;
            self.needs_render = true;
        }
    }

    /// Set the hover outline color.
    ///
    /// # Arguments
    /// * `r`, `g`, `b`, `a` - RGBA color values (0.0-1.0 range).
    pub fn set_hover_color(&mut self, r: f32, g: f32, b: f32, a: f32) {
        self.hover_color = [r, g, b, a];
        let hover_uniform = OutlineUniform {
            color: self.hover_color,
            line_width: 2.0 * self.viewport.dpr,
            _padding1: [0.0, 0.0, 0.0],
            _padding2: [0.0, 0.0, 0.0, 0.0],
        };
        self.queue.write_buffer(
            &self.hover_uniform_buffer,
            0,
            bytemuck::bytes_of(&hover_uniform),
        );
        self.needs_render = true;
    }

    /// Get the current zoom level (pixels per world unit).
    pub fn get_zoom(&self) -> f64 {
        self.viewport.zoom
    }

    /// Force the renderer to re-render on next frame.
    ///
    /// Use this for external triggers that require a visual update.
    pub fn mark_dirty(&mut self) {
        self.needs_render = true;
    }

    /// Get the current offset (screen position of world origin).
    pub fn get_offset(&self) -> Vec<f64> {
        vec![self.viewport.offset_x, self.viewport.offset_y]
    }

    /// Convert screen coordinates to world coordinates.
    pub fn screen_to_world(&self, screen_x: f64, screen_y: f64) -> Vec<f64> {
        let (wx, wy) = self.viewport.screen_to_world(screen_x, screen_y);
        vec![wx, wy]
    }

    /// Signal that the renderer is no longer needed.
    ///
    /// Note: This method does not immediately release GPU resources. Resources
    /// are released when the JS garbage collector frees the WasmRenderer object.
    /// Calling this method allows you to drop your JS reference, signaling to
    /// the GC that the object can be collected.
    ///
    /// wgpu resources (device, queue, surface, buffers, pipelines) are
    /// automatically cleaned up via Rust's Drop trait when the object is freed.
    pub fn destroy(&self) {}

    /// Set laser pointer trail points.
    ///
    /// Points are in screen coordinates (pixels). The array should contain
    /// alternating x, y values: [x0, y0, x1, y1, x2, y2, ...]
    ///
    /// # Arguments
    /// * `points` - Flat array of screen coordinates (x, y pairs).
    pub fn set_laser_points(&mut self, points: &[f64]) {
        let max_segments = 10000usize;
        let num_points = points.len() / 2;

        if num_points < 2 {
            self.laser_segment_count = 0;
            self.needs_render = true;
            return;
        }

        let num_segments = (num_points - 1).min(max_segments);
        let gpu_segments: Vec<LaserSegmentGpu> = (0..num_segments)
            .map(|i| LaserSegmentGpu {
                p0: [points[i * 2] as f32, points[i * 2 + 1] as f32],
                p1: [points[(i + 1) * 2] as f32, points[(i + 1) * 2 + 1] as f32],
            })
            .collect();

        self.queue.write_buffer(
            &self.laser_segments_buffer,
            0,
            bytemuck::cast_slice(&gpu_segments),
        );

        self.laser_segment_count = num_segments as u32;
        self.needs_render = true;
    }

    /// Set laser pointer opacity (for fade animation).
    ///
    /// # Arguments
    /// * `opacity` - Opacity value from 0.0 (invisible) to 1.0 (fully visible).
    pub fn set_laser_opacity(&mut self, opacity: f32) {
        if (self.laser_uniform.opacity - opacity).abs() > 0.001 {
            self.laser_uniform.opacity = opacity.clamp(0.0, 1.0);
            self.queue.write_buffer(
                &self.laser_uniform_buffer,
                0,
                bytemuck::bytes_of(&self.laser_uniform),
            );
            self.needs_render = true;
        }
    }

    /// Clear the laser pointer trail.
    pub fn clear_laser(&mut self) {
        if self.laser_segment_count > 0 {
            self.laser_segment_count = 0;
            self.laser_uniform.opacity = 0.9; // Reset to default
            self.queue.write_buffer(
                &self.laser_uniform_buffer,
                0,
                bytemuck::bytes_of(&self.laser_uniform),
            );
            self.needs_render = true;
        }
    }

    // ==================== Shape Management ====================

    /// Add a shape to render.
    ///
    /// Points are in world coordinates (flat array: [x0, y0, x1, y1, ...]).
    /// Color is RGBA (flat array: [r, g, b, a], values 0.0-1.0).
    ///
    /// # Arguments
    /// * `id` - Unique identifier for the shape.
    /// * `points` - Flat array of world coordinates (x, y pairs).
    /// * `color` - RGBA color array [r, g, b, a].
    pub fn add_shape(&mut self, id: &str, points: &[f64], color: &[f32]) {
        if points.len() < 6 || color.len() < 4 {
            return; // Need at least 3 points and RGBA color
        }

        let points_vec: Vec<[f64; 2]> =
            points.chunks(2).map(|chunk| [chunk[0], chunk[1]]).collect();

        let color_arr = [color[0], color[1], color[2], color[3]];

        self.shape_manager
            .add_shape(id.to_string(), points_vec, color_arr);
        self.needs_render = true;
    }

    /// Update an existing shape's points.
    ///
    /// # Arguments
    /// * `id` - The shape's identifier.
    /// * `points` - New points (flat array: [x0, y0, x1, y1, ...]).
    pub fn update_shape(&mut self, id: &str, points: &[f64]) {
        if points.len() < 6 {
            return;
        }

        let points_vec: Vec<[f64; 2]> =
            points.chunks(2).map(|chunk| [chunk[0], chunk[1]]).collect();

        self.shape_manager.update_shape(id, points_vec);
        self.needs_render = true;
    }

    /// Remove a shape by ID.
    ///
    /// # Arguments
    /// * `id` - The shape's identifier.
    pub fn remove_shape(&mut self, id: &str) {
        self.shape_manager.remove_shape(id);
        self.needs_render = true;
    }

    /// Clear all shapes.
    pub fn clear_shapes(&mut self) {
        self.shape_manager.clear();
        self.needs_render = true;
    }

    /// Set a preview shape (rendered on top, for drag previews).
    ///
    /// # Arguments
    /// * `points` - Flat array of world coordinates (x, y pairs).
    /// * `color` - RGBA color array [r, g, b, a].
    pub fn set_preview_shape(&mut self, points: &[f64], color: &[f32]) {
        if points.len() < 6 || color.len() < 4 {
            return;
        }

        let points_vec: Vec<[f64; 2]> =
            points.chunks(2).map(|chunk| [chunk[0], chunk[1]]).collect();

        let color_arr = [color[0], color[1], color[2], color[3]];

        self.shape_manager.set_preview(points_vec, color_arr);
        self.needs_render = true;
    }

    /// Set a preview origin cross (two perpendicular lines at the given world position).
    ///
    /// # Arguments
    /// * `x`, `y` - World coordinates of the cross center.
    /// * `arm_size` - Half-length of each arm in world units.
    /// * `color` - RGBA color array `[r, g, b, a]`.
    pub fn set_preview_origin(&mut self, x: f64, y: f64, arm_size: f64, color: &[f32]) {
        let c = if color.len() >= 4 {
            [color[0], color[1], color[2], color[3]]
        } else {
            [0.5, 0.5, 0.5, 1.0]
        };
        self.shape_manager.set_preview_origin([x, y], arm_size, c);
        self.needs_render = true;
    }

    /// Clear the preview shape.
    pub fn clear_preview(&mut self) {
        self.shape_manager.clear_preview();
        self.needs_render = true;
    }

    /// Get the number of shapes (excluding preview).
    pub fn shape_count(&self) -> usize {
        self.shape_manager.len()
    }

    // ==================== Selection ====================

    /// Set the selected shape IDs.
    ///
    /// Pass an empty array to clear selection.
    pub fn set_selection(&mut self, ids: Vec<String>) {
        self.shape_manager.set_selection(ids);
        self.needs_render = true;
    }

    /// Get the currently selected shape IDs.
    pub fn get_selection(&self) -> Vec<String> {
        self.shape_manager.get_selection()
    }

    /// Add a shape to the selection.
    pub fn add_to_selection(&mut self, id: &str) {
        self.shape_manager.add_to_selection(id.to_string());
        self.needs_render = true;
    }

    /// Toggle a shape in the selection.
    pub fn toggle_selection(&mut self, id: &str) {
        self.shape_manager.toggle_selection(id);
        self.needs_render = true;
    }

    /// Clear all selection.
    pub fn clear_selection(&mut self) {
        self.shape_manager.clear_selection();
        self.needs_render = true;
    }

    /// Set the hovered shape ID.
    ///
    /// Pass None/undefined to clear hover.
    pub fn set_hover(&mut self, id: Option<String>) {
        self.shape_manager.set_hover(id);
        self.needs_render = true;
    }

    /// Set multiple hovered shape IDs (for marquee preview).
    ///
    /// Pass an empty array to clear hover.
    pub fn set_hover_multiple(&mut self, ids: Vec<String>) {
        self.shape_manager.set_hover_multiple(ids);
        self.needs_render = true;
    }

    /// Get the currently hovered shape ID.
    pub fn get_hover(&self) -> Option<String> {
        self.shape_manager.get_hover().cloned()
    }

    /// Get all currently hovered shape IDs.
    pub fn get_hover_ids(&self) -> Vec<String> {
        self.shape_manager.get_hover_ids()
    }

    // ==================== Screenshot Capture ====================

    /// Capture the current view as raw RGBA pixels.
    ///
    /// Renders the scene to an offscreen texture, copies the result to a
    /// staging buffer, maps it, and returns the pixel data as a `Uint8Array`.
    /// The first 8 bytes encode (width, height) as two little-endian u32s,
    /// followed by `width * height * 4` bytes of RGBA pixel data.
    ///
    /// Returns a `Promise<Uint8Array>` to JS.
    pub fn capture_screenshot(&mut self) -> js_sys::Promise {
        let width = self.surface_config.width;
        let height = self.surface_config.height;

        if width == 0 || height == 0 {
            return js_sys::Promise::reject(&JsValue::from_str("Canvas has zero size"));
        }

        // Ensure all buffers are up to date before rendering
        self.needs_render = true;
        self.grid_dirty = true;
        self.outlines_viewport_dirty = true;

        // Update viewport uniform
        let viewport_uniform =
            ViewportUniform::from_viewport(&self.viewport, self.crosshair_origin);
        self.queue.write_buffer(
            &self.viewport_buffer,
            0,
            bytemuck::bytes_of(&viewport_uniform),
        );

        // Update all dirty buffers
        self.update_grid_points();
        if self.shape_manager.is_dirty() {
            self.update_polygon_buffers();
            self.shape_manager.mark_clean();
            self.borders_dirty = true;
        }
        if self.shape_manager.is_preview_dirty() {
            self.update_preview_buffers();
            self.shape_manager.mark_preview_clean();
        }
        if self.shape_manager.preview_borders_dirty() {
            self.update_preview_border_buffers();
            self.shape_manager.mark_preview_borders_clean();
        }
        if self.borders_dirty || self.shape_manager.outlines_dirty() {
            self.update_border_buffers();
            self.borders_dirty = false;
        }
        if self.shape_manager.outlines_dirty() || self.outlines_viewport_dirty {
            self.update_selection_hover_buffers();
            self.shape_manager.mark_outlines_clean();
            self.outlines_viewport_dirty = false;
        }

        // Capture the surface format for BGRA detection in the async closure
        let format = self.surface_config.format;

        // Create offscreen texture for rendering
        let texture = self.device.create_texture(&wgpu::TextureDescriptor {
            label: Some("screenshot-texture"),
            size: wgpu::Extent3d {
                width,
                height,
                depth_or_array_layers: 1,
            },
            mip_level_count: 1,
            sample_count: 1,
            dimension: wgpu::TextureDimension::D2,
            format: self.surface_config.format,
            usage: wgpu::TextureUsages::RENDER_ATTACHMENT | wgpu::TextureUsages::COPY_SRC,
            view_formats: &[],
        });

        let view = texture.create_view(&wgpu::TextureViewDescriptor::default());

        // Bytes per row must be aligned to 256 for WebGPU buffer copy
        let bytes_per_pixel = 4u32;
        let unpadded_bytes_per_row = width * bytes_per_pixel;
        let align = 256u32;
        let padded_bytes_per_row = unpadded_bytes_per_row.div_ceil(align) * align;
        let buffer_size = (padded_bytes_per_row * height) as u64;

        // Create staging buffer for readback
        let staging_buffer = self.device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("screenshot-staging"),
            size: buffer_size,
            usage: wgpu::BufferUsages::COPY_DST | wgpu::BufferUsages::MAP_READ,
            mapped_at_creation: false,
        });

        let mut encoder = self
            .device
            .create_command_encoder(&wgpu::CommandEncoderDescriptor {
                label: Some("screenshot-encoder"),
            });

        // Run the same render passes as render(), but targeting the offscreen texture
        {
            let clear_color = if self.viewport.dark_theme {
                wgpu::Color {
                    r: 0.07,
                    g: 0.07,
                    b: 0.07,
                    a: 1.0,
                }
            } else {
                wgpu::Color {
                    r: 1.0,
                    g: 1.0,
                    b: 1.0,
                    a: 1.0,
                }
            };

            let mut render_pass = encoder.begin_render_pass(&wgpu::RenderPassDescriptor {
                label: Some("screenshot-render-pass"),
                color_attachments: &[Some(wgpu::RenderPassColorAttachment {
                    view: &view,
                    resolve_target: None,
                    ops: wgpu::Operations {
                        load: wgpu::LoadOp::Clear(clear_color),
                        store: wgpu::StoreOp::Store,
                    },
                })],
                depth_stencil_attachment: None,
                timestamp_writes: None,
                occlusion_query_set: None,
            });

            // Grid
            if self.grid_visible && self.grid_point_count > 0 {
                render_pass.set_pipeline(&self.grid_pipeline);
                render_pass.set_bind_group(0, &self.grid_bind_group, &[]);
                render_pass.set_vertex_buffer(0, self.grid_points_buffer.slice(..));
                render_pass.draw(0..4, 0..self.grid_point_count);
            }

            // Crosshair
            render_pass.set_pipeline(&self.crosshair_pipeline);
            render_pass.set_bind_group(0, &self.viewport_bind_group, &[]);
            render_pass.draw(0..4, 0..2);

            // Polygons
            if self.polygon_index_count > 0 {
                render_pass.set_pipeline(&self.polygon_pipeline);
                render_pass.set_bind_group(0, &self.polygon_bind_group, &[]);
                render_pass.set_vertex_buffer(0, self.polygon_vertex_buffer.slice(..));
                render_pass.set_index_buffer(
                    self.polygon_index_buffer.slice(..),
                    wgpu::IndexFormat::Uint32,
                );
                render_pass.draw_indexed(0..self.polygon_index_count, 0, 0..1);
            }

            // Preview shape
            if self.preview_index_count > 0 {
                render_pass.set_pipeline(&self.polygon_pipeline);
                render_pass.set_bind_group(0, &self.polygon_bind_group, &[]);
                render_pass.set_vertex_buffer(0, self.preview_vertex_buffer.slice(..));
                render_pass.set_index_buffer(
                    self.preview_index_buffer.slice(..),
                    wgpu::IndexFormat::Uint32,
                );
                render_pass.draw_indexed(0..self.preview_index_count, 0, 0..1);
            }

            // Default borders
            if self.border_segment_count > 0 {
                render_pass.set_pipeline(&self.border_pipeline);
                render_pass.set_bind_group(0, &self.border_bind_group, &[]);
                render_pass.set_vertex_buffer(0, self.border_segment_buffer.slice(..));
                render_pass.draw(0..4, 0..self.border_segment_count);
            }

            // Preview borders
            if self.preview_border_segment_count > 0 {
                render_pass.set_pipeline(&self.border_pipeline);
                render_pass.set_bind_group(0, &self.preview_border_bind_group, &[]);
                render_pass.set_vertex_buffer(0, self.preview_border_segment_buffer.slice(..));
                render_pass.draw(0..4, 0..self.preview_border_segment_count);
            }

            // Selection outlines
            if self.selection_segment_count > 0 {
                render_pass.set_pipeline(&self.outline_pipeline);
                render_pass.set_bind_group(0, &self.selection_bind_group, &[]);
                render_pass.set_vertex_buffer(0, self.selection_segment_buffer.slice(..));
                render_pass.draw(0..4, 0..self.selection_segment_count);
            }

            // Hover outlines
            if self.hover_segment_count > 0 {
                render_pass.set_pipeline(&self.outline_pipeline);
                render_pass.set_bind_group(0, &self.hover_bind_group, &[]);
                render_pass.set_vertex_buffer(0, self.hover_segment_buffer.slice(..));
                render_pass.draw(0..4, 0..self.hover_segment_count);
            }

            // Laser
            if self.laser_segment_count > 0 && self.laser_uniform.opacity > 0.0 {
                render_pass.set_pipeline(&self.laser_pipeline);
                render_pass.set_bind_group(0, &self.laser_bind_group, &[]);
                render_pass.set_vertex_buffer(0, self.laser_segments_buffer.slice(..));
                render_pass.draw(0..4, 0..self.laser_segment_count);
            }
        }

        // Copy offscreen texture to staging buffer
        encoder.copy_texture_to_buffer(
            wgpu::ImageCopyTexture {
                texture: &texture,
                mip_level: 0,
                origin: wgpu::Origin3d::ZERO,
                aspect: wgpu::TextureAspect::All,
            },
            wgpu::ImageCopyBuffer {
                buffer: &staging_buffer,
                layout: wgpu::ImageDataLayout {
                    offset: 0,
                    bytes_per_row: Some(padded_bytes_per_row),
                    rows_per_image: Some(height),
                },
            },
            wgpu::Extent3d {
                width,
                height,
                depth_or_array_layers: 1,
            },
        );

        self.queue.submit(std::iter::once(encoder.finish()));

        // Map the staging buffer asynchronously.
        // We share ownership of the buffer via Rc so `map_async` can borrow it
        // before the future moves it for reading.
        let staging_buffer = std::rc::Rc::new(staging_buffer);
        let (sender, receiver) = futures_channel::oneshot::channel();
        {
            let slice = staging_buffer.slice(..);
            slice.map_async(wgpu::MapMode::Read, move |result| {
                let _ = sender.send(result);
            });
        }

        // wgpu-web automatically polls via the browser's microtask queue,
        // so we don't need to call device.poll() on the web target.

        // Detect BGRA formats that need R/B channel swap for RGBA output
        let is_bgra = matches!(
            format,
            wgpu::TextureFormat::Bgra8Unorm | wgpu::TextureFormat::Bgra8UnormSrgb
        );

        let buf = staging_buffer.clone();
        wasm_bindgen_futures::future_to_promise(async move {
            receiver
                .await
                .map_err(|_| JsValue::from_str("Buffer map channel closed"))?
                .map_err(|e| JsValue::from_str(&format!("Buffer map failed: {:?}", e)))?;

            // Read the mapped data, removing row padding
            let mapped = buf.slice(..).get_mapped_range();
            let pixel_count = (width * height * bytes_per_pixel) as usize;
            let mut result = Vec::with_capacity(8 + pixel_count);

            // Header: width and height as little-endian u32
            result.extend_from_slice(&width.to_le_bytes());
            result.extend_from_slice(&height.to_le_bytes());

            // Copy pixel rows, stripping padding
            for row in 0..height {
                let start = (row * padded_bytes_per_row) as usize;
                let end = start + unpadded_bytes_per_row as usize;
                result.extend_from_slice(&mapped[start..end]);
            }

            // Swap B and R channels if the surface format is BGRA
            if is_bgra {
                let pixels = &mut result[8..];
                for pixel in pixels.chunks_exact_mut(4) {
                    pixel.swap(0, 2); // B <-> R
                }
            }

            drop(mapped);
            buf.unmap();

            Ok(js_sys::Uint8Array::from(&result[..]).into())
        })
    }

    // ==================== Library Integration ====================

    /// Sync shapes from a WasmLibrary.
    ///
    /// This replaces all existing shapes with the polygons from the library.
    /// The preview shape is preserved.
    pub fn sync_from_library(&mut self, library: &WasmLibrary) {
        let polygons = library.get_render_polygons_internal();
        self.shape_manager
            .sync_from_polygons(polygons, library.hole_indices_map());

        // Cache instance bounding boxes for outline rendering on selection/hover
        self.instance_bboxes = library.get_instance_bboxes();

        // Sync crosshair to the active cell's origin
        if let Some(origin) = library.get_cell_origin() {
            self.crosshair_origin = [origin[0] as f32, origin[1] as f32];
        }

        self.needs_render = true;
        self.grid_dirty = true;
        self.borders_dirty = true;
    }
}

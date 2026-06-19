//! Dynamic GPU buffer management for [`WasmRenderer`].
//!
//! Capacity checks and reallocation/upload helpers for polygon, border,
//! selection/hover outline, preview, violation, and grid buffers.

use super::{
    BUFFER_GROWTH_FACTOR, GridPointGpu, MAX_BORDER_SEGMENTS, MAX_OUTLINE_SEGMENTS,
    MAX_POLYGON_INDICES, MAX_POLYGON_VERTICES, VIOLATION_SEGMENT_CAPACITY, WasmRenderer,
};
use crate::grid::{calculate_fade_opacity, calculate_grid_range, calculate_skip_factor};
use crate::shapes::{ColoredSegment, OutlineSegment, PolygonVertex};
use crate::violation_markers::build_violation_segments;

impl WasmRenderer {
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

    /// Reallocate selection outline segment buffer if needed.
    /// Returns true if reallocation occurred.
    fn ensure_selection_segment_capacity(&mut self, required: usize) -> bool {
        if required <= self.selection_segment_capacity {
            return false;
        }

        if required > MAX_OUTLINE_SEGMENTS {
            log::error!(
                "Selection segment count ({}) exceeds maximum allowed ({}). Too many selected shapes.",
                required,
                MAX_OUTLINE_SEGMENTS
            );
            return false;
        }

        let new_capacity = Self::calculate_new_capacity(
            self.selection_segment_capacity,
            required,
            MAX_OUTLINE_SEGMENTS,
        );

        log::info!(
            "Reallocating selection segment buffer: {} -> {} segments ({:.1} KB)",
            self.selection_segment_capacity,
            new_capacity,
            (new_capacity * std::mem::size_of::<OutlineSegment>()) as f64 / 1024.0
        );

        self.selection_segment_buffer = self.device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("selection-segments"),
            size: (new_capacity * std::mem::size_of::<OutlineSegment>()) as u64,
            usage: wgpu::BufferUsages::VERTEX | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });

        self.selection_segment_capacity = new_capacity;
        true
    }

    /// Reallocate hover outline segment buffer if needed.
    /// Returns true if reallocation occurred.
    fn ensure_hover_segment_capacity(&mut self, required: usize) -> bool {
        if required <= self.hover_segment_capacity {
            return false;
        }

        if required > MAX_OUTLINE_SEGMENTS {
            log::error!(
                "Hover segment count ({}) exceeds maximum allowed ({}). Too many hovered shapes.",
                required,
                MAX_OUTLINE_SEGMENTS
            );
            return false;
        }

        let new_capacity = Self::calculate_new_capacity(
            self.hover_segment_capacity,
            required,
            MAX_OUTLINE_SEGMENTS,
        );

        log::info!(
            "Reallocating hover segment buffer: {} -> {} segments ({:.1} KB)",
            self.hover_segment_capacity,
            new_capacity,
            (new_capacity * std::mem::size_of::<OutlineSegment>()) as f64 / 1024.0
        );

        self.hover_segment_buffer = self.device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("hover-segments"),
            size: (new_capacity * std::mem::size_of::<OutlineSegment>()) as u64,
            usage: wgpu::BufferUsages::VERTEX | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });

        self.hover_segment_capacity = new_capacity;
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
    pub(super) fn update_polygon_buffers(&mut self) {
        // Triangulate all shapes - GPU will clip what's outside viewport
        let (vertices, indices) = self.shape_manager.triangulate();

        // Ensure vertex buffer capacity (reallocates if needed)
        if vertices.len() > self.polygon_vertex_capacity
            && !self.ensure_polygon_vertex_capacity(vertices.len())
        {
            // Failed to allocate - truncate to fit
            log::warn!(
                "Truncating {} vertices to fit buffer capacity {}",
                vertices.len(),
                self.polygon_vertex_capacity
            );
        }

        // Ensure index buffer capacity (reallocates if needed)
        if indices.len() > self.polygon_index_capacity
            && !self.ensure_polygon_index_capacity(indices.len())
        {
            // Failed to allocate - will truncate indices
            log::warn!(
                "Truncating {} indices to fit buffer capacity {}",
                indices.len(),
                self.polygon_index_capacity
            );
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
    pub(super) fn update_preview_buffers(&mut self) {
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
    pub(super) fn update_border_buffers(&mut self) {
        // Get default border segments (darkened fill color for non-selected/hovered shapes)
        // These are in world coordinates - shader will transform to screen
        let border_segments = self.shape_manager.get_default_border_segments();

        // Ensure buffer capacity (reallocates if needed)
        if border_segments.len() > self.border_segment_capacity
            && !self.ensure_border_segment_capacity(border_segments.len())
        {
            // Failed to allocate - will truncate
            log::warn!(
                "Truncating {} border segments to fit buffer capacity {}",
                border_segments.len(),
                self.border_segment_capacity
            );
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
    pub(super) fn update_preview_border_buffers(&mut self) {
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

    /// Build colored bbox outline segments for the current DRC violations.
    ///
    /// Segments are in world coordinates (the border pipeline transforms them to
    /// screen space). Errors render red, warnings amber. The selected violation
    /// is emphasized by emitting a second, slightly inset outline so it reads as
    /// a thicker/brighter box.
    pub(super) fn update_violation_buffers(&mut self) {
        let mut segments = build_violation_segments(&self.violations, self.selected_violation);

        if segments.len() > VIOLATION_SEGMENT_CAPACITY {
            log::warn!(
                "Truncating {} violation segments to capacity {}",
                segments.len(),
                VIOLATION_SEGMENT_CAPACITY
            );
            segments.truncate(VIOLATION_SEGMENT_CAPACITY);
        }

        self.violation_segment_count = segments.len() as u32;
        if !segments.is_empty() {
            self.queue.write_buffer(
                &self.violation_segment_buffer,
                0,
                bytemuck::cast_slice(&segments),
            );
        }
    }

    /// Update selection and hover outline segment buffers.
    ///
    /// These remain in screen coordinates for consistent line width appearance.
    /// They need to update on viewport changes (pan/zoom).
    pub(super) fn update_selection_hover_buffers(&mut self) {
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

        // Ensure selection buffer capacity (reallocates if needed)
        if selection_segments.len() > self.selection_segment_capacity
            && !self.ensure_selection_segment_capacity(selection_segments.len())
        {
            // Failed to allocate - truncate to fit
            log::warn!(
                "Truncating {} selection segments to fit buffer capacity {}",
                selection_segments.len(),
                self.selection_segment_capacity
            );
            selection_segments.truncate(self.selection_segment_capacity);
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

        // Append instance bbox outline segments for hovered ref UUIDs, excluding
        // those that are also selected so the selection (green) outline takes
        // precedence over the hover (black/white) outline — matching how plain
        // shapes handle this precedence in `get_hover_segments`.
        let mut hovered_ids = self.shape_manager.get_hover_ids();
        hovered_ids.retain(|id| !selected_ids.contains(id));
        self.append_instance_bbox_outlines(
            &hovered_ids,
            zoom,
            offset_x,
            offset_y,
            &mut hover_segments,
        );

        // Ensure hover buffer capacity (reallocates if needed)
        if hover_segments.len() > self.hover_segment_capacity
            && !self.ensure_hover_segment_capacity(hover_segments.len())
        {
            // Failed to allocate - truncate to fit
            log::warn!(
                "Truncating {} hover segments to fit buffer capacity {}",
                hover_segments.len(),
                self.hover_segment_capacity
            );
            hover_segments.truncate(self.hover_segment_capacity);
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
            if let Some(rest) = id.strip_prefix("ref:")
                && let Some(idx_str) = rest.split(':').next()
                && let Ok(elem_idx) = idx_str.parse::<usize>()
            {
                seen_indices.insert(elem_idx);
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
    pub(super) fn update_grid_points(&mut self) {
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
}

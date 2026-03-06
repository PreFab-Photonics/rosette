//! Shape management for polygon rendering.
//!
//! Handles storage, triangulation, and GPU buffer management for shapes.
//! Supports self-intersecting polygons using the evenodd fill rule.

use std::collections::{HashMap, HashSet};

use geo::algorithm::bool_ops::BooleanOps;
use geo::algorithm::line_intersection::{LineIntersection, line_intersection};
use geo::{Coord, LineString, Polygon as GeoPolygon};

/// A shape stored in the renderer.
#[derive(Debug, Clone)]
pub struct Shape {
    /// World coordinates of the shape vertices.
    ///
    /// For polygons with holes, the exterior ring comes first, followed by
    /// the vertices of each hole ring. The `hole_indices` field records
    /// where each hole ring starts.
    pub points: Vec<[f64; 2]>,
    /// RGBA color (0.0-1.0 range).
    pub color: [f32; 4],
    /// Axis-aligned bounding box: [min_x, min_y, max_x, max_y].
    /// Used for view frustum culling.
    pub bbox: [f64; 4],
    /// Start indices of hole rings within `points`.
    ///
    /// Empty for simple polygons. For a polygon with one hole, this
    /// contains a single entry pointing to where the hole vertices begin.
    /// Used by `earcutr::earcut` for correct triangulation of cutouts.
    pub hole_indices: Vec<usize>,
}

/// Compute axis-aligned bounding box from points.
fn compute_bbox(points: &[[f64; 2]]) -> [f64; 4] {
    if points.is_empty() {
        return [0.0, 0.0, 0.0, 0.0];
    }
    let mut min_x = f64::MAX;
    let mut min_y = f64::MAX;
    let mut max_x = f64::MIN;
    let mut max_y = f64::MIN;
    for p in points {
        min_x = min_x.min(p[0]);
        min_y = min_y.min(p[1]);
        max_x = max_x.max(p[0]);
        max_y = max_y.max(p[1]);
    }
    [min_x, min_y, max_x, max_y]
}

/// Check if two axis-aligned bounding boxes intersect.
#[inline]
#[allow(dead_code)] // Used by triangulate_visible for view frustum culling
fn bbox_intersects(a: &[f64; 4], b: &[f64; 4]) -> bool {
    // a and b are [min_x, min_y, max_x, max_y]
    a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1]
}

/// GPU-compatible vertex data for polygon rendering.
#[repr(C)]
#[derive(Debug, Clone, Copy, bytemuck::Pod, bytemuck::Zeroable)]
pub struct PolygonVertex {
    /// World position (will be transformed to screen space in shader).
    pub position: [f32; 2],
    /// RGBA color.
    pub color: [f32; 4],
}

/// GPU-compatible segment data for outline rendering.
/// Points are in SCREEN coordinates (pixels) for precision.
#[repr(C)]
#[derive(Debug, Clone, Copy, bytemuck::Pod, bytemuck::Zeroable)]
pub struct OutlineSegment {
    /// Start point in screen coordinates (pixels).
    pub p0: [f32; 2],
    /// End point in screen coordinates (pixels).
    pub p1: [f32; 2],
}

/// GPU-compatible segment data for colored border rendering.
/// Each segment has its own color (for default borders using darkened fill).
/// Points are in WORLD coordinates - the shader transforms them to screen space.
/// This allows borders to be computed once when shapes change, not on every pan/zoom.
/// Layout must match WGSL: p0 (8), p1 (8), color (16) = 32 bytes total.
#[repr(C)]
#[derive(Debug, Clone, Copy, bytemuck::Pod, bytemuck::Zeroable)]
pub struct ColoredSegment {
    /// Start point in world coordinates.
    pub p0: [f32; 2],
    /// End point in world coordinates.
    pub p1: [f32; 2],
    /// RGBA color for this segment.
    pub color: [f32; 4],
}

/// GPU-compatible uniform data for outline rendering.
/// Must match WGSL struct layout (48 bytes due to vec3 alignment).
#[repr(C)]
#[derive(Debug, Clone, Copy, bytemuck::Pod, bytemuck::Zeroable)]
pub struct OutlineUniform {
    /// Outline color (RGBA).
    pub color: [f32; 4], // 16 bytes (offset 0)
    /// Line width in pixels.
    pub line_width: f32, // 4 bytes (offset 16)
    /// Padding to align _padding2 to 16 bytes.
    pub _padding1: [f32; 3], // 12 bytes (offset 20)
    /// Final padding (vec3 in WGSL takes 16 bytes due to alignment).
    pub _padding2: [f32; 4], // 16 bytes (offset 32) - total 48 bytes
}

impl Default for OutlineUniform {
    fn default() -> Self {
        Self {
            color: [1.0, 0.0, 0.85, 1.0], // Magenta #FF00D9
            line_width: 2.0,
            _padding1: [0.0, 0.0, 0.0],
            _padding2: [0.0, 0.0, 0.0, 0.0],
        }
    }
}

impl OutlineUniform {
    /// Create uniform for selection outline.
    pub fn selection(_dark_theme: bool) -> Self {
        Self {
            color: [0.267, 1.0, 0.267, 1.0], // Bright green #44ff44
            line_width: 2.0,
            _padding1: [0.0, 0.0, 0.0],
            _padding2: [0.0, 0.0, 0.0, 0.0],
        }
    }

    /// Create uniform for hover outline.
    pub fn hover(_dark_theme: bool) -> Self {
        Self {
            color: [0.0, 0.0, 0.0, 1.0], // Black
            line_width: 2.0,
            _padding1: [0.0, 0.0, 0.0],
            _padding2: [0.0, 0.0, 0.0, 0.0],
        }
    }
}

/// Check if a polygon (defined by points) is self-intersecting.
///
/// Two edges intersect if they cross each other (not just share an endpoint).
/// Adjacent edges sharing a vertex don't count as intersections.
fn is_self_intersecting(points: &[[f64; 2]]) -> bool {
    let n = points.len();
    if n < 4 {
        return false; // Triangle can't self-intersect
    }

    // Check each pair of non-adjacent edges
    for i in 0..n {
        let i_next = (i + 1) % n;
        let line_a = geo::Line::new(
            Coord {
                x: points[i][0],
                y: points[i][1],
            },
            Coord {
                x: points[i_next][0],
                y: points[i_next][1],
            },
        );

        // Start from i+2 to skip adjacent edges (they share a vertex)
        // Stop at n-1 when i=0 to avoid checking first-last edge pair twice
        let end = if i == 0 { n - 1 } else { n };
        for j in (i + 2)..end {
            let j_next = (j + 1) % n;

            // Skip if edges share a vertex (adjacent in the circular list)
            if j_next == i {
                continue;
            }

            let line_b = geo::Line::new(
                Coord {
                    x: points[j][0],
                    y: points[j][1],
                },
                Coord {
                    x: points[j_next][0],
                    y: points[j_next][1],
                },
            );

            if let Some(intersection) = line_intersection(line_a, line_b) {
                match intersection {
                    LineIntersection::SinglePoint { is_proper, .. } => {
                        // Proper intersection means the lines cross (not at endpoints)
                        if is_proper {
                            return true;
                        }
                    }
                    LineIntersection::Collinear { .. } => {
                        // Overlapping segments - this is a degenerate case
                        return true;
                    }
                }
            }
        }
    }

    false
}

/// Convert our point array to a geo Polygon.
pub(crate) fn points_to_geo_polygon(points: &[[f64; 2]]) -> GeoPolygon<f64> {
    let coords: Vec<Coord<f64>> = points.iter().map(|p| Coord { x: p[0], y: p[1] }).collect();
    let line_string = LineString::new(coords);
    GeoPolygon::new(line_string, vec![])
}

/// Decompose a self-intersecting polygon into simple (non-intersecting) polygons
/// using the evenodd fill rule.
///
/// Returns a list of simple polygons that, when filled, produce the correct
/// evenodd rendering.
fn decompose_self_intersecting(points: &[[f64; 2]]) -> Vec<Vec<[f64; 2]>> {
    // Convert to geo polygon
    let polygon = points_to_geo_polygon(points);

    // Use union with self to decompose self-intersecting regions
    // This effectively applies the evenodd fill rule by creating
    // separate polygons for each non-overlapping region
    let multi_polygon = polygon.union(&polygon);

    // Convert back to our format
    let mut result = Vec::new();
    for poly in multi_polygon.iter() {
        let exterior: Vec<[f64; 2]> = poly.exterior().coords().map(|c| [c.x, c.y]).collect();

        // Remove the closing point if it's the same as the first
        // (geo closes polygons, but our format doesn't require it)
        let exterior = if exterior.len() > 1 && exterior.first() == exterior.last() {
            exterior[..exterior.len() - 1].to_vec()
        } else {
            exterior
        };

        if exterior.len() >= 3 {
            result.push(exterior);
        }

        // Note: Interior rings (holes) represent regions that should NOT be filled.
        // We intentionally skip them - only exterior rings define filled regions.
        // The geo union operation already produces the correct topology where
        // each exterior ring is a separate filled region.
    }

    result
}

/// Manages shapes and their GPU representation.
#[derive(Debug, Default)]
pub struct ShapeManager {
    /// All shapes indexed by ID.
    shapes: HashMap<String, Shape>,
    /// Insertion order for consistent rendering.
    order: Vec<String>,
    /// Optional preview shape (rendered on top).
    preview: Option<Shape>,
    /// Optional preview origin cross: (position, arm_size, color) in world coordinates.
    preview_origin: Option<([f64; 2], f64, [f32; 4])>,
    /// Whether shapes have changed since last GPU update.
    dirty: bool,
    /// Currently selected shape IDs.
    selected_ids: HashSet<String>,
    /// Currently hovered shape IDs (can be multiple for marquee preview).
    hovered_ids: HashSet<String>,
    /// Whether outline data needs update.
    outlines_dirty: bool,
}

impl ShapeManager {
    /// Create a new shape manager.
    pub fn new() -> Self {
        Self::default()
    }

    // ==================== Selection State ====================

    /// Set selected shape IDs.
    pub fn set_selection(&mut self, ids: Vec<String>) {
        let new_set: HashSet<String> = ids.into_iter().collect();
        if new_set != self.selected_ids {
            self.selected_ids = new_set;
            self.outlines_dirty = true;
        }
    }

    /// Get selected shape IDs.
    pub fn get_selection(&self) -> Vec<String> {
        self.selected_ids.iter().cloned().collect()
    }

    /// Add a shape to selection.
    pub fn add_to_selection(&mut self, id: String) {
        if self.selected_ids.insert(id) {
            self.outlines_dirty = true;
        }
    }

    /// Toggle a shape in selection.
    pub fn toggle_selection(&mut self, id: &str) {
        if self.selected_ids.contains(id) {
            self.selected_ids.remove(id);
        } else {
            self.selected_ids.insert(id.to_string());
        }
        self.outlines_dirty = true;
    }

    /// Clear all selection.
    pub fn clear_selection(&mut self) {
        if !self.selected_ids.is_empty() {
            self.selected_ids.clear();
            self.outlines_dirty = true;
        }
    }

    /// Set hovered shape ID (single).
    pub fn set_hover(&mut self, id: Option<String>) {
        let new_set: HashSet<String> = id.into_iter().collect();
        if new_set != self.hovered_ids {
            self.hovered_ids = new_set;
            self.outlines_dirty = true;
        }
    }

    /// Set multiple hovered shape IDs (for marquee preview).
    pub fn set_hover_multiple(&mut self, ids: Vec<String>) {
        let new_set: HashSet<String> = ids.into_iter().collect();
        if new_set != self.hovered_ids {
            self.hovered_ids = new_set;
            self.outlines_dirty = true;
        }
    }

    /// Get hovered shape ID (returns first one if multiple, for compatibility).
    pub fn get_hover(&self) -> Option<&String> {
        self.hovered_ids.iter().next()
    }

    /// Get all hovered shape IDs.
    pub fn get_hover_ids(&self) -> Vec<String> {
        self.hovered_ids.iter().cloned().collect()
    }

    /// Check if outlines need update.
    pub fn outlines_dirty(&self) -> bool {
        self.outlines_dirty
    }

    /// Mark outlines as clean.
    pub fn mark_outlines_clean(&mut self) {
        self.outlines_dirty = false;
    }

    // ==================== Outline Geometry ====================

    /// Get outline segments for selected shapes in screen coordinates.
    ///
    /// # Arguments
    /// * `zoom` - Pixels per world unit
    /// * `offset_x`, `offset_y` - Screen position of world origin
    pub fn get_selection_segments(
        &self,
        zoom: f64,
        offset_x: f64,
        offset_y: f64,
    ) -> Vec<OutlineSegment> {
        self.get_segments_for_ids(self.selected_ids.iter(), zoom, offset_x, offset_y)
    }

    /// Get outline segments for hovered shapes (excluding if already selected).
    pub fn get_hover_segments(
        &self,
        zoom: f64,
        offset_x: f64,
        offset_y: f64,
    ) -> Vec<OutlineSegment> {
        // Filter out shapes that are already selected (they show selection outline instead)
        let hover_only: Vec<&String> = self
            .hovered_ids
            .iter()
            .filter(|id| !self.selected_ids.contains(*id))
            .collect();

        if hover_only.is_empty() {
            Vec::new()
        } else {
            self.get_segments_for_ids(hover_only.into_iter(), zoom, offset_x, offset_y)
        }
    }

    /// Extract edge segments for given shape IDs, converting to screen coordinates.
    fn get_segments_for_ids<'a, I>(
        &self,
        ids: I,
        zoom: f64,
        offset_x: f64,
        offset_y: f64,
    ) -> Vec<OutlineSegment>
    where
        I: Iterator<Item = &'a String>,
    {
        let mut segments = Vec::new();

        for id in ids {
            if let Some(shape) = self.shapes.get(id) {
                // Skip fully transparent shapes (hidden layers)
                if shape.color[3] <= 0.0 {
                    continue;
                }
                let n = shape.points.len();
                for i in 0..n {
                    let j = (i + 1) % n;
                    // Convert world to screen: screen = world * zoom + offset
                    let p0_screen_x = shape.points[i][0] * zoom + offset_x;
                    let p0_screen_y = shape.points[i][1] * zoom + offset_y;
                    let p1_screen_x = shape.points[j][0] * zoom + offset_x;
                    let p1_screen_y = shape.points[j][1] * zoom + offset_y;

                    segments.push(OutlineSegment {
                        p0: [p0_screen_x as f32, p0_screen_y as f32],
                        p1: [p1_screen_x as f32, p1_screen_y as f32],
                    });
                }
            }
        }

        segments
    }

    /// Get default border segments for all shapes (excluding selected/hovered).
    /// Each segment has a darkened version of the shape's fill color.
    /// Also includes the preview shape border if present.
    /// Get border segments for all non-selected/non-hovered shapes.
    /// Segments are in WORLD coordinates - the shader transforms them to screen space.
    /// This allows borders to be computed once when shapes change, not on every pan/zoom.
    ///
    /// Note: No view bounds culling here since we want to cache all borders.
    /// The GPU will naturally clip segments outside the viewport.
    pub fn get_default_border_segments(&self) -> Vec<ColoredSegment> {
        let mut segments = Vec::new();

        for id in &self.order {
            // Skip selected or hovered shapes (they have their own outlines)
            if self.selected_ids.contains(id) || self.hovered_ids.contains(id) {
                continue;
            }

            if let Some(shape) = self.shapes.get(id) {
                self.add_shape_border_segments(shape, &mut segments);
            }
        }

        // Add preview shape border (always visible when drawing).
        // Uses the shape's RGB at full opacity — the border renders even when
        // the fill alpha is zero (outline-only preview for cell drag).
        if let Some(preview) = &self.preview {
            let border_color = [
                preview.color[0] * 0.7,
                preview.color[1] * 0.7,
                preview.color[2] * 0.7,
                1.0_f32,
            ];
            let n = preview.points.len();
            for i in 0..n {
                let j = (i + 1) % n;
                segments.push(ColoredSegment {
                    p0: [preview.points[i][0] as f32, preview.points[i][1] as f32],
                    p1: [preview.points[j][0] as f32, preview.points[j][1] as f32],
                    color: border_color,
                });
            }
        }

        // Add preview origin cross (two perpendicular line segments).
        if let Some((origin, arm, color)) = &self.preview_origin {
            let color = *color;
            let ox = origin[0] as f32;
            let oy = origin[1] as f32;
            let a = *arm as f32;
            // Horizontal arm
            segments.push(ColoredSegment {
                p0: [ox - a, oy],
                p1: [ox + a, oy],
                color,
            });
            // Vertical arm
            segments.push(ColoredSegment {
                p0: [ox, oy - a],
                p1: [ox, oy + a],
                color,
            });
        }

        segments
    }

    /// Helper to add border segments for a single shape.
    /// Segments are stored in WORLD coordinates.
    fn add_shape_border_segments(&self, shape: &Shape, segments: &mut Vec<ColoredSegment>) {
        // Skip fully transparent shapes (hidden layers)
        if shape.color[3] <= 0.0 {
            return;
        }

        // Darken the fill color for the border (multiply RGB by 0.7)
        let border_color = [
            shape.color[0] * 0.7,
            shape.color[1] * 0.7,
            shape.color[2] * 0.7,
            shape.color[3], // Keep same alpha
        ];

        if shape.hole_indices.is_empty() {
            // Simple polygon: one closed ring
            Self::add_ring_border_segments(&shape.points, border_color, segments);
        } else {
            // Polygon with holes: draw each ring (exterior + holes) separately
            // to avoid connecting the last exterior vertex to the first hole vertex.
            let mut ring_starts: Vec<usize> = vec![0];
            ring_starts.extend_from_slice(&shape.hole_indices);
            ring_starts.push(shape.points.len());

            for w in ring_starts.windows(2) {
                let ring = &shape.points[w[0]..w[1]];
                Self::add_ring_border_segments(ring, border_color, segments);
            }
        }
    }

    /// Draw border segments for a single closed ring of points.
    fn add_ring_border_segments(
        points: &[[f64; 2]],
        color: [f32; 4],
        segments: &mut Vec<ColoredSegment>,
    ) {
        let n = points.len();
        for i in 0..n {
            let j = (i + 1) % n;
            segments.push(ColoredSegment {
                p0: [points[i][0] as f32, points[i][1] as f32],
                p1: [points[j][0] as f32, points[j][1] as f32],
                color,
            });
        }
    }

    /// Add or update a shape.
    pub fn add_shape(&mut self, id: String, points: Vec<[f64; 2]>, color: [f32; 4]) {
        let bbox = compute_bbox(&points);
        if self.shapes.contains_key(&id) {
            // Update existing shape
            if let Some(shape) = self.shapes.get_mut(&id) {
                shape.points = points;
                shape.color = color;
                shape.bbox = bbox;
            }
        } else {
            // Add new shape
            self.shapes.insert(
                id.clone(),
                Shape {
                    points,
                    color,
                    bbox,
                    hole_indices: vec![],
                },
            );
            self.order.push(id);
        }
        self.dirty = true;
        self.outlines_dirty = true; // Borders need regeneration
    }

    /// Update an existing shape's points.
    pub fn update_shape(&mut self, id: &str, points: Vec<[f64; 2]>) {
        if let Some(shape) = self.shapes.get_mut(id) {
            shape.bbox = compute_bbox(&points);
            shape.points = points;
            self.dirty = true;
            self.outlines_dirty = true; // Borders need regeneration
        }
    }

    /// Remove a shape by ID.
    pub fn remove_shape(&mut self, id: &str) {
        if self.shapes.remove(id).is_some() {
            self.order.retain(|s| s != id);
            self.dirty = true;
            self.outlines_dirty = true; // Borders need regeneration
        }
    }

    /// Clear all shapes.
    pub fn clear(&mut self) {
        self.shapes.clear();
        self.order.clear();
        self.dirty = true;
        self.outlines_dirty = true; // Borders need regeneration
    }

    /// Sync shapes from a list of (uuid, vertices, color) tuples.
    ///
    /// This replaces all existing shapes with the provided data.
    /// Used to sync from WasmLibrary.
    pub fn sync_from_polygons(
        &mut self,
        polygons: Vec<(String, Vec<[f64; 2]>, [f32; 4])>,
        hole_map: &HashMap<String, Vec<usize>>,
    ) {
        self.shapes.clear();
        self.order.clear();

        for (id, points, color) in polygons.into_iter() {
            let bbox = compute_bbox(&points);
            let hole_indices = hole_map.get(&id).cloned().unwrap_or_default();
            self.shapes.insert(
                id.clone(),
                Shape {
                    points,
                    color,
                    bbox,
                    hole_indices,
                },
            );
            self.order.push(id);
        }

        self.dirty = true;
        // Clear selection/hover state for shapes that no longer exist
        self.selected_ids.retain(|id| self.shapes.contains_key(id));
        self.hovered_ids.retain(|id| self.shapes.contains_key(id));
        self.outlines_dirty = true;
    }

    /// Set a preview shape (rendered on top, not stored permanently).
    pub fn set_preview(&mut self, points: Vec<[f64; 2]>, color: [f32; 4]) {
        let bbox = compute_bbox(&points);
        self.preview = Some(Shape {
            points,
            color,
            bbox,
            hole_indices: vec![],
        });
        self.dirty = true;
        self.outlines_dirty = true; // Preview border needs regeneration
    }

    /// Set a preview origin cross (rendered as two perpendicular line segments).
    ///
    /// # Arguments
    /// * `origin` - World coordinates of the cross center.
    /// * `arm_size` - Half-length of each arm in world units.
    /// * `color` - RGBA color for the cross lines.
    pub fn set_preview_origin(&mut self, origin: [f64; 2], arm_size: f64, color: [f32; 4]) {
        self.preview_origin = Some((origin, arm_size, color));
        self.outlines_dirty = true;
    }

    /// Clear the preview shape and origin cross.
    pub fn clear_preview(&mut self) {
        if self.preview.is_some() || self.preview_origin.is_some() {
            self.preview = None;
            self.preview_origin = None;
            self.dirty = true;
            self.outlines_dirty = true;
        }
    }

    /// Check if shapes have changed since last GPU update.
    pub fn is_dirty(&self) -> bool {
        self.dirty
    }

    /// Mark shapes as dirty (forces re-triangulation on next update).
    ///
    /// Called when view frustum culling needs to be re-run due to
    /// viewport changes (zoom or pan outside culled bounds).
    #[allow(dead_code)] // Available for future view frustum culling optimization
    pub fn mark_dirty(&mut self) {
        self.dirty = true;
    }

    /// Mark shapes as clean (after GPU update).
    pub fn mark_clean(&mut self) {
        self.dirty = false;
    }

    /// Get the number of shapes (excluding preview).
    pub fn len(&self) -> usize {
        self.shapes.len()
    }

    /// Triangulate all shapes and generate GPU vertex/index buffers.
    ///
    /// Returns (vertices, indices) ready for GPU upload.
    ///
    /// Note: For rendering, prefer `triangulate_visible()` which performs
    /// view frustum culling for better performance with many shapes.
    #[allow(dead_code)]
    pub fn triangulate(&self) -> (Vec<PolygonVertex>, Vec<u32>) {
        let mut vertices = Vec::new();
        let mut indices = Vec::new();

        // Process shapes in order
        for id in &self.order {
            if let Some(shape) = self.shapes.get(id) {
                self.triangulate_shape(shape, &mut vertices, &mut indices);
            }
        }

        // Process preview shape last (renders on top)
        if let Some(preview) = &self.preview {
            self.triangulate_shape(preview, &mut vertices, &mut indices);
        }

        (vertices, indices)
    }

    /// Triangulate only shapes visible within the given viewport bounds.
    ///
    /// This performs view frustum culling - shapes whose bounding boxes
    /// don't intersect the view bounds are skipped entirely.
    ///
    /// # Arguments
    /// * `view_min_x`, `view_min_y` - Minimum corner of visible area (world coords)
    /// * `view_max_x`, `view_max_y` - Maximum corner of visible area (world coords)
    ///
    /// Returns (vertices, indices, visible_count) ready for GPU upload.
    ///
    /// NOTE: Currently unused - we triangulate all shapes and let the GPU clip.
    /// This avoids expensive re-triangulation on every pan/zoom. May be useful
    /// for very large scenes (100k+ shapes) where GPU vertex limits are hit.
    #[allow(dead_code)]
    pub fn triangulate_visible(
        &self,
        view_min_x: f64,
        view_min_y: f64,
        view_max_x: f64,
        view_max_y: f64,
    ) -> (Vec<PolygonVertex>, Vec<u32>, usize) {
        let mut vertices = Vec::new();
        let mut indices = Vec::new();
        let mut visible_count = 0;

        let view_bbox = [view_min_x, view_min_y, view_max_x, view_max_y];

        // Process shapes in order, but only if visible
        for id in &self.order {
            if let Some(shape) = self.shapes.get(id)
                && bbox_intersects(&shape.bbox, &view_bbox)
            {
                self.triangulate_shape(shape, &mut vertices, &mut indices);
                visible_count += 1;
            }
        }

        // Preview shape is always rendered (user is actively drawing it)
        if let Some(preview) = &self.preview {
            self.triangulate_shape(preview, &mut vertices, &mut indices);
        }

        (vertices, indices, visible_count)
    }

    /// Triangulate a single shape and append to buffers.
    ///
    /// Handles self-intersecting polygons by decomposing them into simple
    /// polygons using the evenodd fill rule before triangulation.
    fn triangulate_shape(
        &self,
        shape: &Shape,
        vertices: &mut Vec<PolygonVertex>,
        indices: &mut Vec<u32>,
    ) {
        if shape.points.len() < 3 {
            return;
        }

        // Skip fully transparent shapes (hidden layers)
        if shape.color[3] <= 0.0 {
            return;
        }

        // Polygon with holes: use earcutr's native hole support
        if !shape.hole_indices.is_empty() {
            self.triangulate_polygon_with_holes(shape, vertices, indices);
            return;
        }

        // Check if polygon is self-intersecting
        if is_self_intersecting(&shape.points) {
            // Decompose into simple polygons using evenodd fill rule
            let simple_polygons = decompose_self_intersecting(&shape.points);

            // Triangulate each simple polygon
            for poly_points in simple_polygons {
                self.triangulate_simple_polygon(&poly_points, shape.color, vertices, indices);
            }
        } else {
            // Simple polygon - triangulate directly
            self.triangulate_simple_polygon(&shape.points, shape.color, vertices, indices);
        }
    }

    /// Triangulate a polygon with holes using earcutr's native hole support.
    fn triangulate_polygon_with_holes(
        &self,
        shape: &Shape,
        vertices: &mut Vec<PolygonVertex>,
        indices: &mut Vec<u32>,
    ) {
        let base_index = vertices.len() as u32;

        // Add all vertices (exterior + holes)
        for point in &shape.points {
            vertices.push(PolygonVertex {
                position: [point[0] as f32, point[1] as f32],
                color: shape.color,
            });
        }

        // Flat coordinates for earcutr
        let flat_coords: Vec<f64> = shape.points.iter().flat_map(|p| vec![p[0], p[1]]).collect();

        // earcutr expects hole indices as indices into the flat coordinate
        // array (i.e. vertex index, not byte offset)
        let tri_indices = earcutr::earcut(&flat_coords, &shape.hole_indices, 2).unwrap_or_default();

        for idx in tri_indices {
            indices.push(base_index + idx as u32);
        }
    }

    /// Triangulate a simple (non-self-intersecting) polygon.
    fn triangulate_simple_polygon(
        &self,
        points: &[[f64; 2]],
        color: [f32; 4],
        vertices: &mut Vec<PolygonVertex>,
        indices: &mut Vec<u32>,
    ) {
        if points.len() < 3 {
            return;
        }

        let base_index = vertices.len() as u32;

        // Add vertices
        for point in points {
            vertices.push(PolygonVertex {
                position: [point[0] as f32, point[1] as f32],
                color,
            });
        }

        // Triangulate using earcut
        // earcut expects a flat array of coordinates
        let flat_coords: Vec<f64> = points.iter().flat_map(|p| vec![p[0], p[1]]).collect();

        // No holes, 2D points
        let tri_indices = earcutr::earcut(&flat_coords, &[], 2).unwrap_or_default();

        // Add indices (offset by base_index)
        for idx in tri_indices {
            indices.push(base_index + idx as u32);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add_shape() {
        let mut manager = ShapeManager::new();
        manager.add_shape(
            "rect1".to_string(),
            vec![[0.0, 0.0], [100.0, 0.0], [100.0, 50.0], [0.0, 50.0]],
            [1.0, 0.0, 0.0, 1.0],
        );

        assert_eq!(manager.len(), 1);
        assert!(manager.is_dirty());
    }

    #[test]
    fn test_triangulate_rectangle() {
        let mut manager = ShapeManager::new();
        manager.add_shape(
            "rect1".to_string(),
            vec![[0.0, 0.0], [100.0, 0.0], [100.0, 50.0], [0.0, 50.0]],
            [1.0, 0.0, 0.0, 1.0],
        );

        let (vertices, indices) = manager.triangulate();

        // Rectangle has 4 vertices
        assert_eq!(vertices.len(), 4);
        // Rectangle triangulates to 2 triangles = 6 indices
        assert_eq!(indices.len(), 6);
    }

    #[test]
    fn test_preview_shape() {
        let mut manager = ShapeManager::new();
        manager.set_preview(
            vec![[0.0, 0.0], [50.0, 0.0], [50.0, 50.0], [0.0, 50.0]],
            [0.0, 1.0, 0.0, 0.5],
        );

        let (vertices, _) = manager.triangulate();
        assert_eq!(vertices.len(), 4);

        manager.clear_preview();
        let (vertices, _) = manager.triangulate();
        assert_eq!(vertices.len(), 0);
    }

    #[test]
    fn test_view_frustum_culling() {
        let mut manager = ShapeManager::new();

        // Add three shapes at different positions
        // Shape 1: at origin (0-100, 0-50)
        manager.add_shape(
            "rect1".to_string(),
            vec![[0.0, 0.0], [100.0, 0.0], [100.0, 50.0], [0.0, 50.0]],
            [1.0, 0.0, 0.0, 1.0],
        );
        // Shape 2: far right (500-600, 0-50)
        manager.add_shape(
            "rect2".to_string(),
            vec![[500.0, 0.0], [600.0, 0.0], [600.0, 50.0], [500.0, 50.0]],
            [0.0, 1.0, 0.0, 1.0],
        );
        // Shape 3: far down (0-100, 500-550)
        manager.add_shape(
            "rect3".to_string(),
            vec![[0.0, 500.0], [100.0, 500.0], [100.0, 550.0], [0.0, 550.0]],
            [0.0, 0.0, 1.0, 1.0],
        );

        // View only includes shape 1 (viewport 0-200, 0-100)
        let (vertices, indices, visible_count) =
            manager.triangulate_visible(0.0, 0.0, 200.0, 100.0);

        assert_eq!(visible_count, 1);
        assert_eq!(vertices.len(), 4); // Only 1 rectangle = 4 vertices
        assert_eq!(indices.len(), 6); // Only 1 rectangle = 6 indices

        // View includes shapes 1 and 2 (viewport 0-700, 0-100)
        let (vertices, indices, visible_count) =
            manager.triangulate_visible(0.0, 0.0, 700.0, 100.0);

        assert_eq!(visible_count, 2);
        assert_eq!(vertices.len(), 8); // 2 rectangles = 8 vertices
        assert_eq!(indices.len(), 12); // 2 rectangles = 12 indices

        // View includes all shapes (viewport 0-700, 0-600)
        let (vertices, indices, visible_count) =
            manager.triangulate_visible(0.0, 0.0, 700.0, 600.0);

        assert_eq!(visible_count, 3);
        assert_eq!(vertices.len(), 12); // 3 rectangles = 12 vertices
        assert_eq!(indices.len(), 18); // 3 rectangles = 18 indices
    }

    #[test]
    fn test_bbox_computation() {
        // Test the compute_bbox helper directly
        let points = vec![[10.0, 20.0], [50.0, 20.0], [50.0, 80.0], [10.0, 80.0]];
        let bbox = compute_bbox(&points);
        assert_eq!(bbox[0], 10.0); // min_x
        assert_eq!(bbox[1], 20.0); // min_y
        assert_eq!(bbox[2], 50.0); // max_x
        assert_eq!(bbox[3], 80.0); // max_y
    }

    #[test]
    fn test_bbox_intersects() {
        // Overlapping boxes
        let a = [0.0, 0.0, 100.0, 100.0];
        let b = [50.0, 50.0, 150.0, 150.0];
        assert!(bbox_intersects(&a, &b));

        // Non-overlapping boxes (b is to the right of a)
        let a = [0.0, 0.0, 100.0, 100.0];
        let b = [200.0, 0.0, 300.0, 100.0];
        assert!(!bbox_intersects(&a, &b));

        // Touching edges (should be considered intersecting)
        let a = [0.0, 0.0, 100.0, 100.0];
        let b = [100.0, 0.0, 200.0, 100.0];
        assert!(bbox_intersects(&a, &b));

        // One box inside another
        let a = [0.0, 0.0, 100.0, 100.0];
        let b = [25.0, 25.0, 75.0, 75.0];
        assert!(bbox_intersects(&a, &b));
    }

    #[test]
    fn test_is_self_intersecting_simple() {
        // Simple rectangle - not self-intersecting
        let rect = vec![[0.0, 0.0], [100.0, 0.0], [100.0, 50.0], [0.0, 50.0]];
        assert!(!is_self_intersecting(&rect));

        // Triangle - cannot self-intersect
        let triangle = vec![[0.0, 0.0], [100.0, 0.0], [50.0, 100.0]];
        assert!(!is_self_intersecting(&triangle));
    }

    #[test]
    fn test_is_self_intersecting_bowtie() {
        // Bowtie shape (like the user's image) - self-intersecting
        // Points form an X pattern when connected in order
        let bowtie = vec![
            [0.0, 0.0],     // bottom-left
            [100.0, 100.0], // top-right
            [100.0, 0.0],   // bottom-right
            [0.0, 100.0],   // top-left
        ];
        assert!(is_self_intersecting(&bowtie));
    }

    #[test]
    fn test_decompose_bowtie() {
        // Bowtie shape should decompose into 2 triangles with evenodd fill
        let bowtie = vec![[0.0, 0.0], [100.0, 100.0], [100.0, 0.0], [0.0, 100.0]];

        let decomposed = decompose_self_intersecting(&bowtie);

        // Should produce 2 separate triangles (the two filled regions)
        assert_eq!(decomposed.len(), 2);

        // Each should be a triangle (3 vertices)
        for poly in &decomposed {
            assert_eq!(poly.len(), 3);
        }
    }

    #[test]
    fn test_triangulate_self_intersecting() {
        let mut manager = ShapeManager::new();

        // Add a bowtie (self-intersecting) shape
        manager.add_shape(
            "bowtie".to_string(),
            vec![[0.0, 0.0], [100.0, 100.0], [100.0, 0.0], [0.0, 100.0]],
            [1.0, 0.0, 0.0, 1.0],
        );

        let (vertices, indices) = manager.triangulate();

        // With evenodd fill, a bowtie produces 2 triangles = 6 vertices, 6 indices
        // (center region is NOT filled)
        assert_eq!(vertices.len(), 6);
        assert_eq!(indices.len(), 6);
    }
}

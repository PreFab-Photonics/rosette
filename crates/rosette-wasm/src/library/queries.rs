//! Read-only element queries: hit-testing, selection grouping,
//! bounds, and vertex/info extraction.

use super::{
    ElementInfo, REF_UUID_PREFIX, WasmLibrary, array_transforms, layer_key,
    parse_ref_uuid_element_index, text_bbox,
};
use rosette_core::Point;
use rosette_core::cell::Element;
use rosette_core::geometry::{BBox, offset_polygon};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl WasmLibrary {
    /// Hit test at a world position.
    ///
    /// Returns the UUID of the element at that point, if any.
    /// When multiple elements overlap, returns the one with smallest area
    /// (typically the "topmost" in visual stacking).
    /// Also tests CellRef-resolved geometry using synthetic UUIDs.
    pub fn hit_test(&self, x: f64, y: f64) -> Option<String> {
        let point = Point::new(x, y);
        let cell_name = self.active_cell.as_ref()?;
        let cell = self.library.cell(cell_name)?;

        let mut hits: Vec<(String, f64)> = Vec::new(); // (uuid, area)

        // Test direct polygon elements
        for (uuid, elem_ref) in &self.element_refs {
            if elem_ref.cell_name != *cell_name {
                continue;
            }

            match cell.elements().get(elem_ref.element_index) {
                Some(Element::Polygon { polygon, layer }) => {
                    // Skip hidden layers (alpha == 0)
                    let key = layer_key(layer.number, layer.datatype);
                    if let Some(color) = self.layer_colors.get(&key)
                        && color[3] <= 0.0
                    {
                        continue;
                    }

                    let bbox = polygon.bbox();
                    if !bbox.contains(point) {
                        continue;
                    }

                    if polygon.contains(point) {
                        hits.push((uuid.clone(), polygon.area()));
                    }
                }
                Some(Element::Path {
                    points,
                    width,
                    layer,
                    ..
                }) => {
                    let key = layer_key(layer.number, layer.datatype);
                    if let Some(color) = self.layer_colors.get(&key)
                        && color[3] <= 0.0
                    {
                        continue;
                    }

                    if let Some(ribbon) = offset_polygon(points, *width) {
                        let bbox = ribbon.bbox();
                        if bbox.contains(point) && ribbon.contains(point) {
                            hits.push((uuid.clone(), ribbon.area()));
                        }
                    }
                }
                Some(Element::Text {
                    text,
                    position,
                    layer,
                    height,
                }) => {
                    let key = layer_key(layer.number, layer.datatype);
                    if let Some(color) = self.layer_colors.get(&key)
                        && color[3] <= 0.0
                    {
                        continue;
                    }

                    let bbox = text_bbox(text, position, *height);
                    if bbox.contains(point) {
                        let area = (bbox.max().x - bbox.min().x) * (bbox.max().y - bbox.min().y);
                        hits.push((uuid.clone(), area));
                    }
                }
                _ => {}
            }
        }

        // Test CellRef instances via bounding box — clicking anywhere inside
        // the instance bbox selects the whole instance.
        for (elem_idx, element) in cell.elements().iter().enumerate() {
            if let Element::CellRef(cell_ref) = element {
                let bbox = self.instance_bbox_cached(cell_name, elem_idx, cell_ref);
                if bbox.contains(point) {
                    // Use first synthetic UUID as the representative hit
                    let uuid = format!("{REF_UUID_PREFIX}{elem_idx}:0");
                    let area = (bbox.max().x - bbox.min().x) * (bbox.max().y - bbox.min().y);
                    hits.push((uuid, area));
                }
            }
        }

        // Return smallest area (topmost in stacking order)
        hits.sort_by(|a, b| a.1.partial_cmp(&b.1).unwrap_or(std::cmp::Ordering::Equal));
        hits.first().map(|(uuid, _)| uuid.clone())
    }

    /// Hit test a rectangle to find all intersecting elements.
    ///
    /// Returns UUIDs of all elements whose bounding boxes intersect
    /// the given rectangle (specified in world coordinates).
    ///
    /// For CellRef instances, returns a single representative UUID
    /// (`ref:N:0`) per instance rather than all synthetic UUIDs.
    /// The caller should expand to the full group via `get_group_ids`.
    pub fn hit_test_rect(&self, min_x: f64, min_y: f64, max_x: f64, max_y: f64) -> Vec<String> {
        let query_bbox = BBox::new(Point::new(min_x, min_y), Point::new(max_x, max_y));

        let cell_name = match &self.active_cell {
            Some(name) => name,
            None => return Vec::new(),
        };

        let cell = match self.library.cell(cell_name) {
            Some(c) => c,
            None => return Vec::new(),
        };

        let mut hits: Vec<String> = Vec::new();

        // Test direct polygon elements
        for (uuid, elem_ref) in &self.element_refs {
            if elem_ref.cell_name != *cell_name {
                continue;
            }

            match cell.elements().get(elem_ref.element_index) {
                Some(Element::Polygon { polygon, layer }) => {
                    let key = layer_key(layer.number, layer.datatype);
                    if let Some(color) = self.layer_colors.get(&key)
                        && color[3] <= 0.0
                    {
                        continue;
                    }

                    let bbox = polygon.bbox();
                    if bbox.overlaps(&query_bbox) {
                        hits.push(uuid.clone());
                    }
                }
                Some(Element::Path {
                    points,
                    width,
                    layer,
                    ..
                }) => {
                    let key = layer_key(layer.number, layer.datatype);
                    if let Some(color) = self.layer_colors.get(&key)
                        && color[3] <= 0.0
                    {
                        continue;
                    }

                    if let Some(ribbon) = offset_polygon(points, *width) {
                        let bbox = ribbon.bbox();
                        if bbox.overlaps(&query_bbox) {
                            hits.push(uuid.clone());
                        }
                    }
                }
                Some(Element::Text {
                    text,
                    position,
                    layer,
                    height,
                }) => {
                    let key = layer_key(layer.number, layer.datatype);
                    if let Some(color) = self.layer_colors.get(&key)
                        && color[3] <= 0.0
                    {
                        continue;
                    }

                    let bbox = text_bbox(text, position, *height);
                    if bbox.overlaps(&query_bbox) {
                        hits.push(uuid.clone());
                    }
                }
                _ => {}
            }
        }

        // Test CellRef instances via bounding box.
        // Return a single representative UUID per instance (`ref:N:0`);
        // the instance is selected as a single entity.
        for (elem_idx, element) in cell.elements().iter().enumerate() {
            if let Element::CellRef(cell_ref) = element {
                let bbox = self.instance_bbox_cached(cell_name, elem_idx, cell_ref);
                if bbox.overlaps(&query_bbox) {
                    hits.push(format!("{REF_UUID_PREFIX}{elem_idx}:0"));
                }
            }
        }

        hits
    }

    /// Get all element UUIDs that belong to the same instance group as the given UUID.
    ///
    /// CellRef instances (including arrayed refs) are selected as a single entity,
    /// so ref UUIDs always return a one-element vec containing the canonical
    /// representative `ref:{elem_idx}:0`. This keeps selection sets small (O(1))
    /// regardless of array size, which is critical for pan/move/marquee performance
    /// on large AREFs (e.g. a 100×100 array would otherwise balloon to 10,000 IDs).
    ///
    /// For non-ref UUIDs, returns just the UUID itself.
    pub fn get_group_ids(&self, uuid: &str) -> Vec<String> {
        if let Some(elem_idx) = parse_ref_uuid_element_index(uuid) {
            // Canonicalise any `ref:N:K` to the representative `ref:N:0` so the
            // selection/hover code always uses a single stable ID per instance.
            return vec![format!("{REF_UUID_PREFIX}{elem_idx}:0")];
        }

        // Regular element — return just this element
        vec![uuid.to_string()]
    }

    /// Get all element IDs in the active cell.
    ///
    /// Returns a vector of UUIDs for all elements in the active cell. CellRef
    /// instances (including AREFs) contribute a single canonical ID
    /// `ref:{elem_idx}:0` each — array copies are NOT enumerated individually.
    /// This keeps "Select All" (Cmd+A) cheap on designs with large arrays.
    pub fn get_all_ids(&self) -> Vec<String> {
        let cell_name = match &self.active_cell {
            Some(name) => name,
            None => return Vec::new(),
        };

        let cell = match self.library.cell(cell_name) {
            Some(c) => c,
            None => return Vec::new(),
        };

        // Collect non-CellRef element UUIDs (polygons, paths, etc.)
        let mut ids: Vec<String> = self
            .element_refs
            .iter()
            .filter(|(_, elem_ref)| {
                elem_ref.cell_name == *cell_name
                    && !matches!(
                        cell.elements().get(elem_ref.element_index),
                        Some(Element::CellRef(_))
                    )
            })
            .map(|(uuid, _)| uuid.clone())
            .collect();

        // One representative synthetic UUID per CellRef instance.
        for (elem_idx, element) in cell.elements().iter().enumerate() {
            if let Element::CellRef(_) = element {
                ids.push(format!("{REF_UUID_PREFIX}{elem_idx}:0"));
            }
        }

        ids
    }

    /// Get one representative UUID per element or CellRef instance.
    ///
    /// Used for Tab-cycling: each step in the cycle corresponds to one
    /// cell instance (CellRef) or one standalone element (polygon, path, text).
    pub fn get_group_representative_ids(&self) -> Vec<String> {
        let cell_name = match &self.active_cell {
            Some(name) => name,
            None => return Vec::new(),
        };

        let cell = match self.library.cell(cell_name) {
            Some(c) => c,
            None => return Vec::new(),
        };

        let mut result = Vec::new();

        // Collect non-CellRef element UUIDs (polygons, paths, text)
        let mut direct_uuids: Vec<String> = self
            .element_refs
            .iter()
            .filter(|(_, elem_ref)| {
                elem_ref.cell_name == *cell_name
                    && !matches!(
                        cell.elements().get(elem_ref.element_index),
                        Some(Element::CellRef(_))
                    )
            })
            .map(|(uuid, _)| uuid.clone())
            .collect();
        direct_uuids.sort();
        result.extend(direct_uuids);

        // Include one representative per CellRef instance
        for (elem_idx, element) in cell.elements().iter().enumerate() {
            if let Element::CellRef(_) = element {
                // Use the first synthetic UUID for this CellRef
                result.push(format!("{REF_UUID_PREFIX}{elem_idx}:0"));
            }
        }

        result
    }

    /// Get the bounding box of all elements in the active cell.
    ///
    /// Returns [minX, minY, maxX, maxY] or None if no elements exist.
    /// Includes CellRef-resolved geometry.
    pub fn get_all_bounds(&self) -> Option<Vec<f64>> {
        let cell_name = self.active_cell.as_ref()?;
        let cell = self.library.cell(cell_name)?;

        let mut combined_bbox: Option<BBox> = None;

        for elem_ref in self.element_refs.values() {
            if elem_ref.cell_name != *cell_name {
                continue;
            }

            let bbox = match cell.elements().get(elem_ref.element_index) {
                Some(Element::Polygon { polygon, .. }) => Some(polygon.bbox()),
                Some(Element::Text {
                    text,
                    position,
                    height,
                    ..
                }) => Some(text_bbox(text, position, *height)),
                Some(Element::Path { points, width, .. }) => {
                    offset_polygon(points, *width).map(|ribbon| ribbon.bbox())
                }
                _ => None,
            };

            if let Some(bbox) = bbox {
                combined_bbox = Some(match combined_bbox {
                    Some(existing) => existing.merge(&bbox),
                    None => bbox,
                });
            }
        }

        // Include CellRef-resolved geometry bounds (including array copies)
        for element in cell.elements() {
            if let Element::CellRef(cell_ref) = element {
                for copy_transform in array_transforms(cell_ref) {
                    self.collect_bounds_recursive(
                        &cell_ref.cell_name,
                        &copy_transform,
                        &mut combined_bbox,
                    );
                }
            }
        }

        // Include image overlay bounds for the active cell itself
        if let Some(img_bounds) = self.cell_image_bounds.get(cell_name) {
            let img_bbox = BBox::new(
                Point::new(img_bounds[0], img_bounds[1]),
                Point::new(img_bounds[2], img_bounds[3]),
            );
            combined_bbox = Some(match combined_bbox {
                Some(existing) => existing.merge(&img_bbox),
                None => img_bbox,
            });
        }

        combined_bbox.map(|bbox| vec![bbox.min().x, bbox.min().y, bbox.max().x, bbox.max().y])
    }

    /// Get the bounding box of elements with the given UUIDs.
    ///
    /// Returns [minX, minY, maxX, maxY] or None if none of the IDs are found.
    /// Handles both regular UUIDs and synthetic ref UUIDs.
    pub fn get_bounds_for_ids(&self, ids: Vec<String>) -> Option<Vec<f64>> {
        let cell_name = self.active_cell.as_ref()?;
        let cell = self.library.cell(cell_name)?;

        let mut combined_bbox: Option<BBox> = None;

        // Collect CellRef element indices we've already handled (to avoid double-counting)
        let mut handled_ref_elements: std::collections::HashSet<usize> =
            std::collections::HashSet::new();

        for id in &ids {
            // Check if this is a synthetic ref UUID
            if let Some(elem_idx) = parse_ref_uuid_element_index(id) {
                if handled_ref_elements.insert(elem_idx) {
                    // First time seeing this CellRef — include its full bounds
                    if let Some(Element::CellRef(cell_ref)) = cell.elements().get(elem_idx) {
                        let bbox = self.instance_bbox_cached(cell_name, elem_idx, cell_ref);
                        combined_bbox = Some(match combined_bbox {
                            Some(existing) => existing.merge(&bbox),
                            None => bbox,
                        });
                    }
                }
                continue;
            }

            // Regular element UUID (polygon, text, or path)
            let elem_ref = match self.element_refs.get(id.as_str()) {
                Some(r) => r,
                None => continue,
            };

            if elem_ref.cell_name != *cell_name {
                continue;
            }

            let bbox = match cell.elements().get(elem_ref.element_index) {
                Some(Element::Polygon { polygon, .. }) => Some(polygon.bbox()),
                Some(Element::Text {
                    text,
                    position,
                    height,
                    ..
                }) => Some(text_bbox(text, position, *height)),
                Some(Element::Path { points, width, .. }) => {
                    offset_polygon(points, *width).map(|ribbon| ribbon.bbox())
                }
                _ => None,
            };

            if let Some(bbox) = bbox {
                combined_bbox = Some(match combined_bbox {
                    Some(existing) => existing.merge(&bbox),
                    None => bbox,
                });
            }
        }

        combined_bbox.map(|bbox| vec![bbox.min().x, bbox.min().y, bbox.max().x, bbox.max().y])
    }

    /// Get vertices of an element for outline rendering.
    ///
    /// Returns flat array [x0, y0, x1, y1, ...] or None if not found.
    /// For synthetic ref UUIDs, returns the transformed polygon vertices.
    pub fn get_element_vertices(&self, id: &str) -> Option<Vec<f64>> {
        // Handle synthetic ref UUIDs
        if let Some((polygon, _layer)) = self.resolve_ref_uuid(id) {
            let vertices: Vec<f64> = polygon
                .vertices()
                .iter()
                .flat_map(|p| vec![p.x, p.y])
                .collect();
            return Some(vertices);
        }

        let elem_ref = self.element_refs.get(id)?;
        let cell = self.library.cell(&elem_ref.cell_name)?;

        match cell.elements().get(elem_ref.element_index) {
            Some(Element::Polygon { polygon, .. }) => {
                let vertices: Vec<f64> = polygon
                    .vertices()
                    .iter()
                    .flat_map(|p| vec![p.x, p.y])
                    .collect();
                Some(vertices)
            }
            Some(Element::Path { points, width, .. }) => {
                // Convert path to ribbon polygon for outline rendering
                if let Some(ribbon) = offset_polygon(points, *width) {
                    let vertices: Vec<f64> = ribbon
                        .vertices()
                        .iter()
                        .flat_map(|p| vec![p.x, p.y])
                        .collect();
                    Some(vertices)
                } else {
                    None
                }
            }
            Some(Element::Text {
                text,
                position,
                height,
                ..
            }) => {
                // Return bounding rectangle corners for selection outline rendering
                let bbox = text_bbox(text, position, *height);
                Some(vec![
                    bbox.min().x,
                    bbox.min().y,
                    bbox.max().x,
                    bbox.min().y,
                    bbox.max().x,
                    bbox.max().y,
                    bbox.min().x,
                    bbox.max().y,
                ])
            }
            _ => None,
        }
    }

    /// Get full element information including vertices, layer, and datatype.
    ///
    /// Returns None/undefined if element not found.
    /// For synthetic ref UUIDs, returns the transformed polygon data.
    pub fn get_element_info(&self, id: &str) -> Option<ElementInfo> {
        // Handle synthetic ref UUIDs
        if let Some((polygon, layer)) = self.resolve_ref_uuid(id) {
            let vertices: Vec<f64> = polygon
                .vertices()
                .iter()
                .flat_map(|p| vec![p.x, p.y])
                .collect();
            return Some(ElementInfo {
                vertices,
                layer: layer.number,
                datatype: layer.datatype,
            });
        }

        let elem_ref = self.element_refs.get(id)?;
        let cell = self.library.cell(&elem_ref.cell_name)?;

        match cell.elements().get(elem_ref.element_index) {
            Some(Element::Polygon { polygon, layer }) => {
                let vertices: Vec<f64> = polygon
                    .vertices()
                    .iter()
                    .flat_map(|p| vec![p.x, p.y])
                    .collect();

                Some(ElementInfo {
                    vertices,
                    layer: layer.number,
                    datatype: layer.datatype,
                })
            }
            Some(Element::Path {
                points,
                width,
                layer,
                ..
            }) => {
                // Convert path centerline to ribbon polygon for selection outlines
                if let Some(ribbon) = offset_polygon(points, *width) {
                    let vertices: Vec<f64> = ribbon
                        .vertices()
                        .iter()
                        .flat_map(|p| vec![p.x, p.y])
                        .collect();
                    Some(ElementInfo {
                        vertices,
                        layer: layer.number,
                        datatype: layer.datatype,
                    })
                } else {
                    None
                }
            }
            Some(Element::Text {
                text,
                position,
                layer,
                height,
            }) => {
                // Return bounding rectangle as vertices so selection outlines work
                let bbox = text_bbox(text, position, *height);
                let vertices = vec![
                    bbox.min().x,
                    bbox.min().y,
                    bbox.max().x,
                    bbox.min().y,
                    bbox.max().x,
                    bbox.max().y,
                    bbox.min().x,
                    bbox.max().y,
                ];
                Some(ElementInfo {
                    vertices,
                    layer: layer.number,
                    datatype: layer.datatype,
                })
            }
            _ => None,
        }
    }

    /// Get all vertices from all polygons in the active cell.
    ///
    /// Returns a flat array with polygon boundaries encoded as:
    /// [n1, x0, y0, x1, y1, ..., n2, x0, y0, ...]
    /// where n1, n2 are vertex counts for each polygon.
    /// Includes CellRef-resolved geometry.
    ///
    /// Used for snap-to-geometry functionality.
    pub fn get_all_vertices(&self) -> Vec<f64> {
        let cell_name = match &self.active_cell {
            Some(name) => name,
            None => return Vec::new(),
        };

        let cell = match self.library.cell(cell_name) {
            Some(c) => c,
            None => return Vec::new(),
        };

        let mut result = Vec::new();

        for elem_ref in self.element_refs.values() {
            if elem_ref.cell_name != *cell_name {
                continue;
            }

            if let Some(Element::Polygon { polygon, .. }) =
                cell.elements().get(elem_ref.element_index)
            {
                let verts = polygon.vertices();
                result.push(verts.len() as f64);
                for point in verts {
                    result.push(point.x);
                    result.push(point.y);
                }
            }
        }

        // Include CellRef-resolved vertices
        for element in cell.elements() {
            if let Element::CellRef(cell_ref) = element {
                self.collect_vertices_recursive(
                    &cell_ref.cell_name,
                    &cell_ref.transform,
                    &mut result,
                );
            }
        }

        result
    }
}

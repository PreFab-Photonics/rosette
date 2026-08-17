//! Text label elements: creation, queries, edits, and conversion to polygons.

use super::{ElementRef, WasmLibrary};
use rosette_core::cell::Element;
use rosette_core::{Layer, Point, Polygon};
use std::convert::Infallible;
use uuid::Uuid;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl WasmLibrary {
    /// Add a text label to the active cell.
    ///
    /// Returns the element's UUID, or None if no active cell.
    pub fn add_text(
        &mut self,
        text: &str,
        x: f64,
        y: f64,
        height: f64,
        layer: u16,
        datatype: u16,
    ) -> Option<String> {
        if !x.is_finite() || !y.is_finite() || !height.is_finite() || height <= 0.0 {
            return None;
        }
        let cell_name = self.active_cell.clone()?;

        let position = Point::new(x, y);
        let layer_spec = Layer::new(layer, datatype);

        let element_index = self
            .library
            .edit_cell(&cell_name, |cell| {
                let element_index = cell.elements().len();
                cell.add_text_with_height(text, position, layer_spec, height)
                    .map(|()| element_index)
            })
            .ok()?;
        let uuid = Uuid::new_v4().to_string();

        self.element_refs.insert(
            uuid.clone(),
            ElementRef {
                cell_name,
                element_index,
            },
        );

        self.mark_dirty();
        Some(uuid)
    }

    /// Get all text labels in the active cell as a JS array.
    ///
    /// Each entry is `{ id, text, x, y, height, layer, datatype }`.
    pub fn get_text_labels(&self) -> JsValue {
        let result = js_sys::Array::new();

        let cell_name = match &self.active_cell {
            Some(name) => name,
            None => return result.into(),
        };
        let cell = match self.library.cell(cell_name) {
            Some(c) => c,
            None => return result.into(),
        };

        for (elem_idx, element) in cell.elements().iter().enumerate() {
            if let Element::Text(text) = element {
                // Find the UUID for this element
                let uuid = self
                    .element_refs
                    .iter()
                    .find(|(_, er)| er.cell_name == *cell_name && er.element_index == elem_idx)
                    .map(|(uuid, _)| uuid.as_str());

                let id = match uuid {
                    Some(id) => id,
                    None => continue,
                };

                let obj = js_sys::Object::new();
                js_sys::Reflect::set(&obj, &"id".into(), &JsValue::from_str(id)).ok();
                let position = text.position();
                let layer = text.layer();
                js_sys::Reflect::set(&obj, &"text".into(), &JsValue::from_str(text.text())).ok();
                js_sys::Reflect::set(&obj, &"x".into(), &JsValue::from_f64(position.x)).ok();
                js_sys::Reflect::set(&obj, &"y".into(), &JsValue::from_f64(position.y)).ok();
                js_sys::Reflect::set(&obj, &"height".into(), &JsValue::from_f64(text.height()))
                    .ok();
                js_sys::Reflect::set(
                    &obj,
                    &"layer".into(),
                    &JsValue::from_f64(layer.number as f64),
                )
                .ok();
                js_sys::Reflect::set(
                    &obj,
                    &"datatype".into(),
                    &JsValue::from_f64(layer.datatype as f64),
                )
                .ok();
                result.push(&obj);
            }
        }

        result.into()
    }

    /// Update the text content of an existing text element.
    ///
    /// Returns true if the element was found and updated.
    pub fn update_text(&mut self, id: &str, new_text: &str) -> bool {
        let elem_ref = match self.element_refs.get(id) {
            Some(r) => r.clone(),
            None => return false,
        };

        let updated = self
            .library
            .edit_cell(&elem_ref.cell_name, |cell| {
                cell.edit_element(elem_ref.element_index, |element| {
                    let Element::Text(text) = element else {
                        return Ok::<_, Infallible>(false);
                    };
                    text.set_text(new_text);
                    Ok(true)
                })
            })
            .ok()
            .unwrap_or(false);
        if updated {
            self.mark_dirty();
        }
        updated
    }

    /// Get text-specific information for a given element UUID.
    ///
    /// Returns a JS object `{ text, x, y, height, layer, datatype }` or null
    /// if the element is not a text element.
    pub fn get_text_element_info(&self, id: &str) -> JsValue {
        let elem_ref = match self.element_refs.get(id) {
            Some(r) => r,
            None => return JsValue::NULL,
        };

        let cell = match self.library.cell(&elem_ref.cell_name) {
            Some(c) => c,
            None => return JsValue::NULL,
        };

        if let Some(Element::Text(text)) = cell.elements().get(elem_ref.element_index) {
            let position = text.position();
            let layer = text.layer();
            let obj = js_sys::Object::new();
            js_sys::Reflect::set(&obj, &"text".into(), &JsValue::from_str(text.text())).ok();
            js_sys::Reflect::set(&obj, &"x".into(), &JsValue::from_f64(position.x)).ok();
            js_sys::Reflect::set(&obj, &"y".into(), &JsValue::from_f64(position.y)).ok();
            js_sys::Reflect::set(&obj, &"height".into(), &JsValue::from_f64(text.height())).ok();
            js_sys::Reflect::set(
                &obj,
                &"layer".into(),
                &JsValue::from_f64(layer.number as f64),
            )
            .ok();
            js_sys::Reflect::set(
                &obj,
                &"datatype".into(),
                &JsValue::from_f64(layer.datatype as f64),
            )
            .ok();
            obj.into()
        } else {
            JsValue::NULL
        }
    }

    /// Update the position of a text element.
    ///
    /// Returns true if the element was found and updated.
    pub fn set_text_position(&mut self, id: &str, x: f64, y: f64) -> bool {
        if !x.is_finite() || !y.is_finite() {
            return false;
        }
        let elem_ref = match self.element_refs.get(id) {
            Some(r) => r.clone(),
            None => return false,
        };

        let updated = self
            .library
            .edit_cell(&elem_ref.cell_name, |cell| {
                cell.edit_element(elem_ref.element_index, |element| {
                    let Element::Text(text) = element else {
                        return Ok(false);
                    };
                    text.set_position(Point::new(x, y)).map(|()| true)
                })
            })
            .ok()
            .unwrap_or(false);
        if updated {
            self.mark_dirty();
        }
        updated
    }

    /// Update the height of a text element.
    ///
    /// Returns true if the element was found and updated.
    pub fn set_text_height(&mut self, id: &str, new_height: f64) -> bool {
        if !new_height.is_finite() || new_height <= 0.0 {
            return false;
        }
        let elem_ref = match self.element_refs.get(id) {
            Some(r) => r.clone(),
            None => return false,
        };

        let updated = self
            .library
            .edit_cell(&elem_ref.cell_name, |cell| {
                cell.edit_element(elem_ref.element_index, |element| {
                    let Element::Text(text) = element else {
                        return Ok(false);
                    };
                    text.set_height(new_height).map(|()| true)
                })
            })
            .ok()
            .unwrap_or(false);
        if updated {
            self.mark_dirty();
        }
        updated
    }

    /// Check if an element is a text element.
    pub fn is_text_element(&self, id: &str) -> bool {
        let elem_ref = match self.element_refs.get(id) {
            Some(r) => r,
            None => return false,
        };
        let cell = match self.library.cell(&elem_ref.cell_name) {
            Some(c) => c,
            None => return false,
        };
        matches!(
            cell.elements().get(elem_ref.element_index),
            Some(Element::Text(_))
        )
    }

    /// Convert a text element to polygon outlines.
    ///
    /// Removes the text element and replaces it with polygon contours extracted
    /// from the embedded Source Code Pro font. Holes in glyphs (e.g. 'd', 'o')
    /// are boolean-subtracted so they render correctly.
    /// Returns UUIDs of the new polygons.
    pub fn text_to_polygons(&mut self, id: &str) -> Vec<String> {
        use crate::text_to_polygons::text_to_polygon_contours;

        // Look up the text element.
        let elem_ref = match self.element_refs.get(id) {
            Some(r) => r.clone(),
            None => return Vec::new(),
        };
        let cell = match self.library.cell(&elem_ref.cell_name) {
            Some(c) => c,
            None => return Vec::new(),
        };
        let (text, position, layer_num, datatype, height) =
            match cell.elements().get(elem_ref.element_index) {
                Some(Element::Text(text)) => {
                    let layer = text.layer();
                    (
                        text.text().to_string(),
                        text.position(),
                        layer.number,
                        layer.datatype,
                        text.height(),
                    )
                }
                _ => return Vec::new(),
            };

        // Generate polygon contours from the text glyphs.
        let contours = text_to_polygon_contours(&text, position.x, position.y, height);
        if contours.is_empty() {
            return Vec::new();
        }

        let Some(active_cell) = self.active_cell.clone() else {
            return Vec::new();
        };
        let polygons: Result<Vec<_>, _> = contours
            .iter()
            .map(|vertices| {
                Polygon::new(
                    vertices
                        .chunks_exact(2)
                        .map(|point| Point::new(point[0], point[1]))
                        .collect(),
                )
            })
            .collect();
        let Ok(polygons) = polygons else {
            return Vec::new();
        };

        let mut candidate_library = self.library.clone();
        let removed = candidate_library
            .edit_cell(&elem_ref.cell_name, |cell| {
                Ok::<_, Infallible>(cell.remove_element(elem_ref.element_index).is_some())
            })
            .ok();
        if removed != Some(true) {
            return Vec::new();
        }
        let Some(first_result_index) = candidate_library
            .cell(&active_cell)
            .map(|cell| cell.elements().len())
        else {
            return Vec::new();
        };
        if candidate_library
            .edit_cell(&active_cell, |cell| {
                for polygon in &polygons {
                    cell.add_polygon(polygon.clone(), Layer::new(layer_num, datatype));
                }
                Ok::<_, Infallible>(())
            })
            .is_err()
        {
            return Vec::new();
        }

        let mut candidate_refs = self.element_refs.clone();
        candidate_refs.remove(id);
        for element_ref in candidate_refs.values_mut() {
            if element_ref.cell_name == elem_ref.cell_name
                && element_ref.element_index > elem_ref.element_index
            {
                element_ref.element_index -= 1;
            }
        }

        let mut new_ids = Vec::with_capacity(polygons.len());
        for offset in 0..polygons.len() {
            let uuid = Uuid::new_v4().to_string();
            candidate_refs.insert(
                uuid.clone(),
                ElementRef {
                    cell_name: active_cell.clone(),
                    element_index: first_result_index + offset,
                },
            );
            new_ids.push(uuid);
        }

        self.library = candidate_library;
        self.element_refs = candidate_refs;
        self.mark_dirty();
        new_ids
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn text_edits_validate_inputs_and_remain_atomic() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("top").unwrap();
        let id = library.add_text("label", 1.0, 2.0, 3.0, 4, 5).unwrap();
        library.mark_clean();

        assert!(!library.set_text_position(&id, f64::NAN, 8.0));
        assert!(!library.set_text_height(&id, 0.0));
        assert!(!library.set_text_height(&id, f64::INFINITY));
        assert!(!library.is_dirty());

        let cell = library.library.cell("top").unwrap();
        let (_, position, _, height) = cell.texts().next().unwrap();
        assert_eq!(position, Point::new(1.0, 2.0));
        assert_eq!(height, 3.0);

        assert!(library.set_text_position(&id, 7.0, 8.0));
        assert!(library.set_text_height(&id, 9.0));
        assert_eq!(library.get_element_index(&id), 0);
    }

    #[test]
    fn text_conversion_replaces_the_label_and_reindexes_survivors() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("top").unwrap();
        let text = library.add_text("A", 0.0, 0.0, 10.0, 1, 0).unwrap();
        let trailing = library
            .add_polygon(&[20.0, 0.0, 21.0, 0.0, 21.0, 1.0], 2, 0)
            .unwrap();

        let polygons = library.text_to_polygons(&text);

        assert!(!polygons.is_empty());
        assert_eq!(library.get_element_index(&text), -1);
        assert_eq!(library.get_element_index(&trailing), 0);
        for (offset, id) in polygons.iter().enumerate() {
            assert_eq!(library.get_element_index(id), (offset + 1) as i32);
        }
    }
}

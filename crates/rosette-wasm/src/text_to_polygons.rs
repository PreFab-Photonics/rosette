//! Convert text strings into polygon outlines using an embedded font.
//!
//! Uses `ttf-parser` to extract glyph outlines from the bundled Source Code Pro
//! font, then converts quadratic/cubic Bézier curves into polyline approximations.
//! Holes (inner contours) are boolean-subtracted from outer contours using the
//! `geo` crate so that glyphs like 'd', 'o', 'A' render correctly.

use geo::algorithm::bool_ops::BooleanOps;
use geo::{Coord, LineString, MultiPolygon, Polygon as GeoPolygon};
use ttf_parser::{Face, OutlineBuilder};

/// Embedded Source Code Pro Regular font (SIL Open Font License).
static FONT_DATA: &[u8] = include_bytes!("fonts/SourceCodePro-Regular.ttf");

/// Number of line segments to approximate a quadratic Bézier curve.
const QUAD_SUBDIVISIONS: usize = 8;

/// Number of line segments to approximate a cubic Bézier curve.
const CUBIC_SUBDIVISIONS: usize = 12;

/// Collects glyph outline contours as lists of (x, y) points.
///
/// Each `move_to` starts a new contour. `line_to` appends directly;
/// `quad_to` and `curve_to` are subdivided into line segments.
struct ContourBuilder {
    contours: Vec<Vec<[f64; 2]>>,
    current: Vec<[f64; 2]>,
}

impl ContourBuilder {
    fn new() -> Self {
        Self {
            contours: Vec::new(),
            current: Vec::new(),
        }
    }

    fn finish(mut self) -> Vec<Vec<[f64; 2]>> {
        if self.current.len() >= 3 {
            self.contours.push(self.current);
        }
        self.contours
    }
}

impl OutlineBuilder for ContourBuilder {
    fn move_to(&mut self, x: f32, y: f32) {
        if self.current.len() >= 3 {
            self.contours.push(std::mem::take(&mut self.current));
        } else {
            self.current.clear();
        }
        self.current.push([x as f64, y as f64]);
    }

    fn line_to(&mut self, x: f32, y: f32) {
        self.current.push([x as f64, y as f64]);
    }

    fn quad_to(&mut self, x1: f32, y1: f32, x: f32, y: f32) {
        let (px, py) = match self.current.last() {
            Some(p) => (p[0], p[1]),
            None => return,
        };
        let (cx, cy) = (x1 as f64, y1 as f64);
        let (ex, ey) = (x as f64, y as f64);

        for i in 1..=QUAD_SUBDIVISIONS {
            let t = i as f64 / QUAD_SUBDIVISIONS as f64;
            let mt = 1.0 - t;
            let qx = mt * mt * px + 2.0 * mt * t * cx + t * t * ex;
            let qy = mt * mt * py + 2.0 * mt * t * cy + t * t * ey;
            self.current.push([qx, qy]);
        }
    }

    fn curve_to(&mut self, x1: f32, y1: f32, x2: f32, y2: f32, x: f32, y: f32) {
        let (px, py) = match self.current.last() {
            Some(p) => (p[0], p[1]),
            None => return,
        };
        let (c1x, c1y) = (x1 as f64, y1 as f64);
        let (c2x, c2y) = (x2 as f64, y2 as f64);
        let (ex, ey) = (x as f64, y as f64);

        for i in 1..=CUBIC_SUBDIVISIONS {
            let t = i as f64 / CUBIC_SUBDIVISIONS as f64;
            let mt = 1.0 - t;
            let bx = mt * mt * mt * px
                + 3.0 * mt * mt * t * c1x
                + 3.0 * mt * t * t * c2x
                + t * t * t * ex;
            let by = mt * mt * mt * py
                + 3.0 * mt * mt * t * c1y
                + 3.0 * mt * t * t * c2y
                + t * t * t * ey;
            self.current.push([bx, by]);
        }
    }

    fn close(&mut self) {
        // Closing is handled by `move_to` / `finish`; nothing extra needed.
    }
}

/// Compute the signed area of a contour (shoelace formula).
///
/// Positive = counter-clockwise (outer), negative = clockwise (hole)
/// in standard math coordinates.
fn signed_area(pts: &[[f64; 2]]) -> f64 {
    let n = pts.len();
    let mut area = 0.0;
    for i in 0..n {
        let j = (i + 1) % n;
        area += pts[i][0] * pts[j][1];
        area -= pts[j][0] * pts[i][1];
    }
    area * 0.5
}

/// Convert a contour (list of [x,y] points) to a `geo::Polygon`.
fn contour_to_geo(pts: &[[f64; 2]]) -> GeoPolygon<f64> {
    let mut coords: Vec<Coord<f64>> = pts.iter().map(|p| Coord { x: p[0], y: p[1] }).collect();
    // geo requires closed rings — ensure first == last.
    if let (Some(first), Some(last)) = (coords.first(), coords.last()) {
        if first != last {
            coords.push(*first);
        }
    }
    GeoPolygon::new(LineString::new(coords), vec![])
}

/// Convert a `geo::MultiPolygon` result into flat vertex lists for rosette.
///
/// Each exterior ring becomes one flat `[x0, y0, x1, y1, ...]` vec.
/// Interior rings (holes from boolean ops) are stored as separate polygons
/// in the `hole_data` output so the caller can register them in the hole map.
fn multi_poly_to_flat(mp: &MultiPolygon<f64>) -> Vec<(Vec<f64>, Vec<usize>)> {
    let mut result = Vec::new();

    for geo_poly in mp.iter() {
        let exterior_coords: Vec<[f64; 2]> =
            geo_poly.exterior().coords().map(|c| [c.x, c.y]).collect();

        // Strip closing point if present (geo closes polygons, rosette doesn't).
        let exterior =
            if exterior_coords.len() > 1 && exterior_coords.first() == exterior_coords.last() {
                &exterior_coords[..exterior_coords.len() - 1]
            } else {
                &exterior_coords[..]
            };

        if exterior.len() < 3 {
            continue;
        }

        // Collect holes.
        let holes: Vec<Vec<[f64; 2]>> = geo_poly
            .interiors()
            .iter()
            .map(|ring| {
                let mut coords: Vec<[f64; 2]> = ring.coords().map(|c| [c.x, c.y]).collect();
                if coords.len() > 1 && coords.first() == coords.last() {
                    coords.pop();
                }
                coords
            })
            .filter(|h| h.len() >= 3)
            .collect();

        // Build final vertex list: exterior + hole rings concatenated.
        let mut all_points: Vec<[f64; 2]> = exterior.to_vec();
        let mut hole_start_indices: Vec<usize> = Vec::new();
        for hole in &holes {
            hole_start_indices.push(all_points.len());
            all_points.extend_from_slice(hole);
        }

        let flat: Vec<f64> = all_points.iter().flat_map(|p| [p[0], p[1]]).collect();
        result.push((flat, hole_start_indices));
    }

    result
}

/// Convert a text string into polygon vertex data.
///
/// Returns a list of `(flat_vertices, hole_start_indices)` tuples in world
/// coordinates, ready for `add_polygon` + hole index registration.
///
/// Holes in glyphs (e.g., the counter of 'd', 'o', 'A') are properly
/// boolean-subtracted from outer contours so they render as cutouts.
///
/// # Arguments
///
/// * `text` — the text content (supports `\n` for multi-line)
/// * `x`, `y` — world-space position of the text anchor (bottom-left)
/// * `height` — visual cap-height in world units
pub fn text_to_polygon_contours(
    text: &str,
    x: f64,
    y: f64,
    height: f64,
) -> Vec<(Vec<f64>, Vec<usize>)> {
    let face = match Face::parse(FONT_DATA, 0) {
        Ok(f) => f,
        Err(_) => return Vec::new(),
    };

    // Font metrics (in font units).
    let units_per_em = face.units_per_em() as f64;
    let ascender = face.ascender() as f64;

    // Scale: map font units → world units so that the ascender (visual
    // cap-height) equals the requested `height`.
    let scale = height / ascender;

    // For monospace advance we use the glyph advance of 'M' as a fallback
    // if individual glyph advances are unavailable.
    let default_advance = face
        .glyph_index('M')
        .and_then(|gid| face.glyph_hor_advance(gid))
        .unwrap_or(units_per_em as u16) as f64;

    let line_height = units_per_em * 1.2 * scale;

    let mut all_polys: Vec<(Vec<f64>, Vec<usize>)> = Vec::new();

    for (line_idx, line) in text.split('\n').enumerate() {
        let mut cursor_x = 0.0_f64; // in font units

        for ch in line.chars() {
            if ch == ' ' {
                cursor_x += default_advance;
                continue;
            }

            let glyph_id = match face.glyph_index(ch) {
                Some(gid) => gid,
                None => {
                    cursor_x += default_advance;
                    continue;
                }
            };

            let advance = face
                .glyph_hor_advance(glyph_id)
                .unwrap_or(default_advance as u16) as f64;

            let mut builder = ContourBuilder::new();
            if face.outline_glyph(glyph_id, &mut builder).is_some() {
                let raw_contours = builder.finish();

                // Transform contours to world space and classify as outer/hole.
                let mut outers: Vec<Vec<[f64; 2]>> = Vec::new();
                let mut holes: Vec<Vec<[f64; 2]>> = Vec::new();

                for contour in &raw_contours {
                    if contour.len() < 3 {
                        continue;
                    }

                    // Transform to world coordinates.
                    let world_pts: Vec<[f64; 2]> = contour
                        .iter()
                        .map(|pt| {
                            let wx = x + (cursor_x + pt[0]) * scale;
                            let wy = y - pt[1] * scale + (line_idx as f64 * line_height);
                            [wx, wy]
                        })
                        .collect();

                    // TrueType convention: CW = outer, CCW = hole (in Y-up font space).
                    // After Y-flip (negating Y), CW becomes CCW and vice versa.
                    // So in world space: positive signed area = outer, negative = hole.
                    let area = signed_area(&world_pts);
                    if area > 0.0 {
                        outers.push(world_pts);
                    } else if area < 0.0 {
                        holes.push(world_pts);
                    }
                }

                if outers.is_empty() {
                    cursor_x += advance;
                    continue;
                }

                // If no holes, emit outers directly.
                if holes.is_empty() {
                    for outer in &outers {
                        let flat: Vec<f64> = outer.iter().flat_map(|p| [p[0], p[1]]).collect();
                        all_polys.push((flat, Vec::new()));
                    }
                } else {
                    // Boolean subtract holes from the union of outers.
                    let mut outer_multi =
                        MultiPolygon::new(outers.iter().map(|o| contour_to_geo(o)).collect());

                    for hole in &holes {
                        let hole_poly = MultiPolygon::new(vec![contour_to_geo(hole)]);
                        outer_multi = outer_multi.difference(&hole_poly);
                    }

                    let polys = multi_poly_to_flat(&outer_multi);
                    all_polys.extend(polys);
                }
            }

            cursor_x += advance;
        }
    }

    all_polys
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn font_loads() {
        let face = Face::parse(FONT_DATA, 0).expect("embedded font should parse");
        assert!(face.units_per_em() > 0);
        assert!(face.ascender() > 0);
    }

    #[test]
    fn single_char_produces_contours() {
        let contours = text_to_polygon_contours("A", 0.0, 0.0, 1.0);
        assert!(
            !contours.is_empty(),
            "character 'A' should produce at least one contour"
        );
        for (flat, _holes) in &contours {
            assert!(flat.len() >= 6, "each contour needs at least 3 points");
        }
    }

    #[test]
    fn space_produces_no_contours() {
        let contours = text_to_polygon_contours(" ", 0.0, 0.0, 1.0);
        assert!(contours.is_empty(), "space should produce no contours");
    }

    #[test]
    fn multiline_text() {
        let c1 = text_to_polygon_contours("A", 0.0, 0.0, 1.0);
        let c2 = text_to_polygon_contours("A\nB", 0.0, 0.0, 1.0);
        assert!(
            c2.len() > c1.len(),
            "two-line text should produce more contours than single line"
        );
    }

    #[test]
    fn glyph_with_hole_has_hole_indices() {
        // 'd' has a counter (hole) — the result should have hole_start_indices.
        let contours = text_to_polygon_contours("d", 0.0, 0.0, 100.0);
        assert!(!contours.is_empty(), "'d' should produce contours");
        let has_holes = contours.iter().any(|(_, holes)| !holes.is_empty());
        assert!(has_holes, "'d' should have at least one polygon with holes");
    }
}

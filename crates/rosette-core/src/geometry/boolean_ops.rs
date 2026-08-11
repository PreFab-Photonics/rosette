//! Boolean shape operations on polygons.
//!
//! Provides union, subtract, intersect, and xor operations using the `geo`
//! crate's boolean ops engine. Results are single-ring polygons where any
//! holes are connected to the exterior via zero-width bridges (keyholing).

use geo::{
    Area, BooleanOps, BoundingRect, Coord, Distance, Euclidean, Intersects, LineString,
    MultiPolygon, Polygon as GeoPolygon,
};

use super::{BBox, Point, Polygon};

// =============================================================================
// Conversion: Polygon <-> geo::Polygon
// =============================================================================

/// Convert a rosette `Polygon` to a `geo::Polygon<f64>`.
///
/// Closes the ring if needed (geo expects first == last).
fn polygon_to_geo(poly: &Polygon) -> GeoPolygon<f64> {
    let coords: Vec<Coord<f64>> = poly
        .vertices()
        .iter()
        .map(|p| Coord { x: p.x, y: p.y })
        .collect();

    let mut ring = coords;
    if let (Some(first), Some(last)) = (ring.first(), ring.last())
        && first != last
    {
        ring.push(*first);
    }

    GeoPolygon::new(LineString::from(ring), vec![])
}

/// Convert a `geo::Polygon<f64>` to a rosette `Polygon`.
///
/// If the geo polygon has interior rings (holes), they are keyholed into the
/// exterior ring to produce a single continuous vertex list.
fn polygon_from_geo(geo_poly: &GeoPolygon<f64>) -> Option<Polygon> {
    let exterior = ring_to_points(geo_poly.exterior());
    if exterior.len() < 3 {
        return None;
    }

    if geo_poly.interiors().is_empty() {
        // Simple case: no holes.
        Some(Polygon::new(exterior))
    } else {
        // Keyhole all interior rings into the exterior.
        let holes: Vec<Vec<Point>> = geo_poly
            .interiors()
            .iter()
            .filter_map(|ring| {
                let pts = ring_to_points(ring);
                if pts.len() >= 3 { Some(pts) } else { None }
            })
            .collect();

        if holes.is_empty() {
            Some(Polygon::new(exterior))
        } else {
            let keyholed = keyhole(exterior, &holes);
            if keyholed.len() >= 3 {
                Some(Polygon::new(keyholed))
            } else {
                None
            }
        }
    }
}

/// Convert a `geo::MultiPolygon<f64>` to a `Vec<Polygon>`.
///
/// Each polygon in the multi-polygon is converted individually,
/// with holes keyholed into the exterior ring. Degenerate fragments
/// (fewer than 3 exterior vertices) are silently discarded.
fn polygons_from_geo_multi(multi: &MultiPolygon<f64>) -> Vec<Polygon> {
    multi.iter().filter_map(polygon_from_geo).collect()
}

/// Hole-preserving polygonal geometry for boolean and spatial operations.
#[derive(Debug, Clone)]
pub struct Region {
    geometry: MultiPolygon<f64>,
}

impl Default for Region {
    fn default() -> Self {
        Self {
            geometry: MultiPolygon::new(Vec::new()),
        }
    }
}

impl Region {
    /// Create an empty region.
    pub fn new() -> Self {
        Self::default()
    }

    /// Create a region from one single-ring polygon.
    pub fn from_polygon(polygon: &Polygon) -> Self {
        Self {
            geometry: MultiPolygon::new(vec![polygon_to_geo(polygon)]),
        }
    }

    /// Create a region containing all supplied polygons.
    pub fn from_polygons<'a>(polygons: impl IntoIterator<Item = &'a Polygon>) -> Self {
        polygons.into_iter().fold(Self::new(), |region, polygon| {
            region.union(&Self::from_polygon(polygon))
        })
    }

    /// Compute the union while preserving interior rings.
    #[must_use]
    pub fn union(&self, other: &Self) -> Self {
        Self {
            geometry: self.geometry.union(&other.geometry),
        }
    }

    /// Subtract another region while preserving interior rings.
    #[must_use]
    pub fn subtract(&self, other: &Self) -> Self {
        Self {
            geometry: self.geometry.difference(&other.geometry),
        }
    }

    /// Compute the intersection while preserving interior rings.
    #[must_use]
    pub fn intersect(&self, other: &Self) -> Self {
        Self {
            geometry: self.geometry.intersection(&other.geometry),
        }
    }

    /// Compute the symmetric difference while preserving interior rings.
    #[must_use]
    pub fn xor(&self, other: &Self) -> Self {
        Self {
            geometry: self.geometry.xor(&other.geometry),
        }
    }

    /// Whether the two regions touch or overlap.
    pub fn intersects(&self, other: &Self) -> bool {
        self.geometry.intersects(&other.geometry)
    }

    /// Unsigned filled area, excluding holes.
    pub fn area(&self) -> f64 {
        self.geometry.unsigned_area()
    }

    /// Axis-aligned bounds of the region.
    pub fn bbox(&self) -> Option<BBox> {
        self.geometry.bounding_rect().map(|rect| {
            BBox::new(
                Point::new(rect.min().x, rect.min().y),
                Point::new(rect.max().x, rect.max().y),
            )
        })
    }

    /// Minimum Euclidean distance between filled polygons in two regions.
    pub fn distance(&self, other: &Self) -> f64 {
        self.geometry
            .iter()
            .flat_map(|left| {
                other
                    .geometry
                    .iter()
                    .map(move |right| Euclidean::distance(left, right))
            })
            .fold(f64::INFINITY, f64::min)
    }

    /// Minimum Euclidean distance between exterior boundaries.
    pub fn exterior_distance(&self, other: &Self) -> f64 {
        self.geometry
            .iter()
            .flat_map(|left| {
                other
                    .geometry
                    .iter()
                    .map(move |right| Euclidean::distance(left.exterior(), right.exterior()))
            })
            .fold(f64::INFINITY, f64::min)
    }

    /// Exterior rings without duplicated closing points.
    pub fn exterior_rings(&self) -> Vec<Vec<Point>> {
        self.geometry
            .iter()
            .map(|polygon| ring_to_points(polygon.exterior()))
            .collect()
    }

    /// Interior rings without duplicated closing points.
    pub fn interior_rings(&self) -> Vec<Vec<Point>> {
        self.geometry
            .iter()
            .flat_map(|polygon| polygon.interiors().iter().map(ring_to_points))
            .collect()
    }

    /// Lower the region to Rosette's single-ring polygon model by keyholing holes.
    pub fn to_keyholed_polygons(&self) -> Vec<Polygon> {
        polygons_from_geo_multi(&self.geometry)
    }
}

/// Extract points from a geo `LineString`, stripping the closing point.
fn ring_to_points(ring: &LineString<f64>) -> Vec<Point> {
    let mut points: Vec<Point> = ring.coords().map(|c| Point::new(c.x, c.y)).collect();
    // Remove closing point if present (rosette stores open rings).
    if points.len() > 1 && points.first() == points.last() {
        points.pop();
    }
    points
}

// =============================================================================
// Keyhole algorithm
// =============================================================================

/// Merge holes into an exterior ring by inserting bridges.
///
/// For each hole, finds the leftmost vertex, casts a horizontal ray left to
/// find the nearest intersection with the current contour, and splices the
/// hole in at that point with a zero-width bridge.
///
/// The result is a single closed ring suitable for GDS-II output.
fn keyhole(exterior: Vec<Point>, holes: &[Vec<Point>]) -> Vec<Point> {
    if holes.is_empty() {
        return exterior;
    }

    // For each hole, find its leftmost point index and the x-coordinate.
    let mut hole_info: Vec<(usize, usize, f64)> = holes
        .iter()
        .enumerate()
        .map(|(hole_idx, hole)| {
            let leftmost_idx = hole
                .iter()
                .enumerate()
                .min_by(|(_, a), (_, b)| {
                    a.x.partial_cmp(&b.x)
                        .unwrap_or(std::cmp::Ordering::Equal)
                        .then_with(|| a.y.partial_cmp(&b.y).unwrap_or(std::cmp::Ordering::Equal))
                })
                .map(|(i, _)| i)
                .unwrap_or(0);
            (hole_idx, leftmost_idx, holes[hole_idx][leftmost_idx].x)
        })
        .collect();

    // Sort holes by leftmost x-coordinate (process left-to-right).
    hole_info.sort_by(|a, b| a.2.partial_cmp(&b.2).unwrap_or(std::cmp::Ordering::Equal));

    let mut contour = exterior;

    for (hole_idx, leftmost_idx, _) in hole_info {
        let hole = &holes[hole_idx];
        let bridge_hole_point = hole[leftmost_idx];

        // Cast a horizontal ray LEFT from bridge_hole_point.
        // Find the nearest edge intersection on the current contour.
        if let Some((contour_insert_idx, bridge_contour_point, on_vertex)) =
            find_bridge_point(&contour, bridge_hole_point)
        {
            let n_hole = hole.len();

            // Build the splice sequence that gets inserted into the contour.
            // The bridge is a zero-width pair of coincident edges connecting
            // the contour to the hole and back.
            //
            // If the bridge lands mid-edge, we need to insert the bridge
            // point (splitting the edge). If it lands on an existing vertex,
            // we skip that to avoid a duplicate.
            let mut splice = Vec::with_capacity(n_hole + 3);
            if !on_vertex {
                splice.push(bridge_contour_point);
            }
            // Hole vertices: full loop from leftmost back to leftmost.
            for i in 0..=n_hole {
                splice.push(hole[(leftmost_idx + i) % n_hole]);
            }
            splice.push(bridge_contour_point);

            contour.splice(contour_insert_idx..contour_insert_idx, splice);
        }
    }

    contour
}

/// Find the best bridge point on the contour for a given hole point.
///
/// Casts a horizontal ray LEFT from `hole_point` and finds the nearest
/// intersection with the contour edges. Returns:
/// - The contour index where the bridge should be inserted
/// - The exact intersection point
/// - Whether the intersection lands on an existing vertex (so the caller
///   can avoid inserting a duplicate)
fn find_bridge_point(contour: &[Point], hole_point: Point) -> Option<(usize, Point, bool)> {
    let n = contour.len();
    let mut best_x = f64::NEG_INFINITY;
    let mut best_idx = 0;
    let mut best_point = Point::new(0.0, 0.0);
    let mut on_vertex = false;

    for i in 0..n {
        let j = (i + 1) % n;
        let p0 = contour[i];
        let p1 = contour[j];

        // Check if the edge spans the y-coordinate of hole_point.
        let (min_y, max_y) = if p0.y <= p1.y {
            (p0.y, p1.y)
        } else {
            (p1.y, p0.y)
        };

        if hole_point.y < min_y || hole_point.y > max_y {
            continue;
        }

        // Handle horizontal edges.
        if (p0.y - p1.y).abs() < 1e-12 {
            // Horizontal edge at the same y. Use the rightmost point
            // that's still to the left.
            let right = p0.x.max(p1.x);
            if right <= hole_point.x && right > best_x {
                best_x = right;
                best_point = if p0.x > p1.x { p0 } else { p1 };
                // Landing on a vertex — insert after the matching vertex.
                best_idx = if p0.x > p1.x {
                    (i + 1) % n
                } else {
                    (j + 1) % n
                };
                on_vertex = true;
            }
            continue;
        }

        // Calculate x-intersection of horizontal ray with edge.
        let t = (hole_point.y - p0.y) / (p1.y - p0.y);
        let x_intersect = p0.x + t * (p1.x - p0.x);

        // Must be to the left of (or at) hole_point.
        if x_intersect <= hole_point.x && x_intersect > best_x {
            best_x = x_intersect;
            // Check if the intersection lands on an existing vertex.
            if (x_intersect - p0.x).abs() < 1e-12 && (hole_point.y - p0.y).abs() < 1e-12 {
                best_idx = (i + 1) % n;
                best_point = p0;
                on_vertex = true;
            } else if (x_intersect - p1.x).abs() < 1e-12 && (hole_point.y - p1.y).abs() < 1e-12 {
                best_idx = (j + 1) % n;
                best_point = p1;
                on_vertex = true;
            } else {
                // Mid-edge intersection — insert at j to split the edge.
                best_idx = j;
                best_point = Point::new(x_intersect, hole_point.y);
                on_vertex = false;
            }
        }
    }

    if best_x > f64::NEG_INFINITY {
        Some((best_idx, best_point, on_vertex))
    } else {
        None
    }
}

// =============================================================================
// Boolean operations on Polygon
// =============================================================================

impl Polygon {
    /// Compute the union of this polygon with another.
    ///
    /// Returns the combined area of both polygons as a list of polygons.
    /// Overlapping regions are merged. Results are keyholed single-ring
    /// polygons. Degenerate fragments (fewer than 3 vertices) are discarded.
    #[must_use]
    pub fn union(&self, other: &Polygon) -> Vec<Polygon> {
        Region::from_polygon(self)
            .union(&Region::from_polygon(other))
            .to_keyholed_polygons()
    }

    /// Subtract another polygon from this one.
    ///
    /// Returns the area of `self` that does not overlap with `other`.
    /// If `other` is fully contained within `self`, the result is a
    /// keyholed polygon with a bridge connecting the exterior to the
    /// cutout. Degenerate fragments (fewer than 3 vertices) are discarded.
    #[must_use]
    pub fn subtract(&self, other: &Polygon) -> Vec<Polygon> {
        Region::from_polygon(self)
            .subtract(&Region::from_polygon(other))
            .to_keyholed_polygons()
    }

    /// Compute the intersection of this polygon with another.
    ///
    /// Returns the overlapping area of both polygons. Degenerate fragments
    /// (fewer than 3 vertices) are discarded.
    #[must_use]
    pub fn intersect(&self, other: &Polygon) -> Vec<Polygon> {
        Region::from_polygon(self)
            .intersect(&Region::from_polygon(other))
            .to_keyholed_polygons()
    }

    /// Compute the symmetric difference (XOR) of this polygon with another.
    ///
    /// Returns the area that is in either polygon but not in both. Degenerate
    /// fragments (fewer than 3 vertices) are discarded.
    #[must_use]
    pub fn xor(&self, other: &Polygon) -> Vec<Polygon> {
        Region::from_polygon(self)
            .xor(&Region::from_polygon(other))
            .to_keyholed_polygons()
    }
}

// =============================================================================
// Tests
// =============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    const EPSILON: f64 = 1e-6;

    fn approx_eq(a: f64, b: f64) -> bool {
        (a - b).abs() < EPSILON
    }

    // -- Conversion tests --

    #[test]
    fn test_polygon_to_geo_closes_ring() {
        let poly = Polygon::rect(Point::new(0.0, 0.0), 10.0, 5.0);
        let geo_poly = polygon_to_geo(&poly);
        let coords: Vec<_> = geo_poly.exterior().coords().collect();
        // geo expects closed ring: first == last
        assert_eq!(coords.first(), coords.last());
        // 4 vertices + closing = 5 coords
        assert_eq!(coords.len(), 5);
    }

    #[test]
    fn test_polygon_from_geo_strips_closing() {
        let geo_poly = GeoPolygon::new(
            LineString::from(vec![
                Coord { x: 0.0, y: 0.0 },
                Coord { x: 10.0, y: 0.0 },
                Coord { x: 10.0, y: 5.0 },
                Coord { x: 0.0, y: 5.0 },
                Coord { x: 0.0, y: 0.0 }, // closing point
            ]),
            vec![],
        );
        let poly = polygon_from_geo(&geo_poly).unwrap();
        assert_eq!(poly.len(), 4);
    }

    #[test]
    fn test_roundtrip_conversion() {
        let original = Polygon::rect(Point::new(1.0, 2.0), 8.0, 4.0);
        let geo_poly = polygon_to_geo(&original);
        let roundtripped = polygon_from_geo(&geo_poly).unwrap();
        assert_eq!(original.len(), roundtripped.len());
        assert!(approx_eq(original.area(), roundtripped.area()));
    }

    // -- Keyhole tests --

    #[test]
    fn test_keyhole_no_holes() {
        let exterior = vec![
            Point::new(0.0, 0.0),
            Point::new(10.0, 0.0),
            Point::new(10.0, 10.0),
            Point::new(0.0, 10.0),
        ];
        let result = keyhole(exterior.clone(), &[]);
        assert_eq!(result, exterior);
    }

    #[test]
    fn test_keyhole_single_hole() {
        // Outer: 10x10 square at origin
        let exterior = vec![
            Point::new(0.0, 0.0),
            Point::new(10.0, 0.0),
            Point::new(10.0, 10.0),
            Point::new(0.0, 10.0),
        ];
        // Inner: 2x2 square centered at (5, 5)
        // Winding: clockwise (standard for holes)
        let hole = vec![
            Point::new(4.0, 4.0),
            Point::new(4.0, 6.0),
            Point::new(6.0, 6.0),
            Point::new(6.0, 4.0),
        ];

        let result = keyhole(exterior, &[hole]);

        // The result should be a single ring with more vertices than the original.
        // Original exterior (4) + hole (4) + bridge vertices (2 contour points + 1 repeated hole point) = 4 + 4 + ... > 4
        assert!(result.len() > 4);

        // The hole's leftmost point is (4, 4). A horizontal ray left hits
        // the left edge of the exterior at (0, 4). So the bridge goes from
        // (0, 4) to (4, 4).
        assert!(result.contains(&Point::new(4.0, 4.0)));
    }

    #[test]
    fn test_keyhole_bridge_lands_on_vertex() {
        // Hole whose leftmost point is at y=0, so the horizontal ray left
        // hits the exterior vertex at (0, 0) exactly — testing the on_vertex
        // path in find_bridge_point.
        let exterior = vec![
            Point::new(0.0, 0.0),
            Point::new(10.0, 0.0),
            Point::new(10.0, 10.0),
            Point::new(0.0, 10.0),
        ];
        let hole = vec![
            Point::new(3.0, 0.0), // leftmost, at y=0 -> ray hits vertex (0,0)
            Point::new(3.0, 2.0),
            Point::new(5.0, 2.0),
            Point::new(5.0, 0.0),
        ];

        let result = keyhole(exterior, &[hole]);

        // Must form a valid polygon: area should be exterior minus hole.
        // exterior = 100, hole = 2*2 = 4 (actually 2 wide * 2 tall = 4)
        let poly = Polygon::new(result);
        assert!(
            approx_eq(poly.area(), 96.0),
            "Expected area 96, got {}",
            poly.area()
        );
    }

    #[test]
    fn test_keyhole_from_geo_polygon_with_hole() {
        // Create a geo polygon with a hole directly.
        let exterior = LineString::from(vec![
            Coord { x: 0.0, y: 0.0 },
            Coord { x: 20.0, y: 0.0 },
            Coord { x: 20.0, y: 20.0 },
            Coord { x: 0.0, y: 20.0 },
            Coord { x: 0.0, y: 0.0 },
        ]);
        let hole = LineString::from(vec![
            Coord { x: 5.0, y: 5.0 },
            Coord { x: 5.0, y: 15.0 },
            Coord { x: 15.0, y: 15.0 },
            Coord { x: 15.0, y: 5.0 },
            Coord { x: 5.0, y: 5.0 },
        ]);
        let geo_poly = GeoPolygon::new(exterior, vec![hole]);

        let poly = polygon_from_geo(&geo_poly).unwrap();

        // Should have more than 4 vertices (exterior + hole + bridge)
        assert!(poly.len() > 4);
    }

    // -- Boolean operation tests --

    #[test]
    fn test_union_overlapping_rects() {
        // Two overlapping rectangles
        let a = Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0);
        let b = Polygon::rect(Point::new(5.0, 0.0), 10.0, 10.0);

        let result = a.union(&b);
        assert_eq!(result.len(), 1);

        // Union area should be 150 (10*10 + 10*10 - 5*10 overlap)
        let total_area: f64 = result.iter().map(|p| p.area()).sum();
        assert!(approx_eq(total_area, 150.0));
    }

    #[test]
    fn test_union_disjoint_rects() {
        let a = Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0);
        let b = Polygon::rect(Point::new(20.0, 20.0), 5.0, 5.0);

        let result = a.union(&b);
        assert_eq!(result.len(), 2);

        let total_area: f64 = result.iter().map(|p| p.area()).sum();
        assert!(approx_eq(total_area, 50.0));
    }

    #[test]
    fn test_subtract_overlapping_rects() {
        let a = Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0);
        let b = Polygon::rect(Point::new(5.0, 0.0), 10.0, 10.0);

        let result = a.subtract(&b);
        assert_eq!(result.len(), 1);

        // Remaining area: 10*10 - 5*10 = 50
        let total_area: f64 = result.iter().map(|p| p.area()).sum();
        assert!(approx_eq(total_area, 50.0));
    }

    #[test]
    fn test_subtract_creates_hole() {
        // Large square with a small square cut from the center.
        let outer = Polygon::rect(Point::new(0.0, 0.0), 20.0, 20.0);
        let inner = Polygon::rect(Point::new(5.0, 5.0), 10.0, 10.0);

        let result = outer.subtract(&inner);
        assert_eq!(result.len(), 1);

        // The result should be a keyholed polygon.
        // Area: 20*20 - 10*10 = 300
        let poly = &result[0];
        // More than 4 vertices (has a bridge + hole)
        assert!(poly.len() > 4);

        // Verify area by shoelace — for a keyholed polygon the signed area
        // should equal exterior area minus hole area.
        let area = poly.area();
        assert!(approx_eq(area, 300.0), "Expected area 300, got {}", area,);
    }

    #[test]
    fn test_subtract_no_overlap() {
        let a = Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0);
        let b = Polygon::rect(Point::new(20.0, 20.0), 5.0, 5.0);

        let result = a.subtract(&b);
        assert_eq!(result.len(), 1);

        let total_area: f64 = result.iter().map(|p| p.area()).sum();
        assert!(approx_eq(total_area, 25.0));
    }

    #[test]
    fn test_intersect_overlapping_rects() {
        let a = Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0);
        let b = Polygon::rect(Point::new(5.0, 0.0), 10.0, 10.0);

        let result = a.intersect(&b);
        assert_eq!(result.len(), 1);

        // Intersection area: 5*10 = 50
        let total_area: f64 = result.iter().map(|p| p.area()).sum();
        assert!(approx_eq(total_area, 50.0));
    }

    #[test]
    fn test_intersect_no_overlap() {
        let a = Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0);
        let b = Polygon::rect(Point::new(20.0, 20.0), 5.0, 5.0);

        let result = a.intersect(&b);
        assert!(result.is_empty());
    }

    #[test]
    fn test_xor_overlapping_rects() {
        let a = Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0);
        let b = Polygon::rect(Point::new(5.0, 0.0), 10.0, 10.0);

        let result = a.xor(&b);

        // XOR area: (10*10 + 10*10) - 2*(5*10) = 100
        let total_area: f64 = result.iter().map(|p| p.area()).sum();
        assert!(approx_eq(total_area, 100.0));
    }

    #[test]
    fn test_xor_identical_rects() {
        let a = Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0);
        let b = Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0);

        let result = a.xor(&b);
        assert!(result.is_empty());
    }

    #[test]
    fn test_subtract_complete_coverage() {
        // Subtracting a larger polygon from a smaller one.
        let small = Polygon::rect(Point::new(2.0, 2.0), 3.0, 3.0);
        let big = Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0);

        let result = small.subtract(&big);
        assert!(result.is_empty());
    }

    #[test]
    fn region_preserves_multiple_holes_until_explicit_lowering() {
        let outer = Region::from_polygon(&Polygon::rect(Point::origin(), 30.0, 20.0));
        let hole_a = Region::from_polygon(&Polygon::rect(Point::new(3.0, 3.0), 5.0, 5.0));
        let hole_b = Region::from_polygon(&Polygon::rect(Point::new(20.0, 10.0), 5.0, 5.0));
        let region = outer.subtract(&hole_a).subtract(&hole_b);

        assert_eq!(region.exterior_rings().len(), 1);
        assert_eq!(region.interior_rings().len(), 2);
        assert!(approx_eq(region.area(), 550.0));
        let lowered = region.to_keyholed_polygons();
        assert_eq!(lowered.len(), 1);
        assert!(lowered[0].len() > 12);
    }

    #[test]
    fn chained_region_booleans_keep_topology() {
        let base = Region::from_polygon(&Polygon::rect(Point::origin(), 20.0, 20.0));
        let hole = Region::from_polygon(&Polygon::rect(Point::new(5.0, 5.0), 10.0, 10.0));
        let island = Region::from_polygon(&Polygon::rect(Point::new(30.0, 0.0), 5.0, 5.0));
        let region = base.subtract(&hole).union(&island);

        assert_eq!(region.exterior_rings().len(), 2);
        assert_eq!(region.interior_rings().len(), 1);
        assert!(approx_eq(region.area(), 325.0));
    }
}

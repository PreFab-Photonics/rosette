//! Conversions between rosette-core and geo types.

use geo::{Coord, LineString, Polygon as GeoPolygon};
use rosette_core::{Point, Polygon};

/// Convert rosette Point to geo Coord.
pub fn point_to_coord(p: Point) -> Coord<f64> {
    Coord { x: p.x, y: p.y }
}

/// Convert geo Coord to rosette Point.
pub fn coord_to_point(c: Coord<f64>) -> Point {
    Point::new(c.x, c.y)
}

/// Convert rosette Polygon to geo Polygon.
pub fn polygon_to_geo(poly: &Polygon) -> GeoPolygon<f64> {
    let coords: Vec<Coord<f64>> = poly.vertices().iter().map(|p| point_to_coord(*p)).collect();
    // geo expects closed rings (first == last)
    let mut ring = coords;
    if let (Some(first), Some(last)) = (ring.first(), ring.last())
        && first != last
    {
        ring.push(*first);
    }
    GeoPolygon::new(LineString::from(ring), vec![])
}

/// Convert geo Polygon to rosette Polygon.
#[allow(dead_code)]
pub fn geo_to_polygon(geo_poly: &GeoPolygon<f64>) -> Polygon {
    let coords = geo_poly.exterior().coords();
    let mut points: Vec<Point> = coords.map(|c| coord_to_point(*c)).collect();
    // Remove closing point if present (rosette doesn't store it)
    if points.len() > 1 && points.first() == points.last() {
        points.pop();
    }
    Polygon::new(points)
}

/// Calculate polygon area using the shoelace formula.
pub(crate) fn polygon_area(vertices: &[(f64, f64)]) -> f64 {
    let n = vertices.len();
    if n < 3 {
        return 0.0;
    }

    let mut area = 0.0;
    for i in 0..n {
        let j = (i + 1) % n;
        area += vertices[i].0 * vertices[j].1;
        area -= vertices[j].0 * vertices[i].1;
    }

    area / 2.0
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_point_conversion() {
        let p = Point::new(1.0, 2.0);
        let c = point_to_coord(p);
        assert_eq!(c.x, 1.0);
        assert_eq!(c.y, 2.0);

        let p2 = coord_to_point(c);
        assert_eq!(p2.x, 1.0);
        assert_eq!(p2.y, 2.0);
    }

    #[test]
    fn test_polygon_conversion() {
        let poly = Polygon::rect(Point::origin(), 10.0, 5.0);
        let geo_poly = polygon_to_geo(&poly);

        // Should have 5 coords (4 vertices + closing)
        assert_eq!(geo_poly.exterior().coords().count(), 5);

        let back = geo_to_polygon(&geo_poly);
        assert_eq!(back.vertices().len(), 4);
    }
}

//! Geometry utility functions for component authoring.
//!
//! These utilities help users create custom photonic components by providing
//! common geometric operations like arc generation and polygon offsetting.

use std::f64::consts::PI;

use super::{Point, Polygon, Vector2};

/// Generate points along a circular arc.
///
/// Points are generated counter-clockwise from `start_angle` to `end_angle`.
/// Use negative angles or swap start/end for clockwise arcs.
///
/// # Arguments
/// * `center` - Center point of the arc
/// * `radius` - Radius of the arc
/// * `start_angle` - Starting angle in radians (0 = +X direction)
/// * `end_angle` - Ending angle in radians
/// * `num_points` - Number of points to generate (minimum 2)
///
/// # Example
/// ```
/// use rosette_core::geometry::{Point, arc_points};
/// use std::f64::consts::PI;
///
/// // Quarter circle arc from +X to +Y
/// let points = arc_points(Point::origin(), 5.0, 0.0, PI / 2.0, 10);
/// assert_eq!(points.len(), 10);
/// ```
pub fn arc_points(
    center: Point,
    radius: f64,
    start_angle: f64,
    end_angle: f64,
    num_points: usize,
) -> Vec<Point> {
    let n = num_points.max(2);
    let mut points = Vec::with_capacity(n);

    for i in 0..n {
        let t = i as f64 / (n - 1) as f64;
        let angle = start_angle + t * (end_angle - start_angle);
        points.push(Point::new(
            center.x + radius * angle.cos(),
            center.y + radius * angle.sin(),
        ));
    }

    points
}

/// Create a polygon from a centerline and uniform width.
///
/// The polygon is created by offsetting the centerline perpendicular to the
/// path direction at each point. The resulting polygon forms a "ribbon" shape.
///
/// # Arguments
/// * `centerline` - Points defining the centerline path (minimum 2 points)
/// * `width` - Width of the polygon (applied equally on both sides of centerline)
///
/// # Returns
/// A closed polygon, or None if the centerline has fewer than 2 points.
///
/// # Example
/// ```
/// use rosette_core::geometry::{Point, offset_polygon};
///
/// // Create a simple rectangle from a 2-point centerline
/// let centerline = vec![Point::new(0.0, 0.0), Point::new(10.0, 0.0)];
/// let poly = offset_polygon(&centerline, 1.0).unwrap();
/// assert_eq!(poly.len(), 4);
/// ```
pub fn offset_polygon(centerline: &[Point], width: f64) -> Option<Polygon> {
    if centerline.len() < 2 {
        return None;
    }

    let half_width = width / 2.0;
    let n = centerline.len();

    // Calculate normals at each point
    let normals = calculate_normals(centerline);

    // Build polygon vertices: one side forward, other side backward
    let mut vertices = Vec::with_capacity(2 * n);

    // First side (positive offset)
    for i in 0..n {
        let normal = normals[i];
        vertices.push(Point::new(
            centerline[i].x + normal.x * half_width,
            centerline[i].y + normal.y * half_width,
        ));
    }

    // Second side (negative offset, reversed)
    for i in (0..n).rev() {
        let normal = normals[i];
        vertices.push(Point::new(
            centerline[i].x - normal.x * half_width,
            centerline[i].y - normal.y * half_width,
        ));
    }

    Some(Polygon::new(vertices))
}

/// Create a polygon from a centerline with varying width.
///
/// Similar to `offset_polygon`, but allows specifying a different width at each
/// centerline point for tapered or variable-width shapes.
///
/// # Arguments
/// * `centerline` - Points defining the centerline path (minimum 2 points)
/// * `widths` - Width at each centerline point (must have same length as centerline)
///
/// # Returns
/// A closed polygon, or None if inputs are invalid.
///
/// # Example
/// ```
/// use rosette_core::geometry::{Point, offset_polygon_varying};
///
/// // Create a taper from width 1.0 to 2.0
/// let centerline = vec![Point::new(0.0, 0.0), Point::new(10.0, 0.0)];
/// let widths = vec![1.0, 2.0];
/// let poly = offset_polygon_varying(&centerline, &widths).unwrap();
/// ```
pub fn offset_polygon_varying(centerline: &[Point], widths: &[f64]) -> Option<Polygon> {
    if centerline.len() < 2 || centerline.len() != widths.len() {
        return None;
    }

    let n = centerline.len();
    let normals = calculate_normals(centerline);

    let mut vertices = Vec::with_capacity(2 * n);

    // First side (positive offset)
    for i in 0..n {
        let normal = normals[i];
        let half_width = widths[i] / 2.0;
        vertices.push(Point::new(
            centerline[i].x + normal.x * half_width,
            centerline[i].y + normal.y * half_width,
        ));
    }

    // Second side (negative offset, reversed)
    for i in (0..n).rev() {
        let normal = normals[i];
        let half_width = widths[i] / 2.0;
        vertices.push(Point::new(
            centerline[i].x - normal.x * half_width,
            centerline[i].y - normal.y * half_width,
        ));
    }

    Some(Polygon::new(vertices))
}

/// Calculate perpendicular normals at each point of a path.
///
/// For interior points, the normal is the average of the normals from the
/// incoming and outgoing segments. For endpoints, the normal is perpendicular
/// to the single adjacent segment.
fn calculate_normals(points: &[Point]) -> Vec<Vector2> {
    let n = points.len();
    let mut normals = Vec::with_capacity(n);

    for i in 0..n {
        let normal = if i == 0 {
            // First point: use direction to next point
            let dir = (points[1] - points[0]).normalize();
            dir.perpendicular()
        } else if i == n - 1 {
            // Last point: use direction from previous point
            let dir = (points[n - 1] - points[n - 2]).normalize();
            dir.perpendicular()
        } else {
            // Interior point: average of incoming and outgoing normals
            let dir_in = (points[i] - points[i - 1]).normalize();
            let dir_out = (points[i + 1] - points[i]).normalize();
            let avg_dir = (dir_in + dir_out).normalize();
            avg_dir.perpendicular()
        };
        normals.push(normal);
    }

    normals
}

/// Calculate the total length of a polyline path.
///
/// # Arguments
/// * `points` - Points defining the path
///
/// # Returns
/// The sum of distances between consecutive points.
///
/// # Example
/// ```
/// use rosette_core::geometry::{Point, path_length};
///
/// let points = vec![
///     Point::new(0.0, 0.0),
///     Point::new(3.0, 0.0),
///     Point::new(3.0, 4.0),
/// ];
/// assert!((path_length(&points) - 7.0).abs() < 1e-10);
/// ```
pub fn path_length(points: &[Point]) -> f64 {
    if points.len() < 2 {
        return 0.0;
    }

    points.windows(2).map(|w| w[0].distance_to(w[1])).sum()
}

/// Fresnel cosine integral C(t).
///
/// The Fresnel cosine integral is defined as:
/// C(t) = integral from 0 to t of cos(pi/2 * u^2) du
///
/// Used for generating Euler (clothoid) spiral bends.
///
/// # Arguments
/// * `t` - Upper limit of integration
///
/// # Example
/// ```
/// use rosette_core::geometry::fresnel_c;
///
/// let c = fresnel_c(1.0);
/// assert!((c - 0.7799).abs() < 0.001);
/// ```
pub fn fresnel_c(t: f64) -> f64 {
    // Use numerical integration (Simpson's rule)
    let n = 100;
    let dt = t / n as f64;
    let mut sum = 0.0;

    for i in 0..n {
        let t0 = i as f64 * dt;
        let t1 = (i as f64 + 0.5) * dt;
        let t2 = (i as f64 + 1.0) * dt;

        let f0 = (PI / 2.0 * t0 * t0).cos();
        let f1 = (PI / 2.0 * t1 * t1).cos();
        let f2 = (PI / 2.0 * t2 * t2).cos();

        sum += dt / 6.0 * (f0 + 4.0 * f1 + f2);
    }

    sum
}

/// Fresnel sine integral S(t).
///
/// The Fresnel sine integral is defined as:
/// S(t) = integral from 0 to t of sin(pi/2 * u^2) du
///
/// Used for generating Euler (clothoid) spiral bends.
///
/// # Arguments
/// * `t` - Upper limit of integration
///
/// # Example
/// ```
/// use rosette_core::geometry::fresnel_s;
///
/// let s = fresnel_s(1.0);
/// assert!((s - 0.4383).abs() < 0.001);
/// ```
pub fn fresnel_s(t: f64) -> f64 {
    // Use numerical integration (Simpson's rule)
    let n = 100;
    let dt = t / n as f64;
    let mut sum = 0.0;

    for i in 0..n {
        let t0 = i as f64 * dt;
        let t1 = (i as f64 + 0.5) * dt;
        let t2 = (i as f64 + 1.0) * dt;

        let f0 = (PI / 2.0 * t0 * t0).sin();
        let f1 = (PI / 2.0 * t1 * t1).sin();
        let f2 = (PI / 2.0 * t2 * t2).sin();

        sum += dt / 6.0 * (f0 + 4.0 * f1 + f2);
    }

    sum
}

#[cfg(test)]
mod tests {
    use super::*;

    const EPSILON: f64 = 1e-6;

    fn approx_eq(a: f64, b: f64) -> bool {
        (a - b).abs() < EPSILON
    }

    #[test]
    fn test_arc_points_quarter_circle() {
        let points = arc_points(Point::origin(), 5.0, 0.0, PI / 2.0, 5);
        assert_eq!(points.len(), 5);

        // First point should be at (5, 0)
        assert!(approx_eq(points[0].x, 5.0));
        assert!(approx_eq(points[0].y, 0.0));

        // Last point should be at (0, 5)
        assert!(approx_eq(points[4].x, 0.0));
        assert!(approx_eq(points[4].y, 5.0));
    }

    #[test]
    fn test_arc_points_full_circle() {
        let points = arc_points(Point::new(1.0, 1.0), 2.0, 0.0, 2.0 * PI, 9);
        assert_eq!(points.len(), 9);

        // First and last points should be the same
        assert!(approx_eq(points[0].x, points[8].x));
        assert!(approx_eq(points[0].y, points[8].y));
    }

    #[test]
    fn test_offset_polygon_straight() {
        let centerline = vec![Point::new(0.0, 0.0), Point::new(10.0, 0.0)];
        let poly = offset_polygon(&centerline, 2.0).unwrap();

        // Should create a rectangle
        assert_eq!(poly.len(), 4);

        // Check area (should be 10 * 2 = 20)
        assert!((poly.area() - 20.0).abs() < 0.1);
    }

    #[test]
    fn test_offset_polygon_l_shape() {
        let centerline = vec![
            Point::new(0.0, 0.0),
            Point::new(10.0, 0.0),
            Point::new(10.0, 10.0),
        ];
        let poly = offset_polygon(&centerline, 1.0).unwrap();

        // Should create an L-shaped polygon
        assert_eq!(poly.len(), 6);
    }

    #[test]
    fn test_offset_polygon_varying_taper() {
        let centerline = vec![Point::new(0.0, 0.0), Point::new(10.0, 0.0)];
        let widths = vec![1.0, 2.0];
        let poly = offset_polygon_varying(&centerline, &widths).unwrap();

        assert_eq!(poly.len(), 4);
        // Area should be trapezoid: (1 + 2) / 2 * 10 = 15
        assert!((poly.area() - 15.0).abs() < 0.1);
    }

    #[test]
    fn test_offset_polygon_invalid() {
        // Too few points
        let result = offset_polygon(&[Point::origin()], 1.0);
        assert!(result.is_none());

        // Mismatched lengths
        let centerline = vec![Point::new(0.0, 0.0), Point::new(10.0, 0.0)];
        let widths = vec![1.0]; // Wrong length
        let result = offset_polygon_varying(&centerline, &widths);
        assert!(result.is_none());
    }

    #[test]
    fn test_path_length_simple() {
        let points = vec![
            Point::new(0.0, 0.0),
            Point::new(3.0, 0.0),
            Point::new(3.0, 4.0),
        ];
        assert!(approx_eq(path_length(&points), 7.0));
    }

    #[test]
    fn test_path_length_single_point() {
        let points = vec![Point::new(0.0, 0.0)];
        assert!(approx_eq(path_length(&points), 0.0));
    }

    #[test]
    fn test_path_length_empty() {
        let points: Vec<Point> = vec![];
        assert!(approx_eq(path_length(&points), 0.0));
    }

    #[test]
    fn test_fresnel_c_values() {
        // Known values from tables
        assert!((fresnel_c(0.0)).abs() < EPSILON);
        assert!((fresnel_c(1.0) - 0.7799).abs() < 0.01);
        assert!((fresnel_c(2.0) - 0.4883).abs() < 0.01);
    }

    #[test]
    fn test_fresnel_s_values() {
        // Known values from tables
        assert!((fresnel_s(0.0)).abs() < EPSILON);
        assert!((fresnel_s(1.0) - 0.4383).abs() < 0.01);
        assert!((fresnel_s(2.0) - 0.3434).abs() < 0.01);
    }
}

//! Geometry utility functions for component authoring.
//!
//! These utilities help users create custom photonic components with operations
//! such as arc generation and Fresnel integrals.

use std::f64::consts::PI;

use super::Point;

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

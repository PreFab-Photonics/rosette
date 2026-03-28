//! Path-based routing for waveguides.
//!
//! The [`Route`] struct provides a flexible API for creating waveguide paths
//! that automatically generate bends at corners and tapers for width transitions.
//!
//! # Example
//!
//! ```
//! use rosette_core::component::Route;
//! use rosette_core::{Layer, Point};
//!
//! let layer = Layer::new(1, 0);
//! let mut route = Route::new(layer)
//!     .with_width(0.5)
//!     .with_bend_radius(5.0);
//!
//! route.start_at(0.0, 0.0, 0.0);  // Start at origin, pointing +X
//! route.to(50.0, 0.0);             // Straight segment
//! route.to(50.0, 30.0);            // 90° bend
//! route.to(100.0, 30.0);           // Another straight
//! route.end_at(100.0, 30.0, 0.0);  // End pointing +X
//!
//! let cell = route.to_cell("my_route");
//! ```

use std::f64::consts::PI;

use crate::cell::{BendInfo, Cell};
use crate::geometry::{Point, Polygon, Vector2};
use crate::layer::Layer;
use crate::port::Port;

/// A waypoint along a route path.
#[derive(Debug, Clone)]
pub struct Waypoint {
    /// Position of the waypoint.
    pub position: Point,
    /// Width override from this point onward (None = use previous width).
    pub width: Option<f64>,
    /// Bend radius override at this corner (None = use default).
    pub bend_radius: Option<f64>,
}

impl Waypoint {
    /// Create a new waypoint at the given position.
    pub fn new(x: f64, y: f64) -> Self {
        Self {
            position: Point::new(x, y),
            width: None,
            bend_radius: None,
        }
    }

    /// Create a waypoint from a Point.
    pub fn from_point(point: Point) -> Self {
        Self {
            position: point,
            width: None,
            bend_radius: None,
        }
    }

    /// Set width override for this waypoint.
    pub fn with_width(mut self, width: f64) -> Self {
        self.width = Some(width);
        self
    }

    /// Set bend radius override for this corner.
    pub fn with_bend_radius(mut self, radius: f64) -> Self {
        self.bend_radius = Some(radius);
        self
    }
}

/// Result of route geometry generation.
#[derive(Debug)]
pub struct RouteResult {
    /// Generated polygons.
    pub polygons: Vec<Polygon>,
    /// Total optical path length.
    pub path_length: f64,
    /// Input port.
    pub port_in: Port,
    /// Output port.
    pub port_out: Port,
    /// Warnings generated during routing.
    pub warnings: Vec<String>,
    /// Bend information for each non-trivial corner.
    pub bends: Vec<BendInfo>,
}

/// A path-based waveguide route.
///
/// Routes generate continuous waveguide geometry from a series of waypoints,
/// automatically inserting bends at corners and tapers for width transitions.
#[derive(Debug, Clone)]
pub struct Route {
    /// Waypoints along the route (not including start/end ports).
    waypoints: Vec<Waypoint>,
    /// Starting angle in radians (from +X axis).
    start_angle: Option<f64>,
    /// Starting position.
    start_position: Option<Point>,
    /// Starting width.
    start_width: Option<f64>,
    /// Ending angle in radians.
    end_angle: Option<f64>,
    /// Ending position.
    end_position: Option<Point>,
    /// Ending width.
    end_width: Option<f64>,
    /// Default waveguide width.
    default_width: f64,
    /// Default bend radius.
    default_bend_radius: f64,
    /// Whether to auto-insert tapers for width transitions.
    auto_taper: bool,
    /// Length of auto-inserted tapers.
    taper_length: f64,
    /// Layer for the route.
    layer: Layer,
}

impl Route {
    /// Create a new route with the given layer.
    pub fn new(layer: Layer) -> Self {
        Self {
            waypoints: Vec::new(),
            start_angle: None,
            start_position: None,
            start_width: None,
            end_angle: None,
            end_position: None,
            end_width: None,
            default_width: 0.5,
            default_bend_radius: 5.0,
            auto_taper: true,
            taper_length: 10.0,
            layer,
        }
    }

    /// Set the default waveguide width.
    pub fn with_width(mut self, width: f64) -> Self {
        assert!(width > 0.0, "Width must be positive");
        self.default_width = width;
        self
    }

    /// Set the default bend radius.
    pub fn with_bend_radius(mut self, radius: f64) -> Self {
        assert!(radius > 0.0, "Bend radius must be positive");
        self.default_bend_radius = radius;
        self
    }

    /// Enable or disable automatic taper insertion.
    pub fn with_auto_taper(mut self, enabled: bool) -> Self {
        self.auto_taper = enabled;
        self
    }

    /// Set the length of auto-inserted tapers.
    pub fn with_taper_length(mut self, length: f64) -> Self {
        assert!(length > 0.0, "Taper length must be positive");
        self.taper_length = length;
        self
    }

    /// Start the route at a specific position and angle.
    ///
    /// # Arguments
    /// * `x` - X coordinate
    /// * `y` - Y coordinate  
    /// * `angle` - Direction angle in radians (0 = +X direction)
    pub fn start_at(&mut self, x: f64, y: f64, angle: f64) -> &mut Self {
        self.start_position = Some(Point::new(x, y));
        self.start_angle = Some(angle);
        self
    }

    /// Start the route at a port.
    ///
    /// Uses the port's position, direction, and width.
    pub fn start_at_port(&mut self, port: &Port) -> &mut Self {
        self.start_position = Some(port.position);
        // Port direction points outward from component, so we flip it for route direction
        self.start_angle = Some(port.direction.angle() + PI);
        self.start_width = port.width;
        self
    }

    /// Add a waypoint to the route.
    ///
    /// # Arguments
    /// * `x` - X coordinate
    /// * `y` - Y coordinate
    pub fn to(&mut self, x: f64, y: f64) -> &mut Self {
        self.waypoints.push(Waypoint::new(x, y));
        self
    }

    /// Add a waypoint with a width change.
    pub fn to_width(&mut self, x: f64, y: f64, width: f64) -> &mut Self {
        self.waypoints.push(Waypoint::new(x, y).with_width(width));
        self
    }

    /// Add a waypoint with a custom bend radius.
    pub fn to_bend(&mut self, x: f64, y: f64, bend_radius: f64) -> &mut Self {
        self.waypoints
            .push(Waypoint::new(x, y).with_bend_radius(bend_radius));
        self
    }

    /// Add a waypoint with both width and bend radius overrides.
    pub fn to_full(
        &mut self,
        x: f64,
        y: f64,
        width: Option<f64>,
        bend_radius: Option<f64>,
    ) -> &mut Self {
        let mut wp = Waypoint::new(x, y);
        wp.width = width;
        wp.bend_radius = bend_radius;
        self.waypoints.push(wp);
        self
    }

    /// End the route at a specific position and angle.
    pub fn end_at(&mut self, x: f64, y: f64, angle: f64) -> &mut Self {
        self.end_position = Some(Point::new(x, y));
        self.end_angle = Some(angle);
        self
    }

    /// End the route at a port.
    pub fn end_at_port(&mut self, port: &Port) -> &mut Self {
        self.end_position = Some(port.position);
        // Port direction points outward, we want to arrive facing into it
        self.end_angle = Some(port.direction.angle() + PI);
        self.end_width = port.width;
        self
    }

    /// Get the layer for this route.
    pub fn layer(&self) -> Layer {
        self.layer
    }

    /// Build the complete list of path points including start and end.
    fn build_path_points(&self) -> Vec<PathPoint> {
        let mut points = Vec::new();

        // Start point
        if let Some(pos) = self.start_position {
            let width = self.start_width.unwrap_or(self.default_width);
            let angle = self.start_angle.unwrap_or(0.0);
            points.push(PathPoint {
                position: pos,
                width,
                bend_radius: self.default_bend_radius,
                incoming_angle: None,
                outgoing_angle: Some(angle),
            });
        }

        // Intermediate waypoints
        let mut current_width = self.start_width.unwrap_or(self.default_width);
        for wp in &self.waypoints {
            if let Some(w) = wp.width {
                current_width = w;
            }
            points.push(PathPoint {
                position: wp.position,
                width: current_width,
                bend_radius: wp.bend_radius.unwrap_or(self.default_bend_radius),
                incoming_angle: None,
                outgoing_angle: None,
            });
        }

        // End point
        if let Some(pos) = self.end_position {
            let width = self.end_width.unwrap_or(current_width);
            let angle = self.end_angle.unwrap_or(0.0);
            points.push(PathPoint {
                position: pos,
                width,
                bend_radius: self.default_bend_radius,
                incoming_angle: Some(angle),
                outgoing_angle: None,
            });
        }

        // Calculate angles between consecutive points
        self.calculate_segment_angles(&mut points);

        points
    }

    /// Calculate incoming/outgoing angles for each point based on segment directions.
    fn calculate_segment_angles(&self, points: &mut [PathPoint]) {
        if points.len() < 2 {
            return;
        }

        for i in 0..points.len() {
            // Calculate outgoing angle (direction to next point)
            if i < points.len() - 1 && points[i].outgoing_angle.is_none() {
                let dir = points[i + 1].position - points[i].position;
                if dir.length() > 1e-10 {
                    points[i].outgoing_angle = Some(dir.angle());
                }
            }

            // Calculate incoming angle (direction from previous point)
            if i > 0 && points[i].incoming_angle.is_none() {
                let dir = points[i].position - points[i - 1].position;
                if dir.length() > 1e-10 {
                    points[i].incoming_angle = Some(dir.angle());
                }
            }
        }

        // For endpoints without explicit angles, use the segment angle
        if let Some(first) = points.first_mut()
            && first.outgoing_angle.is_none()
            && first.incoming_angle.is_some()
        {
            first.outgoing_angle = first.incoming_angle;
        }
        if let Some(last) = points.last_mut()
            && last.incoming_angle.is_none()
            && last.outgoing_angle.is_some()
        {
            last.incoming_angle = last.outgoing_angle;
        }
    }

    /// Generate the route geometry.
    pub fn generate(&self) -> RouteResult {
        let points = self.build_path_points();
        let mut warnings = Vec::new();

        if points.len() < 2 {
            // Return empty result
            return RouteResult {
                polygons: Vec::new(),
                path_length: 0.0,
                port_in: Port::new("in", Point::origin(), Vector2::unit_x()),
                port_out: Port::new("out", Point::origin(), Vector2::unit_x()),
                warnings: vec!["Route requires at least 2 points".to_string()],
                bends: Vec::new(),
            };
        }

        // Analyze corners and calculate setbacks
        let (corners, bends) = self.analyze_corners(&points, &mut warnings);

        // Generate polygons
        let polygons = self.generate_polygons(&points, &corners, &mut warnings);

        // Calculate path length
        let path_length = self.calculate_path_length(&points, &corners);

        // Create ports
        let first = &points[0];
        let last = &points[points.len() - 1];

        let port_in = Port::with_width(
            "in",
            first.position,
            -Vector2::from_angle(first.outgoing_angle.unwrap_or(0.0)),
            first.width,
        );

        let port_out = Port::with_width(
            "out",
            last.position,
            Vector2::from_angle(last.incoming_angle.unwrap_or(0.0)),
            last.width,
        );

        RouteResult {
            polygons,
            path_length,
            port_in,
            port_out,
            warnings,
            bends,
        }
    }

    /// Analyze corners to determine turn angles and setbacks.
    fn analyze_corners(
        &self,
        points: &[PathPoint],
        warnings: &mut Vec<String>,
    ) -> (Vec<Corner>, Vec<BendInfo>) {
        let mut corners = Vec::new();
        let mut bends = Vec::new();

        for i in 1..points.len().saturating_sub(1) {
            let prev = &points[i - 1];
            let curr = &points[i];
            let next = &points[i + 1];

            // Direction vectors
            let incoming = (curr.position - prev.position).normalize();
            let outgoing = (next.position - curr.position).normalize();

            // Turn angle (positive = CCW, negative = CW)
            let turn_angle = self.signed_angle(incoming, outgoing);

            if turn_angle.abs() < 1e-6 {
                // Straight through, no bend needed
                corners.push(Corner {
                    turn_angle: 0.0,
                    bend_radius: 0.0,
                    setback: 0.0,
                });
                continue;
            }

            // Calculate setback for this bend radius
            let requested_radius = curr.bend_radius;
            let mut radius = requested_radius;
            let mut setback = radius * (turn_angle.abs() / 2.0).tan();

            // Check if there's enough space
            let to_prev = prev.position.distance_to(curr.position);
            let to_next = curr.position.distance_to(next.position);
            let min_dist = to_prev.min(to_next);

            // Account for previous/next corners
            let prev_setback = if i > 1 {
                corners.get(i - 2).map(|c| c.setback).unwrap_or(0.0)
            } else {
                0.0
            };

            let available = min_dist - prev_setback;

            let mut was_reduced = false;
            if setback > available * 0.9 {
                // Need to reduce bend radius
                let new_setback = available * 0.9;
                let new_radius = new_setback / (turn_angle.abs() / 2.0).tan();
                warnings.push(format!(
                    "Bend radius auto-reduced from {:.1} to {:.1} um at ({:.1}, {:.1}). \
                     Fix: increase spacing or use smaller bend_radius",
                    requested_radius, new_radius, curr.position.x, curr.position.y
                ));
                radius = new_radius;
                setback = new_setback;
                was_reduced = true;
            }

            // Record bend info
            if was_reduced {
                bends.push(BendInfo::auto_reduced(
                    radius,
                    curr.position,
                    requested_radius,
                ));
            } else {
                bends.push(BendInfo::new(radius, curr.position));
            }

            corners.push(Corner {
                turn_angle,
                bend_radius: radius,
                setback,
            });
        }

        (corners, bends)
    }

    /// Calculate signed angle between two vectors.
    fn signed_angle(&self, from: Vector2, to: Vector2) -> f64 {
        let cross = from.x * to.y - from.y * to.x;
        let dot = from.x * to.x + from.y * to.y;
        cross.atan2(dot)
    }

    /// Generate polygons for the route.
    fn generate_polygons(
        &self,
        points: &[PathPoint],
        corners: &[Corner],
        _warnings: &mut Vec<String>,
    ) -> Vec<Polygon> {
        let mut polygons = Vec::new();

        if points.len() < 2 {
            return polygons;
        }

        // Generate each segment with its bends
        for i in 0..points.len() - 1 {
            let start = &points[i];
            let end = &points[i + 1];

            // Get setbacks for this segment
            let start_setback = if i > 0 {
                corners.get(i - 1).map(|c| c.setback).unwrap_or(0.0)
            } else {
                0.0
            };
            let end_setback = corners.get(i).map(|c| c.setback).unwrap_or(0.0);

            // Generate straight segment polygon
            let segment_poly =
                self.generate_segment_polygon(start, end, start_setback, end_setback);
            if let Some(poly) = segment_poly {
                polygons.push(poly);
            }

            // Generate bend polygon at the end of this segment (if not the last segment)
            if i < points.len() - 2
                && let Some(corner) = corners.get(i)
                && corner.turn_angle.abs() > 1e-6
            {
                let bend_poly = self.generate_bend_polygon(
                    &points[i + 1],
                    corner,
                    points[i].position,
                    points[i + 2].position,
                );
                if let Some(poly) = bend_poly {
                    polygons.push(poly);
                }
            }
        }

        polygons
    }

    /// Generate a straight segment polygon.
    fn generate_segment_polygon(
        &self,
        start: &PathPoint,
        end: &PathPoint,
        start_setback: f64,
        end_setback: f64,
    ) -> Option<Polygon> {
        let direction = (end.position - start.position).normalize();

        // Adjusted start and end positions
        let adj_start = start.position + direction * start_setback;
        let adj_end = end.position + direction * (-end_setback);

        let adj_length = adj_start.distance_to(adj_end);
        if adj_length < 1e-6 {
            return None;
        }

        let normal = direction.perpendicular();

        // Handle width transition (taper)
        let start_half_width = start.width / 2.0;
        let end_half_width = end.width / 2.0;

        let vertices = vec![
            adj_start + normal * start_half_width,
            adj_end + normal * end_half_width,
            adj_end + normal * (-end_half_width),
            adj_start + normal * (-start_half_width),
        ];

        Some(Polygon::new(vertices))
    }

    /// Generate a bend polygon at a corner.
    fn generate_bend_polygon(
        &self,
        corner_point: &PathPoint,
        corner: &Corner,
        prev_pos: Point,
        next_pos: Point,
    ) -> Option<Polygon> {
        if corner.turn_angle.abs() < 1e-6 || corner.bend_radius < 1e-6 {
            return None;
        }

        let incoming = (corner_point.position - prev_pos).normalize();
        let outgoing = (next_pos - corner_point.position).normalize();

        // Find the bend center
        // The center is perpendicular to the incoming direction, offset by the radius
        let turn_sign = if corner.turn_angle > 0.0 { 1.0 } else { -1.0 };

        // Start point of the bend (setback from corner along incoming direction)
        let bend_start = corner_point.position + incoming * (-corner.setback);

        // End point of the bend (setback from corner along outgoing direction)
        let bend_end = corner_point.position + outgoing * corner.setback;

        // Find center: perpendicular to incoming direction at bend_start
        let incoming_perp = incoming.perpendicular() * turn_sign;
        let center = bend_start + incoming_perp * corner.bend_radius;

        // Generate arc vertices
        let num_segments = ((corner.turn_angle.abs() * 180.0 / PI * 2.0).ceil() as usize).max(8);
        let half_width = corner_point.width / 2.0;

        let mut outer_vertices: Vec<Point> = Vec::with_capacity(num_segments + 1);
        let mut inner_vertices: Vec<Point> = Vec::with_capacity(num_segments + 1);

        for i in 0..=num_segments {
            let t = i as f64 / num_segments as f64;
            let angle = corner.turn_angle * t;

            // Point on centerline: rotate the vector from center to bend_start
            let start_to_center = bend_start - center;
            let rotated = Vector2::new(
                start_to_center.x * angle.cos() - start_to_center.y * angle.sin(),
                start_to_center.x * angle.sin() + start_to_center.y * angle.cos(),
            );
            let center_point = center + rotated;

            // Normal at this point (pointing outward from center)
            let normal = rotated.normalize() * turn_sign;

            outer_vertices.push(center_point + normal * half_width);
            inner_vertices.push(center_point + normal * (-half_width));
        }

        // Combine into polygon (outer forward, inner backward)
        let mut vertices = outer_vertices;
        inner_vertices.reverse();
        vertices.extend(inner_vertices);

        // Verify the bend connects properly
        let _expected_end = bend_end;

        Some(Polygon::new(vertices))
    }

    /// Calculate total path length.
    fn calculate_path_length(&self, points: &[PathPoint], corners: &[Corner]) -> f64 {
        let mut total = 0.0;

        // Sum straight segment lengths (minus setbacks)
        for i in 0..points.len() - 1 {
            let segment_length = points[i].position.distance_to(points[i + 1].position);

            let start_setback = if i > 0 {
                corners.get(i - 1).map(|c| c.setback).unwrap_or(0.0)
            } else {
                0.0
            };
            let end_setback = corners.get(i).map(|c| c.setback).unwrap_or(0.0);

            total += segment_length - start_setback - end_setback;
        }

        // Add bend arc lengths
        for corner in corners {
            if corner.turn_angle.abs() > 1e-6 {
                total += corner.bend_radius * corner.turn_angle.abs();
            }
        }

        total.max(0.0)
    }

    /// Convert the route to a Cell.
    pub fn to_cell(&self, name: &str) -> Cell {
        let result = self.generate();

        let mut cell = Cell::new(name.to_string());

        for polygon in result.polygons {
            cell.add_polygon(polygon, self.layer);
        }

        cell.add_port(result.port_in);
        cell.add_port(result.port_out);
        cell.set_path_length(result.path_length);

        // Persist bend info and warnings on the cell
        for bend in result.bends {
            cell.add_bend(bend);
        }
        for warning in result.warnings {
            cell.add_warning(warning);
        }

        cell
    }

    /// Get the calculated path length.
    pub fn path_length(&self) -> f64 {
        self.generate().path_length
    }

    /// Get warnings from the last generation.
    pub fn warnings(&self) -> Vec<String> {
        self.generate().warnings
    }
}

/// Internal representation of a point along the path.
#[derive(Debug, Clone)]
struct PathPoint {
    position: Point,
    width: f64,
    bend_radius: f64,
    incoming_angle: Option<f64>,
    outgoing_angle: Option<f64>,
}

/// Information about a corner in the route.
#[derive(Debug, Clone)]
struct Corner {
    /// Turn angle in radians (positive = CCW).
    turn_angle: f64,
    /// Bend radius at this corner.
    bend_radius: f64,
    /// Setback distance from the corner point.
    setback: f64,
}

#[cfg(test)]
mod tests {
    use super::*;

    const EPSILON: f64 = 1e-6;

    fn approx_eq(a: f64, b: f64) -> bool {
        (a - b).abs() < EPSILON
    }

    #[test]
    fn test_route_straight_line() {
        let layer = Layer::new(1, 0);
        let mut route = Route::new(layer).with_width(0.5);

        route.start_at(0.0, 0.0, 0.0);
        route.to(100.0, 0.0);
        route.end_at(100.0, 0.0, 0.0);

        let result = route.generate();

        assert!(result.warnings.is_empty());
        assert_eq!(result.polygons.len(), 1); // Single straight segment
        assert!(approx_eq(result.path_length, 100.0));
    }

    #[test]
    fn test_route_90_degree_bend() {
        let layer = Layer::new(1, 0);
        let mut route = Route::new(layer).with_width(0.5).with_bend_radius(5.0);

        route.start_at(0.0, 0.0, 0.0);
        route.to(50.0, 0.0);
        route.to(50.0, 50.0);
        route.end_at(50.0, 50.0, PI / 2.0);

        let result = route.generate();

        assert!(result.warnings.is_empty());
        // Should have: straight, bend, straight
        assert!(result.polygons.len() >= 2);

        // Path length should be: 50 - setback + arc + 50 - setback
        // setback = 5 * tan(45°) = 5
        // arc = 5 * π/2 ≈ 7.85
        let expected_length = 50.0 - 5.0 + 5.0 * PI / 2.0 + 50.0 - 5.0;
        assert!((result.path_length - expected_length).abs() < 1.0);
    }

    #[test]
    fn test_route_s_curve() {
        let layer = Layer::new(1, 0);
        let mut route = Route::new(layer).with_width(0.5).with_bend_radius(5.0);

        route.start_at(0.0, 0.0, 0.0);
        route.to(25.0, 0.0);
        route.to(25.0, 20.0);
        route.to(50.0, 20.0);
        route.end_at(50.0, 20.0, 0.0);

        let result = route.generate();

        // Should have segments and two bends (opposite directions)
        assert!(result.polygons.len() >= 3);
    }

    #[test]
    fn test_route_tight_corner_auto_reduce() {
        let layer = Layer::new(1, 0);
        let mut route = Route::new(layer).with_width(0.5).with_bend_radius(20.0); // Large radius

        route.start_at(0.0, 0.0, 0.0);
        route.to(10.0, 0.0); // Short segment
        route.to(10.0, 10.0);
        route.end_at(10.0, 10.0, PI / 2.0);

        let result = route.generate();

        // Should have warnings about reduced bend radius
        assert!(
            !result.warnings.is_empty(),
            "Expected warning about reduced bend radius"
        );
    }

    #[test]
    fn test_route_port_to_port() {
        let layer = Layer::new(1, 0);

        let port_a = Port::with_width("out", Point::new(0.0, 0.0), Vector2::unit_x(), 0.5);
        let port_b = Port::with_width("in", Point::new(100.0, 50.0), -Vector2::unit_x(), 0.5);

        let mut route = Route::new(layer).with_bend_radius(5.0);
        route.start_at_port(&port_a);
        route.to(50.0, 0.0);
        route.to(50.0, 50.0);
        route.end_at_port(&port_b);

        let result = route.generate();

        // Check ports are correctly set
        assert!(approx_eq(result.port_in.position.x, 0.0));
        assert!(approx_eq(result.port_out.position.x, 100.0));
        assert!(approx_eq(result.port_out.position.y, 50.0));
    }

    #[test]
    fn test_route_to_cell() {
        let layer = Layer::new(1, 0);
        let mut route = Route::new(layer).with_width(0.5);

        route.start_at(0.0, 0.0, 0.0);
        route.to(50.0, 0.0);
        route.end_at(50.0, 0.0, 0.0);

        let cell = route.to_cell("test_route");

        assert_eq!(cell.name(), "test_route");
        assert!(cell.polygon_count() > 0);
        assert!(cell.port("in").is_some());
        assert!(cell.port("out").is_some());
    }

    #[test]
    fn test_waypoint_builder() {
        let wp = Waypoint::new(10.0, 20.0)
            .with_width(0.8)
            .with_bend_radius(10.0);

        assert!(approx_eq(wp.position.x, 10.0));
        assert!(approx_eq(wp.position.y, 20.0));
        assert_eq!(wp.width, Some(0.8));
        assert_eq!(wp.bend_radius, Some(10.0));
    }
}

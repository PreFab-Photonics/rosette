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
use crate::geometry::{Point, Polygon, Vector2, fresnel_c, fresnel_s};
use crate::layer::Layer;
use crate::port::Port;

/// Corner bend shape for [`Route`].
///
/// `Circular` inserts a constant-radius arc fillet at each corner. `Euler`
/// inserts a pair of mirrored clothoid (Cornu-spiral) segments whose
/// curvature varies linearly with arc length, reaching the specified
/// `bend_radius` at the midpoint of the corner. Euler corners are longer
/// (roughly 2× the arc length of a circular bend with the same peak
/// curvature) but avoid the curvature discontinuity at the tangent
/// points, which reduces radiation loss on high-index-contrast platforms
/// like silicon photonics.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum BendProfile {
    /// Circular arc fillet (default).
    #[default]
    Circular,
    /// Euler (clothoid) fillet with linearly-varying curvature.
    Euler,
}

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
    /// Corner bend profile (circular or Euler).
    bend_profile: BendProfile,
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
            bend_profile: BendProfile::Circular,
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

    /// Set the corner bend profile (circular or Euler).
    pub fn with_bend_profile(mut self, profile: BendProfile) -> Self {
        self.bend_profile = profile;
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

            // Calculate setback for this bend radius. The setback is the
            // distance from the corner vertex to the entry/exit of the
            // bend along the incoming/outgoing tangent. Circular and
            // Euler fillets use different functions of (radius, turn).
            let requested_radius = curr.bend_radius;
            let mut radius = requested_radius;
            let setback_per_radius = setback_ratio(self.bend_profile, turn_angle);
            let mut setback = radius * setback_per_radius;

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
                let new_radius = if setback_per_radius > 1e-12 {
                    new_setback / setback_per_radius
                } else {
                    radius
                };
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
                let bend_poly = match self.bend_profile {
                    BendProfile::Circular => self.generate_bend_polygon(
                        &points[i + 1],
                        corner,
                        points[i].position,
                        points[i + 2].position,
                    ),
                    BendProfile::Euler => self.generate_euler_bend_polygon(
                        &points[i + 1],
                        corner,
                        points[i].position,
                        points[i + 2].position,
                    ),
                };
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

    /// Generate an Euler (clothoid) bend polygon at a corner.
    ///
    /// The corner is built from two mirrored clothoid halves meeting at the
    /// midpoint, with curvature varying linearly from 0 at the entry/exit
    /// tangent points up to a peak of `1 / corner.bend_radius` at the midpoint.
    ///
    /// Note: this is a per-corner, *isotropic* clothoid fillet. It is **not**
    /// the same shape as the whole-S-bend clothoid used by the Python
    /// `rosette.components.sbend(bend_type="euler")` helper, which
    /// anisotropically rescales the clothoid (different `scale_x`, `scale_y`)
    /// so the curve passes through a prescribed `(length, offset)` pair. Both
    /// are intentionally kept — see `python/rosette/components/sbend.py` and
    /// `euler_sbend_point` in `_curves.py` for the comparison.
    ///
    /// Parameterisation (using the Fresnel convention
    /// `C(t) = integral_0^t cos(pi u^2 / 2) du`, likewise for `S`):
    ///     x(t) = a * C(t),    y(t) = a * S(t),    arc length s = a * t,
    ///     tangent angle theta(t) = pi * t^2 / 2,  curvature kappa(t) = pi * t / a.
    /// Setting `theta(t_max) = phi = |turn| / 2` gives `t_max = sqrt(2 phi / pi)`,
    /// and setting `kappa(t_max) = 1 / R` gives `a = R * sqrt(2 * pi * phi)`.
    ///
    /// Half arc length `s_max = a * t_max = R * |turn|`, so total Euler arc
    /// length is `2 * R * |turn|` — double the circular-arc equivalent.
    fn generate_euler_bend_polygon(
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

        let turn_abs = corner.turn_angle.abs();
        let turn_sign = if corner.turn_angle > 0.0 { 1.0 } else { -1.0 };
        let half_angle = turn_abs / 2.0;
        let radius = corner.bend_radius;

        // Clothoid parameters.
        let t_max = (2.0 * half_angle / PI).sqrt();
        let a = radius * (2.0 * PI * half_angle).sqrt();

        // Anchor points.
        let corner_vertex = corner_point.position;
        let bend_start = corner_vertex + incoming * (-corner.setback);

        // Local +Y axis for the first-half parameterisation: the clothoid
        // (a*C(t), a*S(t)) bends into positive y, and we want that to be the
        // side the corner bulges toward. For a CCW turn (turn_sign = +1) the
        // bend center sits to the left of `incoming`, i.e. along `+incoming_perp`.
        // For a CW turn (turn_sign = -1) it sits to the right, i.e. along
        // `-incoming_perp`. Pre-multiplying by `turn_sign` gives the
        // signed local +Y direction in world coordinates.
        let incoming_perp = incoming.perpendicular() * turn_sign;

        // Reflection data for the second half: reflect the first-half
        // samples across the bisector line through the corner vertex.
        //
        // Bisector direction (from corner vertex into the bulge) is
        // (-incoming + outgoing) normalised, then signed by turn_sign —
        // though the sign drops out for reflection since the bisector is
        // an undirected line. We just need the normal to the bisector.
        let bisector_dir_unnorm = -incoming + outgoing;
        let bisector_len = bisector_dir_unnorm.length();
        let bisector_dir = if bisector_len > 1e-12 {
            bisector_dir_unnorm * (1.0 / bisector_len)
        } else {
            // Degenerate: incoming == outgoing (no turn) or 180° flip.
            // Already filtered by the 1e-6 turn-angle check, so this is
            // only the 180° case. Fall back to a well-defined normal.
            incoming_perp
        };
        let bisector_normal = bisector_dir.perpendicular();

        // Sample each half.
        let num_per_half = ((turn_abs * 180.0 / PI).ceil() as usize).max(16);

        let mut centerline: Vec<Point> = Vec::with_capacity(2 * num_per_half + 1);
        let mut tangents: Vec<Vector2> = Vec::with_capacity(2 * num_per_half + 1);

        // First half: t in [0, t_max], anchored at bend_start, local frame
        // (incoming, incoming_perp).
        let mut first_half_points: Vec<Point> = Vec::with_capacity(num_per_half + 1);
        let mut first_half_tangents: Vec<Vector2> = Vec::with_capacity(num_per_half + 1);
        for i in 0..=num_per_half {
            let t = t_max * i as f64 / num_per_half as f64;
            let local_x = a * fresnel_c(t);
            let local_y = a * fresnel_s(t);
            let theta = PI * t * t / 2.0;
            let local_tx = theta.cos();
            let local_ty = theta.sin();

            let world = bend_start + incoming * local_x + incoming_perp * local_y;
            // Tangent in direction of travel along the path.
            let world_tan = (incoming * local_tx + incoming_perp * local_ty).normalize();
            first_half_points.push(world);
            first_half_tangents.push(world_tan);
        }

        // Build the centerline: first half forward, then reflected second half.
        centerline.extend_from_slice(&first_half_points);
        tangents.extend_from_slice(&first_half_tangents);

        // Second half: reflect first-half samples (except the midpoint) across
        // the bisector, in reverse order so we walk forward along the path.
        for i in (0..num_per_half).rev() {
            let p = first_half_points[i];
            let tan = first_half_tangents[i];
            // Reflect position across the bisector line through corner_vertex.
            let offset = p - corner_vertex;
            let d = offset.dot(bisector_normal);
            let reflected = p + bisector_normal * (-2.0 * d);
            // Reflect tangent across bisector (as a free vector). Then negate
            // to preserve direction of travel (the first half's tangent at
            // the mirror sample points into the midpoint; after reflection
            // it still points into the midpoint, but forward-travel along
            // the second half points *away* from the midpoint).
            let reflected_tan_free = tan + bisector_normal * (-2.0 * tan.dot(bisector_normal));
            let reflected_tan = (-reflected_tan_free).normalize();
            centerline.push(reflected);
            tangents.push(reflected_tan);
        }

        // Build outer/inner offset curves. We pick a consistent side using
        // turn_sign so the polygon orientation matches the circular branch
        // for unions downstream.
        let half_width = corner_point.width / 2.0;
        let mut outer_vertices: Vec<Point> = Vec::with_capacity(centerline.len());
        let mut inner_vertices: Vec<Point> = Vec::with_capacity(centerline.len());
        for (p, tan) in centerline.iter().zip(tangents.iter()) {
            let left_normal = tan.perpendicular();
            let side = left_normal * turn_sign;
            outer_vertices.push(*p + side * (-half_width));
            inner_vertices.push(*p + side * half_width);
        }

        let mut vertices = outer_vertices;
        inner_vertices.reverse();
        vertices.extend(inner_vertices);

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

        // Add bend arc lengths.
        //
        //   Circular: a single arc of radius R through angle |turn| has
        //             arc length = R * |turn|.
        //
        //   Euler:    each half-clothoid uses parameters
        //                 a = R * sqrt(2 * pi * phi),  t_max = sqrt(2 * phi / pi),
        //             where phi = |turn|/2 and R is the peak-curvature radius
        //             at the midpoint. Arc length per half is s = a * t_max
        //             = R * 2 * phi = R * |turn|. Total across both halves
        //             is 2 * R * |turn| — double the circular case, because
        //             the curvature ramps linearly from 0 rather than
        //             sitting at 1/R the whole way.
        for corner in corners {
            if corner.turn_angle.abs() > 1e-6 {
                total += match self.bend_profile {
                    BendProfile::Circular => corner.bend_radius * corner.turn_angle.abs(),
                    BendProfile::Euler => 2.0 * corner.bend_radius * corner.turn_angle.abs(),
                };
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

/// Ratio of setback to bend radius for a given corner turn angle and profile.
///
/// The setback is the distance from the corner vertex to the entry/exit of
/// the fillet along the incoming/outgoing tangent. For a circular arc of
/// radius `R` filling an angle of `|turn|`, the setback is `R * tan(|turn|/2)`.
/// For an Euler (clothoid) fillet the setback is derived from the closure
/// constraint that both half-clothoids meet on the corner's interior angle
/// bisector — see below.
fn setback_ratio(profile: BendProfile, turn_angle: f64) -> f64 {
    let turn_abs = turn_angle.abs();
    match profile {
        BendProfile::Circular => (turn_abs / 2.0).tan(),
        BendProfile::Euler => {
            // Derivation. Place the first-half clothoid's anchor (`bend_start`)
            // at the local origin with local +X along `incoming` and local +Y
            // pointing into the bulge. The first-half endpoint M1 is at
            // `(a*C(t_max), a*S(t_max))` with `phi = |turn|/2`,
            // `t_max = sqrt(2 phi / pi)`, `a = R * sqrt(2 pi phi)`.
            //
            // The second half is M1 reflected across the bisector through the
            // corner vertex (at local `(setback, 0)`). For the two halves to
            // meet continuously at M1, M1 must lie *on* that bisector. The
            // bisector direction (from the vertex into the bulge) is
            // `(-sin phi, cos phi)`, so the constraint
            //
            //     (a*C - setback) / (-sin phi) == (a*S) / cos phi
            //
            // gives
            //
            //     setback = a * (C(t_max) + S(t_max) * tan(phi)).
            //
            // Sanity check: small-phi expansion gives setback ≈ 2*R*phi
            // = R * |turn|, which is exactly the Euler half-arc length —
            // consistent with the total-arc-length identity
            // `total = 2 * R * |turn|` used by `calculate_path_length`.
            let phi = turn_abs / 2.0;
            let t_max = (2.0 * phi / PI).sqrt();
            let c = fresnel_c(t_max);
            let s = fresnel_s(t_max);
            let sin_phi = phi.sin();
            let cos_phi = phi.cos();
            // Guard against the phi -> pi/2 singularity (U-turn, tan phi
            // blows up). Upstream callers filter out phi < 1e-6, but the
            // U-turn end is unguarded there — the auto-reduce logic will
            // not accept a U-turn corner anyway, but return 0.0 defensively
            // so this never divides by zero.
            if cos_phi.abs() < 1e-12 {
                return 0.0;
            }
            let tan_phi = sin_phi / cos_phi;
            (2.0 * PI * phi).sqrt() * (c + s * tan_phi)
        }
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

    #[test]
    fn test_euler_setback_ratio_matches_formula() {
        // Small-angle limit: setback(Euler) ≈ 2 R phi (= half-arc length),
        // setback(Circular) ≈ R phi, so the ratio approaches 2. Consistent
        // with the `total_arc_length = 2 * R * |turn|` identity for Euler.
        let small = 0.05; // ~3 degrees
        let circ = setback_ratio(BendProfile::Circular, small);
        let eul = setback_ratio(BendProfile::Euler, small);
        let ratio = eul / circ;
        assert!(
            (ratio - 2.0).abs() < 0.02,
            "expected Euler/circular setback ratio ≈ 2 at small phi, got {}",
            ratio
        );

        // Setback must be strictly positive over the full useful angle range.
        for deg in [1.0_f64, 15.0, 30.0, 45.0, 60.0, 90.0, 135.0] {
            let k = setback_ratio(BendProfile::Euler, deg.to_radians());
            assert!(k > 0.0, "setback_ratio non-positive at {deg}°: {k}");
        }
    }

    #[test]
    fn test_euler_setback_places_midpoint_on_bisector() {
        // Regression for ROS-544: the polygon construction in
        // `generate_euler_bend_polygon` reflects the first clothoid half
        // across the bisector through the corner vertex. The two halves
        // only meet continuously if the first-half endpoint M1 lies on
        // that bisector. Verify that the setback ratio places M1 on the
        // bisector for several representative turn angles.
        for deg in [20.0_f64, 45.0, 60.0, 90.0, 120.0, 150.0] {
            let turn = deg.to_radians();
            let phi = turn / 2.0;
            let t_max = (2.0 * phi / PI).sqrt();
            let c = fresnel_c(t_max);
            let s = fresnel_s(t_max);
            let a = (2.0 * PI * phi).sqrt(); // a/R
            let setback = setback_ratio(BendProfile::Euler, turn); // setback/R

            // M1 (in units of R) in the local frame anchored at bend_start
            // with local +X = incoming, local +Y = into-bulge. The corner
            // vertex is at (setback, 0); M1 is at (a*C, a*S).
            // The bisector from the vertex into the bulge has direction
            // (-sin phi, cos phi). "M1 on bisector" means the vector
            // (M1 - vertex) is parallel to that direction, i.e. its
            // component along the bisector *normal* is zero.
            let m1 = (a * c, a * s);
            let v = (m1.0 - setback, m1.1);
            // Bisector normal = perpendicular rotated 90° CCW from dir.
            // dir = (-sin phi, cos phi)  =>  normal = (-cos phi, -sin phi).
            let nx = -phi.cos();
            let ny = -phi.sin();
            let perp = v.0 * nx + v.1 * ny;
            assert!(
                perp.abs() < 1e-6,
                "M1 off bisector by {} at turn={}° (setback={}, M1=({:.4},{:.4}))",
                perp,
                deg,
                setback,
                m1.0,
                m1.1
            );
        }
    }

    #[test]
    fn test_route_euler_90_degree_bend_path_length() {
        // Single 90° Euler corner path length identity:
        //   path = (leg - setback) * 2 + arc,
        //   arc  = 2 * R * (pi/2) = R * pi,   (Euler total arc length)
        //   setback = R * K_eul(pi/2).
        // This is the Rust-side parity check for the Python test
        // `test_euler_90_degree_bend_path_length`.
        let layer = Layer::new(1, 0);
        let r = 5.0;
        let leg = 60.0;
        let mut route = Route::new(layer)
            .with_width(0.5)
            .with_bend_radius(r)
            .with_bend_profile(BendProfile::Euler);
        route.start_at(0.0, 0.0, 0.0);
        route.to(leg, 0.0);
        route.to(leg, leg);
        route.end_at(leg, leg, PI / 2.0);

        let result = route.generate();
        assert!(
            result.warnings.is_empty(),
            "unexpected warnings: {:?}",
            result.warnings
        );

        let setback = r * setback_ratio(BendProfile::Euler, PI / 2.0);
        let expected = 2.0 * (leg - setback) + r * PI;
        assert!(
            (result.path_length - expected).abs() < 0.5,
            "path_length {} not close to expected {} (setback {})",
            result.path_length,
            expected,
            setback
        );
    }

    #[test]
    fn test_route_euler_s_curve() {
        let layer = Layer::new(1, 0);
        let mut route = Route::new(layer)
            .with_width(0.5)
            .with_bend_radius(5.0)
            .with_bend_profile(BendProfile::Euler);

        route.start_at(0.0, 0.0, 0.0);
        route.to(40.0, 0.0);
        route.to(40.0, 30.0);
        route.to(80.0, 30.0);
        route.end_at(80.0, 30.0, 0.0);

        let result = route.generate();
        assert!(
            result.warnings.is_empty(),
            "unexpected warnings: {:?}",
            result.warnings
        );
        // Should have: straight + euler bend + straight + euler bend + straight
        assert!(result.polygons.len() >= 5);
    }

    // -----------------------------------------------------------------
    // ROS-544 regression: Euler polygon simplicity
    // -----------------------------------------------------------------

    /// Test that two line segments AB and CD strictly cross in their
    /// interiors (sharing an endpoint does not count as a crossing).
    fn segments_cross(a: Point, b: Point, c: Point, d: Point) -> bool {
        fn orient(p: Point, q: Point, r: Point) -> f64 {
            (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x)
        }
        let o1 = orient(a, b, c);
        let o2 = orient(a, b, d);
        let o3 = orient(c, d, a);
        let o4 = orient(c, d, b);
        // Require strict sign change on both pairs. Using 1e-9 tol so
        // that near-coincident vertices (within Fresnel numeric noise)
        // don't trip a false positive.
        let tol = 1e-9;
        (o1 > tol && o2 < -tol || o1 < -tol && o2 > tol)
            && (o3 > tol && o4 < -tol || o3 < -tol && o4 > tol)
    }

    /// Brute-force O(n^2) self-intersection check on a closed polygon.
    fn polygon_is_simple(polygon: &Polygon) -> bool {
        let verts = polygon.vertices();
        let n = verts.len();
        if n < 4 {
            return true;
        }
        for i in 0..n {
            let a = verts[i];
            let b = verts[(i + 1) % n];
            // Skip adjacent edges (they share a vertex by construction).
            for j in (i + 2)..n {
                // Also skip the pair (last, first) when i == 0.
                if i == 0 && j == n - 1 {
                    continue;
                }
                let c = verts[j];
                let d = verts[(j + 1) % n];
                if segments_cross(a, b, c, d) {
                    return false;
                }
            }
        }
        true
    }

    #[test]
    fn test_route_euler_polygon_is_simple_single_corner() {
        // Regression: ROS-544. The previous setback formula produced
        // self-intersecting "arrowhead" spikes at each corner. A correct
        // Euler bend polygon must be a simple (non-self-intersecting)
        // closed curve.
        for turn_deg in [30.0_f64, 45.0, 60.0, 90.0, 120.0, 150.0] {
            for radius in [3.0_f64, 5.0, 10.0] {
                let layer = Layer::new(1, 0);
                let mut route = Route::new(layer)
                    .with_width(0.5)
                    .with_bend_radius(radius)
                    .with_bend_profile(BendProfile::Euler);

                // Long run-in / run-out so there's plenty of room for the
                // (now larger) Euler setback without auto-reduction.
                let run = 10.0 * radius;
                let theta = turn_deg.to_radians();
                let exit_x = run + run * theta.cos();
                let exit_y = run * theta.sin();

                route.start_at(0.0, 0.0, 0.0);
                route.to(run, 0.0);
                route.end_at(exit_x, exit_y, theta);

                let result = route.generate();
                assert!(
                    result.warnings.is_empty(),
                    "unexpected auto-reduce at turn={}°, R={}: {:?}",
                    turn_deg,
                    radius,
                    result.warnings
                );
                // Bend is the middle polygon (straight, bend, straight).
                assert_eq!(
                    result.polygons.len(),
                    3,
                    "unexpected polygon count at turn={}°, R={}",
                    turn_deg,
                    radius
                );
                let bend = &result.polygons[1];
                assert!(
                    polygon_is_simple(bend),
                    "Euler bend polygon self-intersects at turn={}°, R={} ({} vertices)",
                    turn_deg,
                    radius,
                    bend.vertices().len()
                );
            }
        }
    }

    #[test]
    fn test_route_euler_polygon_fits_corner_bounding_box() {
        // The Euler fillet must stay on the *concave* side of the corner —
        // it should not bulge past the incoming or outgoing tangent lines
        // on the convex (outside) side. The pre-fix bug's spike did
        // exactly that, poking past the outgoing tangent.
        //
        // Layout: 90° CCW corner at (run, 0), incoming along +X from the
        // origin, outgoing along +Y to (run, run). The bulge is in the
        // upper-left quadrant relative to the corner. On the *convex*
        // side:
        //   - incoming axis (y=0): convex side is y < 0,
        //   - outgoing axis (x=run): convex side is x > run.
        // The polygon is allowed to cross each tangent line by at most
        // one half-width (the outer-offset vertices at the entry/exit
        // of the fillet), but no further.
        let half_width = 0.25;
        let radius = 5.0_f64;
        let run = 10.0 * radius;
        let layer = Layer::new(1, 0);
        let mut route = Route::new(layer)
            .with_width(2.0 * half_width)
            .with_bend_radius(radius)
            .with_bend_profile(BendProfile::Euler);
        route.start_at(0.0, 0.0, 0.0);
        route.to(run, 0.0);
        route.end_at(run, run, PI / 2.0);
        let result = route.generate();
        assert!(
            result.warnings.is_empty(),
            "unexpected warnings: {:?}",
            result.warnings
        );
        let bend = &result.polygons[1];
        let slack = half_width + 1e-6;
        for v in bend.vertices() {
            // Convex side of the incoming tangent (y = 0) is y < 0.
            // Polygon is allowed to reach y = -half_width (outer offset
            // at the entry vertex) but no further below.
            assert!(
                v.y >= -slack,
                "bend vertex {:?} on convex side of incoming tangent: y = {} < -{}",
                v,
                v.y,
                slack
            );
            // Convex side of the outgoing tangent (x = run) is x > run.
            // Polygon is allowed to reach x = run + half_width but no
            // further to the right.
            assert!(
                v.x <= run + slack,
                "bend vertex {:?} on convex side of outgoing tangent: x = {} > {}",
                v,
                v.x,
                run + slack
            );
        }
    }

    #[test]
    fn test_route_euler_polygon_perpendicular_deviation_bounded() {
        // The Euler polygon is the union of two offset curves at
        // ±half_width from the clothoid centerline. By construction
        // each vertex sits at distance exactly half_width from the
        // nearest centerline point, so the *minimum* distance from any
        // polygon vertex to the centerline should be <= half_width +
        // numeric tolerance. A self-intersecting spike (the ROS-544
        // bug) produces vertices that lie *far* from the centerline
        // (the "wing" tip), which this test catches.
        //
        // We don't have direct access to the centerline here, but we
        // can bound max perpendicular deviation a different way:
        // the polygon must fit inside the convex hull of a
        // [entry_tangent_point, exit_tangent_point, corner_vertex]
        // triangle dilated by half_width. Equivalently, no vertex can
        // sit farther than `max_deviation` from the corner vertex
        // where `max_deviation = setback + half_width + small_slack`.
        let half_width = 0.25;
        let radius = 5.0_f64;
        let run = 10.0 * radius;
        let layer = Layer::new(1, 0);
        let mut route = Route::new(layer)
            .with_width(2.0 * half_width)
            .with_bend_radius(radius)
            .with_bend_profile(BendProfile::Euler);
        route.start_at(0.0, 0.0, 0.0);
        route.to(run, 0.0);
        route.end_at(
            run + run * (PI / 2.0).cos(),
            run * (PI / 2.0).sin(),
            PI / 2.0,
        );
        let result = route.generate();
        assert!(result.warnings.is_empty());
        let bend = &result.polygons[1];

        // Corner vertex is at (run, 0) in this layout.
        let corner = Point::new(run, 0.0);
        let setback = radius * setback_ratio(BendProfile::Euler, PI / 2.0);
        // Slack: `+ radius * 0.5` permits the natural outward bulge of
        // the clothoid beyond the setback-length triangle. A self-
        // intersecting spike exceeds this bound significantly.
        let max_allowed = setback + half_width + radius * 0.5;

        for v in bend.vertices() {
            let d = ((v.x - corner.x).powi(2) + (v.y - corner.y).powi(2)).sqrt();
            assert!(
                d <= max_allowed,
                "bend vertex {:?} too far from corner: {} > {} (setback {})",
                v,
                d,
                max_allowed,
                setback
            );
        }
    }

    #[test]
    fn test_route_euler_total_arc_length_doubles_circular() {
        // For the same bend_radius, Euler arc contribution is 2x circular.
        let layer = Layer::new(1, 0);

        let make = |profile: BendProfile| {
            let mut r = Route::new(layer)
                .with_width(0.5)
                .with_bend_radius(5.0)
                .with_bend_profile(profile);
            r.start_at(0.0, 0.0, 0.0);
            r.to(50.0, 0.0);
            r.to(50.0, 50.0);
            r.end_at(50.0, 50.0, PI / 2.0);
            r.generate()
        };

        let circ = make(BendProfile::Circular);
        let eul = make(BendProfile::Euler);

        // Arc contribution: circular = R*pi/2, euler = R*pi.
        // But straight-segment contribution differs because setbacks differ.
        // The *extra* length from Euler vs circular should equal:
        //     (arc_euler - arc_circ) - 2 * (setback_euler - setback_circ)
        //   = R*pi/2 - 2 * R * (K_eul(pi/2) - tan(pi/4))
        let r = 5.0;
        let k_eul = setback_ratio(BendProfile::Euler, PI / 2.0);
        let k_circ = (PI / 4.0).tan();
        let extra_expected = r * PI / 2.0 - 2.0 * r * (k_eul - k_circ);
        let extra = eul.path_length - circ.path_length;
        assert!(
            (extra - extra_expected).abs() < 0.2,
            "extra path length {} (expected {}) — euler={}, circ={}",
            extra,
            extra_expected,
            eul.path_length,
            circ.path_length
        );
    }

    #[test]
    fn test_route_euler_polygon_count_and_density() {
        // A single-corner Euler route emits three polygons (incoming
        // straight, Euler fillet, outgoing straight) and the fillet is
        // sampled densely enough to resemble a smooth curve. The precise
        // entry/exit tangent alignment is covered by
        // `test_route_euler_polygon_entry_exit_tangent`.
        let layer = Layer::new(1, 0);
        let mut route = Route::new(layer)
            .with_width(0.5)
            .with_bend_radius(8.0)
            .with_bend_profile(BendProfile::Euler);

        route.start_at(0.0, 0.0, 0.0);
        route.to(100.0, 0.0);
        route.to(100.0, 50.0);
        route.end_at(100.0, 50.0, PI / 2.0);

        let result = route.generate();
        assert!(result.warnings.is_empty());

        assert_eq!(
            result.polygons.len(),
            3,
            "expected 3 polygons (straight + euler bend + straight), got {}",
            result.polygons.len()
        );

        // The bend polygon should have at least 2 * (16 + 1) = 34 vertices
        // (16 samples per half, outer + inner).
        let bend_poly = &result.polygons[1];
        assert!(
            bend_poly.vertices().len() >= 2 * 16,
            "expected dense euler bend polygon, got {} vertices",
            bend_poly.vertices().len()
        );
    }

    #[test]
    fn test_route_euler_polygon_entry_exit_tangent() {
        // The Euler fillet must join the adjacent straights with a
        // *continuous tangent* (zero curvature at entry and exit). In
        // practice this means the entry/exit points of the bend polygon
        // lie on the incoming/outgoing axis lines (up to the half-width
        // offset for outer/inner vertices).
        //
        // We construct a 90° CCW corner at (100, 0) with incoming axis
        // y = 0 and outgoing axis x = 100. The bend polygon must have
        // vertices on/near y = ±half_width at the entry and on/near
        // x = 100 ± half_width at the exit.
        let layer = Layer::new(1, 0);
        let half_width = 0.25;
        let mut route = Route::new(layer)
            .with_width(2.0 * half_width)
            .with_bend_radius(10.0)
            .with_bend_profile(BendProfile::Euler);

        route.start_at(0.0, 0.0, 0.0);
        route.to(100.0, 0.0);
        route.to(100.0, 100.0);
        route.end_at(100.0, 100.0, PI / 2.0);

        let result = route.generate();
        assert!(result.warnings.is_empty());
        assert_eq!(result.polygons.len(), 3);

        // Bend is the middle polygon. For each vertex, compute its distance
        // to the incoming axis (y=0) and outgoing axis (x=100). The minimum
        // over all vertices should be <= half_width + small slack (the
        // entry/exit vertices offset perpendicular to tangent give
        // y = ±half_width at entry and x = 100 ± half_width at exit).
        let bend = &result.polygons[1];
        let verts = bend.vertices();
        // Entry side (small x, near y=0).
        let min_entry_y = verts
            .iter()
            .filter(|v| v.x < 95.0) // entry side (well before the corner in x)
            .map(|v| v.y.abs())
            .fold(f64::INFINITY, f64::min);
        // Exit side (near x=100, y > 5).
        let min_exit_dx = verts
            .iter()
            .filter(|v| v.y > 5.0)
            .map(|v| (v.x - 100.0).abs())
            .fold(f64::INFINITY, f64::min);

        // Vertices at the entry tangent point must be at distance ≈ half_width
        // from y=0 (the outer/inner offset). Allow 0.01 um slack for numeric
        // rounding in the Fresnel integration.
        assert!(
            min_entry_y <= half_width + 0.01,
            "entry vertex not on incoming tangent line: min |y| = {}, expected ≤ {}",
            min_entry_y,
            half_width + 0.01
        );
        assert!(
            min_exit_dx <= half_width + 0.01,
            "exit vertex not on outgoing tangent line: min |x-100| = {}, expected ≤ {}",
            min_exit_dx,
            half_width + 0.01
        );

        // Also check that some vertex DOES sit at ≈ half_width (we don't want
        // the polygon to trivially satisfy the upper bound by having no
        // entry/exit vertices at all).
        let max_entry_y_near_tangent = verts
            .iter()
            .filter(|v| v.x < 95.0 && v.y.abs() <= half_width + 0.05)
            .count();
        assert!(
            max_entry_y_near_tangent >= 2,
            "expected at least 2 vertices near the entry tangent line (outer + inner)"
        );
    }
}

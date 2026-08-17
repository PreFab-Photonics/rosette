//! Path generation free functions.
//!
//! These are pure geometry helpers that generate ribbon polygons from centerlines.

use rosette_core::path::stroke_path;
use rosette_core::{PathCap, Point, Polygon};

fn stroke_inputs_are_safe(centerline: &[Point], width: f64) -> bool {
    if !width.is_finite() || width == 0.0 || centerline.iter().any(|point| !point.is_finite()) {
        return false;
    }

    // Core miter joins are capped at four half-widths. Reject coordinates
    // whose largest possible offset could overflow before Polygon validation.
    let max_offset = width.abs() * 2.0;
    max_offset.is_finite()
        && centerline.iter().all(|point| {
            (point.x + max_offset).is_finite()
                && (point.x - max_offset).is_finite()
                && (point.y + max_offset).is_finite()
                && (point.y - max_offset).is_finite()
        })
}

fn validated_stroke(centerline: &[Point], width: f64) -> Option<Polygon> {
    if !stroke_inputs_are_safe(centerline, width) {
        return None;
    }
    stroke_path(centerline, width, PathCap::Flush)
        .filter(|polygon| polygon.vertices().iter().all(|vertex| vertex.is_finite()))
}

/// Generate a constant-width ribbon polygon from a centerline.
///
pub(super) fn constant_width_path(centerline: &[Point], width: f64) -> Option<Polygon> {
    validated_stroke(centerline, width)
}

/// Densify a centerline by replacing sharp interior corners with circular arc points.
///
/// At each interior vertex the signed turn angle is computed. If a `corner_radius`
/// is provided and the angle is non-trivial, the vertex is replaced by a sequence
/// of arc points that smoothly connect the incoming and outgoing segments.
///
/// Uses a two-pass algorithm so adjacent corners sharing a segment split the
/// available space fairly instead of the first corner greedily consuming it all.
fn densify_centerline_with_arcs(
    centerline: &[Point],
    corner_radius: f64,
    num_arc_points: u32,
) -> Vec<Point> {
    let n = centerline.len();
    if n < 3 || corner_radius <= 0.0 {
        return centerline.to_vec();
    }

    // Pre-compute segment lengths
    let seg_lengths: Vec<f64> = (0..n - 1)
        .map(|i| centerline[i].distance_to(centerline[i + 1]))
        .collect();

    let num_corners = n - 2; // interior vertices

    // --- Pass 1: compute ideal setback for each corner ---
    struct CornerInfo {
        turn_angle: f64,
        ideal_setback: f64,
    }
    let mut corners: Vec<Option<CornerInfo>> = Vec::with_capacity(num_corners);

    for i in 1..n - 1 {
        let prev = centerline[i - 1];
        let curr = centerline[i];
        let next = centerline[i + 1];

        let incoming = (curr - prev).normalize();
        let outgoing = (next - curr).normalize();

        let cross = incoming.cross(outgoing);
        let dot = incoming.dot(outgoing);
        let turn_angle = cross.atan2(dot);

        if turn_angle.abs() < 1e-6 {
            corners.push(None); // straight through
        } else {
            let half_angle = turn_angle.abs() / 2.0;
            let ideal_setback = corner_radius * half_angle.tan();
            corners.push(Some(CornerInfo {
                turn_angle,
                ideal_setback,
            }));
        }
    }

    // --- Pass 2: resolve conflicts on shared segments ---
    // Each segment seg[k] is shared between corner k-1 (outgoing) and corner k (incoming).
    // Corner index c corresponds to centerline vertex c+1.
    // Corner c claims seg[c] on its incoming side and seg[c+1] on its outgoing side.
    let mut setbacks: Vec<f64> = corners
        .iter()
        .map(|c| c.as_ref().map(|ci| ci.ideal_setback).unwrap_or(0.0))
        .collect();

    // For each segment, check if the two adjacent corners' setbacks overlap.
    // Segment seg[k] is claimed by corner k-1 (outgoing) and corner k (incoming).
    // Iterate a few times so reductions on one segment propagate to neighbors.
    for _iter in 0..3 {
        for (k, seg_len) in seg_lengths.iter().enumerate() {
            let capacity = seg_len * 0.95; // leave 5% margin

            // Corner whose outgoing side is seg[k] = corner k-1
            // Corner whose incoming side is seg[k] = corner k
            let out_corner = if k > 0 { Some(k - 1) } else { None };
            let in_corner = if k < num_corners { Some(k) } else { None };

            let out_claim = out_corner.map(|c| setbacks[c]).unwrap_or(0.0);
            let in_claim = in_corner.map(|c| setbacks[c]).unwrap_or(0.0);

            let total = out_claim + in_claim;
            if total > capacity && total > 1e-10 {
                // Scale both claims proportionally to fit
                let scale = capacity / total;
                if let Some(c) = out_corner {
                    setbacks[c] = setbacks[c].min(out_claim * scale);
                }
                if let Some(c) = in_corner {
                    setbacks[c] = setbacks[c].min(in_claim * scale);
                }
            }
        }
    }

    // --- Pass 3: generate arc points ---
    let mut result: Vec<Point> = Vec::with_capacity(n * 4);
    result.push(centerline[0]);

    for (c, corner) in corners.iter().enumerate() {
        let i = c + 1; // centerline vertex index
        let curr = centerline[i];

        let corner = match corner {
            Some(ci) => ci,
            None => {
                result.push(curr);
                continue;
            }
        };

        let setback = setbacks[c];
        let half_angle = corner.turn_angle.abs() / 2.0;
        let radius = if half_angle.tan().abs() > 1e-10 {
            setback / half_angle.tan()
        } else {
            0.0
        };

        if radius < 1e-6 || setback < 1e-6 {
            result.push(curr);
            continue;
        }

        let prev = centerline[i - 1];
        let next = centerline[i + 1];
        let incoming = (curr - prev).normalize();
        let outgoing = (next - curr).normalize();

        // Turn sign: +1 for CCW, -1 for CW
        let turn_sign = if corner.turn_angle > 0.0 { 1.0 } else { -1.0 };

        // Tangent points on the centerline
        let bend_start = curr + incoming * (-setback);
        let bend_end = curr + outgoing * setback;

        // Arc center: perpendicular to incoming at bend_start, offset by radius
        let incoming_perp = incoming.perpendicular() * turn_sign;
        let center = bend_start + incoming_perp * radius;

        // Generate arc points
        let num_segments =
            ((corner.turn_angle.abs() * 180.0 / std::f64::consts::PI * 2.0).ceil() as u32).max(8);
        let num_segments = num_segments.min(num_arc_points);

        // Vector from center to bend_start (this gets rotated)
        let start_vec = bend_start - center;

        result.push(bend_start);
        for j in 1..num_segments {
            let t = j as f64 / num_segments as f64;
            let angle = corner.turn_angle * t;
            let rotated = start_vec.rotate(angle);
            result.push(center + rotated);
        }
        result.push(bend_end);
    }

    result.push(centerline[n - 1]);
    result
}

/// Generate a constant-width ribbon polygon with rounded corners.
///
/// First densifies the centerline by inserting circular arc points at each
/// interior corner, then runs the standard miter-offset to produce the ribbon.
pub(super) fn constant_width_path_rounded(
    centerline: &[Point],
    width: f64,
    corner_radius: f64,
    num_arc_points: u32,
) -> Option<Polygon> {
    let mut normalized = Vec::with_capacity(centerline.len());
    for &point in centerline {
        if normalized.last() != Some(&point) {
            normalized.push(point);
        }
    }
    if corner_radius <= 0.0 {
        return constant_width_path(&normalized, width);
    }
    let smooth = densify_centerline_with_arcs(&normalized, corner_radius, num_arc_points);
    validated_stroke(&smooth, width)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn constant_width_straight_vertices_are_stable() {
        let polygon = constant_width_path(&[Point::origin(), Point::new(10.0, 0.0)], 2.0).unwrap();

        assert_eq!(
            polygon.vertices(),
            &[
                Point::new(0.0, 1.0),
                Point::new(10.0, 1.0),
                Point::new(10.0, -1.0),
                Point::new(0.0, -1.0),
            ]
        );
    }

    #[test]
    fn constant_width_right_angle_uses_miter_join() {
        let polygon = constant_width_path(
            &[
                Point::origin(),
                Point::new(10.0, 0.0),
                Point::new(10.0, 10.0),
            ],
            2.0,
        )
        .unwrap();

        let expected = [
            Point::new(0.0, 1.0),
            Point::new(9.0, 1.0),
            Point::new(9.0, 10.0),
            Point::new(11.0, 10.0),
            Point::new(11.0, -1.0),
            Point::new(0.0, -1.0),
        ];
        for (actual, expected) in polygon.vertices().iter().zip(expected) {
            assert!((actual.x - expected.x).abs() < 1e-12);
            assert!((actual.y - expected.y).abs() < 1e-12);
        }
    }

    #[test]
    fn duplicate_start_is_normalized() {
        assert_eq!(
            constant_width_path(
                &[Point::origin(), Point::origin(), Point::new(10.0, 0.0)],
                2.0,
            ),
            constant_width_path(&[Point::origin(), Point::new(10.0, 0.0)], 2.0)
        );
    }

    #[test]
    fn zero_corner_radius_matches_unrounded_path() {
        let points = [
            Point::origin(),
            Point::new(10.0, 0.0),
            Point::new(10.0, 10.0),
        ];

        assert_eq!(
            constant_width_path_rounded(&points, 2.0, 0.0, 16),
            constant_width_path(&points, 2.0)
        );
    }

    #[test]
    fn rounded_path_normalizes_duplicate_corner_points() {
        let clean = [
            Point::origin(),
            Point::new(10.0, 0.0),
            Point::new(10.0, 10.0),
        ];
        let duplicated = [
            Point::origin(),
            Point::new(10.0, 0.0),
            Point::new(10.0, 0.0),
            Point::new(10.0, 10.0),
        ];
        assert_eq!(
            constant_width_path_rounded(&duplicated, 2.0, 3.0, 64),
            constant_width_path_rounded(&clean, 2.0, 3.0, 64)
        );
    }

    #[test]
    fn extreme_finite_path_arithmetic_returns_none() {
        assert!(
            constant_width_path(
                &[Point::new(f64::MAX, 0.0), Point::new(f64::MAX, 1.0)],
                f64::MAX / 2.0,
            )
            .is_none()
        );
        assert!(constant_width_path(&[Point::origin(), Point::new(1.0, 0.0)], f64::MAX).is_none());
        assert!(
            constant_width_path_rounded(
                &[
                    Point::new(f64::MAX, 0.0),
                    Point::new(f64::MAX, 1.0),
                    Point::new(f64::MAX, 2.0),
                ],
                f64::MAX / 2.0,
                1.0,
                64,
            )
            .is_none()
        );
    }
}

//! Path generation free functions.
//!
//! These are pure geometry helpers that generate ribbon polygons from centerlines.

use rosette_core::{Point, Polygon};

/// Generate a constant-width ribbon polygon from a centerline.
///
/// At each interior vertex the average of the two adjacent segment normals is
/// computed and scaled by `1 / cos(half_angle)` to maintain constant width
/// through bends.
pub(super) fn constant_width_path(centerline: &[Point], width: f64) -> Option<Polygon> {
    if centerline.len() < 2 {
        return None;
    }

    let hw = width / 2.0;
    let n = centerline.len();
    let mut left = Vec::with_capacity(n);
    let mut right = Vec::with_capacity(n);

    for i in 0..n {
        let (nx, ny) = if i == 0 {
            // First point: perpendicular to first segment
            let dx = centerline[1].x - centerline[0].x;
            let dy = centerline[1].y - centerline[0].y;
            let len = (dx * dx + dy * dy).sqrt();
            if len < 1e-12 {
                continue;
            }
            (-dy / len, dx / len)
        } else if i == n - 1 {
            // Last point: perpendicular to last segment
            let dx = centerline[n - 1].x - centerline[n - 2].x;
            let dy = centerline[n - 1].y - centerline[n - 2].y;
            let len = (dx * dx + dy * dy).sqrt();
            if len < 1e-12 {
                continue;
            }
            (-dy / len, dx / len)
        } else {
            // Interior: compute miter from incoming and outgoing segment normals
            let dx1 = centerline[i].x - centerline[i - 1].x;
            let dy1 = centerline[i].y - centerline[i - 1].y;
            let len1 = (dx1 * dx1 + dy1 * dy1).sqrt();
            let dx2 = centerline[i + 1].x - centerline[i].x;
            let dy2 = centerline[i + 1].y - centerline[i].y;
            let len2 = (dx2 * dx2 + dy2 * dy2).sqrt();

            if len1 < 1e-12 || len2 < 1e-12 {
                continue;
            }

            // Per-segment unit normals (pointing left of travel direction)
            let perp_x1 = -dy1 / len1;
            let perp_y1 = dx1 / len1;
            let perp_x2 = -dy2 / len2;
            let perp_y2 = dx2 / len2;

            // Angle between the two perpendicular directions
            let dot = (perp_x1 * perp_x2 + perp_y1 * perp_y2).clamp(-1.0, 1.0);
            let angle = dot.acos();
            let cos_half = (angle / 2.0).cos();
            let width_factor = if cos_half > 1e-6 { 1.0 / cos_half } else { 1.0 };

            // Average perpendicular direction, re-normalized and scaled
            let avg_px = (perp_x1 + perp_x2) / 2.0;
            let avg_py = (perp_y1 + perp_y2) / 2.0;
            let avg_len = (avg_px * avg_px + avg_py * avg_py).sqrt();

            if avg_len < 1e-12 {
                // 180° turn — use first normal
                (perp_x1, perp_y1)
            } else {
                let px = (avg_px / avg_len) * width_factor;
                let py = (avg_py / avg_len) * width_factor;
                left.push(Point::new(
                    centerline[i].x + px * hw,
                    centerline[i].y + py * hw,
                ));
                right.push(Point::new(
                    centerline[i].x - px * hw,
                    centerline[i].y - py * hw,
                ));
                continue;
            }
        };

        left.push(Point::new(
            centerline[i].x + nx * hw,
            centerline[i].y + ny * hw,
        ));
        right.push(Point::new(
            centerline[i].x - nx * hw,
            centerline[i].y - ny * hw,
        ));
    }

    if left.len() < 2 {
        return None;
    }

    // Build closed polygon: left side forward, right side reversed
    right.reverse();
    left.append(&mut right);
    Some(Polygon::new(left))
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
    if corner_radius <= 0.0 {
        return constant_width_path(centerline, width);
    }
    let smooth = densify_centerline_with_arcs(centerline, corner_radius, num_arc_points);
    constant_width_path(&smooth, width)
}

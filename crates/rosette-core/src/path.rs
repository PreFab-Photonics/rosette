//! Canonical conversion of layout paths into local-space polygons.

use std::f64::consts::PI;

use crate::{PathCap, Point, Polygon, Transform, Vector2};

const MITER_LIMIT: f64 = 4.0;
const ROUND_CAP_SEGMENTS: usize = 16;
const DIRECTION_EPSILON: f64 = 1e-12;

/// Convert a constant-width layout path into a polygon.
///
/// Consecutive duplicate points are removed. Joins use a miter bounded to
/// four half-widths, with a bevel fallback for sharper turns. End geometry is
/// controlled by [`PathCap`]; round caps use 16 segments per semicircle.
/// Exact reversals are rejected because they cannot be represented as one
/// simple ribbon polygon. Negative widths use their magnitude.
pub fn stroke_path(centerline: &[Point], width: f64, cap: PathCap) -> Option<Polygon> {
    if !width.is_finite()
        || width == 0.0
        || centerline
            .iter()
            .any(|point| !point.x.is_finite() || !point.y.is_finite())
    {
        return None;
    }
    let mut points = Vec::with_capacity(centerline.len());
    for &point in centerline {
        if points.last() != Some(&point) {
            points.push(point);
        }
    }
    if points.len() < 2 {
        return None;
    }

    let mut directions = Vec::with_capacity(points.len() - 1);
    for segment in points.windows(2) {
        let direction = segment[1] - segment[0];
        let length = direction.length();
        if !length.is_finite() || length <= DIRECTION_EPSILON {
            return None;
        }
        directions.push(direction * (1.0 / length));
    }
    if directions
        .windows(2)
        .any(|directions| directions[0].dot(directions[1]) <= -1.0 + DIRECTION_EPSILON)
    {
        return None;
    }
    let normals: Vec<_> = directions
        .iter()
        .map(|direction| direction.perpendicular())
        .collect();
    let half_width = width.abs() / 2.0;

    let extension = matches!(cap, PathCap::HalfWidthExtension)
        .then_some(half_width)
        .unwrap_or(0.0);
    let start_center = points[0] + (-directions[0]) * extension;
    let end_center = points[points.len() - 1] + directions[directions.len() - 1] * extension;

    let mut positive = Vec::with_capacity(points.len() + 2);
    let mut negative = Vec::with_capacity(points.len() + 2);
    positive.push(start_center + normals[0] * half_width);
    negative.push(start_center + (-normals[0]) * half_width);

    for index in 1..points.len() - 1 {
        append_join(
            &mut positive,
            points[index],
            normals[index - 1],
            normals[index],
            half_width,
        );
        append_join(
            &mut negative,
            points[index],
            -normals[index - 1],
            -normals[index],
            half_width,
        );
    }

    let end_normal = normals[normals.len() - 1];
    positive.push(end_center + end_normal * half_width);
    negative.push(end_center + (-end_normal) * half_width);

    let mut vertices = Vec::with_capacity(
        positive.len()
            + negative.len()
            + if matches!(cap, PathCap::Round) {
                2 * (ROUND_CAP_SEGMENTS - 1)
            } else {
                0
            },
    );
    vertices.extend(positive);

    if matches!(cap, PathCap::Round) {
        append_round_cap(&mut vertices, end_center, end_normal, half_width);
    }

    vertices.extend(negative.into_iter().rev());

    if matches!(cap, PathCap::Round) {
        append_round_cap(&mut vertices, start_center, -normals[0], half_width);
    }

    Polygon::new(vertices).ok()
}

/// Stroke a path with an accumulated hierarchy transform applied.
///
/// Normal widths are stroked locally before transforming the polygon, which
/// gives affine scale and reflection explicit geometric meaning. A negative
/// width denotes an absolute world-space width, so its centerline is
/// transformed first and then stroked using the width magnitude.
pub fn stroke_path_transformed(
    centerline: &[Point],
    width: f64,
    cap: PathCap,
    transform: &Transform,
) -> Option<Polygon> {
    stroke_path_transformed_with_scale(centerline, width, cap, transform, 1.0)
}

/// Stroke a transformed path while separately scaling absolute widths.
///
/// `absolute_width_scale` converts the path's stored coordinate unit into the
/// output unit. It does not include hierarchy magnification.
pub fn stroke_path_transformed_with_scale(
    centerline: &[Point],
    width: f64,
    cap: PathCap,
    transform: &Transform,
    absolute_width_scale: f64,
) -> Option<Polygon> {
    if width.is_sign_negative() {
        let transformed: Vec<_> = centerline
            .iter()
            .map(|point| transform.apply(*point))
            .collect();
        stroke_path(&transformed, width.abs() * absolute_width_scale.abs(), cap)
    } else {
        stroke_path(centerline, width, cap)
            .and_then(|polygon| polygon.try_transform(transform).ok())
    }
}

fn append_join(
    side: &mut Vec<Point>,
    point: Point,
    previous_normal: Vector2,
    next_normal: Vector2,
    half_width: f64,
) {
    let sum = previous_normal + next_normal;
    let miter = sum.normalize();
    let denominator = miter.dot(previous_normal).abs();

    if denominator > DIRECTION_EPSILON && 1.0 / denominator <= MITER_LIMIT {
        side.push(point + miter * (half_width / denominator));
    } else {
        side.push(point + previous_normal * half_width);
        side.push(point + next_normal * half_width);
    }
}

fn append_round_cap(vertices: &mut Vec<Point>, center: Point, start_normal: Vector2, radius: f64) {
    let start_angle = start_normal.angle();
    for index in 1..ROUND_CAP_SEGMENTS {
        let angle = start_angle - PI * index as f64 / ROUND_CAP_SEGMENTS as f64;
        vertices.push(center + Vector2::from_angle(angle) * radius);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn bounds(polygon: &Polygon) -> (f64, f64, f64, f64) {
        let bbox = polygon.bbox();
        (bbox.min().x, bbox.min().y, bbox.max().x, bbox.max().y)
    }

    #[test]
    fn caps_have_distinct_geometry() {
        let points = [Point::origin(), Point::new(10.0, 0.0)];
        let flush = stroke_path(&points, 2.0, PathCap::Flush).unwrap();
        let round = stroke_path(&points, 2.0, PathCap::Round).unwrap();
        let extended = stroke_path(&points, 2.0, PathCap::HalfWidthExtension).unwrap();

        assert_eq!(bounds(&flush), (0.0, -1.0, 10.0, 1.0));
        assert_eq!(bounds(&round), (-1.0, -1.0, 11.0, 1.0));
        assert_eq!(bounds(&extended), (-1.0, -1.0, 11.0, 1.0));
        assert_eq!(flush.vertices().len(), 4);
        assert_eq!(round.vertices().len(), 34);
        assert_eq!(extended.vertices().len(), 4);
    }

    #[test]
    fn right_angle_uses_true_miter() {
        let polygon = stroke_path(
            &[
                Point::origin(),
                Point::new(10.0, 0.0),
                Point::new(10.0, 10.0),
            ],
            2.0,
            PathCap::Flush,
        )
        .unwrap();
        assert!(polygon.vertices().contains(&Point::new(9.0, 1.0)));
        assert!(polygon.vertices().contains(&Point::new(11.0, -1.0)));
    }

    #[test]
    fn sharp_turn_is_beveled_and_duplicates_are_removed() {
        let polygon = stroke_path(
            &[
                Point::origin(),
                Point::origin(),
                Point::new(10.0, 0.0),
                Point::new(0.001, 0.001),
            ],
            2.0,
            PathCap::Flush,
        )
        .unwrap();
        assert!(polygon.vertices().iter().all(|point| point.x.abs() < 12.0));
        assert!(stroke_path(&[Point::origin(), Point::origin()], 2.0, PathCap::Flush).is_none());
    }

    #[test]
    fn invalid_inputs_and_exact_reversals_are_rejected() {
        assert!(
            stroke_path(
                &[Point::origin(), Point::new(1.0, 0.0)],
                0.0,
                PathCap::Flush
            )
            .is_none()
        );
        assert!(
            stroke_path(
                &[Point::origin(), Point::new(f64::MAX, 0.0)],
                f64::MAX,
                PathCap::HalfWidthExtension,
            )
            .is_none()
        );
        assert!(
            stroke_path(
                &[Point::new(f64::MAX, 0.0), Point::new(-f64::MAX, 0.0),],
                1.0,
                PathCap::Flush,
            )
            .is_none()
        );
        assert!(
            stroke_path(
                &[Point::origin(), Point::new(f64::NAN, 0.0)],
                1.0,
                PathCap::Flush
            )
            .is_none()
        );
        assert!(
            stroke_path(
                &[Point::origin(), Point::new(1.0, 0.0)],
                f64::INFINITY,
                PathCap::Flush
            )
            .is_none()
        );
        assert!(
            stroke_path(
                &[Point::origin(), Point::new(10.0, 0.0), Point::origin()],
                2.0,
                PathCap::Flush,
            )
            .is_none()
        );
    }

    #[test]
    fn negative_width_remains_absolute_under_transform() {
        let polygon = stroke_path_transformed(
            &[Point::origin(), Point::new(10.0, 0.0)],
            -2.0,
            PathCap::HalfWidthExtension,
            &Transform::scale(2.0, 3.0),
        )
        .unwrap();
        assert_eq!(bounds(&polygon), (-1.0, -1.0, 21.0, 1.0));
    }

    #[test]
    fn negative_width_applies_unit_scale_but_not_hierarchy_scale() {
        let polygon = stroke_path_transformed_with_scale(
            &[Point::origin(), Point::new(10.0, 0.0)],
            -2.0,
            PathCap::HalfWidthExtension,
            &Transform::scale(1000.0, -1000.0),
            1000.0,
        )
        .unwrap();
        assert_eq!(bounds(&polygon), (-1000.0, -1000.0, 11000.0, 1000.0));
    }

    #[test]
    fn transformed_stroke_rejects_affine_overflow() {
        assert!(
            stroke_path_transformed(
                &[Point::new(1.0, 0.0), Point::new(2.0, 0.0)],
                1.0,
                PathCap::Flush,
                &Transform::scale_uniform(f64::MAX),
            )
            .is_none()
        );
        assert!(
            stroke_path_transformed(
                &[Point::new(1.0, 0.0), Point::new(2.0, 0.0)],
                -1.0,
                PathCap::Flush,
                &Transform::scale_uniform(f64::MAX),
            )
            .is_none()
        );
    }
}

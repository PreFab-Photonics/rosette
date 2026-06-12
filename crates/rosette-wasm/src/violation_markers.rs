//! GPU-independent helpers for building DRC violation marker geometry.
//!
//! These are split out from `renderer` (which is `wasm32`-only because it
//! depends on wgpu/web-sys) so the marker-building logic can be unit-tested on
//! the host target.

use crate::shapes::ColoredSegment;

/// Error marker color (RGBA). Tuned to read against both light and dark themes.
pub const VIOLATION_ERROR_COLOR: [f32; 4] = [0.93, 0.16, 0.22, 0.95];
/// Warning marker color (RGBA).
pub const VIOLATION_WARN_COLOR: [f32; 4] = [0.96, 0.62, 0.04, 0.95];

/// World-units-per-micrometer scale applied to all geometry on import
/// (`UM_TO_NM * GRID_SIZE` = 1000 * 50). DRC violation bboxes arrive in µm, so
/// they must be scaled by this to land in the renderer's world space. The Y
/// axis is also negated (GDS/SDK use Y-up; the renderer uses Y-down screen
/// coordinates) — matching `WasmLibrary::from_library`.
const UM_TO_WORLD: f64 = 1000.0 * 50.0;

/// Parse the flat `[min_x, min_y, max_x, max_y, severity, ...]` array from JS
/// into `(bbox, is_error)` tuples. Trailing values that don't form a complete
/// 5-tuple are ignored. `severity >= 0.5` means error.
///
/// Input coordinates are in micrometers (top-cell global frame). They are
/// converted to renderer world coordinates: scaled by [`UM_TO_WORLD`] with the
/// Y axis negated. Because negating Y swaps the min/max Y ordering, the bbox is
/// re-normalized so `[min_x, min_y, max_x, max_y]` stays well-formed.
pub fn parse_violations(data: &[f32]) -> Vec<([f64; 4], bool)> {
    data.chunks_exact(5)
        .map(|c| {
            let x0 = c[0] as f64 * UM_TO_WORLD;
            let x1 = c[2] as f64 * UM_TO_WORLD;
            // Y is negated; recompute min/max after the flip.
            let y0 = -(c[1] as f64) * UM_TO_WORLD;
            let y1 = -(c[3] as f64) * UM_TO_WORLD;
            let bbox = [x0.min(x1), y0.min(y1), x0.max(x1), y0.max(y1)];
            (bbox, c[4] >= 0.5)
        })
        .collect()
}

/// Append the 4 world-coordinate colored edge segments of a bbox.
pub fn push_bbox_outline(segments: &mut Vec<ColoredSegment>, bbox: [f64; 4], color: [f32; 4]) {
    let [min_x, min_y, max_x, max_y] = bbox;
    let p = |x: f64, y: f64| [x as f32, y as f32];
    let corners = [
        (p(min_x, min_y), p(max_x, min_y)), // bottom
        (p(max_x, min_y), p(max_x, max_y)), // right
        (p(max_x, max_y), p(min_x, max_y)), // top
        (p(min_x, max_y), p(min_x, min_y)), // left
    ];
    for (p0, p1) in corners {
        segments.push(ColoredSegment { p0, p1, color });
    }
}

/// Build the colored outline segments for a set of violations. The selected
/// violation (if any) gets a second, slightly inset outline for emphasis so it
/// reads thicker/brighter (line width isn't directly settable on this pipeline).
///
/// Multiple violations frequently share the same bounding box — e.g. every
/// `allowed_angles` violation on one polygon reports that polygon's bbox. We
/// draw the base outline only once per unique (bbox, severity) so stacked
/// markers don't read as redundant double boxes, while the panel list still
/// shows every violation. The selected violation always gets its emphasis
/// outline so clicking any stacked row highlights the shared box.
pub fn build_violation_segments(
    violations: &[([f64; 4], bool)],
    selected: Option<usize>,
) -> Vec<ColoredSegment> {
    /// Quantize a coordinate to an integer key so near-identical bboxes
    /// (floating-point noise) dedupe together.
    fn key(bbox: [f64; 4], is_error: bool) -> (i64, i64, i64, i64, bool) {
        let q = |v: f64| (v * 16.0).round() as i64;
        (q(bbox[0]), q(bbox[1]), q(bbox[2]), q(bbox[3]), is_error)
    }

    let mut segments: Vec<ColoredSegment> = Vec::with_capacity(violations.len() * 4);
    let mut drawn: std::collections::HashSet<(i64, i64, i64, i64, bool)> =
        std::collections::HashSet::new();

    for (i, &(bbox, is_error)) in violations.iter().enumerate() {
        let color = if is_error {
            VIOLATION_ERROR_COLOR
        } else {
            VIOLATION_WARN_COLOR
        };
        // Draw the base outline once per unique (bbox, severity).
        if drawn.insert(key(bbox, is_error)) {
            push_bbox_outline(&mut segments, bbox, color);
        }
        if selected == Some(i) {
            let [min_x, min_y, max_x, max_y] = bbox;
            let inset_x = (max_x - min_x) * 0.04;
            let inset_y = (max_y - min_y) * 0.04;
            push_bbox_outline(
                &mut segments,
                [
                    min_x + inset_x,
                    min_y + inset_y,
                    max_x - inset_x,
                    max_y - inset_y,
                ],
                color,
            );
        }
    }
    segments
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse_violations_groups_into_5_tuples() {
        let data = vec![
            0.0, 0.0, 1.0, 2.0, 1.0, // error bbox (µm)
            5.0, 5.0, 6.0, 7.0, 0.0, // warning bbox (µm)
        ];
        let parsed = parse_violations(&data);
        assert_eq!(parsed.len(), 2);
        assert!(parsed[0].1); // error
        assert!(!parsed[1].1); // warning
    }

    #[test]
    fn parse_violations_scales_um_to_world_and_flips_y() {
        // 1 µm = 50000 world units; Y is negated then re-normalized to keep
        // min <= max.
        let data = vec![0.0, 0.0, 1.0, 2.0, 1.0];
        let parsed = parse_violations(&data);
        let s = 1000.0 * 50.0;
        // x: [0, 1] µm -> [0, 50000]; y: [0, 2] µm -> negated [-100000, 0] -> normalized.
        assert_eq!(parsed[0].0, [0.0, -2.0 * s, 1.0 * s, 0.0]);
    }

    #[test]
    fn parse_violations_ignores_trailing_partial_tuple() {
        let data = vec![0.0, 0.0, 1.0, 1.0, 1.0, 9.0, 9.0];
        let parsed = parse_violations(&data);
        assert_eq!(parsed.len(), 1);
    }

    #[test]
    fn build_segments_emits_four_per_violation() {
        let violations = vec![([0.0, 0.0, 1.0, 1.0], true), ([2.0, 2.0, 3.0, 3.0], false)];
        let segments = build_violation_segments(&violations, None);
        assert_eq!(segments.len(), 8); // 4 edges each
    }

    #[test]
    fn build_segments_colors_by_severity() {
        let violations = vec![([0.0, 0.0, 1.0, 1.0], true), ([2.0, 2.0, 3.0, 3.0], false)];
        let segments = build_violation_segments(&violations, None);
        // First violation is an error -> error color.
        assert_eq!(segments[0].color, VIOLATION_ERROR_COLOR);
        // Second violation (segments 4..8) is a warning -> warn color.
        assert_eq!(segments[4].color, VIOLATION_WARN_COLOR);
    }

    #[test]
    fn selected_violation_gets_extra_inset_outline() {
        let violations = vec![([0.0, 0.0, 1.0, 1.0], true), ([2.0, 2.0, 3.0, 3.0], false)];
        // No selection: 4 + 4 = 8 segments.
        assert_eq!(build_violation_segments(&violations, None).len(), 8);
        // Select index 1: that one gets a doubled outline -> 4 + 8 = 12.
        assert_eq!(build_violation_segments(&violations, Some(1)).len(), 12);
    }

    #[test]
    fn bbox_outline_is_closed_loop() {
        let mut segments = Vec::new();
        push_bbox_outline(&mut segments, [0.0, 0.0, 10.0, 4.0], VIOLATION_ERROR_COLOR);
        assert_eq!(segments.len(), 4);
        // Each segment's end should be the next segment's start (closed loop).
        for i in 0..4 {
            assert_eq!(segments[i].p1, segments[(i + 1) % 4].p0);
        }
    }

    #[test]
    fn duplicate_bboxes_draw_one_outline() {
        // Two violations on the same shape (e.g. two angle violations) share a
        // bbox; the canvas should draw a single box, not stacked duplicates.
        let violations = vec![([0.0, 0.0, 4.0, 3.0], true), ([0.0, 0.0, 4.0, 3.0], true)];
        let segments = build_violation_segments(&violations, None);
        assert_eq!(segments.len(), 4);
    }

    #[test]
    fn selecting_a_stacked_duplicate_still_emphasizes() {
        // Even when the base box is deduped, selecting either stacked violation
        // draws the emphasis inset (4 base + 4 inset = 8).
        let violations = vec![([0.0, 0.0, 4.0, 3.0], true), ([0.0, 0.0, 4.0, 3.0], true)];
        assert_eq!(build_violation_segments(&violations, Some(1)).len(), 8);
    }

    #[test]
    fn same_bbox_different_severity_not_deduped() {
        // A shared box on different layers/severities is meaningfully distinct.
        let violations = vec![([0.0, 0.0, 4.0, 3.0], true), ([0.0, 0.0, 4.0, 3.0], false)];
        assert_eq!(build_violation_segments(&violations, None).len(), 8);
    }
}

//! Criterion benchmarks for `rosette-drc`.
//!
//! Groups:
//! - `pairwise_spacing` — same-layer `min_spacing` at N ∈ {100, 1K, 10K}
//!   in three density regimes (separated / dense / very_dense).
//! - `pairwise_overlap` — `forbid_overlap` + `require_overlap` cross-layer,
//!   same N sweep.
//! - `pairwise_enclosure` — `enclosure` at N ∈ {100, 1K, 10K} with R-tree
//!   spatial indexing (ROS-496).
//! - `per_polygon` — `min_width` + `self_intersection` + `min_edge_length` on
//!   a single polygon with V ∈ {100, 1000} vertices.
//! - `self_intersection` — dedicated sweep-line check (ROS-549) across
//!   V ∈ {100, 1K, 10K}; isolates the scaling from the other per-polygon
//!   checks.
//! - `array_expansion` — AREF 10×10 / 30×30 / 100×100, full deck (baseline
//!   for ROS-511).
//! - `full_deck_realistic` — ~1K polygons, 3 layers, 2-level hierarchy,
//!   realistic rule deck. Single "overall throughput" number.
//!
//! See `benches/README.md` for how to interpret results and save baselines.

mod fixtures;

use std::time::Duration;

use criterion::{BenchmarkId, Criterion, Throughput, black_box, criterion_group, criterion_main};
use rosette_drc::{DrcRules, run_drc};

use fixtures::{L1, L2, L3};

// Sizes for the pairwise sweeps. 10_000 is intentionally slow — smaller sample
// sizes are applied where noted below so wall-time remains reasonable.
const PAIRWISE_SIZES: &[usize] = &[100, 1_000, 10_000];

// Vertices for the per-polygon sweep.
const VERTEX_COUNTS: &[usize] = &[100, 1_000];

// Vertices for the dedicated self-intersection sweep. Extended to 10K to
// cement the O(V^2) -> O(V log V) scaling win landed in ROS-549.
const SELF_INTERSECTION_VERTEX_COUNTS: &[usize] = &[100, 1_000, 10_000];

// AREF dimensions: (rows, cols, label). Stored as strings to avoid formatting
// in the hot path. MUST be listed in ascending size — Criterion's
// `sample_size` setting is sticky within a group, and the per-size
// `sample_size(10)` calls below only lower the count as N grows. Reordering
// this list (or adding a smaller entry after a larger one) would silently
// apply the reduced sample count to smaller cases.
const AREF_DIMS: &[(u16, u16, &str)] =
    &[(10, 10, "10x10"), (30, 30, "30x30"), (100, 100, "100x100")];

// Criterion defaults are 100 samples × 3 s warmup × 5 s measurement, which
// makes the full suite run for tens of minutes. For the scaling signal we
// need, 30 samples × 1 s warmup × 2 s measurement is plenty.
fn configure_group<M: criterion::measurement::Measurement>(
    group: &mut criterion::BenchmarkGroup<'_, M>,
) {
    group
        .warm_up_time(Duration::from_secs(1))
        .measurement_time(Duration::from_secs(2))
        .sample_size(30);
}

// Pitch used for well-separated pairwise grids: rect side (1.0) + generous
// margin. Ensures the bbox prefilter trivially skips every pair.
const SEPARATED_PITCH: f64 = 3.0;

// Pitch for dense grids where rects overlap their neighbors. Chosen so every
// rect overlaps its four cardinal neighbors but the R-tree query returns a
// small, bounded candidate set (~8 neighbors: 3x3 grid minus self).
const DENSE_PITCH: f64 = 0.6;

// Pitch for a genuinely dense grid. At 0.25 with unit rects expanded by a
// 0.1 spacing margin, the search envelope is ~[−0.1, 1.1] wide and reaches
// rects up to ~4 pitches away on each axis → ~9×9 − 1 = ~80 candidates per
// query. Stresses the slow path where the R-tree query itself returns many
// candidates and the inner loop (distance + dedup) dominates.
const VERY_DENSE_PITCH: f64 = 0.25;

// Pitch for paired-layer fixtures: outer is 3x3, so 5.0 keeps pairs apart.
const PAIRED_PITCH: f64 = 5.0;

// --- pairwise_spacing --------------------------------------------------------

fn bench_pairwise_spacing(c: &mut Criterion) {
    let mut group = c.benchmark_group("pairwise_spacing");
    configure_group(&mut group);
    let rules = DrcRules::new().min_spacing(L1, L1, 0.1, Some("M1.S"));

    for &n in PAIRWISE_SIZES {
        group.throughput(Throughput::Elements(n as u64));
        if n >= 10_000 {
            group.sample_size(10);
        }

        // Well-separated: fast bbox-prefilter path.
        let cell_fast = fixtures::build_flat_grid(n, SEPARATED_PITCH);
        group.bench_with_input(BenchmarkId::new("separated", n), &n, |b, _| {
            b.iter(|| run_drc(black_box(&cell_fast), black_box(&rules), None));
        });

        // Dense: overlapping rects, each R-tree query returns several candidates.
        let cell_dense = fixtures::build_flat_grid(n, DENSE_PITCH);
        group.bench_with_input(BenchmarkId::new("dense", n), &n, |b, _| {
            b.iter(|| run_drc(black_box(&cell_dense), black_box(&rules), None));
        });

        // Very dense: tight pitch so each R-tree query returns ~80 candidates
        // and the inner distance/dedup loop dominates. Exercises the regime
        // where R-tree prefiltering is no longer free.
        let cell_very_dense = fixtures::build_flat_grid(n, VERY_DENSE_PITCH);
        group.bench_with_input(BenchmarkId::new("very_dense", n), &n, |b, _| {
            b.iter(|| run_drc(black_box(&cell_very_dense), black_box(&rules), None));
        });
    }

    group.finish();
}

// --- pairwise_overlap --------------------------------------------------------

fn bench_pairwise_overlap(c: &mut Criterion) {
    let mut group = c.benchmark_group("pairwise_overlap");
    configure_group(&mut group);
    let forbid_rules = DrcRules::new().forbid_overlap(L1, L2, Some("L1_L2.NO_OVLP"));
    let require_rules = DrcRules::new().require_overlap(L1, L2, Some("L1_L2.REQ_OVLP"));

    for &n in PAIRWISE_SIZES {
        // Paired fixture emits 2 polygons per pair (inner + outer). Report
        // pair-count as throughput; total polygons = 2 * n.
        group.throughput(Throughput::Elements(n as u64));
        if n >= 10_000 {
            group.sample_size(10);
        }

        let cell = fixtures::build_paired_layers(n, PAIRED_PITCH);

        group.bench_with_input(BenchmarkId::new("forbid_overlap", n), &n, |b, _| {
            b.iter(|| run_drc(black_box(&cell), black_box(&forbid_rules), None));
        });

        group.bench_with_input(BenchmarkId::new("require_overlap", n), &n, |b, _| {
            b.iter(|| run_drc(black_box(&cell), black_box(&require_rules), None));
        });
    }

    group.finish();
}

// --- pairwise_enclosure ------------------------------------------------------

fn bench_pairwise_enclosure(c: &mut Criterion) {
    let mut group = c.benchmark_group("pairwise_enclosure");
    configure_group(&mut group);
    // inner = L1, outer = L2. Enclosure value comfortably satisfied by the 1x1
    // inner inside the 3x3 outer (margin 1.0 on each side).
    let rules = DrcRules::new().min_enclosure(L1, L2, 0.5, Some("L2_L1.ENC"));

    // Enclosure uses R-tree spatial indexing (ROS-496) — the full N sweep
    // (including 10K) runs in reasonable time. Pre-ROS-496 the 1K case was
    // already ~480 ms on an O(I×O) nested loop and 10K was impractical.
    for &n in PAIRWISE_SIZES {
        group.throughput(Throughput::Elements(n as u64));
        if n >= 10_000 {
            group.sample_size(10);
        } else if n >= 1_000 {
            group.sample_size(15);
        }

        let cell = fixtures::build_paired_layers(n, PAIRED_PITCH);

        group.bench_with_input(BenchmarkId::new("paired", n), &n, |b, _| {
            b.iter(|| run_drc(black_box(&cell), black_box(&rules), None));
        });
    }

    group.finish();
}

// --- per_polygon -------------------------------------------------------------

fn bench_per_polygon(c: &mut Criterion) {
    let mut group = c.benchmark_group("per_polygon");
    configure_group(&mut group);
    // Stack three per-polygon checks so each bench call exercises the common
    // Phase-1 path plus three distinct check implementations.
    let rules = DrcRules::new()
        .min_width(L1, 0.1, Some("M1.W"))
        .no_self_intersection(L1, Some("M1.SI"))
        .min_edge_length(L1, 0.01, Some("M1.EL"));

    for &v in VERTEX_COUNTS {
        group.throughput(Throughput::Elements(v as u64));
        // `min_width` and `min_edge_length` combined are roughly O(V^2) at
        // this scale (ray casting on high-vertex polygons). V=1K is ~45 ms
        // per iter, so reduce sample count to keep bench time reasonable.
        if v >= 1_000 {
            group.sample_size(10);
        }
        let cell = fixtures::build_high_vertex_polygon(v);
        group.bench_with_input(BenchmarkId::from_parameter(v), &v, |b, _| {
            b.iter(|| run_drc(black_box(&cell), black_box(&rules), None));
        });
    }

    group.finish();
}

// --- self_intersection -------------------------------------------------------

fn bench_self_intersection(c: &mut Criterion) {
    let mut group = c.benchmark_group("self_intersection");
    configure_group(&mut group);
    // Dedicated self-intersection-only bench across V ∈ {100, 1K, 10K} to
    // characterize the sweep-line scaling independently of the other
    // per-polygon checks (min_width is O(V^2) and would dominate at 10K).
    let rules = DrcRules::new().no_self_intersection(L1, Some("M1.SI"));

    for &v in SELF_INTERSECTION_VERTEX_COUNTS {
        group.throughput(Throughput::Elements(v as u64));
        if v >= 10_000 {
            group.sample_size(10);
        }
        let cell = fixtures::build_high_vertex_polygon(v);
        group.bench_with_input(BenchmarkId::from_parameter(v), &v, |b, _| {
            b.iter(|| run_drc(black_box(&cell), black_box(&rules), None));
        });
    }

    group.finish();
}

// --- array_expansion ---------------------------------------------------------

fn bench_array_expansion(c: &mut Criterion) {
    let mut group = c.benchmark_group("array_expansion");
    configure_group(&mut group);
    // Full deck: per-polygon + pairwise same-layer. Pitch (2.5) keeps child
    // bboxes (~2.5 wide due to the plus pattern — centers at ±1.0 plus 0.25
    // half-side) just touching edge-to-edge, so Phase-3 pair checks do real
    // work but the layout doesn't self-overlap.
    let rules = DrcRules::new()
        .min_width(L1, 0.1, Some("M1.W"))
        .min_spacing(L1, L1, 0.05, Some("M1.S"))
        .forbid_overlap(L1, L1, Some("M1.NO_OVLP"));

    let pitch = 2.5;
    for &(rows, cols, label) in AREF_DIMS {
        let copies = rows as u64 * cols as u64;
        group.throughput(Throughput::Elements(copies));
        // Larger AREFs get slower fast: flatten cost is N*M per bench call
        // (Phase 2 dedup helps, but Phase 3 still visits every copy group).
        if rows >= 100 {
            group.sample_size(10);
        } else if rows >= 30 {
            group.sample_size(15);
        }

        let (lib, top_name) = fixtures::build_aref(rows, cols, pitch);
        let top = lib.cell(&top_name).expect("top cell exists").clone();

        group.bench_with_input(BenchmarkId::from_parameter(label), &(rows, cols), |b, _| {
            b.iter(|| run_drc(black_box(&top), black_box(&rules), black_box(Some(&lib))));
        });
    }

    group.finish();
}

// --- full_deck_realistic -----------------------------------------------------

fn bench_full_deck_realistic(c: &mut Criterion) {
    let mut group = c.benchmark_group("full_deck_realistic");
    configure_group(&mut group);
    // Realistic-ish deck: width, area, spacing on L1, enclosure of L2 inside
    // L1 (partial — tiles don't strictly enclose, which is fine; we're timing
    // the engine, not checking a PDK), forbid overlap of L3 and L2, require
    // overlap of L2 and L1.
    let rules = DrcRules::new()
        .min_width(L1, 0.1, Some("M1.W"))
        .min_width(L3, 0.2, Some("M3.W"))
        .min_area(L1, 0.01, Some("M1.A"))
        .min_spacing(L1, L1, 0.05, Some("M1.S"))
        .min_spacing(L3, L3, 0.1, Some("M3.S"))
        .min_edge_length(L1, 0.01, Some("M1.EL"))
        .forbid_overlap(L2, L3, Some("L2_L3.NO_OVLP"))
        .require_overlap(L2, L1, Some("L2_L1.REQ_OVLP"));

    let (lib, top_name) = fixtures::build_realistic();
    let top = lib.cell(&top_name).expect("top cell exists").clone();

    // ~1K polygons reported as throughput so Criterion shows elems/s.
    group.throughput(Throughput::Elements(1000));
    group.bench_function("1k_polys_3layer_hier", |b| {
        b.iter(|| run_drc(black_box(&top), black_box(&rules), black_box(Some(&lib))));
    });

    group.finish();
}

criterion_group!(
    benches,
    bench_pairwise_spacing,
    bench_pairwise_overlap,
    bench_pairwise_enclosure,
    bench_per_polygon,
    bench_self_intersection,
    bench_array_expansion,
    bench_full_deck_realistic,
);
criterion_main!(benches);

//! Synthetic layout fixtures for DRC benchmarks.
//!
//! These builders are bench-local (not part of the public `rosette-drc` API)
//! and are tuned to exercise specific code paths in the DRC runner:
//!
//! - Flat-grid / paired-layer builders stress the R-tree pairwise checks.
//! - High-vertex builders stress the per-polygon checks (width, edge length,
//!   self-intersection).
//! - AREF builders stress `flatten_into_groups` and
//!   `expand_cellref_transforms` — the code paths ROS-511 targets.
//!
//! Where possible each builder returns a single `Cell` (so `run_drc(&cell, ...,
//! None)` works). Hierarchical fixtures return `(Library, top_cell_name)` so
//! the caller can resolve the top cell against the library.

#![allow(dead_code)] // benches use a subset depending on configuration

use rosette_core::{Cell, CellRef, Layer, Library, Point, Polygon};

pub const L1: Layer = Layer {
    number: 1,
    datatype: 0,
};
pub const L2: Layer = Layer {
    number: 2,
    datatype: 0,
};
pub const L3: Layer = Layer {
    number: 3,
    datatype: 0,
};

/// Build a flat cell with `n` unit rectangles arranged on a roughly-square
/// grid on layer 1.
///
/// `pitch` is the center-to-center spacing. With `pitch > 1.0` the rectangles
/// are well-separated (fast R-tree path — bbox prefilter trivially succeeds).
/// With `pitch < 1.0` they overlap (slow path — every pair must be checked).
///
/// Rect side length is fixed at 1.0 to keep bbox math simple.
pub fn build_flat_grid(n: usize, pitch: f64) -> Cell {
    let mut cell = Cell::new("flat_grid");
    let side = 1.0_f64;
    let cols = (n as f64).sqrt().ceil() as usize;
    for i in 0..n {
        let col = i % cols;
        let row = i / cols;
        let x = col as f64 * pitch;
        let y = row as f64 * pitch;
        cell.add_polygon(Polygon::rect(Point::new(x, y), side, side), L1);
    }
    cell
}

/// Build a flat cell with `n` (inner, outer) polygon pairs on layers 1 and 2
/// respectively.
///
/// Each pair consists of:
/// - an "inner" 1x1 square on layer 1
/// - an "outer" 3x3 square on layer 2, centered on the inner with `enclosure`
///   margin (default 1.0 → fully encloses the inner with room to spare).
///
/// Pairs are laid out on a grid with `pitch` center-to-center, well-separated
/// so cross-pair interactions are culled by bbox. `pitch` must be >= outer
/// side + slack to avoid cross-pair overlap.
///
/// Used for `require_overlap`, `forbid_overlap` (with pitch chosen so no cross
/// overlap exists), and `enclosure`.
pub fn build_paired_layers(n: usize, pitch: f64) -> Cell {
    let mut cell = Cell::new("paired");
    let inner_side = 1.0;
    let outer_side = 3.0;
    let cols = (n as f64).sqrt().ceil() as usize;
    for i in 0..n {
        let col = i % cols;
        let row = i / cols;
        let cx = col as f64 * pitch;
        let cy = row as f64 * pitch;
        // outer rect on layer 2, centered on (cx, cy)
        cell.add_polygon(
            Polygon::rect_centered(Point::new(cx, cy), outer_side, outer_side),
            L2,
        );
        // inner rect on layer 1, same center
        cell.add_polygon(
            Polygon::rect_centered(Point::new(cx, cy), inner_side, inner_side),
            L1,
        );
    }
    cell
}

/// Build a single cell containing one regular polygon with `vertices` sides on
/// layer 1. Used for per-polygon checks (width, self-intersection, edge length).
pub fn build_high_vertex_polygon(vertices: usize) -> Cell {
    let mut cell = Cell::new("high_vertex");
    cell.add_polygon(Polygon::regular(Point::origin(), 10.0, vertices), L1);
    cell
}

/// Build a library with a child cell containing 5 small rectangles, referenced
/// by a top cell that places them as an `rows × cols` AREF with `pitch`
/// center-to-center spacing.
///
/// The child is on layer 1. Returns `(library, top_cell_name)`. Use
/// `library.cell(&top_name).unwrap()` to get the top-level `&Cell`.
pub fn build_aref(rows: u16, cols: u16, pitch: f64) -> (Library, String) {
    let mut child = Cell::new("aref_unit");
    // Five small rects in a plus pattern — gives the child a non-trivial bbox
    // and enough geometry that per-cell dedup measurably matters.
    let s = 0.5;
    child.add_polygon(Polygon::rect_centered(Point::origin(), s, s), L1);
    child.add_polygon(Polygon::rect_centered(Point::new(-1.0, 0.0), s, s), L1);
    child.add_polygon(Polygon::rect_centered(Point::new(1.0, 0.0), s, s), L1);
    child.add_polygon(Polygon::rect_centered(Point::new(0.0, -1.0), s, s), L1);
    child.add_polygon(Polygon::rect_centered(Point::new(0.0, 1.0), s, s), L1);

    let mut top = Cell::new("aref_top");
    top.add_ref(CellRef::new("aref_unit").array(cols, rows, pitch, pitch));

    let mut lib = Library::new("aref_bench");
    lib.add_cell(child).unwrap();
    lib.add_cell(top).unwrap();
    (lib, "aref_top".to_string())
}

/// Build a "realistic" modest layout: ~1K polygons across 3 layers with a
/// two-level hierarchy. Used for the overall-throughput number.
///
/// Structure:
/// - Leaf cell `tile` with 4 polygons (layer 1 waveguide + layer 2 via marker +
///   layer 3 metal + layer 1 extra).
/// - Mid cell `row` with 10 `tile` references in a line (10 x 4 = 40
///   polygons per row).
/// - Top cell `bench_top` with 25 `row` references, for a total of
///   10 * 4 * 25 = 1000 polygons after flattening.
pub fn build_realistic() -> (Library, String) {
    let mut tile = Cell::new("tile");
    // Waveguide-ish rect on layer 1.
    tile.add_polygon(Polygon::rect(Point::origin(), 2.0, 0.5), L1);
    // Via marker on layer 2.
    tile.add_polygon(Polygon::rect(Point::new(0.8, 0.15), 0.4, 0.2), L2);
    // Metal patch on layer 3.
    tile.add_polygon(Polygon::rect(Point::new(0.5, -0.4), 1.0, 0.3), L3);
    // Extra shape on layer 1 (taper-ish). Offset by 0.1 from the waveguide
    // end so `min_spacing(L1, L1)` doesn't flag a touching-edge violation on
    // every tile — we want the realistic bench to time the non-violating
    // path, not the violation-collection path.
    tile.add_polygon(Polygon::rect(Point::new(2.1, 0.15), 0.5, 0.2), L1);

    let mut row = Cell::new("row");
    for i in 0..10 {
        row.add_ref(CellRef::new("tile").at(i as f64 * 3.0, 0.0));
    }

    let mut top = Cell::new("bench_top");
    for j in 0..25 {
        top.add_ref(CellRef::new("row").at(0.0, j as f64 * 2.0));
    }

    let mut lib = Library::new("bench_realistic");
    lib.add_cell(tile).unwrap();
    lib.add_cell(row).unwrap();
    lib.add_cell(top).unwrap();
    (lib, "bench_top".to_string())
}

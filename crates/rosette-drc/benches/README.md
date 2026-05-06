# `rosette-drc` benchmarks

Criterion-based performance harness for the DRC engine. These benches exist to
(a) establish a baseline before the planned perf work in ROS-496 and ROS-511,
and (b) detect regressions as the engine evolves.

## Baseline

The initial baseline (captured on an Apple M1 Pro) is posted as a comment on
[ROS-494](https://linear.app/prefabphotonics/issue/ROS-494/drc-performance-baseline-and-benchmarks).
Compare local runs against it via the baseline flags above. Raw criterion
estimates live under `target/criterion/` (gitignored — they're per-machine).

## Running

```bash
# Run everything. Takes ~3–5 min on a modern laptop.
cargo bench -p rosette-drc

# Run one group.
cargo bench -p rosette-drc -- pairwise_spacing

# Run one specific case.
cargo bench -p rosette-drc -- 'pairwise_spacing/separated/1000'
```

Reports land in `target/criterion/report/index.html` — open it in a browser
for plots, distributions, and regression detection across runs.

## Saving and comparing baselines

Criterion stores per-benchmark timings under `target/criterion/<group>/<id>/`.
The `--save-baseline` and `--baseline` flags let you checkpoint and diff:

```bash
# On main, before changes:
cargo bench -p rosette-drc -- --save-baseline main

# After your patch:
cargo bench -p rosette-drc -- --baseline main
```

The second invocation prints a per-bench `change` column (e.g. `-42.3%`) and
flags statistically significant shifts.

## The groups

| Group                | What it measures                                         | Why it exists                                    |
| -------------------- | -------------------------------------------------------- | ------------------------------------------------ |
| `pairwise_spacing`   | `min_spacing` at N ∈ {100, 1K, 10K}, separated + dense   | R-tree path health; scales as N log N            |
| `pairwise_overlap`   | `forbid_overlap` + `require_overlap` at same N sweep     | R-tree-backed overlap checks                     |
| `pairwise_enclosure` | `enclosure` at {100, 1K} (capped low; see below)         | **Baseline for ROS-496** (enclosure is O(I·O) today) |
| `per_polygon`        | `min_width` + self-int + edge-length, V ∈ {100, 1K}      | Per-polygon scaling (ray-casting, etc.)          |
| `array_expansion`    | Full deck on an AREF (10², 30², 100² copies)             | **Baseline for ROS-511** (AREF flattening cost)  |
| `full_deck_realistic`| 1K polygons, 3 layers, 2-level hierarchy, mixed deck     | Overall throughput number                        |

### Throughput units

Most groups report `Throughput::Elements(n)` so Criterion prints an elements/s
rate alongside wall-clock. What "element" means varies:

- `pairwise_spacing`, `pairwise_enclosure`: polygons on layer 1 (or inner layer).
- `pairwise_overlap`: pair count (total polygons = 2 × n).
- `per_polygon`: vertices in the polygon.
- `array_expansion`: AREF copies. Each copy has 5 polygons, so the 100×100
  case flattens to 50K polygons.
- `full_deck_realistic`: hardcoded to 1000 (approximate polygon count after
  flattening).

## Interpreting numbers — caveats

**Phase-1 dedup makes hierarchical layouts look fast.** The DRC runner checks
each unique cell definition once for per-polygon rules (`runner.rs:244`). The
`array_expansion` bench therefore does *not* scale linearly with AREF size for
per-polygon checks — those run once on the child and are trivially cheap.
Pairwise checks (`min_spacing`, `forbid_overlap`) still pay the per-copy cost,
which is where the ROS-511 optimization will show up.

**The enclosure check has no spatial index yet.** `pairwise_enclosure` is
intentionally capped at 1K pairs — the un-indexed O(I·O) cost at 10K would
be tens of seconds per sample. Once ROS-496 lands, extend the sweep back up to
10K to confirm the scaling win.

**Wall-clock microbench noise.** Expect ±5% run-to-run variance on a laptop,
more if other processes contend for cores. For trustworthy comparisons:

- Run on AC power (macOS CPU frequency scaling otherwise interferes).
- Close Chrome / Slack / anything with a busy-loop renderer.
- Use `--baseline` / `--save-baseline` so Criterion compares within a single
  execution environment.

**Hardware matters.** Baseline numbers in the Linear issue are tagged with the
machine that produced them. Large cross-machine deltas don't necessarily
indicate regressions.

**No parallelism.** The engine is single-threaded today; these numbers
characterize serial performance. Any future rayon work will need a different
benching story.

## Adding a new benchmark

1. If you need a new fixture, add it to `benches/fixtures.rs`. Keep builders
   simple and pure (no I/O, no randomness) so Criterion's repeated-iteration
   model stays honest.
2. Add a `bench_foo` function to `benches/drc.rs` and list it in the
   `criterion_group!` invocation at the bottom.
3. Build rules outside the `b.iter` closure — only the `run_drc` call belongs
   inside the measured region.
4. Wrap inputs with `black_box` so the optimizer can't hoist work out of the
   loop.
5. If a single iteration is slow (> ~100 ms), drop `group.sample_size(10)`
   before the `bench_with_input` call so the whole run completes in a
   reasonable time.

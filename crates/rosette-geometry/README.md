# rosette-geometry

Boolean and topological geometry operations for Rosette layout primitives, including hole-preserving regions and explicit lowering to single-ring polygons.

- **Depends on:** rosette-core
- **Consumed by:** rosette-drc, rosette-python, rosette-wasm

This feature crate owns operations that combine atomic core geometry and require the `geo` engine. Keeping that policy outside `rosette-core` leaves the core model lightweight while giving Rust callers one canonical Boolean API through `rosette_geometry::Region`.

See the workspace [`AGENTS.md`](../../AGENTS.md) for the crate map, and `cargo doc -p rosette-geometry --open` for the API reference.

# rosette-io

File I/O for photonic layout: GDS II (read & write) and JSON (web viewer communication).

`rosette-io` owns the versioned `rosette-layout` JSON contract. Core model types
remain format-neutral and are converted through validated DTOs at this boundary.

- **Depends on:** rosette-core
- **Consumed by:** rosette-python, rosette-wasm

See the workspace [`AGENTS.md`](../../AGENTS.md) for the crate map, and `cargo doc -p rosette-io --open` for the API reference (including GDS unit conventions).

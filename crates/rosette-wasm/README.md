# rosette-wasm

WebAssembly bindings for rosette with GPU-accelerated rendering via wgpu (WebGPU, with WebGL2 fallback). Powers the web viewer canvas.

- **Depends on:** rosette-core, rosette-io
- **Consumed by:** the viewer app (`app/`)

Build with `bun run build:wasm` from `app/`. See the workspace [`AGENTS.md`](../../AGENTS.md) for the crate map, and `cargo doc -p rosette-wasm --open` for the API reference.

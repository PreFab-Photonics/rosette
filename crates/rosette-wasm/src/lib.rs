//! # rosette-wasm
//!
//! WebAssembly bindings for rosette with GPU-accelerated rendering via wgpu.
//!
//! This crate provides a [`WasmRenderer`] that renders photonic layouts
//! to a WebGPU (or WebGL2 fallback) canvas in the browser, and [`WasmLibrary`]
//! for managing cells and geometry using rosette-core types.
//!
//! ## Usage
//!
//! ```javascript
//! import init, { WasmRenderer, WasmLibrary } from 'rosette-wasm';
//!
//! await init();
//!
//! // Create library and cell
//! const library = new WasmLibrary("mylib");
//! library.add_cell("TOP");
//! library.set_layer_color(1, 0, 0.29, 0.56, 0.85, 0.7);  // Blue for layer 1
//!
//! // Create renderer
//! const renderer = await WasmRenderer.new('canvas');
//! renderer.set_viewport(0, 0, 0.015625);
//!
//! // Add shapes
//! const rectId = library.add_rectangle(0, 0, 100, 50, 1, 0);
//!
//! // Sync and render
//! renderer.sync_from_library(library);
//! renderer.render();
//! ```

#[allow(dead_code)]
mod grid;
mod library;
#[cfg(target_arch = "wasm32")]
mod renderer;
#[allow(dead_code)]
mod shaders;
#[allow(dead_code)]
mod shapes;
mod text_to_polygons;
mod viewport;

use wasm_bindgen::prelude::*;

pub use library::WasmLibrary;
#[cfg(target_arch = "wasm32")]
pub use renderer::WasmRenderer;
pub use viewport::Viewport;

/// Initialize panic hook for better error messages in browser console.
#[wasm_bindgen(start)]
pub fn init() {
    console_error_panic_hook::set_once();
    console_log::init_with_level(log::Level::Warn).ok();
}

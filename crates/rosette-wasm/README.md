# rosette-wasm

WebAssembly bindings for rosette with GPU-accelerated rendering via wgpu.

## Features

- **WebGPU rendering** with automatic WebGL2 fallback
- **Grid rendering** with LOD-aware point density
- **Origin crosshair** with glow effect
- **Theme support** (dark/light)
- **Viewport controls** (pan, zoom)

## Building

```bash
# From librosette root
wasm-pack build crates/rosette-wasm --target web --out-dir ../../app/src/wasm
```

## Usage

```javascript
import init, { WasmRenderer } from './wasm/rosette_wasm.js';

async function main() {
  await init();
  
  const renderer = await new WasmRenderer('canvas');
  renderer.set_viewport(0, 0, 0.015625); // center at origin, zoomed out
  renderer.set_theme(true); // dark theme
  renderer.render();
}
```

## API

### `WasmRenderer`

- `new(canvas_id: string)` - Create renderer attached to canvas element
- `render()` - Render current view
- `set_viewport(center_x, center_y, zoom)` - Set camera position and zoom
- `resize(width, height)` - Handle canvas resize
- `set_theme(dark: boolean)` - Set color theme
- `get_zoom()` - Get current zoom level
- `get_center()` - Get current center position `[x, y]`
- `screen_to_world(screen_x, screen_y)` - Convert screen to world coordinates

## Architecture

```
┌─────────────────────────────────────┐
│  JavaScript                          │
│  - Event handling                    │
│  - React state                       │
│  - UI components                     │
└──────────────┬──────────────────────┘
               │ wasm-bindgen
┌──────────────▼──────────────────────┐
│  rosette-wasm (Rust)                │
│  - WasmRenderer                      │
│  - Viewport                          │
│  - Grid/Crosshair shaders           │
└──────────────┬──────────────────────┘
               │ wgpu
┌──────────────▼──────────────────────┐
│  WebGPU / WebGL2                    │
│  (GPU-accelerated rendering)        │
└─────────────────────────────────────┘
```

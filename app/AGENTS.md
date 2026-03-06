# AGENTS.md

Rosette web viewer - a WebGPU canvas for viewing photonic layouts.

## Stack

- **React 19** with functional components and hooks
- **TypeScript** with strict mode
- **Zustand** for state management (no Redux)
- **Tailwind CSS v4** (Vite plugin, no config file)
- **Vite 6** with WASM support
- **Bun** as package manager
- **Oxlint** for linting (React, React Hooks, JSX-a11y plugins)
- **Oxfmt** for formatting

## Commands

```bash
# Development
bun install                              # Install dependencies
bun dev                                  # Start dev server (hot reload)
bun run build                            # Type check + production build

# WASM (run from app/ directory)
bun run build:wasm                       # Rebuild WASM from rosette-wasm crate

# Lint & format
bun lint                                 # Check for lint errors
bun lint:fix                             # Auto-fix lint errors
bun fmt                                  # Format code
bun fmt:check                            # Check formatting (CI)
```

## Where Things Live

| What              | Where                        |
| ----------------- | ---------------------------- |
| React entry       | `src/main.tsx`               |
| App shell         | `src/App.tsx`                |
| Canvas + renderer | `src/components/canvas/`     |
| UI overlays       | `src/components/ui/`         |
| Zustand stores    | `src/stores/`                |
| Custom hooks      | `src/hooks/`                 |
| Utilities         | `src/lib/`                   |
| WASM bindings     | `src/wasm/` (generated)      |
| Vite config       | `vite.config.ts`             |
| Lint config       | `.oxlintrc.json`             |
| Format config     | `.oxfmtrc.json`              |

## Code Conventions

**Components:** Functional only, named exports, JSDoc on public components. Use `@/` path alias.

**State:** Zustand stores with interface-first design. Split by domain (`ui.ts`, `viewport.ts`). Access with selectors: `useUIStore((s) => s.theme)`.

**Hooks:** `use-` prefix, return object with named properties. Handle cleanup in useEffect.

**Styling:** Tailwind classes inline. Use `clsx` + `tailwind-merge` via `cn()` for conditional classes.

**Types:** Strict TypeScript. Interfaces for state shapes, explicit return types on hooks.

## WASM Integration

The app loads `rosette-wasm` for WebGPU rendering:

1. WASM is built via `wasm-pack` and output to `src/wasm/`
2. `use-wasm.ts` handles async loading with singleton pattern
3. `use-renderer.ts` creates the WebGPU renderer from WASM

After changing Rust code in `crates/rosette-wasm/`, rebuild with `bun run build:wasm`.

## Coordinate System

Matches rosette-web conventions:
- `zoom`: pixels per world unit (higher = more zoomed in)
- `offset`: screen position of world origin
- Transform: `screenPos = worldPos * zoom + offset`
- Grid: 1 grid point = 1 nanometer

### HiDPI / Retina Support

The app uses two coordinate spaces:

- **CSS pixels**: Used by JS (mouse events, viewport store, UI logic)
- **Physical pixels**: Used by WASM renderer (canvas buffer, GPU rendering)

The conversion happens at the JS↔WASM boundary in `use-renderer.ts`:

- Viewport offset/zoom are scaled by `devicePixelRatio` before passing to renderer
- Screen coordinates (e.g., laser points) are scaled by DPR before sending to WASM
- Canvas dimensions use physical pixels (`width * dpr`), CSS uses logical pixels

**When adding new features:**

- World-space geometry (shapes, polygons): No DPR handling needed - viewport transform handles it
- Fixed-size UI elements (dots, lines): Scale by `viewport.dpr` in the shader
- Screen coordinates from JS to WASM: Multiply by `devicePixelRatio`
- Uniform line widths: Set to `base_width * dpr` when updating uniform buffers

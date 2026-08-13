//! CPU polygon rasterizer for rosette photonic layouts.
//!
//! Renders a [`rosette_core::Library`] (or a named cell, or an explicit
//! bounding box) to a PNG image via `tiny-skia`. Output is deterministic
//! and accompanied by a [`ViewTransform`] that describes the world↔pixel
//! mapping, so any pixel position can be recovered as design coordinates.
//!
//! ## Consumed by
//!
//! - `rosette.render.render_png` — Python wrapper in `python/rosette/_api.py`
//! - `rosette shot` — CLI subcommand in `python/rosette/cli.py`
//!
//! Both entry points exist to let an AI assistant "look at" a design
//! when the textual conversation about it breaks down: the user is
//! pointing at something visual they can't easily describe, or has
//! explicitly asked for a visual inspection. The crate produces the
//! image; the `view` metadata makes any pixel in that image recoverable
//! as design coordinates so the assistant can act on what it sees.
//!
//! For data queries (polygon counts, bounding boxes, port positions),
//! callers should read the design through `rosette-core` directly —
//! rasterizing is more expensive and less precise.
//!
//! See [`render_png`] for the main entry point.

pub mod flatten;
pub mod palette;
pub mod render;
pub mod transform;

pub use flatten::{FlatGeometry, FlatPolygon, flatten_cell, flatten_library};
pub use palette::Palette;
pub use render::{RenderError, RenderOptions, RenderResult, render_png};
pub use transform::ViewTransform;

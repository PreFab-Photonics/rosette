# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.9] - 2026-04-10

### Changed

- Removed metal layer from default layer maps, templates, and DRC rules (will return as part of a comprehensive layer set)
- Renamed default text layer from 100/0 to 10/0
- Simplified generic template DRC to silicon-only rules

### Fixed

- Stale project name and layers persisting when running bare `rosette serve` after a design session
- Rebuilt bundled webapp to pick up current version and layer changes

## [0.1.8] - 2026-04-10

### Added

- "Create Array" feature for duplicating shapes in a grid pattern
- `[` and `]` shortcuts for changing hierarchy level
- Right-click zoom toggle: marquee zoom on right-click as alternative to context menu
- "Ruler: Clear All" command and preserve multi-selection on right-click
- Position editing for multi-element selections in inspector

### Changed

- Keep hamburger menu open for toggle items (theme, grid, right-click zoom)
- Keep menu open for Zoom In/Zoom Out actions
- Auto-select first field text when array dialog opens

### Fixed

- Inspector showing requested bend radius instead of actual after auto-reduction
- Path metadata lost on duplicate/copy/paste/array and move operations
- Missing selection borders on large selections and post-move UI lag

## [0.1.7] - 2026-04-03

### Added

- Boolean shape operations (union, subtract, intersect, xor) in the viewer
- Dedicated cell instance inspector with position, rotation, scale, and array editing
- Quick path placement (`H`+`Enter`) and "Add waypoint" button in inspector
- Zoom-to-fit button on scale bar label (extracted `zoomToFitAll()` helper)
- Flat/nested toggle for Explorer cell list
- Alphabetical sorting for Explorer cells and stabilized layer ordering
- `c` keyboard shortcut to create a new cell with inline rename
- Keyboard navigation for Explorer and Layers panels
- Blog section on docs site with fumadocs MDX collections
- Connectivity checking for photonic layouts (port-to-port, floating ports, shorted nets)
- Unified `rosette-checks` crate combining connectivity and bend-radius analysis
- DRC: self-intersection, max-width, minimum-edge-length, and same-layer overlap checks
- DFM: continuous rasterization, feature detection, decoupled from check CLI
- 20 new API reference doc pages (BBox, Point, Polygon, Port, Transform, Vector2, DRC/DFM types, etc.)
- CI check for API docs completeness (`check-api-docs.py`)
- Bend-radius metadata on Route, Bend, Ring, and Spiral components

### Changed

- Replaced `rosette-connectivity` crate with unified `rosette-checks` crate
- Overhauled DFM pipeline: continuous rasters, contour comparison improvements, configurable via `rosette.toml`
- Overhauled DRC runner: fixed 5 bugs, improved config and violation reporting
- Rewrote API reference docs from scratch, removing stale auto-generated component pages
- Updated landing page: rebuilt viewer, swapped feature tiles, taller preview
- Improved laser pointer trail smoothness and consistency

### Fixed

- Path tool preview: stable rendering, proper miter joins, reduced default width
- Layer swatch click not closing editor when already open
- Vertical centering of coordinate text in status bar
- Same-layer overlap detection in DRC with `no_overlap` config option
- Instance transform bounding-box shift documentation

### Removed

- `rosette-connectivity` crate (merged into `rosette-checks`)
- Auto-generated component doc pages (bend, crossing, coupler, grating, MMI, ring, s-bend, spiral, taper, waveguide, y-branch)

## [0.1.6] - 2026-03-27

### Added

- DFM (Design for Manufacturability) prediction tool with parallel layer processing and contour comparison
- Changelog and automatic GitHub Releases on new versions

### Fixed

- Instance transform decomposition for 180-degree rotations
- Component geometry bugs with added validation

## [0.1.5] - 2026-03-26

### Added

- `rosette check` and `rosette drc` CLI commands for design rule checking
- `ro` as a short alias for the `rosette` CLI
- Interactive command picker when running bare `rosette` with no arguments
- `--version` flag and `build --check` option
- Colored terminal output and improved error handling
- `uv tool install` as a global CLI installation option

## [0.1.4] - 2026-03-25

### Added

- Docs site with installation guide and getting started page
- Auto-generated Python API reference documentation
- Early-development disclaimers to README and docs

### Changed

- Improved Route docstrings to prevent common routing mistakes

### Fixed

- Template scaffolding for blank template (standalone CLAUDE.md, no components)

## [0.1.3] - 2026-03-23

### Changed

- App status bar version now derived from workspace Cargo.toml at build time
- Improved `rosette init` agent templates

## [0.1.2] - 2026-03-23

### Changed

- Web app is now bundled in Python release wheels

## [0.1.1] - 2026-03-23

### Changed

- `rosette init` now works within uv-managed projects

## [0.1.0] - 2026-03-23

### Added

- Initial public release
- PyPI publishing as `librosette` with cross-platform wheel builds (macOS ARM, Linux x86_64)
- `rosette init` command for scaffolding new projects (blank and generic templates)
- `rosette serve` dev server with live preview
- `rosette build` for compiling designs to GDS-II
- Child cell feature with full two-way editing support
- CI workflow for linting, testing, type checking, and formatting

### Fixed

- `rosette serve` to use installed Rosette.app on macOS

[Unreleased]: https://github.com/PreFab-Photonics/rosette/compare/v0.1.9...HEAD
[0.1.9]: https://github.com/PreFab-Photonics/rosette/compare/v0.1.8...v0.1.9
[0.1.8]: https://github.com/PreFab-Photonics/rosette/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/PreFab-Photonics/rosette/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/PreFab-Photonics/rosette/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/PreFab-Photonics/rosette/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/PreFab-Photonics/rosette/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/PreFab-Photonics/rosette/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/PreFab-Photonics/rosette/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/PreFab-Photonics/rosette/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/PreFab-Photonics/rosette/releases/tag/v0.1.0

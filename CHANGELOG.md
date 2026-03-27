# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- DFM (Design for Manufacturability) prediction tool with parallel layer processing and contour comparison

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

[Unreleased]: https://github.com/PreFab-Photonics/rosette/compare/v0.1.5...HEAD
[0.1.5]: https://github.com/PreFab-Photonics/rosette/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/PreFab-Photonics/rosette/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/PreFab-Photonics/rosette/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/PreFab-Photonics/rosette/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/PreFab-Photonics/rosette/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/PreFab-Photonics/rosette/releases/tag/v0.1.0

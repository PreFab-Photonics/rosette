---
name: component-authoring
description: Create or modify reusable project-local photonic components. Use only when the user requests a component or a device is clearly reusable across designs, not for one-off design geometry.
---

# Component Authoring

Read `.rosette/contracts/component-authoring.pyi`, `components/__init__.py`, the
relevant shared helpers, and a similar existing component when one exists.

## Contract

- Put meaningfully reusable device geometry in `components/<name>.py`. Keep
  one-off exploratory and test geometry in the design that uses it.
- Accept `layer: Layer` as the first parameter, give remaining parameters useful
  defaults, and return a `Cell`.
- Use microns for dimensions and degrees for angles.
- Orient the canonical component along +X. Place its input near the origin and
  outputs at positive x where practical.
- Point every port direction outward from the component body and set the port
  width to the physical waveguide width at that boundary.
- For an optical component with a meaningful propagation path, set
  `cell.path_length` to its optical centerline length in microns. Otherwise leave
  it unset rather than assigning a synthetic zero.
- Use `safe_cell_name()` from `components._utils` for parameterized GDS-safe names.
- Reuse `components._curves` and `components._tapers` instead of duplicating their
  geometry algorithms.
- Export public components from `components/__init__.py` and its `__all__`.

## Validate

Reject non-finite or physically invalid parameters before constructing geometry.
Create a small design that places the component, connects its ports where
applicable, and then load the `verification` skill. Build, check, and inspect the
result before considering the component complete.

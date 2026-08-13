---
name: verification
description: Build, check, and visually inspect Rosette designs. Use after layout changes and when diagnosing DRC, connectivity, bend-radius, or manufacturability failures.
---

# Verification

Read `rosette.toml`. Read `.rosette/contracts/verification.pyi` only when writing
Python code that calls DRC, DFM, check, or rendering APIs. A design is not complete
until it builds and its checks pass.

## Required loop

Run commands through the project environment:

```bash
uv run rosette build designs/foo.py
uv run rosette check designs/foo.py --json
```

Read structured fields rather than parsing prose. Completion requires top-level
`passed` to be true and no requested child result to have `error: true`. On
failure, inspect each result section and violation. A violation `bbox` is
`[[min_x, min_y], [max_x, max_y]]` in microns.

Render the whole design or a failing region when geometry is not obvious:

```bash
uv run rosette shot designs/foo.py
uv run rosette shot designs/foo.py --bbox min_x,min_y,max_x,max_y
```

Fix the source, then repeat both build and check until `passed` is true. Do not
waive or suppress a violation merely to make the command green.

## Focused diagnosis

- `uv run rosette drc designs/foo.py --json` isolates geometric rules.
- `uv run rosette dfm designs/foo.py --json` isolates manufacturing prediction.
- `uv run rosette check designs/foo.py --include-dfm --json` includes configured
  DFM prediction in the combined result.

Read only the relevant command entry in `.rosette/cli.json` when exact flags or
exit behavior are not covered here.

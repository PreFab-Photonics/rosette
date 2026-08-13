---
name: routing
description: Plan and implement photonic routes between ports. Use when connecting placed components, choosing waypoints, resolving crossings or overlaps, or fixing bend-radius warnings.
---

# Routing

Read `.rosette/contracts/routing.pyi` and the source of the components whose
ports will be connected. Use `rosette.routing.Route`; it is a waypoint router,
not an autorouter.

## Plan before drawing

1. List each source and destination port, including position, outward direction,
   width, and layer.
2. Reserve a distinct corridor for every connection. Plan all routes together so
   an early route does not block a later one.
3. Prefer few bends and crossings. Preserve geometric symmetry when path balance
   matters.

## Respect port axes

`start_at_port()` and `end_at_port()` set endpoint position, width, and heading,
but they do not invent the approach geometry. Add a waypoint along the source
axis before turning and a waypoint along the destination axis before ending.
Passing only two ports to `Route.through()` creates a straight line between them.

Every bend consumes clearance on both adjacent segments. For a circular 90-degree
bend of radius `R`, budget at least `R` on each leg. An S-bend needs a transverse
span greater than `2 * R`; leave another 1-2 microns of margin to avoid automatic
radius reduction.

## Avoid route-to-route overlap

Give each route a unique horizontal channel and vertical turning column, separated
by at least the configured minimum spacing. When fanning a compact port group into
a wider bank, assign turning columns outside-in: outer pairs take outer columns,
then work toward the center. Apply this ordering independently to upper and lower
groups.

## Finish

Convert each route with `to_cell()`, place it explicitly with `.at(0, 0)`, and add
the resulting instance to the parent cell. Inspect `route.warnings` and resolve any
reduced-radius warning. Then load the `verification` skill and complete the full
build-check loop.

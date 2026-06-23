---
name: layout-design
description: How to think about photonic chip layout. Floorplanning, spacing, routing strategy, and hierarchy. Use when planning or creating a new design.
---

# Layout Design

> **Example skill — placeholder for future work.** This ships as a starting
> point to show what a Rosette skill looks like. The heuristics below are
> general and intentionally brief; expand or replace this skill with rules
> specific to your process and design library.

High-level heuristics for photonic integrated circuit layout.

## Start from the optical path

Trace the signal from input to output before placing anything. The signal
flow graph determines the topology; the topology constrains the floorplan.
Identify the optical I/O count, what connects to what, and which connections
are performance-critical (short, low-loss) vs. just routing.

## Floorplan around the I/O

Optical interfaces (grating/edge couplers) connect to fibers with fixed
spacing, so they are usually the widest constraint — place them first and fit
everything else between them. Leave room for routing: every route needs its
own channel, and bends consume roughly one bend radius in each direction.
Balanced circuits (MZIs, differential paths) want geometric symmetry to keep
arm lengths matched.

## Route deliberately

Plan all routes together, not one at a time — an early route can block a later
one. Minimize crossings (each adds loss and crosstalk; reordering or mirroring
often removes one), prefer fewer bends, and use the smallest bend radius that
meets your loss budget.

## Use hierarchy when it pays

Group components into a sub-cell when the group repeats, has a clean low-port
interface, or could be tested independently. A flat layout is fine for simple
circuits — don't force hierarchy for its own sake.

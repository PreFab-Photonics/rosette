---
name: layout-design
description: How to think about photonic chip layout. Floorplanning, spacing, routing strategy, and hierarchy. Use when planning or creating a new design.
---

# Layout Design

Design heuristics for photonic integrated circuit layout.

## Start from the optical path

Before placing anything, trace the signal from input to output. Identify:

- How many optical I/O ports does this circuit need?
- What is the signal flow? What connects to what?
- Are there splits, combines, or loops in the path?
- Which connections are performance-critical (short, low-loss) vs. just routing?

The signal flow graph determines the topology. The topology constrains the floorplan. Don't start placing components until you understand the topology.

## Floorplanning

### Optical I/O anchors the layout

The chip's optical interfaces (grating couplers, edge couplers, etc.) connect to external fibers, which have fixed physical spacing constraints. These I/O positions are typically the widest spacing constraint in the design and should be established first -- everything else fits between them.

When internal component spacing is tighter than I/O spacing, the layout needs fan-out regions where routes transition gradually from tight to wide pitch.

### Leave room for routing

The most common layout mistake is placing components too close together, then finding there's no room to route between them. Estimate routing space before finalizing placement:

- Each waveguide route needs its own channel
- Bends consume area -- a 90-degree turn needs roughly one bend radius in each direction
- Parallel routes need one channel per route
- Fan-outs need enough horizontal distance to spread routes apart gradually

### Symmetry matters for balanced circuits

Mach-Zehnder interferometers, balanced detectors, and differential circuits require matched optical path lengths in both arms. The easiest way to achieve this is geometric symmetry -- make the layout mirror-symmetric about the axis of balance. Asymmetric layouts can still be path-length-matched, but this is harder to maintain as the design evolves.

## Routing strategy

### Plan all routes together

Think about all routes simultaneously, not one at a time. Routes interact -- a route placed early can block a route needed later. Identify which routes need to cross, which can run in parallel, and where the congestion points are before committing.

### Minimize crossings

Every waveguide crossing adds insertion loss and crosstalk. Before adding a crossing, check if a different floorplan or port ordering eliminates it. Often, swapping the Y-order of two components or mirroring a section removes a crossing entirely.

### Keep routes simple

Prefer routes with fewer bends. Each bend adds loss and consumes area. If a route needs many turns to get around obstacles, the floorplan likely needs adjustment rather than more complex routing.

### Bend radius is a tradeoff

Larger bend radii have lower optical loss but consume more area. There's a process-dependent sweet spot. Use the smallest radius that meets your loss budget.

## Hierarchy

### When to use sub-cells

Group components into a sub-cell when the group:

- **Repeats** -- the same sub-circuit appears multiple times (ring array, splitter tree)
- **Has a clean interface** -- a small number of I/O ports, self-contained routing
- **Could be tested independently** -- useful as a standalone test structure

A flat layout is fine for simple circuits. Don't force hierarchy for its own sake.

### Repeated sub-cells

When arraying a sub-cell, the pitch between instances should account for the sub-cell's footprint, routing clearance for connections entering/leaving each instance, and any shared bus waveguides running alongside the array.

## Common pitfalls

- **Placing without considering routing.** Placement and routing are coupled problems. Committing to placement before thinking about routing usually means redoing both.
- **Tight coupling between unrelated paths.** Keep independent optical paths physically separated. If two signals share no logical connection, their waveguides shouldn't run next to each other.
- **Forgetting testability.** Every optical path needs an accessible port. Include test structures (loopbacks, reference paths) if the design will be fabricated.

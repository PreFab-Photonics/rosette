---
name: spiral-cutback
description: Spiral waveguide structures for cutback loss measurement. How to design a set of spirals at varying lengths for extracting propagation loss, and how to construct spirals that don't self-intersect. Use when asked to create cutback structures, loss measurement structures, or spiral waveguides.
---

# Spiral Waveguides for Cutback Analysis

Cutback measurement extracts propagation loss (dB/cm) by measuring transmission through waveguides of different lengths. The loss per unit length is the slope of a linear fit of insertion loss vs. waveguide length. The spirals are just a way to pack long waveguides into a compact area.

## The cutback set

A cutback measurement requires multiple structures with **different waveguide lengths but identical everything else** -- same coupling, same number of bends (or bend-loss-compensated), same waveguide width, same port positions if possible.

### Length selection

Choose lengths that span a wide enough range to give a reliable linear fit:

- A minimum of 3 lengths, ideally 5 or more
- Evenly spaced or geometrically spaced (e.g., 1, 2, 5, 10, 20 mm)
- The shortest length should be short enough that total loss is small (establishes the y-intercept, which captures coupling and bend losses)
- The longest length should be long enough that propagation loss dominates

### Isolating propagation loss

The critical requirement is that non-propagation losses (coupling, bends, transitions) are **constant across all structures** in the set. This means:

- Every structure should use the same optical I/O (same coupler type, same taper)
- Every structure should have the same number of bends at the same radius, OR the bend count should be accounted for in the analysis
- Waveguide width must be identical throughout -- no tapers or width changes within the spiral itself

If the spiral geometry forces different structures to have different bend counts, include the bend count as a variable in the fit (loss = a _ length + b _ num_bends + c).

### Reference structures

Include at minimum:

- A **straight-through** reference (shortest possible path from input to output, no spiral) to establish baseline coupling loss
- Optionally, a **bend-loss reference** -- a structure with many bends but minimal straight length, to separate bend loss from propagation loss

## Designing a single spiral

A spiral is a waveguide that folds back on itself to pack length into area. The fundamental challenge is avoiding self-intersection while maintaining valid bend geometry.

### Anatomy of a spiral

A typical spiral consists of:

- **Straight segments** running in alternating directions (the "rungs")
- **U-turns** connecting the ends of adjacent segments (semicircular bends or pairs of 90-degree bends)
- **Entry/exit transitions** where the spiral connects to the input/output ports

The total waveguide length is the sum of all straight segments plus the length of all bends.

### Avoiding self-intersection

The key constraint: **adjacent parallel waveguide segments must be separated by at least the minimum DRC spacing, and the U-turn bends must fit within that separation.**

For a spiral that winds inward then outward (or simply folds back and forth):

- The spacing between adjacent parallel runs must accommodate the bend diameter (2 \* bend radius) plus waveguide width plus DRC clearance on both sides
- As you add more turns to increase length, the spiral grows in the direction perpendicular to the straight segments
- The innermost turn has the least room -- make sure the bend radius is achievable there

### Spiral shapes

There's no single "correct" spiral shape. Common approaches:

- **Rectangular / racetrack spiral**: Straight segments connected by U-turns. Simple to reason about, easy to calculate total length. The most common choice for cutback.
- **Archimedean spiral**: Continuously curving path with constant spacing between turns. More compact but harder to construct from discrete waypoints.
- **S-bend folded**: Alternating S-bends that fold the waveguide back and forth. Good when you need the input and output on the same side.

For cutback purposes, the rectangular/racetrack spiral is usually the best choice because its length is easy to calculate exactly and the geometry is straightforward to scale.

### Scaling length across the set

To create spirals of different lengths, you can vary:

- **Number of turns** -- more turns = more length. This changes the bend count, so account for it.
- **Length of straight segments** -- longer rungs = more length per turn, same bend count. Preferred when you want constant bend count across the set.
- **Both** -- for very long spirals, you may need more turns AND longer segments.

Keeping the bend count constant across the set (by varying only segment length) simplifies the analysis, but may not be practical for large length ranges. In that case, track the bend count per structure.

## Layout considerations

### Consistent port positions

Ideally, all structures in the cutback set should have their optical I/O ports at the same positions (same coordinates, same spacing). This allows using the same fiber array alignment for all measurements, reducing measurement variability. The spiral geometry varies, but the entry and exit points stay fixed.

### Compact packing

Multiple spirals on the same chip should be spaced to avoid optical or electrical crosstalk, but close enough to fit within the usable die area. Arrange them in a row with consistent I/O port pitch.

### Labeling

Each structure should be clearly identifiable -- include a text label with the nominal waveguide length so the fabricated chip can be measured without ambiguity.

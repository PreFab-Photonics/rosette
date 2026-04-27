"""Type stubs for rosette._core (Rust extension module).

All coordinates, dimensions, and distances are in microns (um).
"""

from collections.abc import Iterator
from pathlib import Path

# =============================================================================
# Geometry Types
# =============================================================================

class Point:
    x: float
    y: float
    def __init__(self, x: float = 0.0, y: float = 0.0) -> None: ...
    @staticmethod
    def origin() -> Point: ...
    def distance_to(self, other: Point) -> float: ...
    def translate(self, v: Vector2) -> Point: ...
    def rotate(self, angle_deg: float) -> Point: ...
    def rotate_around(self, center: Point, angle_deg: float) -> Point: ...
    def __add__(self, other: Vector2) -> Point: ...
    def __sub__(self, other: Point) -> Vector2: ...
    def __eq__(self, other: object) -> bool: ...
    def __repr__(self) -> str: ...

class Vector2:
    x: float
    y: float
    def __init__(self, x: float = 0.0, y: float = 0.0) -> None: ...
    @staticmethod
    def unit_x() -> Vector2: ...
    @staticmethod
    def unit_y() -> Vector2: ...
    @staticmethod
    def from_angle(angle_deg: float) -> Vector2: ...
    def length(self) -> float: ...
    def normalize(self) -> Vector2: ...
    def dot(self, other: Vector2) -> float: ...
    def perpendicular(self) -> Vector2: ...
    def rotate(self, angle_deg: float) -> Vector2: ...
    def __add__(self, other: Vector2) -> Vector2: ...
    def __sub__(self, other: Vector2) -> Vector2: ...
    def __mul__(self, scalar: float) -> Vector2: ...
    def __rmul__(self, scalar: float) -> Vector2: ...
    def __neg__(self) -> Vector2: ...
    def __eq__(self, other: object) -> bool: ...
    def __repr__(self) -> str: ...

class Polygon:
    def __init__(self, vertices: list[Point]) -> None: ...
    @staticmethod
    def rect(origin: Point, width: float, height: float) -> Polygon: ...
    @staticmethod
    def rect_centered(center: Point, width: float, height: float) -> Polygon: ...
    @staticmethod
    def regular(center: Point, radius: float, sides: int) -> Polygon: ...
    def vertices(self) -> list[Point]: ...
    def __len__(self) -> int: ...
    def area(self) -> float: ...
    def centroid(self) -> Point: ...
    def bbox(self) -> BBox: ...
    def translate(self, v: Vector2) -> Polygon: ...
    def rotate(self, angle_deg: float) -> Polygon: ...
    def rotate_around(self, center: Point, angle_deg: float) -> Polygon: ...
    def scale(self, sx: float, sy: float) -> Polygon: ...
    def mirror_x(self) -> Polygon: ...
    def mirror_y(self) -> Polygon: ...
    def union(self, other: Polygon) -> list[Polygon]:
        """Compute the union of this polygon with another.

        Returns a list of polygons covering the combined area of both inputs.
        Overlapping regions are merged. Holes are keyholed into single-ring
        polygons.

        Args:
            other: The polygon to union with.

        Returns:
            List of result polygons (may be more than one if inputs are disjoint).
        """
        ...
    def subtract(self, other: Polygon) -> list[Polygon]:
        """Subtract another polygon from this one.

        Returns the area of this polygon that does not overlap with `other`.
        If `other` cuts a hole, the result is a keyholed single-ring polygon.

        Args:
            other: The polygon to subtract.

        Returns:
            List of result polygons (empty if fully subtracted).
        """
        ...
    def intersect(self, other: Polygon) -> list[Polygon]:
        """Compute the intersection of this polygon with another.

        Returns the overlapping area of both polygons.

        Args:
            other: The polygon to intersect with.

        Returns:
            List of result polygons (empty if no overlap).
        """
        ...
    def xor(self, other: Polygon) -> list[Polygon]:
        """Compute the symmetric difference (XOR) of this polygon with another.

        Returns the area in either polygon but not both.

        Args:
            other: The polygon to XOR with.

        Returns:
            List of result polygons (empty if polygons are identical).
        """
        ...
    def __iter__(self) -> PolygonIterator: ...
    def __repr__(self) -> str: ...

class PolygonIterator:
    """Iterator over polygon vertices."""

    def __iter__(self) -> PolygonIterator: ...
    def __next__(self) -> Point: ...

class Transform:
    def __init__(self) -> None: ...
    @staticmethod
    def identity() -> Transform: ...
    @staticmethod
    def translate(tx: float, ty: float) -> Transform: ...
    @staticmethod
    def rotate(angle_deg: float) -> Transform: ...
    @staticmethod
    def scale_uniform(s: float) -> Transform: ...
    @staticmethod
    def scale(sx: float, sy: float) -> Transform: ...
    def apply(self, p: Point) -> Point: ...
    def then(self, other: Transform) -> Transform: ...
    def __repr__(self) -> str: ...

class BBox:
    min: Point
    max: Point
    def __init__(self, min: Point, max: Point) -> None: ...
    def width(self) -> float: ...
    def height(self) -> float: ...
    def center(self) -> Point: ...
    def area(self) -> float: ...
    def contains(self, p: Point) -> bool: ...
    def merge(self, other: BBox) -> BBox: ...
    def __repr__(self) -> str: ...

# =============================================================================
# Instance: A positioned cell with transform
# =============================================================================

class Instance:
    """A cell placed at a specific position with optional transformations.

    Instance provides an ergonomic API for positioning cells and querying
    their transformed ports without redundant cell references.

    Created with `cell.at(x, y)`. Supports transform chaining.

    Transform chaining order: each call wraps the outside of the
    accumulated transform, so the *first* call is applied first to
    geometry.  ``.at(x, y).rotate(deg)`` translates first then rotates
    around the origin -- moving the component to an unexpected position.
    To rotate then place: ``.at(0, 0).rotate(deg).at(x, y)``.

    Bounding-box shift after transform: even with the correct ordering,
    transforms change where geometry sits relative to the anchor point.
    For example, an 8x5 rect at (0,0)-(8,5) rotated 45° becomes a
    diamond whose extents are completely different. The final ``.at(x, y)``
    places the *transformed origin*, not the visual center or corner.
    To align transformed instances with other geometry, account for the
    new bounds when choosing placement coordinates.

    Example:
        gc_cell = grating_coupler(layer=layer)
        gc_in = gc_cell.at(0, 0)              # Position at origin
        gc_out = gc_cell.at(0, 127)           # Position at fiber pitch

        # Get ports directly - no need to pass cell again
        port_in = gc_in.port("opt")
        port_out = gc_out.port("opt")

        # Add to design
        top.add_ref(gc_in)
        top.add_ref(gc_out)

        # Rotate then place at a specific position:
        rotated = some_cell.at(0, 0).rotate(90).at(50, 100)

        # Caution: rotation shifts the bounding box relative to the
        # anchor. A 45° rotation moves the geometry's visual center,
        # so you may need to adjust the final .at() offset:
        rotated45 = block.at(0, 0).rotate(45).at(x + 4, y - 2)
    """

    @property
    def cell(self) -> Cell:
        """The underlying cell definition."""
        ...
    @property
    def cell_name(self) -> str:
        """Name of the referenced cell."""
        ...
    def at(self, x: float, y: float) -> Instance:
        """Set the position (translation).

        Args:
            x: X coordinate
            y: Y coordinate

        Returns:
            A new Instance with updated transform
        """
        ...
    def rotate(self, angle_deg: float) -> Instance:
        """Rotate by angle (in degrees).

        Args:
            angle_deg: Rotation angle in degrees (counter-clockwise)

        Returns:
            A new Instance with updated transform
        """
        ...
    def mirror_x(self) -> Instance:
        """Mirror across X axis (flips Y coordinates).

        Returns:
            A new Instance with updated transform
        """
        ...
    def mirror_y(self) -> Instance:
        """Mirror across Y axis (flips X coordinates).

        Returns:
            A new Instance with updated transform
        """
        ...
    def scale(self, s: float) -> Instance:
        """Scale uniformly.

        Args:
            s: Scale factor

        Returns:
            A new Instance with updated transform
        """
        ...
    def array(self, columns: int, rows: int, col_spacing: float, row_spacing: float) -> Instance:
        """Set array repetition (columns x rows grid with given pitch).

        Creates a GDS AREF — a single compact array reference instead of
        many individual references. In the viewer, the entire array is
        selected as one object.

        Args:
            columns: Number of columns (1 to 32767).
            rows: Number of rows (1 to 32767).
            col_spacing: Column pitch — center-to-center distance between
                adjacent copies along local +X, in µm.
            row_spacing: Row pitch — center-to-center distance between
                adjacent copies along local +Y, in µm.

        Raises:
            ValueError: If columns or rows is outside the range [1, 32767].
                The upper bound is the GDS COLROW INT16 limit.

        Example:
            arr = unit_cell.at(0, 0).array(10, 5, 20.0, 15.0)
            top.add_ref(arr)
        """
        ...
    def port(self, name: str) -> Port:
        """Get a transformed port from this instance.

        Unlike CellRef.port(), this doesn't require passing the Cell again
        since the Instance already knows its cell definition.

        Both position and direction are fully transformed (translation,
        rotation, mirroring). For example, a port facing +X will face -X
        after a 180-degree rotation.

        Args:
            name: Name of the port to retrieve

        Returns:
            The port with position and direction transformed

        Raises:
            KeyError: If the port is not found in the cell

        Example:
            gc = gc_cell.at(100, 50)
            opt_port = gc.port("opt")  # Transformed port position & direction

            # 180-degree rotation flips both position and direction:
            flipped = gc_cell.at(0, 0).rotate(180).at(50, 0)
            p = flipped.port("opt")   # direction is now (-1, 0)
        """
        ...
    def __repr__(self) -> str: ...

# =============================================================================
# Layout Types
# =============================================================================

class PathEndType:
    """GDS path end type."""

    FLUSH: PathEndType
    """Flush (square) ends at path endpoints."""
    ROUND: PathEndType
    """Round ends."""
    HALF_WIDTH_EXTENSION: PathEndType
    """Square ends extending half-width past endpoints."""
    def __repr__(self) -> str: ...

class Layer:
    number: int
    datatype: int
    def __init__(self, number: int, datatype: int = 0) -> None: ...
    def __repr__(self) -> str: ...
    def __hash__(self) -> int: ...
    def __eq__(self, other: object) -> bool: ...

class Port:
    name: str
    position: Point
    direction: Vector2
    width: float | None
    def __init__(
        self,
        name: str,
        position: Point,
        direction: Vector2,
        width: float | None = None,
    ) -> None: ...
    def angle(self) -> float: ...
    def can_connect_to(self, other: Port, tolerance: float = 0.001) -> bool:
        """Check if this port can connect to another port.

        Ports can connect if they are at the same position (within tolerance)
        and have opposite directions.
        """
        ...
    def __repr__(self) -> str: ...

class CellRef:
    cell_name: str
    def __init__(self, cell_or_name: Cell | str) -> None:
        """Create a new cell reference.

        Args:
            cell_or_name: Either a Cell object or a cell name string.

        Example:
            ref1 = CellRef("my_cell")      # From string
            ref2 = CellRef(waveguide_cell) # From Cell object
        """
        ...
    def at(self, x: float, y: float) -> CellRef: ...
    def rotate(self, angle_deg: float) -> CellRef: ...
    def mirror_x(self) -> CellRef: ...
    def mirror_y(self) -> CellRef: ...
    def scale(self, s: float) -> CellRef: ...
    def array(self, columns: int, rows: int, col_spacing: float, row_spacing: float) -> CellRef:
        """Set array repetition (columns x rows grid with given pitch).

        Creates a GDS AREF — a single compact array reference instead of
        many individual references. In the viewer, the entire array is
        selected as one object.

        Args:
            columns: Number of columns (1 to 32767).
            rows: Number of rows (1 to 32767).
            col_spacing: Column pitch — center-to-center distance between
                adjacent copies along local +X, in µm.
            row_spacing: Row pitch — center-to-center distance between
                adjacent copies along local +Y, in µm.

        Raises:
            ValueError: If columns or rows is outside the range [1, 32767].
                The upper bound is the GDS COLROW INT16 limit.

        Example:
            ref = CellRef("unit").at(0, 0).array(10, 5, 20.0, 15.0)
        """
        ...
    def port(self, name: str, cell: Cell) -> Port:
        """Get a transformed port from this cell reference.

        Returns the named port from the source cell, transformed by this
        CellRef's transform (position, rotation, mirror, etc.).

        Args:
            name: Name of the port to retrieve
            cell: The source Cell object containing the port definition

        Returns:
            The port with position and direction transformed

        Raises:
            KeyError: If the port is not found in the cell

        Example:
            gc_cell = grating_coupler(layer=layer)
            gc_ref = CellRef(gc_cell).at(100, 50)

            # Get the transformed port
            opt_port = gc_ref.port("opt", gc_cell)

            # Use in routing
            route = Route.through(opt_port, ..., layer=layer)
        """
        ...
    def __repr__(self) -> str: ...

class Cell:
    name: str
    path_length: float | None
    bends: list[dict]
    """Bend info entries as list of dicts with keys: radius, x, y, and optionally requested_radius."""
    cell_warnings: list[str]
    """Warnings from cell construction."""
    def __init__(self, name: str) -> None:
        """Create a new empty cell.

        Raises:
            ValueError: If the name is empty, longer than 32 characters,
                or contains non-printable ASCII characters (spaces, Unicode, etc.)
        """
        ...
    def add_polygon(self, polygon: Polygon, layer: Layer | int | tuple[int, int]) -> None:
        """Add a polygon to the cell.

        For repeated geometry (arrays, banks, test structures), define the
        shape in a sub-cell and use ``.array()`` or individual ``add_ref()``
        calls instead of calling ``add_polygon`` in a loop on the parent
        cell.  This keeps the GDS compact and the viewer responsive::

            unit = Cell("unit")
            unit.add_polygon(Polygon.rect(Point.origin(), w, h), layer)
            top.add_ref(unit.at(0, 0).array(cols, rows, pitch_x, pitch_y))
        """
        ...
    def add_path(
        self,
        points: list[Point],
        width: float,
        layer: Layer | int | tuple[int, int],
        end_type: PathEndType | None = None,
    ) -> None:
        """Add a path (centerline with width) to the cell.

        Paths are an alternative to polygons for representing waveguides and
        similar structures. They store a centerline and width, which can be
        more compact than storing the full polygon outline.

        Args:
            points: List of Point objects along the path centerline
            width: Width of the path
            layer: Layer number or Layer object
            end_type: Path end type (default: PathEndType.FLUSH)

        Example:
            cell.add_path(
                [Point(0, 0), Point(100, 0), Point(100, 50)],
                width=0.5,
                layer=1,
                end_type=PathEndType.ROUND
            )
        """
        ...
    def add_text(
        self,
        text: str,
        position: Point,
        layer: Layer | int | tuple[int, int],
        height: float = 1.0,
    ) -> None:
        """Add a text label to the cell.

        Text labels are useful for debugging and documentation but are
        typically not fabricated.

        Args:
            text: The text string
            position: Position of the text
            layer: Layer number or Layer object
            height: Text height in user units (default: 1.0)

        Example:
            cell.add_text("Input", Point(0, 5), layer=10)
            cell.add_text("Big Label", Point(0, 10), layer=10, height=5.0)
        """
        ...
    def add_port(self, port: Port) -> None: ...
    def add_bend(
        self,
        radius: float,
        x: float,
        y: float,
        requested_radius: float | None = None,
    ) -> None:
        """Add a bend info entry to the cell metadata.

        Args:
            radius: Effective bend radius in um
            x: X coordinate of bend location
            y: Y coordinate of bend location
            requested_radius: Original requested radius if auto-reduced (optional)
        """
        ...
    def add_warning(self, warning: str) -> None:
        """Add a warning to the cell metadata."""
        ...
    def port(self, name: str) -> Port: ...
    def ports(self) -> list[Port]: ...
    def polygon_count(self) -> int: ...
    def path_count(self) -> int: ...
    def text_count(self) -> int: ...
    def ref_count(self) -> int: ...
    def cell_ref_names(self) -> list[str]:
        """Get the unique names of all cells referenced by this cell.

        Returns:
            Sorted list of unique cell names that this cell references (direct children only).
        """
        ...
    def bbox(self) -> BBox | None: ...
    def at(self, x: float, y: float) -> Instance:
        """Create a positioned instance of this cell.

        This is the recommended way to place cells in a design. The returned
        Instance tracks the cell reference, allowing port queries without
        redundantly passing the cell.

        Args:
            x: X coordinate
            y: Y coordinate

        Returns:
            An Instance positioned at (x, y)

        Example:
            gc_cell = grating_coupler(layer=layer)
            gc_in = gc_cell.at(0, 0)
            gc_out = gc_cell.at(0, 127)

            # Get ports directly from instances
            port_in = gc_in.port("opt")
            port_out = gc_out.port("opt")

            # Array of identical cells (single AREF, selected as one unit):
            top.add_ref(unit_cell.at(0, 0).array(10, 10, pitch, pitch))
        """
        ...
    def add_ref(self, ref: Cell | CellRef | Instance) -> None:
        """Add a cell, cell reference, or instance.

        When adding a Cell or Instance, the child cell is automatically
        tracked for write_gds().

        Args:
            ref: A Cell (placed at origin), Instance, or CellRef to add

        Example:
            top.add_ref(gc_cell.at(0, 0))        # Instance at position
            top.add_ref(route.to_cell("wg"))     # Cell at origin
        """
        ...
    def place_at_port(self, cell_ref: CellRef, cell_port: Port, target_port: Port) -> CellRef:
        """Place a cell reference by aligning its port to a target port.

        Returns a transformed CellRef that can be added with add_ref().
        """
        ...
    def __repr__(self) -> str: ...

class Library:
    name: str
    def __init__(self, name: str) -> None: ...
    def add_cell(self, cell: Cell) -> None:
        """Add a cell to the library.

        Raises:
            ValueError: If the cell name is invalid or a cell with the
                same name already exists.
        """
        ...
    def add_cell_recursive(self, cell: Cell, available_cells: list[Cell]) -> None:
        """Add a cell and all its referenced cells recursively.

        This method automatically adds all cells that are referenced by the
        given cell, resolving the entire hierarchy. You must provide a list
        of all available cells that may be referenced.

        Cells that already exist in the library (by name) are skipped.

        Args:
            cell: The cell to add (typically the top-level cell)
            available_cells: List of all cells that may be referenced

        Raises:
            ValueError: If any cell name is invalid.
        """
        ...
    def cell(self, name: str) -> Cell | None: ...
    def cells(self) -> list[Cell]: ...
    def top_cell(self) -> Cell | None: ...
    def cell_bbox(self, name: str) -> BBox | None:
        """Calculate the fully-resolved bounding box of a cell in this library.

        Unlike ``Cell.bbox()``, this recursively resolves every cell reference
        (SREF and AREF) and expands array repetitions, so the returned box
        covers everything that would appear when the cell is rendered or
        written to GDS.

        Args:
            name: Name of the cell to measure.

        Returns:
            The fully-resolved BBox, or None if the cell does not exist or
            contains no geometry.

        Example:
            lib = Library("design")
            lib.add_cell(unit)
            lib.add_cell(top)  # contains a 5x3 AREF of `unit`
            bb = lib.cell_bbox("top")  # covers all 15 copies
        """
        ...
    def __repr__(self) -> str: ...

# =============================================================================
# Route
# =============================================================================

class Route:
    """Waypoint-based waveguide route.

    Route connects an ordered sequence of waypoints with straight segments,
    inserting circular bends at corners and tapers for width transitions.
    It is **not** an auto-router — you must supply intermediate waypoints
    to create the path shape you want.

    Important: When connecting two ports, always add intermediate (x, y)
    waypoints so the route departs and arrives along each port's axis.
    Two ports alone produce a straight diagonal line between them,
    ignoring port directions.

    Example — connecting two ports with an S-bend::

        route = Route(Layer(1, 0), width=0.5, bend_radius=5.0)
        route.start_at_port(port_a)                    # departs along port_a's axis
        route.to(mid_x, port_a.position.y)             # horizontal segment out
        route.to(mid_x, port_b.position.y)             # vertical transition
        route.end_at_port(port_b)                      # arrives along port_b's axis
        cell = route.to_cell("my_route")

    Example — manual waypoints::

        route = Route(Layer(1, 0), width=0.5, bend_radius=5.0)
        route.start_at(0, 0, angle=0)
        route.to(50, 0)
        route.to(50, 30)
        route.end_at(100, 30, angle=0)
        cell = route.to_cell("my_route")

    Bend radius constraints
    -----------------------
    Quick reference for S-bend sizing (R = ``bend_radius``):

    * **Vertical segment**: ``dy >= 2 * R + 2`` (minimum, including margin)
    * **Each horizontal leg**: ``dx >= R``
    * **Fan-out pitch**: ``pitch >= 4 * R + port_spacing + 2``

    Example: R=10, port_spacing=2 -> pitch >= 44, each horizontal >= 10.

    Detailed explanation: each 90-degree corner consumes R of clearance
    on both adjacent segments (the "setback").  If the segment between
    two consecutive corners is shorter than the sum of their setbacks
    the bend radius is **auto-reduced** to fit, producing a build warning.

    For an S-bend (horizontal -> vertical -> horizontal):

    * **Vertical**: ``dy > 2 * R``.  Two quarter-circle bends stacked
      vertically each consume R of the vertical segment.  Use a margin
      of at least 1-2 um beyond the ``2R`` minimum -- the router
      auto-reduces at exactly ``2R`` due to internal tolerances.
    * **Horizontal**: each horizontal leg must be ``>= R``.

    When fanning out from closely-spaced ports to a wider pitch, the
    vertical offset per route is
    ``dy = (pitch - port_spacing) / 2``.  For ``dy > 2R``:
    ``pitch >= 4 * R + port_spacing + 2``.

    Fan-out / fan-in nesting order
    ------------------------------
    When routing from a cluster of closely-spaced ports to a set of
    widely-spread targets, each route uses a turning-column x-position
    for its vertical segment.  Assigning columns in sequential order
    causes outer routes' vertical segments to cross inner routes'
    horizontal segments.

    Fix: assign turning columns **outside-in** -- outermost
    source-destination pairs get the leftmost columns, inner pairs get
    progressively rightward columns.  For N sources the non-crossing
    order is ``[0, N-1, 1, N-2, ...]``, alternating from each end
    toward the center.  Space columns ``>= 2 * R`` apart so bend arcs
    do not overlap.

    Symmetric layouts (e.g. an MMI tree with upper and lower port
    groups) -- apply outside-in ordering **within each group
    independently**.  Do not interleave columns across groups that
    route to opposite sides of the layout.

    Avoiding overlaps (``no_overlap`` DRC rule)
    --------------------------------------------
    Each Route generates waveguide polygons on its layer. If two routes
    share the same horizontal or vertical corridor, their polygons
    physically overlap and ``rosette check`` reports ``no_overlap``
    violations. This is the **most common** cause of overlap errors —
    not port-to-component overlap at connection points.

    The problem arises when multiple routes converge to ports that sit
    on the same y-coordinate (or x-coordinate). A naive S-bend to each
    port creates a horizontal segment at that shared y-level, and those
    segments overlap in the x-range where they coincide.

    Fix: **give each route its own routing channel** — a unique y-level
    for horizontal segments and a unique x-level for vertical segments,
    with at least ``min_spacing`` between them.

    Example — 3 ports at the same y, routed without overlap::

        #  port_a, port_b, port_c all at y = 0, spread along x.
        #  Route from gc_a, gc_b, gc_c (at x = 0, different y).
        #  pairs = [(gc_a_port, port_a), (gc_b_port, port_b), ...]
        #
        #  Bad:  all 3 routes share a horizontal segment at y = 0
        #  Good: each route uses a unique horizontal channel
        vert_x = 50.0     # x for vertical segment (between GCs and ports)
        ch_spacing = 5.0   # um between channels (>= min_spacing)
        for i, (gc_port, target_port) in enumerate(pairs):
            ch_y = target_port.position.y - 30.0 - i * ch_spacing
            ring_x = target_port.position.x - 35.0  # approach column
            route = Route(layer, width=0.5, bend_radius=10.0)
            route.start_at_port(gc_port)
            route.to(vert_x, gc_port.position.y)   # vertical column
            route.to(vert_x, ch_y)                  # unique horiz channel
            route.to(ring_x, ch_y)                  # across to target
            route.to(ring_x, target_port.position.y)  # up to port
            route.end_at_port(target_port)

    Components that place multiple ports on one line (add-drop rings,
    MMI arrays, arrayed couplers) always need this channel-routing
    approach when more than one route must reach those ports.
    """

    def __init__(
        self,
        layer: Layer | int | tuple[int, int],
        width: float = 0.5,
        bend_radius: float = 5.0,
        auto_taper: bool = True,
        taper_length: float = 10.0,
    ) -> None: ...
    def start_at(self, x: float, y: float, angle: float = 0.0) -> None:
        """Start the route at a specific position and angle (degrees)."""
        ...
    def start_at_port(self, port: Port) -> None:
        """Start the route at a port's position, heading into the port.

        The port's outward-facing direction is flipped 180 degrees so the
        route departs in the correct direction (away from the component).
        The port's width is used as the starting width.

        Note: The first waypoint after this should continue along the
        port's axis (e.g., same y for a horizontal port) before turning.
        """
        ...
    def to(
        self,
        x: float,
        y: float,
        width: float | None = None,
        bend_radius: float | None = None,
    ) -> None:
        """Add a waypoint to the route.

        The route draws a straight segment from the previous waypoint to
        (x, y), inserting a circular bend at the corner if the direction
        changes. Provide intermediate waypoints to create L-bends and
        S-bends — the router does not infer turns on its own.
        """
        ...
    def end_at(self, x: float, y: float, angle: float = 0.0) -> None:
        """End the route at a specific position and angle (degrees)."""
        ...
    def end_at_port(self, port: Port) -> None:
        """End the route arriving into a port.

        The port's outward-facing direction is flipped 180 degrees so the
        route arrives heading into the component. The port's width is used
        as the ending width.

        Note: The last waypoint before this should approach along the
        port's axis (e.g., same y for a horizontal port) to ensure a
        flush connection.
        """
        ...
    def to_cell(self, name: str) -> Cell:
        """Convert the route to a Cell."""
        ...
    @property
    def path_length(self) -> float:
        """Total optical path length."""
        ...
    @property
    def warnings(self) -> list[str]:
        """Warnings from route generation (e.g., reduced bend radii)."""
        ...
    @staticmethod
    def through(
        *waypoints: Port | Point | tuple[float, float] | tuple[float, float, float],
        layer: Layer | int | tuple[int, int],
        width: float = 0.5,
        bend_radius: float = 5.0,
    ) -> Route:
        """Create a route through a series of waypoints.

        The route draws straight segments between consecutive waypoints,
        inserting bends at corners. You **must** include intermediate
        waypoints to create turns — two ports alone produce a straight
        diagonal line regardless of port directions.

        Port directions are used only for the first and last waypoint
        (to set departure/arrival angle). Intermediate ports are treated
        as plain (x, y) positions — their direction is ignored.

        Args:
            *waypoints: Sequence of waypoints. Each can be:
                - Port: position + width; direction used only if first/last
                - Point: uses position only
                - (x, y) tuple: position only
                - (x, y, angle) tuple: position and angle (first/last only)
            layer: The layer for the route
            width: Default waveguide width
            bend_radius: Default bend radius

        Example — S-bend between two component ports::

            route = Route.through(
                port_a,             # start at port_a, depart along its axis
                (25, port_a.position.y),   # extend horizontally
                (25, port_b.position.y),   # shift vertically
                port_b,             # arrive at port_b along its axis
                layer=Layer(1, 0),
                bend_radius=10.0,
            )
            cell = route.to_cell("my_route")
        """
        ...

# =============================================================================
# I/O Functions
# =============================================================================

def read_gds(path: str) -> Library:
    """Read a GDS file and return a Library.

    Args:
        path: Path to the GDS file

    Returns:
        A Library containing all cells from the GDS file
    """
    ...

def write_gds(
    path: str,
    design: Cell | Library,
    cells: list[Cell] | None = None,
    quiet: bool = False,
    verbose: bool = False,
) -> None:
    """Write a Cell or Library to a GDS file.

    A build summary is printed to stderr by default, providing feedback about
    the design. Use quiet=True to suppress, verbose=True for details.

    Args:
        path: Output file path
        design: Cell or Library to write
        cells: Child cells (only valid when design is a Cell with references)
        quiet: If True, suppress the build summary
        verbose: If True, print detailed build info
    """
    ...

def to_json(
    design: Cell | Library,
    cells: list[Cell] | None = None,
) -> str:
    """Serialize a Cell or Library to compact JSON.

    Preserves the full hierarchical structure including cells, cell references,
    paths, text, and ports. Used internally by `rosette serve` to send the
    complete design to the web viewer.

    Args:
        design: Cell or Library to serialize
        cells: Child cells (only valid when design is a Cell with references)

    Returns:
        Compact JSON string representation of the library
    """
    ...

# =============================================================================
# Layer Map (project configuration)
# =============================================================================

class LayerInfo:
    """A single layer definition with metadata.

    Access the underlying Layer for API calls via the ``layer`` attribute.

    Attributes:
        layer: The underlying Layer(number, datatype)
        name: Semantic name (e.g., "silicon", "text")
        number: GDS layer number (shortcut for layer.number)
        datatype: GDS datatype (shortcut for layer.datatype)
        color: Hex color string (e.g., "#ff69b4")
        fill: Fill pattern ("solid", "hatched", "crosshatched", "dotted")
        opacity: Fill opacity 0.0-1.0
        description: Human-readable description
    """

    layer: Layer
    name: str
    number: int
    datatype: int
    color: str
    fill: str
    opacity: float
    description: str

class LayerMap:
    """Named layer definitions from rosette.toml.

    Access layers by attribute::

        layers = load_layer_map()
        layers.silicon        # LayerInfo
        layers.silicon.layer  # Layer(1, 0) -- use this in API calls
        layers.silicon.color  # "#ff69b4"
    """

    def __getattr__(self, name: str) -> LayerInfo: ...
    def get(self, name: str) -> LayerInfo | None:
        """Get a layer by name, or None if not found."""
        ...
    def names(self) -> list[str]:
        """Get all layer names."""
        ...
    def __contains__(self, name: str) -> bool: ...
    def __iter__(self) -> Iterator[LayerInfo]: ...
    def __len__(self) -> int: ...
    def __repr__(self) -> str: ...

def load_layer_map(config_path: str | Path | None = None) -> LayerMap:
    """Load layer definitions from rosette.toml.

    Reads the ``[layers]`` section and returns a LayerMap with
    attribute-style access to each named layer.

    Example::

        layers = load_layer_map()
        silicon = layers.silicon.layer   # Layer(1, 0)
        gc = grating_coupler(silicon, waveguide_width=0.5)
        cell.add_polygon(poly, silicon)
    """
    ...

# =============================================================================
# Connection Helpers
# =============================================================================

def connect_transform(component_port: Port, target_port: Port) -> Transform:
    """Calculate the transform to connect one port to another.

    This aligns a component so that `component_port` matches the position
    of `target_port` with opposite directions (so they face each other).

    Args:
        component_port: The port on the component to be placed
        target_port: The port to connect to

    Returns:
        A Transform that, when applied to the component, aligns the ports.
    """
    ...

# =============================================================================
# Geometry Utility Functions
# =============================================================================

def arc_points(
    center: Point,
    radius: float,
    start_angle: float,
    end_angle: float,
    num_points: int = 64,
) -> list[Point]:
    """Generate points along a circular arc.

    Args:
        center: Center point of the arc
        radius: Radius of the arc
        start_angle: Starting angle in degrees (0 = +X direction)
        end_angle: Ending angle in degrees
        num_points: Number of points to generate (default: 64)

    Returns:
        List of points along the arc
    """
    ...

def offset_polygon(centerline: list[Point], width: float) -> Polygon:
    """Create a polygon from a centerline and uniform width.

    The polygon is created by offsetting the centerline perpendicular to the
    path direction at each point, forming a "ribbon" shape.

    Args:
        centerline: List of points defining the centerline path (minimum 2 points)
        width: Width of the polygon

    Returns:
        A closed polygon

    Raises:
        ValueError: If centerline has fewer than 2 points
    """
    ...

def offset_polygon_varying(centerline: list[Point], widths: list[float]) -> Polygon:
    """Create a polygon from a centerline with varying width.

    Similar to offset_polygon, but allows specifying a different width at each
    centerline point for tapered or variable-width shapes.

    Args:
        centerline: List of points defining the centerline path
        widths: Width at each centerline point (must have same length as centerline)

    Returns:
        A closed polygon

    Raises:
        ValueError: If inputs are invalid
    """
    ...

def path_length(points: list[Point]) -> float:
    """Calculate the total length of a polyline path.

    Args:
        points: List of points defining the path

    Returns:
        Sum of distances between consecutive points
    """
    ...

def fresnel_c(t: float) -> float:
    """Fresnel cosine integral C(t).

    The Fresnel cosine integral is defined as:
    C(t) = integral from 0 to t of cos(pi/2 * u^2) du

    Used for generating Euler (clothoid) spiral bends.

    Args:
        t: Upper limit of integration

    Returns:
        The value of C(t)
    """
    ...

def fresnel_s(t: float) -> float:
    """Fresnel sine integral S(t).

    The Fresnel sine integral is defined as:
    S(t) = integral from 0 to t of sin(pi/2 * u^2) du

    Used for generating Euler (clothoid) spiral bends.

    Args:
        t: Upper limit of integration

    Returns:
        The value of S(t)
    """
    ...

# =============================================================================
# DRC (Design Rule Checking)
# =============================================================================

class DrcRules:
    """Builder for DRC rule sets.

    Example:
        rules = (
            DrcRules()
            .min_width(Layer(1), 0.1, name="M1.W.1")
            .min_spacing(Layer(1), Layer(1), 0.15)
            .min_area(Layer(1), 0.01)
        )
    """

    def __init__(self) -> None: ...
    def min_width(
        self,
        layer: Layer | int | tuple[int, int],
        width: float,
        name: str | None = None,
    ) -> DrcRules:
        """Add minimum width rule for a layer."""
        ...
    def min_spacing(
        self,
        layer1: Layer | int | tuple[int, int],
        layer2: Layer | int | tuple[int, int],
        spacing: float,
        name: str | None = None,
    ) -> DrcRules:
        """Add minimum spacing rule between two layers."""
        ...
    def min_area(
        self,
        layer: Layer | int | tuple[int, int],
        area: float,
        name: str | None = None,
    ) -> DrcRules:
        """Add minimum area rule for a layer."""
        ...
    def min_enclosure(
        self,
        inner: Layer | int | tuple[int, int],
        outer: Layer | int | tuple[int, int],
        enclosure: float,
        name: str | None = None,
    ) -> DrcRules:
        """Add enclosure rule (inner must be enclosed by outer)."""
        ...
    def require_overlap(
        self,
        layer1: Layer | int | tuple[int, int],
        layer2: Layer | int | tuple[int, int],
        name: str | None = None,
    ) -> DrcRules:
        """Add rule requiring overlap between two layers."""
        ...
    def forbid_overlap(
        self,
        layer1: Layer | int | tuple[int, int],
        layer2: Layer | int | tuple[int, int],
        name: str | None = None,
    ) -> DrcRules:
        """Add rule forbidding overlap between two layers.

        Supports same-layer usage (layer1 == layer2) to detect overlapping
        polygons within a single layer. In TOML config, use ``no_overlap = true``
        in a per-layer section as a shorthand.
        """
        ...
    def allowed_angles(
        self,
        layer: Layer | int | tuple[int, int],
        angles: list[float],
        name: str | None = None,
    ) -> DrcRules:
        """Add rule restricting edge angles to specified values (degrees)."""
        ...
    def min_edge_length(
        self,
        layer: Layer | int | tuple[int, int],
        length: float,
        name: str | None = None,
    ) -> DrcRules:
        """Add minimum edge length rule for a layer (catches tiny jogs/notches)."""
        ...
    def no_self_intersection(
        self,
        layer: Layer | int | tuple[int, int],
        name: str | None = None,
    ) -> DrcRules:
        """Add self-intersection check for a layer (invalid geometry detection)."""
        ...
    def max_width(
        self,
        layer: Layer | int | tuple[int, int],
        width: float,
        name: str | None = None,
    ) -> DrcRules:
        """Add maximum width rule for a layer (e.g., single-mode waveguide enforcement)."""
        ...
    def snap_to_grid(
        self,
        layer: Layer | int | tuple[int, int],
        grid_pitch: float,
        name: str | None = None,
    ) -> DrcRules:
        """Add snap-to-grid check for a layer.

        Verifies all vertex coordinates are multiples of the manufacturing grid
        pitch. Off-grid geometry causes mask fracturing errors and is rejected
        by foundries.

        Common values: 0.001 (1 nm grid) or 0.005 (5 nm grid).
        """
        ...
    def __repr__(self) -> str: ...

class DrcViolation:
    """A single DRC violation."""

    rule_name: str | None
    message: str
    severity: str  # "error" or "warning"
    rule_type: str
    layer: tuple[int, int]
    layer2: tuple[int, int] | None
    bbox: tuple[tuple[float, float], tuple[float, float]]
    cell_name: str | None
    """Name of the cell containing the first polygon (for pairwise violations)."""
    cell_name2: str | None
    """Name of the cell containing the second polygon (for pairwise violations)."""
    def __repr__(self) -> str: ...

class DrcResult:
    """Result of running DRC."""

    violations: list[DrcViolation]
    passed: bool
    polygons_checked: int
    rules_checked: int
    elapsed_ms: float
    def __len__(self) -> int: ...
    def __repr__(self) -> str: ...

def run_drc(
    cell: Cell,
    rules: DrcRules,
    library: Library | None = None,
) -> DrcResult:
    """Run DRC on a cell.

    Args:
        cell: The cell to check
        rules: DRC rules to apply
        library: Library containing referenced cells. If None, CellRefs
                 cannot be resolved and are skipped during flattening.

    Returns:
        DrcResult with violations and statistics

    Example:
        rules = load_drc_rules()  # Load from rosette.toml
        result = run_drc(cell, rules)
        if result.passed:
            print("DRC passed!")
        else:
            for v in result.violations:
                print(f"  {v.message}")
    """
    ...

# =============================================================================
# Component Reference (NOT part of rosette._core)
# =============================================================================
#
# The stubs below document components from the project's components/ directory.
# They are NOT importable from rosette -- import them as:
#     from components import grating_coupler, mmi_1x2, ...
#
# These stubs are included here as a quick reference for type signatures and
# placement notes. The editable source lives in components/.

def grating_coupler(
    layer: Layer,
    waveguide_width: float = 0.5,
    period: float = 0.63,
    fill_factor: float = 0.5,
    num_periods: int = 25,
    focusing_angle: float | None = 20.0,
    grating_width: float = 12.0,
    taper_length: float = 20.0,
) -> Cell:
    """Create a grating coupler for fiber-to-chip coupling.

    Geometry: taper + teeth extend in **-X** from the origin.
    Port: ``"opt"`` at ``(0, 0)``, facing **+X**.

    Placement: rotate the GC so ``"opt"`` faces **toward** the target
    port.  The grating body (taper + teeth) will then extend **away**.

    ============  ==============  ======================
    opt faces     Rotation        Grating body extends
    ============  ==============  ======================
    +X (right)    0 (default)     -X (left)
    -X (left)     180             +X (right)
    +Y (up)       90              -Y (down)
    -Y (down)     -90             +Y (up)
    ============  ==============  ======================

    Example — connect to a port facing +X (e.g. MMI output)::

        # GC opt must face -X (toward the port) -> rotate 180
        gc_out = gc.at(0, 0).rotate(180).at(x, y)

    Example — connect to a port facing -X (e.g. MMI input)::

        # GC opt already faces +X (toward the port) -> no rotation
        gc_in = gc.at(x, y)
    """
    ...

# =============================================================================
# DFM (Design for Manufacturability) Prediction
# =============================================================================

class DfmConfig:
    """Configuration for DFM prediction.

    Example:
        config = DfmConfig(resolution=0.01, padding=1.0)
        result = run_dfm(cell, layers=[Layer(1)], config=config)

        # With tolerances for pass/fail checking:
        config = DfmConfig(resolution=0.01, max_area_deviation=0.10)
    """

    resolution: float
    padding: float
    contour_threshold: float
    keep_raster: bool
    max_area_deviation: float | None
    has_tolerances: bool

    def __init__(
        self,
        resolution: float = 0.01,
        padding: float = 1.0,
        contour_threshold: float = 0.5,
        keep_raster: bool = False,
        max_area_deviation: float | None = None,
        severity: str = "error",
    ) -> None: ...
    def set_layer_config(
        self,
        layer: Layer | int | tuple[int, int],
        sigma: float | None = None,
        max_area_deviation: float | None = None,
        severity: str | None = None,
    ) -> None:
        """Set per-layer model and tolerance overrides.

        Per-layer settings override the global defaults for a specific layer.
        Parameters left as None fall back to the global config.

        If sigma is provided, a per-layer GaussianModel is created with the
        specified sigma (using the config's resolution for pixel conversion).

        Example:
            config = DfmConfig(resolution=0.01)
            config.set_layer_config(Layer(1, 0), sigma=0.05, max_area_deviation=0.05)
            config.set_layer_config(Layer(2, 0), sigma=0.15)
        """
        ...
    def __repr__(self) -> str: ...

class GaussianModel:
    """Gaussian blur DFM model for proximity effect simulation.

    Simulates optical proximity effects during lithography by applying
    a Gaussian blur to the rasterized geometry. The model produces
    continuous values in [0.0, 1.0] representing fabrication probability.
    Binarization is controlled by contour_threshold in DfmConfig.

    Example:
        model = GaussianModel(sigma=0.08)
        result = run_dfm(cell, layers=[Layer(1)], model=model)
    """

    sigma: float
    name: str

    def __init__(self, sigma: float) -> None: ...
    def __repr__(self) -> str: ...

class LayerMetrics:
    """Per-layer comparison metrics between designed and predicted geometry."""

    layer: tuple[int, int]
    max_edge_deviation: float
    """Maximum edge deviation in design units."""
    area_deviation: float
    """Relative area change (signed: negative = shrinkage)."""
    designed_area: float
    """Designed area in design units squared."""
    predicted_area: float
    """Predicted area in design units squared."""
    designed_feature_count: int
    """Number of connected components in the designed raster."""
    predicted_feature_count: int
    """Number of connected components in the predicted raster."""
    def __repr__(self) -> str: ...

class DfmViolation:
    """A single DFM violation."""

    layer: tuple[int, int]
    violation_type: str
    """Type: "area_deviation", "feature_erasure", or "feature_merge"."""
    message: str
    severity: str
    """Severity: "error" or "warning"."""
    bbox: tuple[tuple[float, float], tuple[float, float]]
    max_allowed: float | None
    """Maximum allowed value (for area_deviation), or None."""
    actual: float | None
    """Actual measured value (for area_deviation), or None."""
    designed_count: int | None
    """Number of designed features (for feature_erasure/feature_merge), or None."""
    predicted_count: int | None
    """Number of predicted features (for feature_erasure/feature_merge), or None."""
    def __repr__(self) -> str: ...

class LayerPrediction:
    """Prediction result for a single layer."""

    layer: tuple[int, int]
    predicted_polygons: list[Polygon]
    input_polygon_count: int
    predicted_polygon_count: int
    metrics: LayerMetrics | None
    violations: list[DfmViolation]
    has_raster: bool
    raster_data: list[float] | None
    raster_width: int | None
    raster_height: int | None
    raster_origin: tuple[float, float] | None
    def __repr__(self) -> str: ...

class DfmResult:
    """Result of running DFM prediction."""

    layers: list[LayerPrediction]
    total_predicted_polygons: int
    total_input_polygons: int
    passed: bool
    violations: list[DfmViolation]
    layers_processed: int
    total_pixels: int
    resolution: float
    elapsed_ms: float
    def __len__(self) -> int: ...
    def __repr__(self) -> str: ...

def run_dfm(
    cell: Cell,
    layers: list[Layer],
    model: GaussianModel | None = None,
    config: DfmConfig | None = None,
    library: Library | None = None,
) -> DfmResult:
    """Run DFM prediction on a cell.

    Rasterizes each specified layer, applies the fabrication prediction model,
    extracts contour polygons, and computes comparison metrics.

    Args:
        cell: The cell to predict
        layers: Layers to process
        model: The prediction model (default: GaussianModel with sigma=0.08)
        config: DFM configuration (default: DfmConfig())
        library: Library containing referenced cells (required if cell has refs)

    Returns:
        DfmResult with per-layer predictions, metrics, and violations

    Example:
        result = run_dfm(cell, layers=[Layer(1, 0)])
        for lp in result.layers:
            m = lp.metrics
            if m:
                print(f"  Layer {lp.layer}: edge dev {m.max_edge_deviation:.3f} um")
    """
    ...

# ---------------------------------------------------------------------------
# Design checks
# ---------------------------------------------------------------------------

class ChecksConfig:
    """Configuration for design checks."""

    def __init__(
        self,
        position_tolerance: float = 0.001,
        angle_tolerance: float = 0.1,
        check_widths: bool = True,
        min_bend_radius: float | None = None,
        severity: str = "error",
    ) -> None:
        """Create a new checks config.

        Args:
            position_tolerance: Max gap between port centres to count as connected (default 0.001)
            angle_tolerance: Max angular deviation from anti-parallel in degrees (default 0.1)
            check_widths: Whether to flag width mismatches (default True)
            min_bend_radius: Minimum allowed bend radius in um, or None to skip (default None)
            severity: Default severity, "error" or "warning" (default "error")
        """
        ...
    def __repr__(self) -> str: ...

class CheckViolation:
    """A single check violation."""

    violation_type: str
    """Type: "unconnected_port", "width_mismatch", "angle_mismatch", "bend_radius_too_small", "bend_radius_auto_reduced"."""
    name: str
    """Name of the relevant port or component."""
    cell_path: str
    """Hierarchy path (e.g. "mmi_1/out_2")."""
    partner_name: str | None
    """Name of the partner port (for connectivity mismatch violations)."""
    partner_path: str | None
    """Hierarchy path to the partner port."""
    message: str
    """Human-readable description."""
    severity: str
    """Severity: "error" or "warning"."""
    bbox: tuple[tuple[float, float], tuple[float, float]]
    """Bounding box as ((min_x, min_y), (max_x, max_y))."""
    def __repr__(self) -> str: ...

class ChecksResult:
    """Result of running design checks."""

    passed: bool
    """True if no violations were found."""
    violations: list[CheckViolation]
    """List of violations found."""
    ports_checked: int
    """Number of ports checked."""
    connections_found: int
    """Number of port-to-port connections found."""
    bends_checked: int
    """Number of bends checked."""
    elapsed_ms: float
    """Elapsed time in milliseconds."""
    def __len__(self) -> int: ...
    def __repr__(self) -> str: ...

def run_checks(
    cell: Cell,
    config: ChecksConfig | None = None,
    library: Library | None = None,
) -> ChecksResult:
    """Run design checks on a cell.

    Runs all design checks: connectivity (unconnected ports, width/angle
    mismatch) and bend radius (below minimum, auto-reduced).

    Ports on the top-level cell are treated as external I/O and are not
    flagged as unconnected.

    Args:
        cell: The cell to check
        config: Checks config (default: ChecksConfig())
        library: Library containing referenced cells (required if cell has refs)

    Returns:
        ChecksResult with violations and statistics
    """
    ...

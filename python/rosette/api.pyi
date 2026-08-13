"""Public Rosette API contract and project agent reference.

All coordinates, dimensions, and distances are in microns (um).

This is a reference contract rather than an importable module stub. In
initialized projects it is copied to ``.rosette/api.pyi``. Atomic layout types
are imported from ``rosette``. Feature declarations below are imported from
their owning modules: ``rosette.layout``, ``rosette.routing``, ``rosette.io``,
``rosette.geometry``, ``rosette.project``, ``rosette.drc``, ``rosette.checks``,
``rosette.dfm``, and ``rosette.render``. Project-local components remain outside
this contract; their source, signatures, and documentation live in the
template-specific ``components/`` package.

Canonical imports::

    from rosette import Cell, Layer, Point, Polygon, Port
    from rosette.checks import ChecksConfig, ChecksResult, run_checks
    from rosette.dfm import DfmConfig, DfmResult, run_dfm
    from rosette.drc import DrcResult, DrcRules, run_drc
    from rosette.geometry import arc_points
    from rosette.io import read_gds, write_gds
    from rosette.layout import ArrayCopy
    from rosette.project import LayerInfo, LayerMap, load_layer_map
    from rosette.render import RenderResult, render_png
    from rosette.routing import Route
"""

from collections.abc import Iterator
from pathlib import Path
from typing import Literal

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
    """A polygon with at least three finite vertices.

    Repeated vertices, zero-area rings, and self-intersections remain
    representable. Transformations raise ``ValueError`` rather than returning
    a polygon with non-finite coordinates.
    """

    def __init__(self, vertices: list[Point]) -> None: ...
    @staticmethod
    def rect(origin: Point, width: float, height: float) -> Polygon: ...
    @staticmethod
    def rect_centered(center: Point, width: float, height: float) -> Polygon: ...
    @staticmethod
    def regular(center: Point, radius: float, sides: int) -> Polygon: ...
    def vertices(self) -> list[Point]: ...
    def __len__(self) -> int: ...
    def area(self) -> float:
        """Return the absolute area, independent of vertex winding."""
        ...
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
    def __iter__(self) -> Iterator[Point]: ...
    def __repr__(self) -> str: ...

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

    Placement and per-copy array transforms must remain finite and invertible;
    uniform scale factors must also be nonzero. Array dimensions are limited
    to 1 through 32767, and array spacings/vectors must be finite. Invalid
    builder inputs raise ``ValueError`` without modifying the existing Instance.

    Example:
        input_instance = unit_cell.at(0, 0)
        output_instance = unit_cell.at(100, 0)

        # Get ports directly - no need to pass cell again
        port_in = input_instance.port("io")
        port_out = output_instance.port("io")

        # Add to design
        top.add_ref(input_instance)
        top.add_ref(output_instance)

        # Rotate then place at a specific position:
        rotated = some_cell.at(0, 0).rotate(90).at(50, 100)

        # Caution: rotation shifts the bounding box relative to the
        # anchor. A 45° rotation moves the geometry's visual center,
        # so you may need to adjust the final .at() offset:
        rotated45 = block.at(0, 0).rotate(45).at(x + 4, y - 2)
    """

    def __init__(
        self,
        cell: Cell,
        transform: Transform | None = None,
        repetition: tuple[int, int, float, float]
        | tuple[int, int, float, float, float, float]
        | None = None,
    ) -> None: ...
    @property
    def cell(self) -> Cell:
        """The underlying cell definition."""
        ...
    @property
    def transform(self) -> Transform:
        """The current transform applied to this instance."""
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
        """Set array repetition (columns x rows rectangular grid with given pitch).

        Creates a GDS AREF — a single compact array reference instead of
        many individual references. In the viewer, the entire array is
        selected as one object.

        Args:
            columns: Number of columns (1 to 32767).
            rows: Number of rows (1 to 32767).
            col_spacing: Column pitch — center-to-center distance between
                adjacent copies along local +X, in µm. Negative values
                place copies along local -X.
            row_spacing: Row pitch — center-to-center distance between
                adjacent copies along local +Y, in µm. Negative values
                place copies along local -Y.

        Raises:
            ValueError: If columns or rows is outside the range [1, 32767].
                The upper bound is the GDS COLROW INT16 limit.

        Note:
            For hex packings or any skewed / non-orthogonal grid, use
            :meth:`array_vectors` instead.

        Example:
            unit = Cell("unit")
            arr = unit.at(0, 0).array(10, 5, 20.0, 15.0)
        """
        ...
    def array_vectors(
        self,
        columns: int,
        rows: int,
        col_vector: Vector2,
        row_vector: Vector2,
    ) -> Instance:
        """Set array repetition from arbitrary column and row displacement vectors.

        Lower-level constructor supporting non-orthogonal lattices — hex
        packings, skewed test arrays, etc. Vectors are defined in the
        instance's local (pre-transform) coordinate space, in µm.

        Args:
            columns: Number of columns (1 to 32767).
            rows: Number of rows (1 to 32767).
            col_vector: Column displacement — the offset between copy
                ``(c, r)`` and ``(c+1, r)``, in µm.
            row_vector: Row displacement — the offset between copy
                ``(c, r)`` and ``(c, r+1)``, in µm.

        Raises:
            ValueError: If columns or rows is outside the range [1, 32767].
        """
        ...
    def port(self, name: str, col: int = 0, row: int = 0) -> Port:
        """Get a transformed port from this instance.

        The Instance already knows its cell definition, so only the port name
        and optional array coordinates are needed.

        Both position and direction are fully transformed (translation,
        rotation, mirroring). For example, a port facing +X will face -X
        after a 180-degree rotation.

        For arrayed instances (see :meth:`array` / :meth:`array_vectors`),
        pass ``col`` and ``row`` to address a specific copy in the
        lattice. The default ``(0, 0)`` returns the port of the anchor
        copy, matching the behaviour of non-arrayed instances.

        Args:
            name: Name of the port to retrieve
            col: Grid column of the copy to query (0-indexed). Only
                meaningful on arrayed instances.
            row: Grid row of the copy to query (0-indexed). Only
                meaningful on arrayed instances.

        Returns:
            The port with position and direction transformed

        Raises:
            KeyError: If the port is not found in the cell
            IndexError: If ``col`` or ``row`` is outside the array bounds

        Example:
            placed = unit_cell.at(100, 50)
            io_port = placed.port("io")  # Transformed position and direction

            # 180-degree rotation flips both position and direction:
            flipped = unit_cell.at(0, 0).rotate(180).at(50, 0)
            p = flipped.port("io")   # direction is now (-1, 0)

            # Arrayed: address a specific copy.
            bank = unit_cell.at(0, 0).array(8, 1, 30.0, 0.0)
            p = bank.port("in", col=3)
        """
        ...
    @property
    def array_shape(self) -> tuple[int, int]:
        """Grid dimensions ``(columns, rows)`` of this instance.

        Returns ``(1, 1)`` for non-arrayed instances.
        """
        ...
    def copies(self) -> Iterator[ArrayCopy]:
        """Iterate over the individual copies in this instance's array.

        Yields one :class:`ArrayCopy` per grid position, in
        column-major order (``col`` varies fastest). Each yielded
        object exposes ``col``, ``row``, a world-space ``transform``,
        and a :meth:`ArrayCopy.port` convenience for per-copy port
        access — without mutating this instance or adding extra GDS
        references.

        For a non-arrayed instance this yields exactly one copy at
        ``(col=0, row=0)``.
        """
        ...
    def __repr__(self) -> str: ...

class ArrayCopy:
    """A single copy in an arrayed :class:`Instance`.

    Produced by :meth:`Instance.copies`. Exposes the copy's grid position, its world-space
    transform, and a :meth:`port` helper for retrieving the
    transformed port of this specific copy.

    ``ArrayCopy`` is a lightweight view over the parent instance — it
    does **not** add geometry or a GDS reference when constructed.
    """

    @property
    def col(self) -> int:
        """Grid column of this copy (0-indexed)."""
        ...
    @property
    def row(self) -> int:
        """Grid row of this copy (0-indexed)."""
        ...

    def __init__(self, instance: Instance, col: int, row: int) -> None:
        """Create an ArrayCopy view.

        Typically not called directly — use :meth:`Instance.copies`.
        """
        ...

    @property
    def transform(self) -> Transform:
        """World-space transform of this copy.

        The outer transform of the parent Instance composed with the
        local copy offset.
        """
        ...
    @property
    def position(self) -> Point:
        """World-space position of the copy's anchor (local origin)."""
        ...
    @property
    def cell(self) -> Cell:
        """The underlying cell definition (shared with the parent Instance)."""
        ...
    def port(self, name: str) -> Port:
        """Get the transformed port of this specific copy.

        Equivalent to ``parent.port(name, col=self.col, row=self.row)``.

        Args:
            name: Name of the port to retrieve.

        Returns:
            The port with position and direction transformed.

        Raises:
            KeyError: If the port is not found in the cell.
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
    """A validated named connection point.

    Names are nonempty, positions are finite, directions are finite and
    nonzero, and optional widths are positive and finite. Directions are
    normalized during construction. Port names must be unique within a Cell.
    """

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

class Cell:
    """A cell whose mutations validate before committing.

    Invalid geometry, reference, text, or port inputs raise ``ValueError`` and
    leave both cell contents and tracked hierarchy state unchanged.
    """

    name: str
    path_length: float | None
    bends: list[dict[str, float]]
    """Bend info entries as list of dicts with keys: radius, x, y, and optionally requested_radius."""
    cell_warnings: list[str]
    """Warnings from cell construction."""
    drc_skip: bool
    """Whether this cell is marked as trusted for DRC.

    When True, DRC violations attributed entirely to this cell (or cells in
    its subtree) are suppressed from the final DRC result. Inter-cell
    violations against an untrusted cell are still reported.
    """
    drc_waive_regions: list[BBox]
    """DRC region waivers defined on this cell, in local coordinates.

    Each waiver is an axis-aligned ``BBox`` in this cell's local coordinate
    frame. A DRC violation whose location is fully contained within one of
    these regions (after the region is transformed into top-level global
    coordinates for the relevant placement of this cell) is suppressed from
    the final DRC result. Used for intentional local violations such as taper
    tips. Like ``drc_skip``, region waivers are not persisted to GDS.
    """
    def __init__(self, name: str, *, drc_skip: bool = False) -> None:
        """Create a new empty cell.

        Args:
            name: Cell name.
            drc_skip: If True, mark this cell as trusted for DRC.

        Raises:
            ValueError: If the name is empty, longer than 32 characters,
                or contains non-printable ASCII characters (spaces, Unicode, etc.)
        """
        ...
    def add_drc_waive_region(self, region: BBox) -> None:
        """Add a DRC region waiver in this cell's local coordinate frame.

        Any DRC violation fully contained within ``region`` (after
        transforming into global coordinates for each placement of this cell)
        is suppressed. See ``drc_waive_regions``.
        """
        ...
    def clear_drc_waive_regions(self) -> None:
        """Remove all DRC region waivers from this cell."""
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
            points: At least two finite Point objects along the path centerline
            width: Finite, nonzero width. Negative values preserve GDS
                absolute-width semantics.
            layer: Layer number or Layer object
            end_type: Path end type (default: PathEndType.FLUSH)

        Example:
            cell.add_path(
                [Point(0, 0), Point(100, 0), Point(100, 50)],
                width=0.5,
                layer=1,
                end_type=PathEndType.ROUND
            )

        Raises:
            ValueError: If the points or width are invalid. The cell is left
                unchanged.
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
            position: Finite position of the text
            layer: Layer number or Layer object
            height: Positive finite text height in user units (default: 1.0)

        Example:
            cell.add_text("Input", Point(0, 5), layer=10)
            cell.add_text("Big Label", Point(0, 10), layer=10, height=5.0)

        Raises:
            ValueError: If the position or height is invalid. The cell is left
                unchanged.
        """
        ...
    def add_port(self, port: Port) -> None:
        """Add a validated port whose name is not already used by this cell.

        Raises ``ValueError`` without changing the cell for an invalid or
        duplicate port.
        """
        ...
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
    def polygons(self) -> list[tuple[Polygon, Layer]]:
        """Get all polygons (and their layers) stored directly on this cell.

        Does not descend into referenced cells; only returns polygons added
        via ``add_polygon``. Cell references and paths are excluded.

        Returns:
            List of ``(Polygon, Layer)`` tuples.
        """
        ...
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
            input_instance = unit_cell.at(0, 0)
            output_instance = unit_cell.at(100, 0)

            # Get ports directly from instances
            port_in = input_instance.port("io")
            port_out = output_instance.port("io")

            # Array of identical cells (single AREF, selected as one unit):
            top.add_ref(unit_cell.at(0, 0).array(10, 10, pitch, pitch))
        """
        ...
    def add_ref(self, ref: Cell | Instance) -> None:
        """Add a cell or resolved instance.

        When adding a Cell or Instance, the child cell is automatically
        tracked for write_gds().

        For uniform grids of identical copies at a fixed pitch, call
        ``.array()`` on the instance before passing it to ``add_ref``
        instead of looping ``add_ref`` N*M times.  This emits a single
        GDS AREF rather than many SREFs -- compact on disk and fast in
        the viewer.  Mix with individual ``add_ref`` calls when per-copy
        differences are needed (labels, unique port connections, etc.)::

            top.add_ref(unit.at(0, 0).array(cols, rows, pitch_x, pitch_y))

        Args:
            ref: A Cell (placed at origin) or Instance to add

        Example:
            top.add_ref(unit_cell.at(0, 0))      # Instance at position
            top.add_ref(route.to_cell("wg"))     # Cell at origin

        Raises:
            ValueError: If the placement is invalid. The parent reference list
                and tracked child set are left unchanged.
        """
        ...
    def __repr__(self) -> str: ...

class Library:
    name: str
    def __init__(self, name: str) -> None: ...
    def add_cell(
        self,
        cell: Cell,
        *,
        on_duplicate: Literal["error", "keep"] = "error",
    ) -> None:
        """Add a cell to the library.

        Args:
            cell: Cell definition to insert.
            on_duplicate: ``"error"`` rejects an existing identity;
                ``"keep"`` retains the existing definition.

        Raises:
            ValueError: If the cell name is invalid or a cell with the
                same name already exists under the ``"error"`` policy.
        """
        ...
    def add_cell_recursive(
        self,
        cell: Cell,
        available_cells: list[Cell],
        *,
        on_duplicate: Literal["error", "keep"] = "keep",
    ) -> None:
        """Add a cell and all its referenced cells recursively.

        This method automatically adds all cells that are referenced by the
        given cell, resolving the entire hierarchy. You must provide a list
        of all available cells that may be referenced. Validation completes
        before mutation, so failures never leave a partial hierarchy.

        Args:
            cell: The cell to add (typically the top-level cell)
            available_cells: List of all cells that may be referenced
            on_duplicate: ``"error"`` rejects reachable existing identities;
                ``"keep"`` uses their installed definitions.

        Raises:
            ValueError: If a name is invalid, a reference is missing, a cycle
                exists, candidate identities are ambiguous, or duplicate
                policy rejects an existing definition.
        """
        ...
    def cell(self, name: str) -> Cell | None: ...
    def cells(self) -> list[Cell]: ...
    def roots(self) -> list[Cell]:
        """Get graph-derived roots in deterministic library order.

        A root is a cell that no other cell references. Closed cycles may
        therefore have no roots.
        """
        ...
    def set_top_cell(self, name: str) -> None:
        """Select an existing cell as the explicit top entry cell.

        Versioned Rosette JSON preserves the selection. GDS has no top-cell
        record and therefore does not preserve it.

        Raises:
            ValueError: If ``name`` does not identify a library cell.
        """
        ...
    def clear_top_cell(self) -> None:
        """Clear explicit top selection and restore unique-root inference."""
        ...
    def top_cell(self) -> Cell | None:
        """Get the explicit top cell or sole graph-derived root.

        Returns ``None`` for empty, ambiguous multi-root, and rootless cyclic
        libraries when no explicit top is selected.
        """
        ...
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
    inserting circular bends at corners and interpolating width across segments.
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

    For symmetric layouts with upper and lower port groups, apply outside-in
    ordering **within each group independently**. Do not interleave columns
    across groups that route to opposite sides of the layout.

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
        #  Source ports are at x = 0 with different y coordinates.
        #  pairs = [(source_a, port_a), (source_b, port_b), ...]
        #
        #  Bad:  all 3 routes share a horizontal segment at y = 0
        #  Good: each route uses a unique horizontal channel
        vert_x = 50.0      # x for the shared vertical region
        ch_spacing = 5.0   # um between channels (>= min_spacing)
        for i, (source_port, target_port) in enumerate(pairs):
            ch_y = target_port.position.y - 30.0 - i * ch_spacing
            approach_x = target_port.position.x - 35.0
            route = Route(layer, width=0.5, bend_radius=10.0)
            route.start_at_port(source_port)
            route.to(vert_x, source_port.position.y)
            route.to(vert_x, ch_y)                  # unique horiz channel
            route.to(approach_x, ch_y)               # across to target
            route.to(approach_x, target_port.position.y)
            route.end_at_port(target_port)

    Cells that place multiple ports on one line need this channel-routing
    approach when more than one route must reach those ports.
    """

    def __init__(
        self,
        layer: Layer | int | tuple[int, int],
        width: float = 0.5,
        bend_radius: float = 5.0,
        bend_profile: Literal["circular", "euler"] = "circular",
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
        changes. A width override is interpolated across the full segment
        ending at this waypoint. Provide intermediate waypoints to create
        L-bends and S-bends — the router does not infer turns on its own.
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
        bend_profile: Literal["circular", "euler"] = "circular",
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
            bend_profile: Corner shape — "circular" (default) or "euler"
                (clothoid corner with linearly-varying curvature).

        Example — S-bend between two ports::

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

def read_gds(path: str | Path) -> Library:
    """Read a GDS file and return a Library.

    Args:
        path: Path to the GDS file

    Returns:
        A Library containing all cells from the GDS file
    """
    ...

def write_gds(
    path: str | Path,
    design: Cell | Library,
    cells: list[Cell] | None = None,
    *,
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

# =============================================================================
# Layer Map (project configuration)
# =============================================================================

class LayerInfo:
    """A single layer definition with metadata.

    Access the underlying Layer for API calls via the ``layer`` attribute.

    Attributes:
        layer: The underlying Layer(number, datatype)
        name: Semantic name (e.g., "silicon", "text")
        color: Hex color string (e.g., "#ff69b4")
        fill: Fill pattern ("solid", "hatched", "crosshatched", "dotted")
        opacity: Fill opacity 0.0-1.0
        description: Human-readable description
    """

    layer: Layer
    name: str
    color: str
    fill: str
    opacity: float
    description: str
    def __init__(
        self,
        name: str,
        layer: Layer,
        color: str = "#808080",
        fill: str = "solid",
        opacity: float = 0.7,
        description: str = "",
    ) -> None: ...

class LayerMap:
    """Named layer definitions from rosette.toml.

    Access layers by attribute::

        layers = load_layer_map()
        layers.silicon        # LayerInfo
        layers.silicon.layer  # Layer(1, 0) -- use this in API calls
        layers.silicon.color  # "#ff69b4"
    """

    def __init__(self, layer_infos: list[LayerInfo] | None = None) -> None: ...
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
        cell.add_polygon(Polygon.rect(Point(0, 0), 10, 5), silicon)
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
    def acute_angle(
        self,
        layer: Layer | int | tuple[int, int],
        threshold_deg: float,
        name: str | None = None,
    ) -> DrcRules:
        """Add acute interior angle check for a layer.

        Flags convex polygon vertices whose interior angle is strictly less
        than ``threshold_deg``. Reflex (concave, > 180°) vertices are ignored
        — they represent the polygon turning outward and are not a
        lithography risk.

        Common value: 60.0 (typical photonic PDK default).
        """
        ...
    def not_inside(
        self,
        inner: Layer | int | tuple[int, int],
        outer: Layer | int | tuple[int, int],
        name: str | None = None,
    ) -> DrcRules:
        """Add a not-inside / exclusion-zone rule.

        Flags polygons on ``inner`` that are fully contained inside the union
        of polygons on ``outer``. Partial crossings (an inner polygon that
        crosses an outer boundary) are not violations — an inner polygon must
        sit wholly inside an outer region for the rule to trigger.

        Use this for keep-out zones. Distinct from ``forbid_overlap``, which
        flags any overlap at all.
        """
        ...
    def density(
        self,
        layer: Layer | int | tuple[int, int],
        window: float,
        step: float,
        min: float | None = None,
        max: float | None = None,
        region_layer: Layer | int | tuple[int, int] | None = None,
        name: str | None = None,
    ) -> DrcRules:
        """Add a layer density (CMP uniformity) check.

        Tiles a region with a sliding ``window`` x ``window`` square, stepping
        by ``step``, and flags every window position where the area fraction
        covered by ``layer`` falls outside ``[min, max]``.

        Foundries require density within a band for CMP (chemical-mechanical
        planarization) uniformity. Typical photonic-PDK values: silicon
        device layer 0.20-0.80 fill over a 100 µm window.

        At least one of ``min`` or ``max`` must be provided.

        If ``region_layer`` is set, the union of polygons on that layer
        defines the region over which density is measured. Otherwise the
        bounding box of all placed geometry in the design is used (which
        matches ``Library.cell_bbox`` for the top cell). Designs with no
        geometry at all skip the check silently.

        In TOML config, use the ``[drc.layers.<layer>.density]`` subtable::

            [drc.layers.silicon.density]
            min = 0.20
            max = 0.80
            window = 100.0
            step = 50.0
            region_layer = "prbnd"   # optional

        Args:
            layer: Target layer whose density is measured.
            window: Window side length in design units.
            step: Stride between window positions in design units. Typically
                ``window / 2`` for sliding-window hot-spot detection.
            min: Minimum required density fraction in [0, 1], or None for no
                lower bound.
            max: Maximum allowed density fraction in [0, 1], or None for no
                upper bound.
            region_layer: Optional marker layer whose union defines the
                region over which density is measured.
            name: Optional rule name for violation reporting.

        Raises:
            ValueError: If both ``min`` and ``max`` are None, if ``window``
                or ``step`` is not positive, or if ``min > max``.
        """
        ...
    def warning_margin(self, margin: float) -> DrcRules:
        """Set a global warning margin (in user units, typically µm).

        Near-threshold violations on length-based numeric rules
        (``min_width``, ``min_spacing``, ``min_enclosure``,
        ``min_edge_length``, ``max_width``) whose measured value is within
        ``margin`` of the required threshold are reported as
        ``severity == "warning"`` instead of ``"error"``. Warnings do not
        cause :attr:`DrcResult.passed` to be ``False`` and do not fail
        ``rosette check`` / ``rosette drc``.

        ``min_area`` and ``density`` are intentionally excluded (their
        values are not in length units) and remain strict errors.

        Pass ``0.0`` to disable (the default behavior — every violation is an
        error).
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
    """``True`` when no error-severity violations were found.

    Warnings (see :meth:`DrcRules.warning_margin`) do not cause this to be
    ``False`` — a run with only warnings still passes.
    """
    polygons_checked: int
    rules_checked: int
    elapsed_ms: float
    error_count: int
    """Number of error-severity violations."""
    warning_count: int
    """Number of warning-severity violations."""
    suppressed_violations: int
    """Number of violations suppressed by ``drc_skip`` post-filtering.

    A violation is suppressed iff every cell it names has ``drc_skip =
    True`` (or is within the subtree of a trusted cell). Violations with
    unknown cell-name provenance are always kept.
    """
    skipped_cells: int
    """Number of unique cells in the skipped-cell closure for this run."""
    waived_violations: int
    """Number of violations suppressed by a region waiver
    (``Cell.drc_waive_regions``).

    A violation is waived iff it was not already suppressed by ``drc_skip``
    and its location is fully contained within at least one waiver region
    (transformed into top-level global coordinates for the relevant placement
    of its owning cell).
    """
    def __len__(self) -> int:
        """Total number of violations — errors **plus** warnings.

        Use ``error_count`` / ``warning_count`` (or :attr:`passed`) to gate
        pass/fail decisions; ``len(result) > 0`` does not imply failure when
        a warning margin is configured.
        """
        ...
    def __repr__(self) -> str: ...

def load_drc_rules(config_path: str | Path | None = None) -> DrcRules:
    """Load DRC rules from ``rosette.toml``."""
    ...

def run_drc(
    cell: Cell,
    rules: DrcRules,
    library: Library | None = None,
) -> DrcResult:
    """Run DRC on a cell.

    Args:
        cell: The cell to check
        rules: DRC rules to apply
        library: Library containing referenced cells. If None, cell references
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

def load_dfm_config(
    config_path: str | Path | None = None,
) -> tuple[DfmConfig, GaussianModel, list[Layer]] | None:
    """Load DFM configuration from ``rosette.toml``."""
    ...

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
    """Hierarchy path (e.g. "child_1/out_2")."""
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

def load_checks_config(config_path: str | Path | None = None) -> ChecksConfig:
    """Load design-check configuration from ``rosette.toml``."""
    ...

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

# =============================================================================
# Rendering
# =============================================================================

class RenderResult:
    """Result of a render call: PNG bytes, world<->pixel transform, layers drawn."""

    @property
    def png(self) -> bytes:
        """PNG-encoded image bytes."""
        ...

    @property
    def view(self) -> dict[str, object]:
        """World<->pixel transform metadata as a dict.

        Keys:
        - ``scale_px_per_um`` (float): pixels per micron, uniform (aspect preserved).
        - ``offset_x_px`` (float): X pixel offset added during world->pixel mapping.
        - ``offset_y_px`` (float): Y pixel offset added during world->pixel mapping
          (after Y-axis flip).
        - ``canvas_px`` (tuple[int, int]): final image size as ``(width, height)``.
        - ``world_bbox_um`` (dict): visible region in microns, with keys ``min`` and
          ``max``, each a ``(x, y)`` tuple.
        """
        ...

    @property
    def layers_rendered(self) -> list[tuple[int, int]]:
        """`(layer, datatype)` pairs that contributed pixels, in draw order."""
        ...

    def px_to_world(self, px: float, py: float) -> tuple[float, float]:
        """Convert a pixel coordinate in the rendered image back to design (micron)
        coordinates."""
        ...

    def world_to_px(self, x: float, y: float) -> tuple[float, float]:
        """Convert design (micron) coordinates to pixel position in the rendered image."""
        ...

    def __repr__(self) -> str: ...

def render_png(
    design: Cell | Library,
    *,
    bbox: BBox | None = None,
    cell: str | None = None,
    layers: list[tuple[int, int]] | None = None,
    width: int = 1024,
    height: int | None = None,
    pad: float = 0.1,
    bg: str = "#1a1a1a",
    fill_alpha: int = 178,
    palette: dict[int, str] | None = None,
) -> RenderResult:
    """Render a Cell or Library to a PNG image.

    Args:
        design: The Cell or Library to render.
        bbox: Optional explicit world-space region (microns). If omitted, derived
            from `cell` or the full library extent.
        cell: Render only the named cell instead of the selected/unique top
            or the full multi-root library.
        layers: Restrict rendering to these `(layer, datatype)` pairs.
        width: Output width in pixels. Default 1024.
        height: Output height in pixels. If None, derived from aspect ratio.
        pad: Fractional padding around the target bbox (0.1 = 10%).
        bg: Background color as `#RRGGBB` or `#RRGGBBAA`. Default `#1a1a1a`.
        fill_alpha: Alpha applied to layer fill colors (0-255). Default 178 (~70%).
        palette: Optional `{layer_number: hex_color}` overrides.

    Returns:
        RenderResult with `png` (bytes), `view` (dict), and `layers_rendered`.
    """
    ...

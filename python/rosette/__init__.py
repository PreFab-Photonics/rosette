"""rosette - Photonic layout library.

Example usage:
    from rosette import *

    # Create a simple cell
    cell = Cell("my_design")
    cell.add_polygon(Polygon.rect(Point.origin(), 10, 5), Layer(1, 0))
    write_gds("output.gds", cell)

    # Route between ports
    route = Route(Layer(1, 0), width=0.5, bend_radius=5.0)
    route.start_at_port(port_a)
    route.to(50, 0)
    route.end_at_port(port_b)
    cell = route.to_cell("my_route")

In user projects (after `rosette init`), components are local:
    from components import mmi_1x2, ring, grating_coupler

For library development, import from rosette.components:
    from rosette.components import mmi_1x2, ring, grating_coupler
"""

from __future__ import annotations

import math
import os
import re
import sys
import tomllib
import warnings
from importlib.metadata import PackageNotFoundError
from importlib.metadata import version as _pkg_version
from pathlib import Path

from rosette._core import (
    # Geometry
    BBox,
    ChecksConfig,
    ChecksResult,
    # Checks
    CheckViolation,
    # DFM
    DfmConfig,
    DfmResult,
    DfmViolation,
    # DRC
    DrcResult,
    DrcRules,
    DrcViolation,
    GaussianModel,
    # Layout
    Layer,
    LayerMetrics,
    LayerPrediction,
    PathEndType,
    Point,
    Polygon,
    Port,
    Transform,
    Vector2,
    # Geometry utilities (for component authoring)
    arc_points,
    fresnel_c,
    fresnel_s,
    offset_polygon,
    offset_polygon_varying,
    path_length,
)
from rosette._core import Cell as _Cell
from rosette._core import CellRef as _CellRef
from rosette._core import Library as _Library
from rosette._core import Route as _Route
from rosette._core import read_gds as _read_gds
from rosette._core import run_checks as _run_checks
from rosette._core import run_dfm as _run_dfm
from rosette._core import run_drc as _run_drc
from rosette._core import write_gds as _write_gds

try:
    __version__ = _pkg_version("librosette")
except PackageNotFoundError:
    __version__ = "0.0.0-dev"

# DFM default model parameters — keep in sync with Rust DEFAULT_SIGMA / DEFAULT_THRESHOLD
_DFM_DEFAULT_SIGMA = 0.08

# =============================================================================
# Instance: A positioned cell that knows both its definition and transform
# =============================================================================


class Instance:
    """A cell placed at a specific location with optional transformations.

    Instance solves the ergonomic problem of needing to pass the Cell twice:
    once to create a CellRef, and again to query ports. With Instance, the
    Cell reference is preserved, allowing direct port queries.

    Example:
        # Old pattern (redundant):
        gc_cell = grating_coupler(...)
        gc_ref = CellRef(gc_cell).at(0, 0)
        port = gc_ref.port("opt", gc_cell)  # Must pass gc_cell again

        # New pattern (ergonomic):
        gc_cell = grating_coupler(...)
        gc_in = gc_cell.at(0, 0)            # Returns Instance
        port = gc_in.port("opt")            # No redundancy!

    Instances can be added directly to cells and support transform chaining:
        gc = gc_cell.at(100, 50)
        top.add_ref(gc)

    **Transform chaining order:** Each chained call wraps the *outside* of
    the accumulated transform. This means the *first* call in the chain is
    applied first to the geometry, and the *last* call is applied last::

        # .at(10, 0).rotate(90) -> translate first, THEN rotate around origin
        # Point (0,0) becomes (10,0) then rotates to (0,10) -- NOT at (10,0)!

        # To rotate a component then place it at a specific position,
        # rotate first, then translate:
        inst = cell.at(0, 0).rotate(90).at(25, 50)  # rotate, then move to (25,50)

    **Bounding-box shift after transform:** Even with the correct ordering,
    transforms change where geometry sits relative to the anchor point.
    For example, an 8x5 rect at (0,0)-(8,5) rotated 45° becomes a diamond
    whose extents are completely different. The final ``.at(x, y)`` places
    the *transformed origin*, not the visual center or corner. To align
    transformed instances with other geometry, account for the new bounds
    when choosing placement coordinates::

        # 45° rotation shifts the bbox — adjust the final offset:
        rotated45 = block.at(0, 0).rotate(45).at(x + 4, y - 2)
    """

    __slots__ = ("_cell", "_repetition", "_transform")

    def __init__(
        self,
        cell: Cell,
        transform: Transform | None = None,
        repetition: tuple[int, int, float, float] | None = None,
    ) -> None:
        """Create an Instance from a Cell and optional transform.

        Args:
            cell: The cell definition
            transform: Optional transform (defaults to identity)
            repetition: Optional (columns, rows, col_spacing, row_spacing) tuple
        """
        self._cell = cell
        self._transform = transform if transform is not None else Transform.identity()
        self._repetition = repetition

    @property
    def cell(self) -> Cell:
        """The underlying cell definition."""
        return self._cell

    @property
    def transform(self) -> Transform:
        """The current transform applied to this instance."""
        return self._transform

    @property
    def cell_name(self) -> str:
        """Name of the referenced cell (for compatibility with CellRef)."""
        return self._cell.name

    def at(self, x: float, y: float) -> Instance:
        """Set the position (translation).

        Args:
            x: X coordinate
            y: Y coordinate

        Returns:
            A new Instance with updated transform
        """
        new_transform = Transform.translate(x, y).then(self._transform)
        return Instance(self._cell, new_transform, self._repetition)

    def rotate(self, angle_deg: float) -> Instance:
        """Rotate by angle (in degrees).

        Args:
            angle_deg: Rotation angle in degrees

        Returns:
            A new Instance with updated transform
        """
        new_transform = Transform.rotate(angle_deg).then(self._transform)
        return Instance(self._cell, new_transform, self._repetition)

    def mirror_x(self) -> Instance:
        """Mirror across X axis.

        Returns:
            A new Instance with updated transform
        """
        new_transform = Transform.scale(1.0, -1.0).then(self._transform)
        return Instance(self._cell, new_transform, self._repetition)

    def mirror_y(self) -> Instance:
        """Mirror across Y axis.

        Returns:
            A new Instance with updated transform
        """
        new_transform = Transform.scale(-1.0, 1.0).then(self._transform)
        return Instance(self._cell, new_transform, self._repetition)

    def scale(self, s: float) -> Instance:
        """Scale uniformly.

        Args:
            s: Scale factor

        Returns:
            A new Instance with updated transform
        """
        new_transform = Transform.scale_uniform(s).then(self._transform)
        return Instance(self._cell, new_transform, self._repetition)

    def array(
        self,
        columns: int,
        rows: int,
        col_spacing: float,
        row_spacing: float,
    ) -> Instance:
        """Set array repetition (columns x rows grid with given spacing).

        Creates a GDS AREF - a single compact array reference instead of
        many individual references. In the viewer, the entire array is
        selected as one object.

        Args:
            columns: Number of columns (>= 1).
            rows: Number of rows (>= 1).
            col_spacing: Spacing between columns (X direction, in um).
            row_spacing: Spacing between rows (Y direction, in um).

        Returns:
            A new Instance with array repetition set.

        Raises:
            ValueError: If columns or rows is less than 1.

        Example:
            arr = unit_cell.at(0, 0).array(10, 5, 20.0, 15.0)
            top.add_ref(arr)  # Single AREF, not 50 individual refs
        """
        if columns < 1 or rows < 1:
            raise ValueError(f"columns and rows must be >= 1, got columns={columns}, rows={rows}")
        return Instance(self._cell, self._transform, (columns, rows, col_spacing, row_spacing))

    def port(self, name: str) -> Port:
        """Get a transformed port from this instance.

        Unlike CellRef.port(), this doesn't require passing the Cell again
        since the Instance already knows its cell definition.

        Args:
            name: Name of the port to retrieve

        Returns:
            The port with position and direction transformed

        Raises:
            KeyError: If the port is not found in the cell

        Example:
            gc = gc_cell.at(100, 50)
            opt_port = gc.port("opt")  # No need to pass gc_cell!
        """
        # Get the original port from the cell
        original_port = self._cell.port(name)
        # Apply the transform to get the positioned port
        pos = self._transform.apply(original_port.position)
        # Transform the direction vector using the 2x2 linear part of the
        # transform.  This correctly handles rotation, mirroring, and any
        # combination without needing decomposition.
        origin = self._transform.apply(Point.origin())
        dir_pt = self._transform.apply(Point(original_port.direction.x, original_port.direction.y))
        dx = dir_pt.x - origin.x
        dy = dir_pt.y - origin.y
        length = math.sqrt(dx * dx + dy * dy)
        if length > 0:
            direction = Vector2(dx / length, dy / length)
        else:
            direction = original_port.direction
        return Port(name, pos, direction, original_port.width)

    def to_ref(self) -> CellRef:
        """Convert to a CellRef for use with low-level APIs.

        Returns:
            A CellRef with the same cell name, transform, and array repetition
        """
        # Decompose into GDS-compatible: mirror_x (innermost),
        # then rotation, then translation (outermost).
        ref = CellRef(self._cell.name)
        angle, is_mirrored = self._decompose_transform()
        # Mirror first (innermost -- applied first to geometry)
        if is_mirrored:
            ref = ref.mirror_x()
        # Then rotation (wraps outside the mirror)
        if abs(angle) > 0.001:
            ref = ref.rotate(angle)
        pos = self._transform.apply(Point.origin())
        ref = ref.at(pos.x, pos.y)
        # Propagate array repetition if set
        if self._repetition is not None:
            ref = ref.array(*self._repetition)
        return ref

    def _decompose_transform(self) -> tuple[float, bool]:
        """Decompose transform into rotation angle (degrees) and mirror flag.

        Returns (angle_deg, is_mirrored) matching GDS convention:
        the transform is equivalent to mirror_x (if flagged) then rotate.

        Uses the determinant of the 2x2 linear part to detect reflection
        (det < 0) instead of checking individual axis signs, which gives
        false positives for rotations > 90 degrees.
        """
        origin = self._transform.apply(Point.origin())
        ux = self._transform.apply(Point(1.0, 0.0))
        uy = self._transform.apply(Point(0.0, 1.0))

        # Basis vectors of the 2x2 linear part
        ax = ux.x - origin.x  # transform matrix a
        ay = ux.y - origin.y  # transform matrix c
        bx = uy.x - origin.x  # transform matrix b
        by = uy.y - origin.y  # transform matrix d

        det = ax * by - ay * bx
        is_mirrored = det < 0

        if is_mirrored:
            # GDS convention: mirror_x first (negate Y), then rotate.
            # After removing mirror_x, the effective rotation matrix is:
            #   [a, -b; c, -d]  (since mirror_x negates row 2)
            # But we can simply use atan2(c, a) which gives the correct
            # angle for the GDS decomposition R * mirror_x.
            angle = math.atan2(ay, ax) * 180.0 / math.pi
        else:
            angle = math.atan2(ay, ax) * 180.0 / math.pi

        return angle, is_mirrored

    def _rotation_angle(self) -> float:
        """Extract rotation angle from transform (in degrees)."""
        angle, _ = self._decompose_transform()
        return angle

    def _is_mirrored_x(self) -> bool:
        """Check if transform includes reflection (mirror about X axis).

        Uses determinant-based detection to avoid false positives from
        rotations > 90 degrees.
        """
        _, is_mirrored = self._decompose_transform()
        return is_mirrored

    def _is_mirrored_y(self) -> bool:
        """Check if transform includes Y-axis mirroring.

        With determinant-based decomposition, mirroring is always
        decomposed as mirror_x + rotation (GDS convention), so
        mirror_y is never needed.
        """
        return False

    def __repr__(self) -> str:
        pos = self._transform.apply(Point.origin())
        return f"Instance('{self._cell.name}', at=({pos.x:.2f}, {pos.y:.2f}))"


# =============================================================================
# CellRef wrapper: Accepts our Cell wrapper
# =============================================================================


class CellRef:
    """A reference to another cell with transformation.

    This wrapper around the core CellRef accepts our Cell wrapper in addition
    to cell names and Rust Cell objects.
    """

    __slots__ = ("_inner",)

    def __init__(self, cell_or_name: Cell | _Cell | str) -> None:
        """Create a new cell reference.

        Args:
            cell_or_name: Either a Cell object or a cell name string.

        Example:
            ref1 = CellRef("my_cell")      # From string
            ref2 = CellRef(waveguide_cell) # From Cell object
        """
        if isinstance(cell_or_name, Cell):
            # Our wrapper Cell - extract name
            self._inner = _CellRef(cell_or_name.name)
        elif isinstance(cell_or_name, str):
            self._inner = _CellRef(cell_or_name)
        else:
            # Rust _Cell
            self._inner = _CellRef(cell_or_name)

    @classmethod
    def _from_inner(cls, inner: _CellRef) -> CellRef:
        """Create a CellRef wrapper from an existing Rust CellRef."""
        ref = object.__new__(cls)
        ref._inner = inner
        return ref

    @property
    def cell_name(self) -> str:
        """Cell name being referenced."""
        return self._inner.cell_name

    def at(self, x: float, y: float) -> CellRef:
        """Set the position."""
        return CellRef._from_inner(self._inner.at(x, y))

    def rotate(self, angle_deg: float) -> CellRef:
        """Rotate by angle (in degrees)."""
        return CellRef._from_inner(self._inner.rotate(angle_deg))

    def mirror_x(self) -> CellRef:
        """Mirror across X axis."""
        return CellRef._from_inner(self._inner.mirror_x())

    def mirror_y(self) -> CellRef:
        """Mirror across Y axis."""
        return CellRef._from_inner(self._inner.mirror_y())

    def scale(self, s: float) -> CellRef:
        """Scale uniformly."""
        return CellRef._from_inner(self._inner.scale(s))

    def array(
        self,
        columns: int,
        rows: int,
        col_spacing: float,
        row_spacing: float,
    ) -> CellRef:
        """Set array repetition (columns x rows grid with given spacing).

        Creates a GDS AREF - a single compact array reference instead of
        many individual references. In the viewer, the entire array is
        selected as one object.

        Args:
            columns: Number of columns (>= 1).
            rows: Number of rows (>= 1).
            col_spacing: Spacing between columns (X direction, in um).
            row_spacing: Spacing between rows (Y direction, in um).

        Returns:
            A new CellRef with array repetition set.

        Raises:
            ValueError: If columns or rows is less than 1.

        Example:
            ref = CellRef("unit").at(0, 0).array(10, 5, 20.0, 15.0)
            top.add_ref(ref)  # Single AREF, not 50 individual refs
        """
        if columns < 1 or rows < 1:
            raise ValueError(f"columns and rows must be >= 1, got columns={columns}, rows={rows}")
        return CellRef._from_inner(self._inner.array(columns, rows, col_spacing, row_spacing))

    def port(self, name: str, cell: Cell | _Cell) -> Port:
        """Get a transformed port from this cell reference.

        Args:
            name: Name of the port to retrieve
            cell: The source Cell object containing the port definition

        Returns:
            The port with position and direction transformed
        """
        inner_cell = cell._inner if isinstance(cell, Cell) else cell
        return self._inner.port(name, inner_cell)

    def __repr__(self) -> str:
        return repr(self._inner)


# =============================================================================
# Cell wrapper: Adds .at() method and child cell tracking
# =============================================================================


class Cell:
    """A cell containing geometry and references to other cells.

    This wrapper around the core Cell adds:
    - `at(x, y)` method returning an Instance for ergonomic positioning
    - Automatic child cell tracking for simplified write_gds() calls

    All other methods delegate to the underlying Rust Cell.
    """

    __slots__ = ("_child_cells", "_inner")

    def __init__(self, name: str) -> None:
        """Create a new empty cell.

        Args:
            name: Name of the cell (must be unique within a design)
        """
        self._inner = _Cell(name)
        self._child_cells: set[Cell] = set()

    @classmethod
    def _from_inner(cls, inner: _Cell) -> Cell:
        """Create a Cell wrapper from an existing Rust Cell."""
        cell = object.__new__(cls)
        cell._inner = inner
        cell._child_cells = set()
        return cell

    # --- Delegated properties ---

    @property
    def name(self) -> str:
        """Cell name."""
        return self._inner.name

    @property
    def path_length(self) -> float | None:
        """Path length metadata (if built from a Route)."""
        return self._inner.path_length

    @path_length.setter
    def path_length(self, value: float) -> None:
        self._inner.path_length = value

    def add_bend(
        self,
        radius: float,
        x: float,
        y: float,
        requested_radius: float | None = None,
    ) -> None:
        """Add a bend info entry to the cell metadata.

        Args:
            radius: Effective bend radius in um.
            x: X coordinate of bend location.
            y: Y coordinate of bend location.
            requested_radius: Original requested radius if auto-reduced.
        """
        self._inner.add_bend(radius, x, y, requested_radius)

    @property
    def bends(self) -> list[dict]:
        """Bend info entries as list of dicts."""
        return self._inner.bends

    def add_warning(self, warning: str) -> None:
        """Add a warning to the cell metadata."""
        self._inner.add_warning(warning)

    @property
    def cell_warnings(self) -> list[str]:
        """Warnings from cell construction."""
        return self._inner.cell_warnings

    # --- Delegated methods ---

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
        self._inner.add_polygon(polygon, layer)

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
        self._inner.add_path(points, width, layer, end_type)

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
        self._inner.add_text(text, position, layer, height)

    def add_port(self, port: Port) -> None:
        """Add a port to the cell."""
        self._inner.add_port(port)

    def port(self, name: str) -> Port:
        """Get a port by name. Raises KeyError if not found."""
        return self._inner.port(name)

    def ports(self) -> list[Port]:
        """Get all ports."""
        return self._inner.ports()

    def polygon_count(self) -> int:
        """Number of polygons in the cell."""
        return self._inner.polygon_count()

    def path_count(self) -> int:
        """Number of paths in the cell."""
        return self._inner.path_count()

    def text_count(self) -> int:
        """Number of text labels in the cell."""
        return self._inner.text_count()

    def ref_count(self) -> int:
        """Number of cell references."""
        return self._inner.ref_count()

    def bbox(self) -> BBox | None:
        """Calculate the bounding box of all polygons."""
        return self._inner.bbox()

    def place_at_port(self, cell_ref: CellRef, cell_port: Port, target_port: Port) -> CellRef:
        """Place a cell reference by aligning its port to a target port."""
        inner_ref = cell_ref._inner if isinstance(cell_ref, CellRef) else cell_ref
        result = self._inner.place_at_port(inner_ref, cell_port, target_port)
        return CellRef._from_inner(result)

    # --- New ergonomic methods ---

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
            gc_cell = grating_coupler(...)
            gc_in = gc_cell.at(0, 0)
            gc_out = gc_cell.at(0, 127)

            # Get ports directly from instances
            port_in = gc_in.port("opt")
            port_out = gc_out.port("opt")

            # Array of identical cells (single AREF, selected as one unit):
            top.add_ref(unit_cell.at(0, 0).array(10, 10, pitch, pitch))
        """
        return Instance(self, Transform.translate(x, y))

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
        # Convert Cell to Instance at origin
        if isinstance(ref, Cell):
            ref = ref.at(0, 0)

        if isinstance(ref, Instance):
            instance = ref
            # Track the child cell for auto-collection
            self._child_cells.add(instance.cell)
            # Also recursively include any children from the instance's cell
            if hasattr(instance.cell, "_child_cells"):
                self._child_cells.update(instance.cell._child_cells)
            # Convert to Rust CellRef for the underlying Rust call.
            #
            # CellRef uses left-prepend chaining: each method wraps the
            # outside of the accumulated transform.  To decompose an
            # Instance transform M into CellRef calls we must apply
            # rotation/mirror FIRST, then translation LAST:
            #
            #   CellRef().rotate(angle).mirror_*().at(pos)
            #
            # produces T(pos) * Mirror * R(angle), where pos = M * origin
            # gives the final translated position.  This correctly
            # reconstructs M for any combination of rotate + translate.
            #
            # The previous order (.at(pos).rotate(angle)) was wrong
            # because it produced R(angle) * T(pos), double-rotating
            # the translation component.
            rust_ref = _CellRef(instance.cell.name)
            # Decompose into GDS-compatible: mirror_x (innermost),
            # then rotation, then translation (outermost).
            angle, is_mirrored = instance._decompose_transform()
            # Mirror first (innermost -- applied first to geometry)
            if is_mirrored:
                rust_ref = rust_ref.mirror_x()
            # Then rotation (wraps outside the mirror)
            if abs(angle) > 0.001:
                rust_ref = rust_ref.rotate(angle)
            # Translation last (outermost transform)
            pos = instance.transform.apply(Point.origin())
            rust_ref = rust_ref.at(pos.x, pos.y)
            # Propagate array repetition if set
            if instance._repetition is not None:
                rust_ref = rust_ref.array(*instance._repetition)
            self._inner.add_ref(rust_ref)
        else:
            # Raw CellRef - issue warning about untracked cell
            warnings.warn(
                f"Adding CellRef('{ref.cell_name}') without automatic child tracking. "
                "Consider using cell.at(x, y) instead for automatic tracking, "
                "or pass child cells explicitly to write_gds().",
                stacklevel=2,
            )
            # Extract inner CellRef if it's our wrapper
            inner_ref = ref._inner if isinstance(ref, CellRef) else ref
            self._inner.add_ref(inner_ref)

    def get_child_cells(self) -> set[Cell]:
        """Get all tracked child cells (for write_gds auto-collection).

        Returns:
            Set of child cells that have been added via add_ref(Instance)
        """
        return self._child_cells.copy()

    def __repr__(self) -> str:
        return f"Cell('{self.name}', {self.polygon_count()} polygons, {self.ref_count()} refs)"


# =============================================================================
# Route wrapper: Returns wrapped Cell from to_cell()
# =============================================================================


class Route:
    """Waypoint-based waveguide route.

    Route connects an ordered sequence of waypoints with straight segments,
    inserting circular bends at corners and tapers for width transitions.
    It is **not** an auto-router — you must supply intermediate waypoints
    to create the path shape you want. Returns wrapped Cell objects from
    to_cell(), enabling the ergonomic Instance API.

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
        cell = route.to_cell("my_route")  # Returns wrapped Cell with .at()
    """

    __slots__ = ("_inner",)

    def __init__(
        self,
        layer: Layer | int | tuple[int, int],
        width: float = 0.5,
        bend_radius: float = 5.0,
        auto_taper: bool = True,
        taper_length: float = 10.0,
    ) -> None:
        """Create a new Route.

        Args:
            layer: The layer for the route geometry
            width: Default waveguide width
            bend_radius: Default bend radius
            auto_taper: Whether to automatically add tapers for width changes
            taper_length: Length of auto-generated tapers
        """
        self._inner = _Route(layer, width, bend_radius, auto_taper, taper_length)

    def start_at(self, x: float, y: float, angle: float = 0.0) -> None:
        """Start the route at a specific position and angle (degrees)."""
        self._inner.start_at(x, y, angle)

    def start_at_port(self, port: Port) -> None:
        """Start the route at a port's position, heading into the port.

        The port's outward-facing direction is flipped 180 degrees so the
        route departs in the correct direction (away from the component).
        The port's width is used as the starting width.

        Note: The first waypoint after this should continue along the
        port's axis (e.g., same y for a horizontal port) before turning.
        """
        self._inner.start_at_port(port)

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
        self._inner.to(x, y, width, bend_radius)

    def end_at(self, x: float, y: float, angle: float = 0.0) -> None:
        """End the route at a specific position and angle (degrees)."""
        self._inner.end_at(x, y, angle)

    def end_at_port(self, port: Port) -> None:
        """End the route arriving into a port.

        The port's outward-facing direction is flipped 180 degrees so the
        route arrives heading into the component. The port's width is used
        as the ending width.

        Note: The last waypoint before this should approach along the
        port's axis (e.g., same y for a horizontal port) to ensure a
        flush connection.
        """
        self._inner.end_at_port(port)

    def to_cell(self, name: str) -> Cell:
        """Convert the route to a Cell.

        Warnings are printed to stderr if the route had to auto-reduce bend radii
        or encountered other issues. This provides immediate feedback to both
        users and AI agents about potential design problems.

        Returns:
            A wrapped Cell with the .at() method for ergonomic positioning.
        """
        # Print any warnings immediately so agents/users see them
        for warning in self._inner.warnings:
            print(f"  warning: {name}: {warning}", file=sys.stderr)

        inner_cell = self._inner.to_cell(name)
        return Cell._from_inner(inner_cell)

    @property
    def path_length(self) -> float:
        """Total optical path length."""
        return self._inner.path_length

    @property
    def warnings(self) -> list[str]:
        """Warnings from route generation (e.g., reduced bend radii)."""
        return self._inner.warnings

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

        Returns:
            A Route that can be converted to a Cell with to_cell()

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
        inner_route = _Route.through(*waypoints, layer=layer, width=width, bend_radius=bend_radius)
        route = object.__new__(Route)
        route._inner = inner_route
        return route


# =============================================================================
# Library wrapper: Accepts our Cell wrapper
# =============================================================================


class Library:
    """A library containing multiple cells.

    This wrapper accepts our Cell wrapper in addition to Rust Cell objects.
    """

    __slots__ = ("_inner",)

    def __init__(self, name: str) -> None:
        """Create a new library."""
        self._inner = _Library(name)

    @classmethod
    def _from_inner(cls, inner: _Library) -> Library:
        """Create a Library wrapper from a Rust Library object."""
        lib = object.__new__(cls)
        lib._inner = inner
        return lib

    @property
    def name(self) -> str:
        """Library name."""
        return self._inner.name

    def add_cell(self, cell: Cell | _Cell) -> None:
        """Add a cell to the library.

        If a cell with the same name already exists, this is a no-op.
        """
        inner_cell = cell._inner if isinstance(cell, Cell) else cell
        self._inner.add_cell(inner_cell)

    def add_cell_recursive(self, cell: Cell | _Cell, available_cells: list[Cell | _Cell]) -> None:
        """Add a cell and all its referenced cells recursively.

        This method automatically adds all cells that are referenced by the
        given cell, resolving the entire hierarchy.
        """
        inner_cell = cell._inner if isinstance(cell, Cell) else cell
        inner_available = [c._inner if isinstance(c, Cell) else c for c in available_cells]
        self._inner.add_cell_recursive(inner_cell, inner_available)

    def cell(self, name: str) -> Cell | None:
        """Get a cell by name."""
        inner = self._inner.cell(name)
        return Cell._from_inner(inner) if inner is not None else None

    def cells(self) -> list[Cell]:
        """Get all cells."""
        return [Cell._from_inner(c) for c in self._inner.cells()]

    def top_cell(self) -> Cell | None:
        """Get the top cell (last added)."""
        inner = self._inner.top_cell()
        return Cell._from_inner(inner) if inner is not None else None

    def __repr__(self) -> str:
        return repr(self._inner)


def _collect_all_cells(cell: Cell, collected: set[Cell]) -> None:
    """Recursively collect all child cells from a cell hierarchy."""
    if hasattr(cell, "_child_cells"):
        for child in cell._child_cells:
            if child not in collected:
                collected.add(child)
                _collect_all_cells(child, collected)


def load_drc_rules(config_path: str | Path | None = None) -> DrcRules:
    """Load DRC rules from rosette.toml.

    Searches for rosette.toml in the current directory and parent directories.
    Rules are defined per-layer in the [drc.layers] section, and inter-layer
    rules in the [[drc.rules]] array.

    Layer keys can use semantic names from the [layers] section (e.g.
    ``[drc.layers.silicon]``) or the traditional ``"number/datatype"`` format
    (e.g. ``[drc.layers."1/0"]``). Semantic names are resolved against the
    [layers] section of the same rosette.toml file.

    Args:
        config_path: Optional explicit path to rosette.toml. If None, searches
                     from current directory upward.

    Returns:
        DrcRules built from the configuration

    Raises:
        FileNotFoundError: If rosette.toml is not found
        ValueError: If the config has invalid DRC settings

    Example:
        In rosette.toml::

            [layers.silicon]
            number = 1
            datatype = 0

            [drc.layers.silicon]
            min_width = 0.12
            min_spacing = 0.13

            # Numeric format still works:
            # [drc.layers."2/0"]
            # min_width = 0.5

            [[drc.rules]]
            type = "spacing"
            layer1 = "silicon"
            layer2 = "2/0"
            min_spacing = 1.0

        Usage::

            rules = load_drc_rules()
            result = run_drc(cell, rules)
    """
    # Find config file
    if config_path is not None:
        toml_path = Path(config_path)
        if not toml_path.exists():
            raise FileNotFoundError(f"Config file not found: {toml_path}")
    else:
        toml_path = _find_rosette_toml()
        if toml_path is None:
            raise FileNotFoundError(
                "rosette.toml not found. Run 'rosette init' to create a project, "
                "or specify config_path explicitly."
            )

    # Parse TOML
    with open(toml_path, "rb") as f:
        config = tomllib.load(f)

    # Build semantic name -> Layer lookup from [layers] section (if present)
    layer_lookup = _build_layer_lookup(config)

    # Build rules from config
    rules = DrcRules()

    drc_config = config.get("drc", {})
    layers_config = drc_config.get("layers", {})

    # Collect known (number, datatype) pairs from [layers] for cross-validation
    known_layer_pairs = {(ly.number, ly.datatype) for ly in layer_lookup.values()}

    # Process per-layer rules
    for layer_str, layer_rules in layers_config.items():
        # Resolve layer: accepts semantic names ("silicon") or numeric ("1/0")
        layer, display_name = _resolve_layer(
            layer_str, layer_lookup, context=f"[drc.layers.{layer_str}]"
        )

        # Warn if a numeric layer key doesn't match any [layers] entry
        if layer_lookup and layer_str not in layer_lookup:
            pair = (layer.number, layer.datatype)
            if pair not in known_layer_pairs:
                warnings.warn(
                    f"DRC layer '{layer_str}' does not match any layer in [layers]. "
                    f"Consider using a semantic name or adding this layer to [layers]. "
                    f"Known layers: {', '.join(sorted(layer_lookup.keys()))}",
                    stacklevel=2,
                )

        # Auto-generate rule names from the display name so violations are
        # identifiable (e.g., "Lsilicon.min_width" or "L1/0.min_width").
        prefix = f"L{display_name}"

        # Apply rules for this layer
        if "min_width" in layer_rules:
            rules = rules.min_width(layer, layer_rules["min_width"], f"{prefix}.min_width")

        if "min_spacing" in layer_rules:
            rules = rules.min_spacing(
                layer, layer, layer_rules["min_spacing"], f"{prefix}.min_spacing"
            )

        if "min_area" in layer_rules:
            rules = rules.min_area(layer, layer_rules["min_area"], f"{prefix}.min_area")

        if "angles" in layer_rules:
            rules = rules.allowed_angles(layer, layer_rules["angles"], f"{prefix}.allowed_angles")

        if "min_edge_length" in layer_rules:
            rules = rules.min_edge_length(
                layer, layer_rules["min_edge_length"], f"{prefix}.min_edge_length"
            )

        if "max_width" in layer_rules:
            rules = rules.max_width(layer, layer_rules["max_width"], f"{prefix}.max_width")

        if layer_rules.get("no_self_intersection", False):
            rules = rules.no_self_intersection(layer, f"{prefix}.no_self_intersection")

        if layer_rules.get("no_overlap", False):
            rules = rules.forbid_overlap(layer, layer, f"{prefix}.no_overlap")

        if "snap_to_grid" in layer_rules:
            rules = rules.snap_to_grid(layer, layer_rules["snap_to_grid"], f"{prefix}.snap_to_grid")

        # Warn about unrecognized keys that might be typos
        _KNOWN_LAYER_KEYS = {
            "min_width",
            "max_width",
            "min_spacing",
            "min_area",
            "min_edge_length",
            "angles",
            "no_self_intersection",
            "no_overlap",
            "snap_to_grid",
        }
        unknown_keys = set(layer_rules.keys()) - _KNOWN_LAYER_KEYS
        for key in sorted(unknown_keys):
            warnings.warn(
                f"Unknown DRC key '{key}' for layer {display_name} in rosette.toml "
                f"(known keys: {', '.join(sorted(_KNOWN_LAYER_KEYS))})",
                stacklevel=2,
            )

    # Process inter-layer rules
    inter_layer_rules = drc_config.get("rules", [])
    for i, rule in enumerate(inter_layer_rules):
        rule_type = rule.get("type")
        name = rule.get("name")

        if rule_type is None:
            raise ValueError(f"DRC rule #{i + 1} missing required 'type' field")

        rule_context = f"DRC rule #{i + 1} (type='{rule_type}')"

        if rule_type == "enclosure":
            _validate_rule_fields(rule, ["inner", "outer", "min_enclosure"], i)
            inner, _ = _resolve_layer(rule["inner"], layer_lookup, context=rule_context)
            outer, _ = _resolve_layer(rule["outer"], layer_lookup, context=rule_context)
            enclosure = rule["min_enclosure"]
            rules = rules.min_enclosure(inner, outer, enclosure, name)

        elif rule_type == "spacing":
            _validate_rule_fields(rule, ["layer1", "layer2", "min_spacing"], i)
            layer1, _ = _resolve_layer(rule["layer1"], layer_lookup, context=rule_context)
            layer2, _ = _resolve_layer(rule["layer2"], layer_lookup, context=rule_context)
            spacing = rule["min_spacing"]
            rules = rules.min_spacing(layer1, layer2, spacing, name)

        elif rule_type == "require_overlap":
            _validate_rule_fields(rule, ["layer1", "layer2"], i)
            layer1, _ = _resolve_layer(rule["layer1"], layer_lookup, context=rule_context)
            layer2, _ = _resolve_layer(rule["layer2"], layer_lookup, context=rule_context)
            rules = rules.require_overlap(layer1, layer2, name)

        elif rule_type == "forbid_overlap":
            _validate_rule_fields(rule, ["layer1", "layer2"], i)
            layer1, _ = _resolve_layer(rule["layer1"], layer_lookup, context=rule_context)
            layer2, _ = _resolve_layer(rule["layer2"], layer_lookup, context=rule_context)
            rules = rules.forbid_overlap(layer1, layer2, name)

        else:
            raise ValueError(f"Unknown DRC rule type: {rule_type}")

    return rules


def _find_rosette_toml() -> Path | None:
    """Search for rosette.toml in current directory and parents."""
    current = Path.cwd()
    for directory in [current, *current.parents]:
        candidate = directory / "rosette.toml"
        if candidate.exists():
            return candidate
    return None


def _validate_rule_fields(rule: dict, required: list[str], index: int) -> None:
    """Validate that a DRC rule has all required fields."""
    missing = [field for field in required if field not in rule]
    if missing:
        rule_type = rule.get("type", "unknown")
        raise ValueError(
            f"DRC rule #{index + 1} (type='{rule_type}') missing required fields: {missing}"
        )


def _parse_layer_string(layer_str: str) -> Layer:
    """Parse a layer string like '1/0' into a Layer object."""
    parts = layer_str.split("/")
    if len(parts) == 1:
        return Layer(int(parts[0]), 0)
    elif len(parts) == 2:
        return Layer(int(parts[0]), int(parts[1]))
    else:
        raise ValueError(
            f"Invalid layer format '{layer_str}'. Expected 'number' or 'number/datatype'."
        )


def _build_layer_lookup(config: dict) -> dict[str, Layer]:
    """Build a name -> Layer lookup from the [layers] section of a parsed TOML config.

    Returns an empty dict if no [layers] section exists.
    """
    layers_config = config.get("layers", {})
    lookup: dict[str, Layer] = {}
    for name, props in layers_config.items():
        if isinstance(props, dict) and "number" in props:
            number = props["number"]
            datatype = props.get("datatype", 0)
            lookup[name] = Layer(int(number), int(datatype))
    return lookup


def _resolve_layer(
    layer_str: str,
    layer_lookup: dict[str, Layer],
    *,
    context: str = "",
) -> tuple[Layer, str]:
    """Resolve a layer string that may be a semantic name or a 'number/datatype' string.

    First checks the layer_lookup dict for a semantic name match. If not found,
    falls back to _parse_layer_string() for numeric parsing.

    Args:
        layer_str: Either a semantic name (e.g. "silicon") or numeric (e.g. "1/0").
        layer_lookup: Mapping from semantic names to Layer objects (from [layers] section).
        context: Optional context string for error messages (e.g. "DRC rule #1").

    Returns:
        Tuple of (Layer, display_name) where display_name is the semantic name if resolved
        that way, or the original layer_str otherwise.

    Raises:
        ValueError: If layer_str is not a known semantic name and cannot be parsed as
                    a numeric layer string.
    """
    # Check semantic name first
    if layer_str in layer_lookup:
        return layer_lookup[layer_str], layer_str

    # Try numeric parsing
    try:
        layer = _parse_layer_string(layer_str)
        return layer, layer_str
    except (ValueError, TypeError):
        # Neither a semantic name nor a valid numeric string
        available = ", ".join(sorted(layer_lookup.keys())) if layer_lookup else "(none defined)"
        ctx = f" in {context}" if context else ""
        raise ValueError(
            f"Unknown layer '{layer_str}'{ctx}. "
            f"Not a valid 'number/datatype' format, and not a known layer name. "
            f"Available layer names: {available}"
        ) from None


def run_drc(
    cell: Cell | _Cell,
    rules: DrcRules,
    library: Library | _Library | None = None,
) -> DrcResult:
    """Run DRC on a cell.

    When called with a Cell that was built using Instance references (via
    cell.at()), child cells are automatically collected into a Library for
    hierarchy resolution. You can also pass a Library explicitly.

    Args:
        cell: The cell to check
        rules: DRC rules to apply
        library: Library containing referenced cells. If None and cell is a
                 Python Cell with Instance tracking, a Library is auto-built.

    Returns:
        DrcResult with violations and statistics

    Example:
        rules = DrcRules().min_width(Layer(1), 0.1).min_spacing(Layer(1), Layer(1), 0.15)
        result = run_drc(cell, rules)
        if result.passed:
            print("DRC passed!")
        else:
            for v in result.violations:
                print(f"  {v.message}")
    """
    # Extract inner Rust objects
    inner_cell = cell._inner if isinstance(cell, Cell) else cell

    inner_library = None
    if library is not None:
        inner_library = library._inner if isinstance(library, Library) else library
    elif isinstance(cell, Cell):
        # Auto-collect child cells into a Library for hierarchy resolution.
        # Without this, CellRefs are silently skipped during flattening and
        # polygons inside referenced cells are invisible to DRC.
        collected: set[Cell] = set()
        _collect_all_cells(cell, collected)
        if collected:
            lib = Library("_drc")
            for child in collected:
                lib.add_cell(child)
            lib.add_cell(cell)
            inner_library = lib._inner

    return _run_drc(inner_cell, rules, inner_library)


# =============================================================================
# Connectivity checking
# =============================================================================


def load_checks_config(
    config_path: str | Path | None = None,
) -> ChecksConfig:
    """Load checks config from rosette.toml.

    Reads the [checks] section. If the section is absent, returns
    a ChecksConfig with sensible defaults.

    Args:
        config_path: Optional explicit path to rosette.toml. If None, searches
                     from current directory upward.

    Returns:
        ChecksConfig built from the configuration

    Example:
        # In rosette.toml:
        # [checks]
        # position_tolerance = 0.001
        # angle_tolerance = 0.1
        # check_widths = true
        # min_bend_radius = 5.0
        # severity = "error"

        config = load_checks_config()
        result = run_checks(cell, config)
    """
    # Find config file
    if config_path is not None:
        toml_path = Path(config_path)
        if not toml_path.exists():
            raise FileNotFoundError(f"Config file not found: {toml_path}")
    else:
        toml_path = _find_rosette_toml()
        if toml_path is None:
            # No config file — return defaults
            return ChecksConfig()

    # Parse TOML
    with open(toml_path, "rb") as f:
        config = tomllib.load(f)

    checks_config = config.get("checks", {})
    if not checks_config:
        return ChecksConfig()

    return ChecksConfig(
        position_tolerance=checks_config.get("position_tolerance", 0.001),
        angle_tolerance=checks_config.get("angle_tolerance", 0.1),
        check_widths=checks_config.get("check_widths", True),
        min_bend_radius=checks_config.get("min_bend_radius"),
        severity=checks_config.get("severity", "error"),
    )


def run_checks(
    cell: Cell | _Cell,
    config: ChecksConfig | None = None,
    library: Library | _Library | None = None,
) -> ChecksResult:
    """Run design checks on a cell.

    Runs all design checks: connectivity (unconnected ports, width/angle
    mismatch) and bend radius (below minimum, auto-reduced).

    When called with a Cell that was built using Instance references (via
    cell.at()), child cells are automatically collected into a Library for
    hierarchy resolution. You can also pass a Library explicitly.

    Ports on the top-level cell are treated as external I/O and are not
    flagged as unconnected.

    Args:
        cell: The cell to check
        config: Checks config (default: ChecksConfig())
        library: Library containing referenced cells. If None and cell is a
                 Python Cell with Instance tracking, a Library is auto-built.

    Returns:
        ChecksResult with violations and statistics

    Example:
        config = ChecksConfig(min_bend_radius=5.0)
        result = run_checks(cell, config)
        if result.passed:
            print("All checks passed!")
        else:
            for v in result.violations:
                print(f"  {v.message}")
    """
    # Extract inner Rust objects
    inner_cell = cell._inner if isinstance(cell, Cell) else cell

    inner_library = None
    if library is not None:
        inner_library = library._inner if isinstance(library, Library) else library
    elif isinstance(cell, Cell):
        # Auto-collect child cells into a Library for hierarchy resolution
        collected: set[Cell] = set()
        _collect_all_cells(cell, collected)
        if collected:
            lib = Library("_checks")
            for child in collected:
                lib.add_cell(child)
            lib.add_cell(cell)
            inner_library = lib._inner

    return _run_checks(inner_cell, config, inner_library)


def load_dfm_config(
    config_path: str | Path | None = None,
) -> tuple[DfmConfig, GaussianModel, list[Layer]]:
    """Load DFM configuration from rosette.toml.

    Reads the [dfm] section of rosette.toml which configures the virtual
    nanofabrication prediction tool.

    Layer references in the ``layers`` list and ``[dfm.layer.*]`` overrides
    accept semantic names from the [layers] section (e.g. ``"silicon"``) or
    the traditional ``"number/datatype"`` format (e.g. ``"1/0"``).

    Args:
        config_path: Optional explicit path to rosette.toml. If None, searches
                     from current directory upward.

    Returns:
        Tuple of (DfmConfig, GaussianModel, layers) where layers is the list
        of layers to predict (empty list means "all layers in the design").

    Raises:
        FileNotFoundError: If rosette.toml is not found
        ValueError: If the config has invalid DFM settings

    Example:
        In rosette.toml::

            [layers.silicon]
            number = 1

            [dfm]
            resolution = 0.01
            sigma = 0.08
            layers = ["silicon"]     # or ["1/0"]

        Usage::

            config, model, layers = load_dfm_config()
            result = run_dfm(cell, layers=layers, model=model, config=config)
    """
    # Find config file
    if config_path is not None:
        toml_path = Path(config_path)
        if not toml_path.exists():
            raise FileNotFoundError(f"Config file not found: {toml_path}")
    else:
        toml_path = _find_rosette_toml()
        if toml_path is None:
            raise FileNotFoundError(
                "rosette.toml not found. Run 'rosette init' to create a project, "
                "or specify config_path explicitly."
            )

    # Parse TOML
    with open(toml_path, "rb") as f:
        config = tomllib.load(f)

    # Build semantic name -> Layer lookup from [layers] section (if present)
    layer_lookup = _build_layer_lookup(config)

    dfm_config = config.get("dfm", {})
    if not dfm_config:
        raise ValueError("No [dfm] section found in rosette.toml")

    # Extract configuration values with defaults
    resolution = dfm_config.get("resolution", 0.01)
    padding = dfm_config.get("padding", 1.0)
    contour_threshold = dfm_config.get("contour_threshold", 0.5)
    keep_raster = dfm_config.get("keep_raster", False)

    # Model configuration
    model_type = dfm_config.get("model", "gaussian")
    if model_type != "gaussian":
        raise ValueError(
            f"Unknown DFM model type: '{model_type}'. "
            "Currently supported: 'gaussian'. "
            "PreFab models coming soon."
        )

    sigma = dfm_config.get("sigma", _DFM_DEFAULT_SIGMA)
    # "threshold" in rosette.toml maps to contour_threshold (binarization level)
    threshold = dfm_config.get("threshold")
    if threshold is not None:
        if "contour_threshold" in dfm_config and dfm_config["contour_threshold"] != threshold:
            import warnings

            warnings.warn(
                f"Both 'threshold' ({threshold}) and 'contour_threshold' "
                f"({dfm_config['contour_threshold']}) are set in [dfm]. "
                f"Using 'threshold' ({threshold}). Remove one to silence this warning.",
                stacklevel=2,
            )
        contour_threshold = threshold

    # Validate numeric values
    if not isinstance(resolution, (int, float)) or resolution <= 0:
        raise ValueError(f"DFM 'resolution' must be a positive number, got {resolution!r}")
    if not isinstance(sigma, (int, float)) or sigma < 0:
        raise ValueError(f"DFM 'sigma' must be a non-negative number, got {sigma!r}")
    if (
        not isinstance(contour_threshold, (int, float))
        or contour_threshold < 0
        or contour_threshold > 1
    ):
        raise ValueError(f"DFM 'threshold' must be between 0.0 and 1.0, got {contour_threshold!r}")

    # Parse layers — accepts semantic names ("silicon") or numeric ("1/0")
    layer_strs = dfm_config.get("layers", [])
    layers = [_resolve_layer(ls, layer_lookup, context="[dfm] layers")[0] for ls in layer_strs]

    # Parse optional tolerances
    max_area_deviation = dfm_config.get("max_area_deviation")
    severity = dfm_config.get("severity", "error")

    if max_area_deviation is not None:
        if not isinstance(max_area_deviation, (int, float)) or max_area_deviation <= 0:
            raise ValueError(
                f"DFM 'max_area_deviation' must be a positive number, got {max_area_deviation!r}"
            )
        max_area_deviation = float(max_area_deviation)

    if severity not in ("error", "warning"):
        raise ValueError(f"DFM 'severity' must be 'error' or 'warning', got {severity!r}")

    dfm_cfg = DfmConfig(
        resolution=float(resolution),
        padding=float(padding),
        contour_threshold=float(contour_threshold),
        keep_raster=bool(keep_raster),
        max_area_deviation=max_area_deviation,
        severity=severity,
    )
    model = GaussianModel(sigma=float(sigma))

    # Parse per-layer overrides from [dfm.layer."1/0"] or [dfm.layer.silicon] sections
    per_layer = dfm_config.get("layer", {})
    for layer_str, layer_params in per_layer.items():
        if not isinstance(layer_params, dict):
            continue
        layer_obj, _ = _resolve_layer(layer_str, layer_lookup, context="[dfm.layer]")
        dfm_cfg.set_layer_config(
            layer_obj,
            sigma=layer_params.get("sigma"),
            max_area_deviation=layer_params.get("max_area_deviation"),
            severity=layer_params.get("severity"),
        )

    return dfm_cfg, model, layers


def run_dfm(
    cell: Cell | _Cell,
    layers: list[Layer],
    model: GaussianModel | None = None,
    config: DfmConfig | None = None,
    library: Library | _Library | None = None,
) -> DfmResult:
    """Run DFM prediction on a cell.

    Rasterizes each specified layer, applies the fabrication prediction model,
    and extracts contour polygons representing the predicted fabricated geometry.

    Args:
        cell: The cell to predict
        layers: Layers to process
        model: The prediction model (default: GaussianModel with default sigma)
        config: DFM configuration (default: DfmConfig())
        library: Library containing referenced cells (required if cell has refs)

    Returns:
        DfmResult with per-layer predictions and statistics

    Example:
        result = run_dfm(cell, layers=[Layer(1, 0)])
        for lp in result.layers:
            print(f"  Layer {lp.layer}: {lp.input_polygon_count} -> {lp.predicted_polygon_count}")
    """
    # Extract inner Rust objects
    inner_cell = cell._inner if isinstance(cell, Cell) else cell
    inner_library = None
    if library is not None:
        inner_library = library._inner if isinstance(library, Library) else library

    # Default model
    if model is None:
        model = GaussianModel(sigma=_DFM_DEFAULT_SIGMA)

    # Default config
    if config is None:
        config = DfmConfig()

    return _run_dfm(inner_cell, layers, model, config, inner_library)


def add_dfm_predictions(
    cell: Cell,
    result: DfmResult,
    datatype_offset: int = 100,
) -> None:
    """Add DFM predicted polygons to a cell on offset layers.

    For each layer in the DFM result, adds the predicted polygons to the cell
    on a new layer with the same layer number but datatype offset by
    ``datatype_offset``. This makes it easy to visualize designed vs predicted
    geometry side-by-side in a GDS viewer.

    Args:
        cell: The cell to add predicted polygons to (modified in-place)
        result: DFM prediction result from ``run_dfm``
        datatype_offset: Offset added to the original datatype (default 100).
            E.g., layer (1, 0) predictions go to (1, 100).

    Example:
        result = run_dfm(cell, layers=[Layer(1, 0)], model=model)
        add_dfm_predictions(cell, result)
        write_gds("output.gds", cell)
        # Layer 1/0 = designed, Layer 1/100 = predicted
    """
    for lp in result.layers:
        layer_num, datatype = lp.layer
        pred_layer = Layer(layer_num, datatype + datatype_offset)
        for poly in lp.predicted_polygons:
            cell.add_polygon(poly, pred_layer)


def read_gds(path: str | Path) -> Library:
    """Read a GDS file and return a Library.

    Args:
        path: Path to the GDS file

    Returns:
        A Library containing all cells from the GDS file

    Example:
        >>> lib = read_gds("input.gds")
        >>> for cell in lib.cells():
        ...     print(cell.name)
    """
    inner_lib = _read_gds(str(path))
    return Library._from_inner(inner_lib)


def write_gds(
    path: str | Path,
    design: Cell | Library,
    cells: list[Cell] | None = None,
    *,
    quiet: bool = False,
    verbose: bool = False,
) -> None:
    """Write a Cell or Library to a GDS file.

    When writing a Cell that was built using Instance references (via cell.at()),
    child cells are automatically collected and included. You can still pass
    cells explicitly if needed.

    A build summary is printed to stderr by default, providing feedback about
    the design (bounding box, cell count, ports). This helps both users and
    AI agents validate builds without opening a viewer.

    Args:
        path: Output file path
        design: Cell or Library to write
        cells: Optional list of child cells. If None and design is a Cell,
               child cells are auto-collected from Instance references.
        quiet: If True, suppress the build summary (default: False)
        verbose: If True, print detailed build info including port positions

    Example:
        # Auto-collection (recommended):
        top = Cell("top")
        top.add_ref(gc_cell.at(0, 0))
        top.add_ref(wg_cell.at(0, 0))
        write_gds("output.gds", top)  # No manual cell list needed!

        # Explicit cell list (still supported):
        write_gds("output.gds", top, [gc_cell, wg_cell])

        # Suppress output for batch processing:
        write_gds("output.gds", top, quiet=True)
    """
    if cells is None and isinstance(design, Cell):
        # Auto-collect child cells from Instance tracking
        collected: set[Cell] = set()
        _collect_all_cells(design, collected)
        if collected:
            cells = list(collected)

    # Extract inner Rust objects for the Rust write_gds function
    inner_design: _Cell | _Library
    if isinstance(design, Cell):
        inner_design = design._inner
    elif isinstance(design, Library):
        inner_design = design._inner
    else:
        inner_design = design

    inner_cells: list[_Cell] | None = None
    if cells is not None:
        inner_cells = [c._inner if isinstance(c, Cell) else c for c in cells]  # type: ignore[misc]

    # Check environment variables for CLI compatibility (rosette build -v)
    if os.environ.get("ROSETTE_VERBOSE"):
        verbose = True

    _write_gds(str(path), inner_design, inner_cells, quiet, verbose)


# =============================================================================
# LayerMap: Named layer definitions with colors from layers.toml
# =============================================================================

# Valid fill pattern values (matches app/WASM renderer)
_VALID_FILL_PATTERNS = {"solid", "hatched", "crosshatched", "dotted"}

# Default layer definitions — single source of truth for templates and app.
# These are used as the fallback when rosette.toml has no [layers] section
# and are mirrored in the templates and the desktop app.
DEFAULT_LAYERS: list[dict] = [
    {
        "name": "silicon",
        "number": 1,
        "datatype": 0,
        "color": "#ff69b4",
        "fill": "solid",
        "opacity": 0.7,
        "description": "Silicon waveguides",
    },
    {
        "name": "text",
        "number": 10,
        "datatype": 0,
        "color": "#607d8b",
        "fill": "dotted",
        "opacity": 0.7,
        "description": "Text annotations",
    },
]


def _default_layer_map() -> LayerMap:
    """Create a LayerMap from the built-in DEFAULT_LAYERS."""
    return LayerMap(
        [
            LayerInfo(
                name=d["name"],
                layer=Layer(d["number"], d["datatype"]),
                color=d["color"],
                fill=d["fill"],
                opacity=d["opacity"],
                description=d["description"],
            )
            for d in DEFAULT_LAYERS
        ]
    )


# Hex color regex: #RRGGBB
_HEX_COLOR_RE = re.compile(r"^#[0-9a-fA-F]{6}$")


class LayerInfo:
    """A single layer definition with metadata.

    Combines the GDS layer identity (number, datatype) with display
    properties (color, fill, opacity) and a human-readable description.

    Use `info.layer` to get the underlying Layer for rosette APIs::

        layers = load_layer_map()
        cell.add_polygon(poly, layers.silicon.layer)

    Attributes:
        layer: The underlying Layer(number, datatype)
        name: Semantic name (e.g., "silicon", "text")
        color: Hex color string (e.g., "#ff69b4")
        fill: Fill pattern ("solid", "hatched", "crosshatched", "dotted")
        opacity: Fill opacity 0.0-1.0
        description: Human-readable description
    """

    __slots__ = ("color", "description", "fill", "layer", "name", "opacity")

    def __init__(
        self,
        name: str,
        layer: Layer,
        color: str = "#808080",
        fill: str = "solid",
        opacity: float = 0.7,
        description: str = "",
    ) -> None:
        self.name = name
        self.layer = layer
        self.color = color
        self.fill = fill
        self.opacity = opacity
        self.description = description

    @property
    def number(self) -> int:
        """GDS layer number."""
        return self.layer.number

    @property
    def datatype(self) -> int:
        """GDS datatype."""
        return self.layer.datatype

    def __repr__(self) -> str:
        return (
            f"LayerInfo('{self.name}', Layer({self.number}, {self.datatype}), color='{self.color}')"
        )


class LayerMap:
    """Named layer definitions loaded from layers.toml.

    Provides attribute-style access to layers by semantic name, so
    components and designs can reference layers without hardcoded numbers.

    Example:
        layers = load_layer_map()
        layers.silicon        # -> LayerInfo('silicon', Layer(1, 0), color='#ff69b4')
        layers.silicon.layer  # -> Layer(1, 0)
        layers.silicon.color  # -> '#ff69b4'

        # Use directly in component calls and cell operations
        gc = grating_coupler(layers.silicon.layer, waveguide_width=0.5)
        cell.add_polygon(poly, layers.silicon.layer)

        # Iterate over all layers
        for info in layers:
            print(f"{info.name}: Layer({info.number}, {info.datatype})")

        # Export as list of dicts (for app/viewer consumption)
        layers.to_dict_list()
    """

    def __init__(self, layer_infos: list[LayerInfo] | None = None) -> None:
        """Create a LayerMap from a list of LayerInfo objects.

        Args:
            layer_infos: List of layer definitions. If None, creates an empty map.
        """
        self._layers: dict[str, LayerInfo] = {}
        if layer_infos:
            for info in layer_infos:
                self._layers[info.name] = info

    def __getattr__(self, name: str) -> LayerInfo:
        # Avoid infinite recursion for dunder/private attrs
        if name.startswith("_"):
            raise AttributeError(name)
        try:
            return self._layers[name]
        except KeyError:
            available = ", ".join(self._layers.keys()) if self._layers else "(none)"
            raise AttributeError(
                f"No layer named '{name}'. Available layers: {available}"
            ) from None

    def __contains__(self, name: str) -> bool:
        return name in self._layers

    def __iter__(self):
        return iter(self._layers.values())

    def __len__(self) -> int:
        return len(self._layers)

    def get(self, name: str) -> LayerInfo | None:
        """Get a layer by name, or None if not found."""
        return self._layers.get(name)

    def names(self) -> list[str]:
        """Get all layer names."""
        return list(self._layers.keys())

    def to_dict_list(self) -> list[dict]:
        """Export as a list of dicts for serialization.

        Returns a list suitable for JSON serialization, with keys matching
        the app's Layer interface.
        """
        result = []
        for i, info in enumerate(self._layers.values(), start=1):
            result.append(
                {
                    "id": i,
                    "layerNumber": info.number,
                    "datatype": info.datatype,
                    "name": info.name,
                    "color": info.color,
                    "visible": True,
                    "fillPattern": info.fill,
                    "opacity": info.opacity,
                }
            )
        return result

    def __repr__(self) -> str:
        names = ", ".join(self._layers.keys())
        return f"LayerMap([{names}])"


def load_layer_map(config_path: str | Path | None = None) -> LayerMap:
    """Load layer definitions from rosette.toml.

    Reads the [layers] section of rosette.toml which maps semantic names
    to GDS layer numbers with optional display properties (color, fill, opacity).

    Args:
        config_path: Optional explicit path to rosette.toml. If None, searches
                     from current directory upward.

    Returns:
        LayerMap with named layer access

    Raises:
        FileNotFoundError: If rosette.toml is not found
        ValueError: If the config has invalid layer definitions

    Example:
        In rosette.toml:

            [layers.silicon]
            number = 1
            datatype = 0
            color = "#ff69b4"
            description = "Silicon waveguides"

        Usage:

            layers = load_layer_map()
            layers.silicon.layer   # Layer(1, 0)
            layers.silicon.color   # "#ff69b4"
            layers.text.number     # 10
    """
    # Find config file
    if config_path is not None:
        toml_path = Path(config_path)
        if not toml_path.exists():
            raise FileNotFoundError(f"Config file not found: {toml_path}")
    else:
        toml_path = _find_rosette_toml()
        if toml_path is None:
            raise FileNotFoundError(
                "rosette.toml not found. Run 'rosette init' to create a project, "
                "or specify config_path explicitly."
            )

    # Parse TOML
    with open(toml_path, "rb") as f:
        config = tomllib.load(f)

    layers_config = config.get("layers", {})
    if not layers_config:
        return _default_layer_map()

    layer_infos = []
    seen_pairs: dict[tuple[int, int], str] = {}

    for name, props in layers_config.items():
        if not isinstance(props, dict):
            raise ValueError(f"Layer '{name}': expected a table, got {type(props).__name__}")

        # Required: number
        if "number" not in props:
            raise ValueError(f"Layer '{name}': missing required field 'number'")

        number = props["number"]
        if not isinstance(number, int) or number < 0 or number > 999:
            raise ValueError(f"Layer '{name}': 'number' must be an integer 0-999, got {number!r}")

        datatype = props.get("datatype", 0)
        if not isinstance(datatype, int) or datatype < 0 or datatype > 999:
            raise ValueError(
                f"Layer '{name}': 'datatype' must be an integer 0-999, got {datatype!r}"
            )

        # Check for duplicate (number, datatype) pairs
        pair = (number, datatype)
        if pair in seen_pairs:
            raise ValueError(
                f"Layer '{name}': layer ({number}, {datatype}) already defined "
                f"as '{seen_pairs[pair]}'"
            )
        seen_pairs[pair] = name

        # Optional display properties
        color = props.get("color", "#808080")
        if not isinstance(color, str) or not _HEX_COLOR_RE.match(color):
            raise ValueError(
                f"Layer '{name}': 'color' must be a hex string like '#ff0000', got {color!r}"
            )

        fill = props.get("fill", "solid")
        if fill not in _VALID_FILL_PATTERNS:
            raise ValueError(
                f"Layer '{name}': 'fill' must be one of {_VALID_FILL_PATTERNS}, got {fill!r}"
            )

        opacity = props.get("opacity", 0.7)
        if not isinstance(opacity, (int, float)) or opacity < 0.0 or opacity > 1.0:
            raise ValueError(f"Layer '{name}': 'opacity' must be a number 0.0-1.0, got {opacity!r}")

        description = props.get("description", "")

        layer_infos.append(
            LayerInfo(
                name=name,
                layer=Layer(number, datatype),
                color=color,
                fill=fill,
                opacity=float(opacity),
                description=description,
            )
        )

    return LayerMap(layer_infos)


__all__ = [
    "DEFAULT_LAYERS",
    "BBox",
    "Cell",
    "CellRef",
    "CheckViolation",
    "ChecksConfig",
    "ChecksResult",
    "DfmConfig",
    "DfmResult",
    "DfmViolation",
    "DrcResult",
    "DrcRules",
    "DrcViolation",
    "GaussianModel",
    "Instance",
    "Layer",
    "LayerInfo",
    "LayerMap",
    "LayerMetrics",
    "LayerPrediction",
    "Library",
    "PathEndType",
    "Point",
    "Polygon",
    "Port",
    "Route",
    "Transform",
    "Vector2",
    "add_dfm_predictions",
    "arc_points",
    "fresnel_c",
    "fresnel_s",
    "load_checks_config",
    "load_dfm_config",
    "load_drc_rules",
    "load_layer_map",
    "offset_polygon",
    "offset_polygon_varying",
    "path_length",
    "read_gds",
    "run_checks",
    "run_dfm",
    "run_drc",
    "write_gds",
]

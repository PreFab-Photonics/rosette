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
    from components import waveguide, bend, mmi_1x2
    wg_cell = waveguide(length=10.0, width=0.5)
    bend_cell = bend(radius=5.0, angle=90, width=0.5)

For library development, import from rosette.components:
    from rosette.components import waveguide, bend, mmi_1x2
"""

from __future__ import annotations

import linecache
import os
import re
import sys
import tomllib
import warnings
from dataclasses import dataclass
from pathlib import Path
from typing import TYPE_CHECKING

from rosette._core import (
    # Geometry
    BBox,
    # DRC
    DrcResult,
    DrcRules,
    DrcViolation,
    # Layout
    Layer,
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
from rosette._core import run_drc as _run_drc
from rosette._core import write_gds as _write_gds

if TYPE_CHECKING:
    pass

__version__ = "0.1.0"

# =============================================================================
# Source tracking for two-way editing (rosette serve)
# =============================================================================

# Module-level flag: only enabled during `rosette serve` to avoid overhead
_SOURCE_TRACKING = False


def enable_source_tracking():
    """Enable source location capture on Cell.add_* methods."""
    global _SOURCE_TRACKING
    _SOURCE_TRACKING = True


def disable_source_tracking():
    """Disable source location capture."""
    global _SOURCE_TRACKING
    _SOURCE_TRACKING = False


@dataclass(frozen=True)
class SourceLocation:
    """Source code location for an element added to a Cell."""

    file: str
    line: int
    function: str
    code: str
    element_type: str  # "polygon", "path", "text", "ref"


def _capture_source(element_type: str) -> SourceLocation | None:
    """Capture the caller's source location (2 frames up)."""
    try:
        # Frame 0: _capture_source
        # Frame 1: Cell.add_polygon / add_path / add_text / add_ref
        # Frame 2: User's code (the call site we want)
        frame = sys._getframe(2)
        filename = frame.f_code.co_filename
        lineno = frame.f_lineno
        funcname = frame.f_code.co_name
        code = linecache.getline(filename, lineno).strip()
        return SourceLocation(
            file=filename,
            line=lineno,
            function=funcname,
            code=code,
            element_type=element_type,
        )
    except (ValueError, AttributeError):
        return None


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
        gc = gc_cell.at(100, 50).rotate(180).mirror_x()
        top.add_ref(gc)
    """

    __slots__ = ("_cell", "_transform")

    def __init__(self, cell: Cell, transform: Transform | None = None) -> None:
        """Create an Instance from a Cell and optional transform.

        Args:
            cell: The cell definition
            transform: Optional transform (defaults to identity)
        """
        self._cell = cell
        self._transform = transform if transform is not None else Transform.identity()

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
        return Instance(self._cell, new_transform)

    def rotate(self, angle_deg: float) -> Instance:
        """Rotate by angle (in degrees).

        Args:
            angle_deg: Rotation angle in degrees

        Returns:
            A new Instance with updated transform
        """
        new_transform = Transform.rotate(angle_deg).then(self._transform)
        return Instance(self._cell, new_transform)

    def mirror_x(self) -> Instance:
        """Mirror across X axis.

        Returns:
            A new Instance with updated transform
        """
        new_transform = Transform.scale(1.0, -1.0).then(self._transform)
        return Instance(self._cell, new_transform)

    def mirror_y(self) -> Instance:
        """Mirror across Y axis.

        Returns:
            A new Instance with updated transform
        """
        new_transform = Transform.scale(-1.0, 1.0).then(self._transform)
        return Instance(self._cell, new_transform)

    def scale(self, s: float) -> Instance:
        """Scale uniformly.

        Args:
            s: Scale factor

        Returns:
            A new Instance with updated transform
        """
        new_transform = Transform.scale_uniform(s).then(self._transform)
        return Instance(self._cell, new_transform)

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
            gc = gc_cell.at(100, 50).rotate(180)
            opt_port = gc.port("opt")  # No need to pass gc_cell!
        """
        # Get the original port from the cell
        original_port = self._cell.port(name)
        # Apply the transform to get the positioned port
        pos = self._transform.apply(original_port.position)
        # Transform the direction vector
        direction = original_port.direction.rotate(self._rotation_angle())
        if self._is_mirrored_x():
            direction = Vector2(direction.x, -direction.y)
        if self._is_mirrored_y():
            direction = Vector2(-direction.x, direction.y)
        return Port(name, pos, direction, original_port.width)

    def to_ref(self) -> CellRef:
        """Convert to a CellRef for use with low-level APIs.

        Returns:
            A CellRef with the same cell name and transform
        """
        # Create CellRef and apply transform components
        # We need to decompose and reapply since CellRef uses its own transform
        ref = CellRef(self._cell.name)
        # Apply translation
        ref = ref.at(
            self._transform.apply(Point.origin()).x, self._transform.apply(Point.origin()).y
        )
        return ref

    def _rotation_angle(self) -> float:
        """Extract rotation angle from transform (in degrees)."""
        # Apply transform to unit vector to get rotation
        origin = self._transform.apply(Point.origin())
        unit_x = self._transform.apply(Point(1.0, 0.0))
        dx = unit_x.x - origin.x
        dy = unit_x.y - origin.y
        import math

        # Account for mirroring in angle calculation
        scale_x = math.sqrt(dx * dx + dy * dy)
        if scale_x > 0:
            angle = math.atan2(dy, dx) * 180.0 / math.pi
        else:
            angle = 0.0
        return angle

    def _is_mirrored_x(self) -> bool:
        """Check if transform includes X-axis mirroring."""
        # Check if Y is inverted by looking at how (0,1) transforms
        origin = self._transform.apply(Point.origin())
        unit_y = self._transform.apply(Point(0.0, 1.0))
        # Get the transformed Y basis vector
        dy = unit_y.y - origin.y
        # If dy is negative when we expect positive, we're mirrored
        return dy < 0

    def _is_mirrored_y(self) -> bool:
        """Check if transform includes Y-axis mirroring."""
        origin = self._transform.apply(Point.origin())
        unit_x = self._transform.apply(Point(1.0, 0.0))
        dx = unit_x.x - origin.x
        return dx < 0

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

    __slots__ = ("_child_cells", "_def_source", "_element_sources", "_inner")

    def __init__(self, name: str) -> None:
        """Create a new empty cell.

        Args:
            name: Name of the cell (must be unique within a design)
        """
        self._inner = _Cell(name)
        self._child_cells: set[Cell] = set()
        self._element_sources: list[SourceLocation | None] = []
        if _SOURCE_TRACKING:
            self._def_source: SourceLocation | None = _capture_source("cell_def")
        else:
            self._def_source = None

    @classmethod
    def _from_inner(cls, inner: _Cell) -> Cell:
        """Create a Cell wrapper from an existing Rust Cell."""
        cell = object.__new__(cls)
        cell._inner = inner
        cell._child_cells = set()
        cell._element_sources = []
        cell._def_source = None
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

    # --- Delegated methods ---

    def add_polygon(self, polygon: Polygon, layer: Layer | int | tuple[int, int]) -> None:
        """Add a polygon to the cell."""
        if _SOURCE_TRACKING:
            self._element_sources.append(_capture_source("polygon"))
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
        if _SOURCE_TRACKING:
            self._element_sources.append(_capture_source("path"))
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
        if _SOURCE_TRACKING:
            self._element_sources.append(_capture_source("text"))
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
        if _SOURCE_TRACKING:
            self._element_sources.append(_capture_source("ref"))

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
            # Convert to Rust CellRef for the underlying Rust call
            rust_ref = _CellRef(instance.cell.name)
            # Apply the instance's transform by positioning
            pos = instance.transform.apply(Point.origin())
            rust_ref = rust_ref.at(pos.x, pos.y)
            # Handle rotation - extract from transform
            angle = instance._rotation_angle()
            if abs(angle) > 0.001:
                rust_ref = rust_ref.rotate(angle)
            # Handle mirroring
            if instance._is_mirrored_x():
                rust_ref = rust_ref.mirror_x()
            if instance._is_mirrored_y():
                rust_ref = rust_ref.mirror_y()
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
    """Path-based waveguide route.

    This wrapper extends the core Route to return wrapped Cell objects
    from to_cell(), enabling the ergonomic Instance API.

    Routes generate continuous waveguide geometry from a series of waypoints,
    automatically inserting bends at corners and tapers for width transitions.

    Example:
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
        """Start the route at a port."""
        self._inner.start_at_port(port)

    def to(
        self,
        x: float,
        y: float,
        width: float | None = None,
        bend_radius: float | None = None,
    ) -> None:
        """Add a waypoint to the route."""
        self._inner.to(x, y, width, bend_radius)

    def end_at(self, x: float, y: float, angle: float = 0.0) -> None:
        """End the route at a specific position and angle (degrees)."""
        self._inner.end_at(x, y, angle)

    def end_at_port(self, port: Port) -> None:
        """End the route at a port."""
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

        Args:
            *waypoints: Sequence of waypoints. Each can be:
                - Port: uses position, angle, and width
                - Point: uses position only
                - (x, y) tuple: position only
                - (x, y, angle) tuple: position and angle (for first/last waypoint)
            layer: The layer for the route
            width: Default waveguide width
            bend_radius: Default bend radius

        Returns:
            A Route that can be converted to a Cell with to_cell()

        Example:
            route = Route.through(port_a, (50, 0), (50, 30), port_b, layer=Layer(1, 0))
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

    Args:
        config_path: Optional explicit path to rosette.toml. If None, searches
                     from current directory upward.

    Returns:
        DrcRules built from the configuration

    Raises:
        FileNotFoundError: If rosette.toml is not found
        ValueError: If the config has invalid DRC settings

    Example:
        # In rosette.toml:
        # [drc.layers."1/0"]
        # min_width = 0.12
        # min_spacing = 0.13
        # min_area = 0.01
        # angles = [0, 90]
        #
        # [[drc.rules]]
        # type = "enclosure"
        # inner = "11/0"
        # outer = "10/0"
        # min_enclosure = 0.10
        # name = "VIA_ENC"

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

    # Build rules from config
    rules = DrcRules()

    drc_config = config.get("drc", {})
    layers_config = drc_config.get("layers", {})

    # Process per-layer rules
    for layer_str, layer_rules in layers_config.items():
        # Parse layer string "number/datatype"
        layer = _parse_layer_string(layer_str)

        # Apply rules for this layer
        if "min_width" in layer_rules:
            rules = rules.min_width(layer, layer_rules["min_width"])

        if "min_spacing" in layer_rules:
            rules = rules.min_spacing(layer, layer, layer_rules["min_spacing"])

        if "min_area" in layer_rules:
            rules = rules.min_area(layer, layer_rules["min_area"])

        if "angles" in layer_rules:
            rules = rules.allowed_angles(layer, layer_rules["angles"])

    # Process inter-layer rules
    inter_layer_rules = drc_config.get("rules", [])
    for i, rule in enumerate(inter_layer_rules):
        rule_type = rule.get("type")
        name = rule.get("name")

        if rule_type is None:
            raise ValueError(f"DRC rule #{i + 1} missing required 'type' field")

        if rule_type == "enclosure":
            _validate_rule_fields(rule, ["inner", "outer", "min_enclosure"], i)
            inner = _parse_layer_string(rule["inner"])
            outer = _parse_layer_string(rule["outer"])
            enclosure = rule["min_enclosure"]
            rules = rules.min_enclosure(inner, outer, enclosure, name)

        elif rule_type == "spacing":
            _validate_rule_fields(rule, ["layer1", "layer2", "min_spacing"], i)
            layer1 = _parse_layer_string(rule["layer1"])
            layer2 = _parse_layer_string(rule["layer2"])
            spacing = rule["min_spacing"]
            rules = rules.min_spacing(layer1, layer2, spacing, name)

        elif rule_type == "require_overlap":
            _validate_rule_fields(rule, ["layer1", "layer2"], i)
            layer1 = _parse_layer_string(rule["layer1"])
            layer2 = _parse_layer_string(rule["layer2"])
            rules = rules.require_overlap(layer1, layer2, name)

        elif rule_type == "forbid_overlap":
            _validate_rule_fields(rule, ["layer1", "layer2"], i)
            layer1 = _parse_layer_string(rule["layer1"])
            layer2 = _parse_layer_string(rule["layer2"])
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


def run_drc(
    cell: Cell | _Cell,
    rules: DrcRules,
    library: Library | _Library | None = None,
) -> DrcResult:
    """Run DRC on a cell.

    Args:
        cell: The cell to check
        rules: DRC rules to apply
        library: Library containing referenced cells (required if cell has refs)

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

    return _run_drc(inner_cell, rules, inner_library)


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

# Hex color regex: #RRGGBB
_HEX_COLOR_RE = re.compile(r"^#[0-9a-fA-F]{6}$")


class LayerInfo:
    """A single layer definition with metadata.

    Combines the GDS layer identity (number, datatype) with display
    properties (color, fill, opacity) and a human-readable description.

    Use `info.layer` to get the underlying Layer for rosette APIs::

        layers = load_layer_map()
        cell.add_polygon(poly, layers.core.layer)

    Attributes:
        layer: The underlying Layer(number, datatype)
        name: Semantic name (e.g., "core", "clad")
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
        layers.core        # -> LayerInfo('core', Layer(1, 0), color='#ff69b4')
        layers.core.layer  # -> Layer(1, 0)
        layers.core.color  # -> '#ff69b4'

        # Use directly in component calls and cell operations
        wg = waveguide(layers.core.layer, width=0.5, length=10.0)
        cell.add_polygon(poly, layers.core.layer)

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

            [layers.core]
            number = 1
            datatype = 0
            color = "#ff69b4"
            description = "Waveguide core"

            [layers.clad]
            number = 2
            color = "#4caf50"

        Usage:

            layers = load_layer_map()
            layers.core.layer   # Layer(1, 0)
            layers.core.color   # "#ff69b4"
            layers.clad.number  # 2
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
        return LayerMap()

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
    "BBox",
    "Cell",
    "CellRef",
    "DrcResult",
    "DrcRules",
    "DrcViolation",
    "Instance",
    "Layer",
    "LayerInfo",
    "LayerMap",
    "Library",
    "PathEndType",
    "Point",
    "Polygon",
    "Port",
    "Route",
    "Transform",
    "Vector2",
    "arc_points",
    "fresnel_c",
    "fresnel_s",
    "load_drc_rules",
    "load_layer_map",
    "offset_polygon",
    "offset_polygon_varying",
    "path_length",
    "read_gds",
    "run_drc",
    "write_gds",
]

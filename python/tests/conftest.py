"""Pytest configuration and shared fixtures for rosette tests."""

from pathlib import Path

import pytest

from rosette import (
    Cell,
    Layer,
    Library,
    Point,
    Polygon,
    Port,
    Transform,
    Vector2,
)

# Components are now Python functions in rosette.components
from rosette.components import (
    bend,
    crossing,
    directional_coupler,
    grating_coupler,
    mmi_1x2,
    mmi_2x2,
    ring,
    sbend,
    spiral,
    taper,
    waveguide,
    ybranch,
)

# =============================================================================
# Geometry Fixtures
# =============================================================================


@pytest.fixture
def origin() -> Point:
    """Point at origin."""
    return Point.origin()


@pytest.fixture
def point() -> Point:
    """Sample point at (10, 20)."""
    return Point(10.0, 20.0)


@pytest.fixture
def vector() -> Vector2:
    """Sample vector (3, 4)."""
    return Vector2(3.0, 4.0)


@pytest.fixture
def unit_x() -> Vector2:
    """Unit vector in X direction."""
    return Vector2.unit_x()


@pytest.fixture
def unit_y() -> Vector2:
    """Unit vector in Y direction."""
    return Vector2.unit_y()


@pytest.fixture
def rectangle(origin: Point) -> Polygon:
    """10x5 rectangle at origin."""
    return Polygon.rect(origin, 10.0, 5.0)


@pytest.fixture
def triangle() -> Polygon:
    """Simple triangle."""
    return Polygon([Point(0, 0), Point(10, 0), Point(5, 10)])


@pytest.fixture
def identity_transform() -> Transform:
    """Identity transform."""
    return Transform.identity()


# =============================================================================
# Layout Fixtures
# =============================================================================


@pytest.fixture
def layer() -> Layer:
    """Standard waveguide layer (1, 0)."""
    return Layer(1, 0)


@pytest.fixture
def metal_layer() -> Layer:
    """Metal layer (10, 0)."""
    return Layer(10, 0)


@pytest.fixture
def port(origin: Point, unit_x: Vector2) -> Port:
    """Port at origin pointing in +X direction."""
    return Port("test_port", origin, unit_x, width=0.5)


@pytest.fixture
def empty_cell() -> Cell:
    """Empty cell for testing."""
    return Cell("test_cell")


@pytest.fixture
def simple_cell(layer: Layer) -> Cell:
    """Cell with a single rectangle."""
    cell = Cell("simple_cell")
    cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 5.0), layer)
    return cell


@pytest.fixture
def library(simple_cell: Cell) -> Library:
    """Library with a simple cell."""
    lib = Library("test_lib")
    lib.add_cell(simple_cell)
    return lib


# =============================================================================
# Component Fixtures (now return Cells from Python component functions)
# =============================================================================


@pytest.fixture
def waveguide_cell(layer: Layer) -> Cell:
    """Standard waveguide: 10um long, 0.5um wide."""
    return waveguide(layer, waveguide_width=0.5, length=10.0)


@pytest.fixture
def bend_90_cell(layer: Layer) -> Cell:
    """90-degree circular bend: 5um radius, 0.5um wide."""
    return bend(layer, waveguide_width=0.5, radius=5.0, angle=90.0)


@pytest.fixture
def euler_bend_cell(layer: Layer) -> Cell:
    """90-degree Euler bend: 5um radius, 0.5um wide."""
    return bend(layer, waveguide_width=0.5, radius=5.0, angle=90.0, euler=True)


@pytest.fixture
def taper_cell(layer: Layer) -> Cell:
    """Taper from 0.5um to 1.0um over 10um."""
    return taper(layer, width_in=0.5, width_out=1.0, length=10.0)


@pytest.fixture
def sbend_cell(layer: Layer) -> Cell:
    """S-bend: 20um long, 5um offset, 0.5um wide."""
    return sbend(layer, waveguide_width=0.5, length=20.0, offset=5.0)


@pytest.fixture
def mmi_1x2_cell(layer: Layer) -> Cell:
    """1x2 MMI splitter."""
    return mmi_1x2(layer)


@pytest.fixture
def mmi_2x2_cell(layer: Layer) -> Cell:
    """2x2 MMI coupler."""
    return mmi_2x2(layer)


@pytest.fixture
def directional_coupler_cell(layer: Layer) -> Cell:
    """Standard directional coupler."""
    return directional_coupler(layer)


@pytest.fixture
def ybranch_cell(layer: Layer) -> Cell:
    """Standard Y-branch."""
    return ybranch(layer, waveguide_width=0.5)


@pytest.fixture
def ring_cell(layer: Layer) -> Cell:
    """All-pass ring resonator: 10um radius, 0.5um wide."""
    return ring(layer, waveguide_width=0.5, radius=10.0)


@pytest.fixture
def ring_add_drop_cell(layer: Layer) -> Cell:
    """Add-drop ring resonator."""
    return ring(layer, waveguide_width=0.5, radius=10.0, coupling="adddrop")


@pytest.fixture
def spiral_cell(layer: Layer) -> Cell:
    """Standard spiral delay line."""
    return spiral(layer, waveguide_width=0.5, turns=3, min_radius=10.0)


@pytest.fixture
def crossing_cell(layer: Layer) -> Cell:
    """Standard waveguide crossing."""
    return crossing(layer, waveguide_width=0.5)


@pytest.fixture
def grating_coupler_cell(layer: Layer) -> Cell:
    """Standard grating coupler."""
    return grating_coupler(layer, waveguide_width=0.5)


# =============================================================================
# I/O Fixtures
# =============================================================================


@pytest.fixture
def temp_gds_path(tmp_path: Path) -> Path:
    """Temporary path for GDS output."""
    return tmp_path / "test_output.gds"


@pytest.fixture
def temp_dir(tmp_path: Path) -> Path:
    """Temporary directory for test outputs."""
    return tmp_path

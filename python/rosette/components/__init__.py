"""Photonic components library.

This module contains user-customizable photonic components. Each component
is implemented as a function that returns a Cell.

Usage in main repo:
    from rosette.components import waveguide, mmi_1x2, bend

Usage in user projects (after rosette init):
    from components import waveguide, mmi_1x2, bend

Components can be freely modified to match your PDK or process requirements.

All components follow a consistent API:
- First parameter is always `layer: Layer`
- Second parameter is typically `width: float = 0.5`
- Returns a Cell with named ports
"""

from rosette.components.bend import bend
from rosette.components.crossing import crossing
from rosette.components.directional_coupler import directional_coupler
from rosette.components.grating_coupler import grating_coupler
from rosette.components.mmi import mmi_1x2, mmi_2x1, mmi_2x2
from rosette.components.ring import ring
from rosette.components.sbend import sbend
from rosette.components.spiral import spiral
from rosette.components.taper import taper
from rosette.components.waveguide import waveguide
from rosette.components.ybranch import ybranch

__all__ = [
    "bend",
    "crossing",
    "directional_coupler",
    "grating_coupler",
    "mmi_1x2",
    "mmi_2x1",
    "mmi_2x2",
    "ring",
    "sbend",
    "spiral",
    "taper",
    "waveguide",
    "ybranch",
]

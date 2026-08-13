"""Design-rule checking."""

from rosette._api import Cell, Library, load_drc_rules
from rosette._api import run_drc as _run_drc
from rosette._core import DrcResult, DrcRules, DrcViolation


def run_drc(
    cell: Cell,
    rules: DrcRules,
    library: Library | None = None,
) -> DrcResult:
    """Run design-rule checks on a cell hierarchy."""
    return _run_drc(cell, rules, library)


__all__ = [
    "DrcResult",
    "DrcRules",
    "DrcViolation",
    "load_drc_rules",
    "run_drc",
]

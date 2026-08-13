"""Design-rule checking."""

from rosette._api import Cell, Library, load_drc_rules
from rosette._api import run_drc as _run_drc
from rosette._core import DrcPolicy, DrcResult, DrcRules, DrcViolation


def run_drc(
    cell: Cell,
    rules: DrcRules,
    library: Library | None = None,
    *,
    policy: DrcPolicy | None = None,
) -> DrcResult:
    """Run design-rule checks with an optional per-run suppression policy."""
    return _run_drc(cell, rules, library, policy=policy)


__all__ = [
    "DrcPolicy",
    "DrcResult",
    "DrcRules",
    "DrcViolation",
    "load_drc_rules",
    "run_drc",
]

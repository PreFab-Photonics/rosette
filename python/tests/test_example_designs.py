"""Regression coverage for the repository's checked-in example designs."""

from __future__ import annotations

from collections import Counter
from pathlib import Path

import pytest

from rosette._design import load_design
from rosette.dfm import load_dfm_config
from rosette.drc import load_drc_rules, run_drc
from rosette.io import write_gds

ROOT = Path(__file__).resolve().parents[2]
DESIGNS = ROOT / "designs"
CONFIG = DESIGNS / "rosette.toml"


@pytest.mark.parametrize(
    ("filename", "cell_name"),
    [
        ("components_gallery.py", "components_gallery"),
        ("drc_showcase.py", "drc_showcase"),
        ("primitives_gallery.py", "primitives_gallery"),
    ],
)
def test_example_design_builds(filename: str, cell_name: str, tmp_path: Path):
    cell, file_path, target = load_design(str(DESIGNS / filename))

    assert file_path == DESIGNS / filename
    assert target == "design"
    assert cell.name == cell_name
    write_gds(tmp_path / f"{cell_name}.gds", cell, quiet=True)


def test_drc_showcase_has_only_documented_rule_violations():
    cell, _, _ = load_design(str(DESIGNS / "drc_showcase.py"))
    result = run_drc(cell, load_drc_rules(CONFIG))

    expected = {
        "Lsilicon.min_width": 1,
        "Lsilicon.min_spacing": 1,
        "Lsilicon.min_area": 1,
        "Lsilicon.acute_angle": 2,
        "Lsilicon.no_overlap": 1,
        "Loxide.min_width": 1,
        "Loxide.min_spacing": 1,
        "Loxide.min_area": 1,
        "Lmarker.min_width": 1,
        "Lmarker.min_spacing": 1,
        "Lmarker.min_area": 1,
        "Lp_doping.min_width": 1,
        "Lp_doping.min_spacing": 1,
        "Lp_doping.min_area": 1,
        "Ln_doping.min_width": 1,
        "Ln_doping.min_spacing": 1,
        "Ln_doping.min_area": 1,
        "Lexclusion.min_width": 1,
        "Lexclusion.min_spacing": 1,
        "Lexclusion.min_area": 1,
        "PN_SPC": 1,
        "PN_NOOVLP": 1,
        "EXCL_KEEPOUT": 1,
    }

    assert result.rules_checked == 23
    assert Counter(violation.rule_name for violation in result.violations) == expected


def test_shared_gallery_config_disables_dfm():
    assert load_dfm_config(CONFIG) is None

"""Basic execution and syntax gates for public Python examples."""

from __future__ import annotations

import doctest
import importlib
import re
import textwrap
from pathlib import Path

import pytest

import rosette
import rosette.components

ROOT = Path(__file__).resolve().parents[2]
API_DOCS = ROOT / "www" / "content" / "docs" / "api-reference"
PYTHON_FENCE = re.compile(r"```python\s*\n(.*?)```", re.DOTALL)
STUB = ROOT / "python" / "rosette" / "api.pyi"

RUNNABLE_API_EXAMPLES = {
    ("BBox.mdx", 11),
    ("Cell.mdx", 12),
    ("Cell.mdx", 46),
    ("Cell.mdx", 87),
    ("DfmConfig.mdx", 121),
    ("Layer.mdx", 11),
    ("Layer.mdx", 41),
    ("Point.mdx", 12),
    ("Point.mdx", 64),
    ("Point.mdx", 169),
    ("Point.mdx", 175),
    ("Polygon.mdx", 12),
    ("Polygon.mdx", 275),
    ("Polygon.mdx", 367),
    ("Port.mdx", 12),
    ("Port.mdx", 59),
    ("Port.mdx", 120),
    ("Transform.mdx", 12),
    ("Transform.mdx", 152),
    ("Vector2.mdx", 11),
    ("Vector2.mdx", 179),
    ("Vector2.mdx", 185),
    ("Vector2.mdx", 191),
    ("Vector2.mdx", 198),
    ("index.mdx", 32),
    ("index.mdx", 228),
}

RUNNABLE_STUB_EXAMPLES = (
    """unit = Cell("unit")
arr = unit.at(0, 0).array(10, 5, 20.0, 15.0)""",
    """route = Route(Layer(1, 0), width=0.5, bend_radius=5.0)
route.start_at(0, 0, angle=0)
route.to(50, 0)
route.to(50, 30)
route.end_at(100, 30, angle=0)
cell = route.to_cell("my_route")""",
    """rules = (
    DrcRules()
    .min_width(Layer(1), 0.1, name="M1.W.1")
    .min_spacing(Layer(1), Layer(1), 0.15)
    .min_area(Layer(1), 0.01)
)""",
    """config = DfmConfig(resolution=0.01)
config.set_layer_config(Layer(1, 0), sigma=0.05, max_area_deviation=0.05)
config.set_layer_config(Layer(2, 0), sigma=0.15)""",
)

COMPONENT_MODULES = sorted(
    {getattr(rosette.components, name).__module__ for name in rosette.components.__all__}
)


@pytest.mark.parametrize("module_name", COMPONENT_MODULES)
def test_component_docstring_examples_execute(module_name: str):
    module = importlib.import_module(module_name)
    result = doctest.testmod(module, raise_on_error=True)
    assert result.attempted > 0


def test_api_reference_python_blocks_are_valid_syntax():
    checked = 0
    for path in API_DOCS.glob("*.mdx"):
        for index, source in enumerate(PYTHON_FENCE.findall(path.read_text()), start=1):
            compile(source, f"{path} code block {index}", "exec")
            checked += 1

    assert checked > 0


def test_self_contained_api_reference_examples_execute():
    executed: set[tuple[str, int]] = set()
    for path in API_DOCS.glob("*.mdx"):
        content = path.read_text()
        for match in PYTHON_FENCE.finditer(content):
            opening_line = content.count("\n", 0, match.start()) + 1
            key = (path.name, opening_line)
            if key not in RUNNABLE_API_EXAMPLES:
                continue
            exec(match.group(1), vars(rosette).copy())
            executed.add(key)

    assert executed == RUNNABLE_API_EXAMPLES


@pytest.mark.parametrize("source", RUNNABLE_STUB_EXAMPLES)
def test_self_contained_agent_reference_examples_execute(source: str):
    lines = STUB.read_text().splitlines()
    length = len(source.splitlines())
    matches = [
        textwrap.dedent("\n".join(lines[index : index + length]))
        for index, line in enumerate(lines)
        if line.strip() == source.splitlines()[0]
    ]
    assert matches.count(source) == 1
    exec(source, vars(rosette).copy())

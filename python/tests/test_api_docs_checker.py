"""Regression tests for the structured API documentation checker."""

import sys
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[2] / "www" / "scripts" / "check-api-docs.py"
SPEC = spec_from_file_location("check_api_docs", SCRIPT)
assert SPEC is not None and SPEC.loader is not None
CHECKER = module_from_spec(SPEC)
sys.modules[SPEC.name] = CHECKER
SPEC.loader.exec_module(CHECKER)


def test_mdx_components_ignore_literals_and_preserve_nested_lines(tmp_path):
    content = """   ```mdx
<PyFunction name={"fenced"} type={"() -> None"} />
## `fenced_component`
   ````

{/* <PyFunction name={"commented"} type={"() -> None"} /> */}

``<PyFunction name={"inline"} type={"() -> None"} />``

<PyFunction name={"real"} type={"(value) -> None"}>

<PyParameter name={"value"} type={"int"} />
<PyFunctionReturn type={"None"} />

</PyFunction>

## `real_component`
"""

    callables = CHECKER._documented_callables(content)
    assert set(callables) == {"real"}

    real = callables["real"]
    parameters = CHECKER.find_mdx_components(
        real.body, "PyParameter", line_offset=real.body_line - 1
    )
    expected_line = next(
        index
        for index, line in enumerate(content.splitlines(), start=1)
        if line.startswith("<PyParameter")
    )
    assert parameters[0].line == expected_line

    page = tmp_path / "index.mdx"
    page.write_text(content)
    assert CHECKER.find_documented_functions(page) == {"real"}
    assert CHECKER.find_documented_components(page) == {"real_component"}

    unclosed = """{/* <PyFunction name={"commented"} type={"() -> None"} /> */}
``<PyFunction name={"inline"} type={"() -> None"} />``
```mdx
<PyFunction name={"fenced"} type={"() -> None"} />
"""
    page.write_text(unclosed)
    assert CHECKER.find_documented_functions(page) == set()

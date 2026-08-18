#!/usr/bin/env python3
"""Check that every public API symbol has corresponding documentation.

Parses __all__ from the root package and public feature modules, then verifies
that each symbol either has its own .mdx page (classes) or is documented on the
index page (functions and constants). Project-owned component exports are
documented in the generic-template component catalog instead.

Usage:
    uv run python www/scripts/check-api-docs.py

Exit codes:
    0  All public symbols are documented
    1  Missing or extra documentation found
"""

from __future__ import annotations

import ast
import json
import re
import sys
from collections import Counter
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent  # repo root
DOCS_DIR = ROOT / "www" / "content" / "docs" / "api-reference"
META_JSON = DOCS_DIR / "meta.json"
ROSETTE_PACKAGE = ROOT / "python" / "rosette"
PUBLIC_MODULES = {
    "rosette": ROSETTE_PACKAGE / "__init__.py",
    "rosette.layout": ROSETTE_PACKAGE / "layout.py",
    "rosette.routing": ROSETTE_PACKAGE / "routing.py",
    "rosette.io": ROSETTE_PACKAGE / "io.py",
    "rosette.geometry": ROSETTE_PACKAGE / "geometry.py",
    "rosette.project": ROSETTE_PACKAGE / "project.py",
    "rosette.drc": ROSETTE_PACKAGE / "drc.py",
    "rosette.checks": ROSETTE_PACKAGE / "checks.py",
    "rosette.dfm": ROSETTE_PACKAGE / "dfm.py",
    "rosette.render": ROSETTE_PACKAGE / "render.py",
}
AGENT_REFERENCE = ROOT / "python" / "rosette" / "api.pyi"
COMPONENT_MODULE = ROSETTE_PACKAGE / "components" / "__init__.py"
GENERIC_COMPONENT_DOCS = (
    ROOT / "www" / "content" / "docs" / "templates" / "generic" / "components.mdx"
)


@dataclass(frozen=True)
class ParameterSpec:
    name: str
    kind: str
    annotation: ast.expr | None
    default: ast.expr | None
    required: bool


@dataclass(frozen=True)
class MdxComponent:
    attributes: dict[str, str]
    body: str
    line: int
    body_line: int


def extract_all(filepath: Path) -> list[str]:
    """Extract __all__ list from a Python file using AST parsing."""
    source = filepath.read_text()
    tree = ast.parse(source)
    for node in ast.walk(tree):
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id == "__all__":
                    if isinstance(node.value, ast.List):
                        return [
                            elt.value
                            for elt in node.value.elts
                            if isinstance(elt, ast.Constant) and isinstance(elt.value, str)
                        ]
    return []


def find_mdx_pages(docs_dir: Path) -> set[str]:
    """Find all top-level .mdx page names in the api-reference directory.

    Returns page names like 'Cell', 'Point', etc.
    Excludes index.mdx.
    """
    pages = set()
    for mdx in docs_dir.glob("*.mdx"):
        if mdx.name == "index.mdx":
            continue
        pages.add(mdx.stem)
    return pages


def find_documented_functions(index_mdx: Path) -> set[str]:
    """Find function names documented in the index.mdx via PyFunction components."""
    return set(_documented_callables(index_mdx.read_text()))


def find_documented_attrs(index_mdx: Path) -> set[str]:
    """Find attribute/constant names documented in the index.mdx via PyAttribute components."""
    return set(_documented_attributes(index_mdx.read_text()))


def find_documented_components(page: Path) -> set[str]:
    """Find component exports documented as second-level code headings."""
    content = _mask_mdx_literals(page.read_text(), inline_code=False)
    return set(re.findall(r"^## `([^`]+)`$", content, flags=re.MULTILINE))


def _find_tag_end(content: str, start: int) -> int:
    """Find an MDX opening tag's closing bracket outside expressions/strings."""
    braces = 0
    quote: str | None = None
    escaped = False
    for index in range(start, len(content)):
        char = content[index]
        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
        elif char in {'"', "'"}:
            quote = char
        elif char == "{":
            braces += 1
        elif char == "}":
            braces -= 1
        elif char == ">" and braces == 0:
            return index
    raise ValueError("unterminated MDX tag")


def _parse_mdx_attributes(tag: str) -> dict[str, str]:
    """Parse literal string attributes from one MDX opening tag."""
    attributes: dict[str, str] = {}
    for match in re.finditer(r"([A-Za-z_][A-Za-z0-9_]*)\s*=\s*\{", tag):
        start = match.end()
        braces = 1
        quote: str | None = None
        escaped = False
        end = start
        while end < len(tag) and braces:
            char = tag[end]
            if quote:
                if escaped:
                    escaped = False
                elif char == "\\":
                    escaped = True
                elif char == quote:
                    quote = None
            elif char in {'"', "'"}:
                quote = char
            elif char == "{":
                braces += 1
            elif char == "}":
                braces -= 1
            end += 1
        if braces:
            raise ValueError(f"unterminated attribute {match.group(1)}")
        value = ast.literal_eval(tag[start : end - 1])
        if not isinstance(value, str):
            raise ValueError(f"attribute {match.group(1)} must be a string literal")
        attributes[match.group(1)] = value
    return attributes


def _mask_mdx_literals(content: str, *, inline_code: bool = True) -> str:
    """Blank code and comment regions while preserving offsets and line numbers."""

    def blank_text(value: str) -> str:
        return "".join("\n" if char == "\n" else " " for char in value)

    def blank(match: re.Match[str]) -> str:
        return blank_text(match.group())

    inline_pattern = r"(?s)(?<!`)(`+)(?!`)(.*?)\1(?!`)"
    for pattern in (r"(?s)\{/\*.*?\*/\}", r"(?s)<!--.*?-->"):
        content = re.sub(pattern, blank, content)

    opening_fence = re.compile(r"(?m)^[ \t]{0,3}(`{3,}|~{3,})[^\n]*(?:\n|$)")
    while match := opening_fence.search(content):
        marker = match.group(1)
        closing_fence = re.compile(
            rf"(?m)^[ \t]{{0,3}}{re.escape(marker[0])}{{{len(marker)},}}[ \t]*(?:\n|$)"
        )
        closing = closing_fence.search(content, match.end())
        if closing is None:
            prefix = content[: match.start()]
            if inline_code:
                prefix = re.sub(inline_pattern, blank, prefix)
            return prefix + blank_text(content[match.start() :])
        content = (
            content[: match.start()]
            + blank_text(content[match.start() : closing.end()])
            + content[closing.end() :]
        )

    if inline_code:
        content = re.sub(inline_pattern, blank, content)
    return content


def find_mdx_components(content: str, name: str, *, line_offset: int = 0) -> list[MdxComponent]:
    """Extract non-nested MDX components with source line numbers."""
    content = _mask_mdx_literals(content)
    components: list[MdxComponent] = []
    token = f"<{name}"
    cursor = 0
    while (start := content.find(token, cursor)) != -1:
        after_name = start + len(token)
        if after_name < len(content) and content[after_name] not in " \t\r\n/>":
            cursor = after_name
            continue
        tag_end = _find_tag_end(content, after_name)
        opening = content[start : tag_end + 1]
        self_closing = opening.rstrip().endswith("/>")
        if self_closing:
            body = ""
            cursor = tag_end + 1
        else:
            closing = f"</{name}>"
            close_start = content.find(closing, tag_end + 1)
            if close_start == -1:
                raise ValueError(f"missing {closing}")
            body = content[tag_end + 1 : close_start]
            cursor = close_start + len(closing)
        components.append(
            MdxComponent(
                attributes=_parse_mdx_attributes(opening),
                body=body,
                line=line_offset + content.count("\n", 0, start) + 1,
                body_line=line_offset + content.count("\n", 0, tag_end + 1) + 1,
            )
        )
    return components


def _expression_key(node: ast.expr | None) -> str | None:
    if node is None:
        return None
    return ast.dump(node, include_attributes=False)


def _parse_expression(value: str) -> ast.expr:
    return ast.parse(value, mode="eval").body


def _parameter_specs(arguments: ast.arguments, *, drop_receiver: bool) -> list[ParameterSpec]:
    positional = [*arguments.posonlyargs, *arguments.args]
    defaults: list[ast.expr | None] = [None] * (len(positional) - len(arguments.defaults))
    defaults.extend(arguments.defaults)
    specs: list[ParameterSpec] = []
    for index, (argument, default) in enumerate(zip(positional, defaults, strict=True)):
        if drop_receiver and index == 0 and argument.arg in {"self", "cls"}:
            continue
        kind = "positional-only" if index < len(arguments.posonlyargs) else "positional"
        specs.append(
            ParameterSpec(argument.arg, kind, argument.annotation, default, default is None)
        )
    if arguments.vararg:
        specs.append(
            ParameterSpec(
                f"*{arguments.vararg.arg}",
                "variadic",
                arguments.vararg.annotation,
                None,
                True,
            )
        )
    for argument, default in zip(arguments.kwonlyargs, arguments.kw_defaults, strict=True):
        specs.append(
            ParameterSpec(
                argument.arg, "keyword-only", argument.annotation, default, default is None
            )
        )
    if arguments.kwarg:
        specs.append(
            ParameterSpec(
                f"**{arguments.kwarg.arg}",
                "keyword-variadic",
                arguments.kwarg.annotation,
                None,
                True,
            )
        )
    return specs


def _is_property(node: ast.FunctionDef) -> bool:
    return any(isinstance(item, ast.Name) and item.id == "property" for item in node.decorator_list)


def _contract_classes() -> dict[str, ast.ClassDef]:
    tree = ast.parse(AGENT_REFERENCE.read_text())
    return {node.name: node for node in tree.body if isinstance(node, ast.ClassDef)}


def _contract_functions() -> dict[str, ast.FunctionDef]:
    tree = ast.parse(AGENT_REFERENCE.read_text())
    return {node.name: node for node in tree.body if isinstance(node, ast.FunctionDef)}


def _documented_callables(content: str) -> dict[str, MdxComponent]:
    callables: dict[str, MdxComponent] = {}
    for component in find_mdx_components(content, "PyFunction"):
        name = component.attributes.get("name")
        if not name:
            raise ValueError(f"PyFunction at line {component.line} has no name")
        if name in callables:
            raise ValueError(f"duplicate PyFunction {name!r} at line {component.line}")
        callables[name] = component
    return callables


def _documented_attributes(content: str) -> dict[str, MdxComponent]:
    attributes: dict[str, MdxComponent] = {}
    for component in find_mdx_components(content, "PyAttribute"):
        name = component.attributes.get("name")
        if not name:
            raise ValueError(f"PyAttribute at line {component.line} has no name")
        if name in attributes:
            raise ValueError(f"duplicate PyAttribute {name!r} at line {component.line}")
        attributes[name] = component
    return attributes


def find_landing_class_cards(index_mdx: Path) -> set[str]:
    """Find class pages linked from cards on the API landing page."""
    content = _mask_mdx_literals(index_mdx.read_text())
    pages = set(re.findall(r'href=\{"/docs/api-reference/([A-Z][^"]*)"\}', content))
    return pages


def _compare_callable(
    label: str,
    contract: ast.FunctionDef,
    documented: MdxComponent,
    errors: list[str],
) -> None:
    expected = _parameter_specs(contract.args, drop_receiver=True)
    signature = documented.attributes.get("type")
    if not signature:
        errors.append(f"{label} has no documented signature at line {documented.line}")
        return

    try:
        parsed = ast.parse(f"def _{signature}: ...").body[0]
        assert isinstance(parsed, ast.FunctionDef)
    except (AssertionError, SyntaxError) as exc:
        errors.append(f"{label} has invalid signature {signature!r}: {exc}")
        return

    summary = _parameter_specs(parsed.args, drop_receiver=False)
    expected_shape = [
        (item.name, item.kind, _expression_key(item.default), item.required) for item in expected
    ]
    summary_shape = [
        (item.name, item.kind, _expression_key(item.default), item.required) for item in summary
    ]
    if summary_shape != expected_shape:
        errors.append(f"{label} signature parameters differ from api.pyi: documented {signature!r}")
    if _expression_key(parsed.returns) != _expression_key(contract.returns):
        errors.append(
            f"{label} return type differs from api.pyi: documented "
            f"{ast.unparse(parsed.returns) if parsed.returns else None!r}"
        )

    parameters = find_mdx_components(
        documented.body, "PyParameter", line_offset=documented.body_line - 1
    )
    documented_names = [item.attributes.get("name") for item in parameters]
    expected_names = [item.name for item in expected]
    if documented_names != expected_names:
        errors.append(
            f"{label} parameter details differ from api.pyi: "
            f"documented {documented_names}, expected {expected_names}"
        )
        return

    for expected_parameter, parameter in zip(expected, parameters, strict=True):
        documented_type = parameter.attributes.get("type")
        if documented_type is None:
            errors.append(
                f"{label}.{expected_parameter.name} has no documented type at line {parameter.line}"
            )
        else:
            try:
                documented_type_key = _expression_key(_parse_expression(documented_type))
            except SyntaxError as exc:
                errors.append(
                    f"{label}.{expected_parameter.name} has invalid type {documented_type!r}: {exc}"
                )
            else:
                if documented_type_key != _expression_key(expected_parameter.annotation):
                    errors.append(
                        f"{label}.{expected_parameter.name} type differs from api.pyi: "
                        f"documented {documented_type!r}, expected "
                        f"{ast.unparse(expected_parameter.annotation) if expected_parameter.annotation else None!r}"
                    )

        value = parameter.attributes.get("value")
        legacy_default = parameter.attributes.get("default")
        if value is not None and legacy_default is not None:
            errors.append(f"{label}.{expected_parameter.name} documents both value and default")
            continue
        documented_default = value if value is not None else legacy_default
        if expected_parameter.required:
            if documented_default is not None:
                errors.append(
                    f"{label}.{expected_parameter.name} has unexpected default "
                    f"{documented_default!r}"
                )
        elif documented_default is None:
            errors.append(f"{label}.{expected_parameter.name} is missing its default")
        else:
            try:
                default_key = _expression_key(_parse_expression(documented_default))
            except SyntaxError as exc:
                errors.append(
                    f"{label}.{expected_parameter.name} has invalid default "
                    f"{documented_default!r}: {exc}"
                )
            else:
                if default_key != _expression_key(expected_parameter.default):
                    errors.append(
                        f"{label}.{expected_parameter.name} default differs from api.pyi: "
                        f"documented {documented_default!r}, expected "
                        f"{ast.unparse(expected_parameter.default) if expected_parameter.default else None!r}"
                    )

    returns = find_mdx_components(
        documented.body, "PyFunctionReturn", line_offset=documented.body_line - 1
    )
    if len(returns) != 1:
        errors.append(f"{label} must document exactly one return type, found {len(returns)}")
    elif contract.returns is not None:
        documented_return = returns[0].attributes.get("type")
        if documented_return is None:
            errors.append(f"{label} has no detailed return type at line {returns[0].line}")
        else:
            try:
                return_key = _expression_key(_parse_expression(documented_return))
            except SyntaxError as exc:
                errors.append(f"{label} has invalid detailed return type: {exc}")
            else:
                if return_key != _expression_key(contract.returns):
                    errors.append(
                        f"{label} detailed return differs from api.pyi: "
                        f"documented {documented_return!r}, expected {ast.unparse(contract.returns)!r}"
                    )


def _check_contract_details(classes: list[str], functions: list[str], errors: list[str]) -> None:
    """Compare structured API documentation against the authoritative stub."""
    contract_classes = _contract_classes()
    contract_functions = _contract_functions()

    for class_name in classes:
        contract = contract_classes.get(class_name)
        page = DOCS_DIR / f"{class_name}.mdx"
        if contract is None:
            errors.append(f"Class '{class_name}' is exported but missing from api.pyi")
            continue
        if not page.exists():
            continue

        content = page.read_text()
        try:
            documented_methods = _documented_callables(content)
            documented_attrs = _documented_attributes(content)
        except (SyntaxError, ValueError) as exc:
            errors.append(f"Could not parse {page.name}: {exc}")
            continue

        expected_methods = {
            node.name: node
            for node in contract.body
            if isinstance(node, ast.FunctionDef)
            and (node.name == "__init__" or not node.name.startswith("_"))
            and not _is_property(node)
        }
        for name in sorted(expected_methods.keys() - documented_methods.keys()):
            errors.append(f"Method '{class_name}.{name}' is missing from {page.name}")
        for name in sorted(documented_methods.keys() - expected_methods.keys()):
            errors.append(f"Unknown method '{class_name}.{name}' is documented in {page.name}")
        for name in sorted(expected_methods.keys() & documented_methods.keys()):
            _compare_callable(
                f"{class_name}.{name}",
                expected_methods[name],
                documented_methods[name],
                errors,
            )

        expected_attrs: dict[str, ast.expr | None] = {
            node.target.id: node.annotation
            for node in contract.body
            if isinstance(node, ast.AnnAssign) and isinstance(node.target, ast.Name)
        }
        expected_attrs.update(
            {
                node.name: node.returns
                for node in contract.body
                if isinstance(node, ast.FunctionDef) and _is_property(node)
            }
        )
        for name in sorted(expected_attrs.keys() - documented_attrs.keys()):
            errors.append(f"Attribute '{class_name}.{name}' is missing from {page.name}")
        for name in sorted(documented_attrs.keys() - expected_attrs.keys()):
            errors.append(f"Unknown attribute '{class_name}.{name}' is documented in {page.name}")
        for name in sorted(expected_attrs.keys() & documented_attrs.keys()):
            documented_type = documented_attrs[name].attributes.get("type")
            if documented_type is None:
                errors.append(f"Attribute '{class_name}.{name}' has no documented type")
                continue
            try:
                documented_key = _expression_key(_parse_expression(documented_type))
            except SyntaxError as exc:
                errors.append(
                    f"Attribute '{class_name}.{name}' has invalid type {documented_type!r}: {exc}"
                )
                continue
            if documented_key != _expression_key(expected_attrs[name]):
                errors.append(
                    f"Attribute '{class_name}.{name}' type differs from api.pyi: "
                    f"documented {documented_type!r}, expected "
                    f"{ast.unparse(expected_attrs[name]) if expected_attrs[name] else None!r}"
                )

    index = DOCS_DIR / "index.mdx"
    if not index.exists():
        return
    try:
        documented_functions = _documented_callables(index.read_text())
    except (SyntaxError, ValueError) as exc:
        errors.append(f"Could not parse index.mdx callables: {exc}")
        return
    for name in functions:
        contract = contract_functions.get(name)
        documented = documented_functions.get(name)
        if contract is None:
            errors.append(f"Function '{name}' is exported but missing from api.pyi")
        elif documented is None:
            errors.append(f"Function '{name}' has no structured documentation in index.mdx")
        else:
            _compare_callable(name, contract, documented, errors)


def find_nav_pages(meta_json: Path) -> set[str]:
    """Find page entries listed in the api-reference sidebar nav (meta.json).

    Returns page names like 'Cell', 'Point', etc. Section separators
    ('---Geometry---') and meta entries ('...index') are excluded, leaving
    only references to actual .mdx pages.
    """
    meta = json.loads(meta_json.read_text())
    pages = set()
    for entry in meta.get("pages", []):
        if not isinstance(entry, str):
            continue
        if entry.startswith("---") or entry.startswith("..."):
            continue
        pages.add(entry)
    return pages


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []

    # ── Parse public modules ───────────────────────────────────────────
    symbols_by_module: dict[str, list[str]] = {}
    for module, filepath in PUBLIC_MODULES.items():
        symbols = extract_all(filepath)
        if not symbols:
            errors.append(f"Could not parse __all__ from {module} ({filepath})")
            continue
        symbols_by_module[module] = symbols
        duplicates = [name for name, count in Counter(symbols).items() if count > 1]
        for symbol in duplicates:
            errors.append(f"Symbol '{module}.{symbol}' appears more than once in __all__")

    all_symbols = [symbol for symbols in symbols_by_module.values() for symbol in symbols]
    duplicate_exports = [name for name, count in Counter(all_symbols).items() if count > 1]
    for symbol in duplicate_exports:
        modules = [module for module, symbols in symbols_by_module.items() if symbol in symbols]
        errors.append(
            f"Symbol '{symbol}' is exported by multiple public modules: {', '.join(modules)}"
        )

    # Separate classes (uppercase, not ALL_CAPS) from functions/constants.
    # ALL_CAPS names are constants documented on index.mdx.
    # The leading `s and` guards against a malformed (empty) __all__ entry.
    classes = [s for s in all_symbols if s and s[0].isupper() and not s.isupper()]
    functions = [s for s in all_symbols if s and s[0].islower()]
    constants = [s for s in all_symbols if s and s.isupper()]

    # Template components are project-owned after `rosette init`, so their
    # catalog lives under the generic template rather than the core API index.
    component_symbols = set(extract_all(COMPONENT_MODULE))
    if not component_symbols:
        errors.append(f"Could not parse __all__ from rosette.components ({COMPONENT_MODULE})")
    if GENERIC_COMPONENT_DOCS.exists():
        documented_components = find_documented_components(GENERIC_COMPONENT_DOCS)
        for component in sorted(component_symbols - documented_components):
            errors.append(
                f"Generic component '{component}' is missing from "
                f"{GENERIC_COMPONENT_DOCS.relative_to(ROOT)}"
            )
        for component in sorted(documented_components - component_symbols):
            errors.append(f"Generic template docs contain unknown component '{component}'")
    else:
        errors.append(f"Generic component docs not found: {GENERIC_COMPONENT_DOCS}")

    # ── Check docs exist ───────────────────────────────────────────────
    mdx_pages = find_mdx_pages(DOCS_DIR)
    index_mdx = DOCS_DIR / "index.mdx"

    # Classes: each needs its own .mdx page
    for cls in classes:
        if cls not in mdx_pages:
            errors.append(f"Class '{cls}' is in __all__ but has no docs page")

    landing_classes = find_landing_class_cards(index_mdx) if index_mdx.exists() else set()
    for cls in set(classes) - landing_classes:
        errors.append(f"Class '{cls}' is missing from the API landing-page cards")
    for cls in landing_classes - set(classes):
        errors.append(f"Landing-page class card '{cls}' is not in __all__")

    _check_contract_details(classes, functions, errors)

    # Functions: each needs a <PyFunction> entry on index.mdx
    try:
        documented_functions = find_documented_functions(index_mdx) if index_mdx.exists() else set()
    except (SyntaxError, ValueError) as exc:
        errors.append(f"Could not parse functions in index.mdx: {exc}")
    else:
        for func in functions:
            if func not in documented_functions:
                errors.append(f"Function '{func}' is in __all__ but not documented in index.mdx")
        for func in documented_functions - set(functions):
            errors.append(f"Function '{func}' is documented in index.mdx but is not in __all__")

    # Constants: each needs a <PyAttribute> entry on index.mdx
    try:
        documented_attrs = find_documented_attrs(index_mdx) if index_mdx.exists() else set()
    except (SyntaxError, ValueError) as exc:
        errors.append(f"Could not parse constants in index.mdx: {exc}")
    else:
        for const in constants:
            if const not in documented_attrs:
                errors.append(f"Constant '{const}' is in __all__ but not documented in index.mdx")
        for attr in documented_attrs - set(constants):
            errors.append(f"Constant '{attr}' is documented in index.mdx but is not in __all__")

    # Orphan check: pages that exist but aren't public classes.
    known_symbols = set(all_symbols)
    for page in mdx_pages:
        if page not in known_symbols:
            errors.append(f"Docs page '{page}.mdx' exists but '{page}' is not in __all__")

    # ── Check sidebar nav (meta.json) ──────────────────────────────────
    # A class page can exist and be public yet still be invisible in the
    # sidebar if it's missing from meta.json's `pages`. Diff the .mdx pages
    # against the nav to catch that drift (and dangling nav entries).
    if META_JSON.exists():
        nav_pages = find_nav_pages(META_JSON)
        for page in mdx_pages:
            if page not in nav_pages:
                errors.append(
                    f"Docs page '{page}.mdx' exists but is missing from meta.json sidebar nav"
                )
        for entry in nav_pages:
            if entry not in mdx_pages:
                errors.append(
                    f"meta.json nav entry '{entry}' has no corresponding '{entry}.mdx' page"
                )
    else:
        errors.append(f"Sidebar nav file not found: {META_JSON}")

    # ── Report ─────────────────────────────────────────────────────────
    if warnings:
        print(f"\n{'=' * 60}", file=sys.stderr)
        print(f"  API DOCS WARNINGS ({len(warnings)})", file=sys.stderr)
        print(f"{'=' * 60}", file=sys.stderr)
        for w in warnings:
            print(f"  WARNING: {w}", file=sys.stderr)

    if errors:
        print(f"\n{'=' * 60}", file=sys.stderr)
        print(f"  API DOCS CHECK FAILED ({len(errors)} errors)", file=sys.stderr)
        print(f"{'=' * 60}", file=sys.stderr)
        for e in errors:
            print(f"  ERROR: {e}", file=sys.stderr)
        print(
            "\nWhen adding or renaming a public API symbol, update the",
            file=sys.stderr,
        )
        print(
            "corresponding API or template component docs page.",
            file=sys.stderr,
        )
        print(
            "See AGENTS.md for the docs convention.",
            file=sys.stderr,
        )
        return 1

    print(
        f"API docs check passed: {len(classes)} classes, "
        f"{len(functions)} functions, {len(constants)} constants "
        f"across {len(symbols_by_module)} public modules, plus "
        f"{len(component_symbols)} generic-template component exports - all documented."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())

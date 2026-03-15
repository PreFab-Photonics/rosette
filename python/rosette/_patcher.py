"""Semantic code patcher for rosette serve two-way editing.

Uses libcst (concrete syntax tree) to apply semantic edit operations
from the web viewer back to Python source files. Preserves formatting
of untouched code (libcst guarantee).
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import libcst as cst
from libcst.metadata import MetadataWrapper, PositionProvider


# =============================================================================
# Coordinate conversion: WASM world coords → Python µm
# =============================================================================

GRID_SIZE = 50
NM_PER_UM = 1000
WORLD_PER_UM = GRID_SIZE * NM_PER_UM  # 50000


def world_to_um(x: float, y: float) -> tuple[float, float]:
    """Convert WASM world coordinates to Python µm (with Y-flip)."""
    return (x / WORLD_PER_UM, -y / WORLD_PER_UM)


def _format_num(n: float) -> str:
    """Format a number for Python code: remove trailing zeros, keep ints clean."""
    rounded = round(n, 6)
    if rounded == int(rounded):
        return str(int(rounded))
    return f"{rounded:g}"


# =============================================================================
# Edit operation dataclasses
# =============================================================================


@dataclass
class ModifyVertices:
    file: str
    line: int
    old_code: str | None
    vertices: list[float]  # flat [x0, y0, ...] in WASM world coords


@dataclass
class ModifyLayer:
    file: str
    line: int
    old_code: str | None
    layer: int
    datatype: int = 0


@dataclass
class DeleteElement:
    file: str
    line: int
    old_code: str | None


@dataclass
class AddElement:
    file: str
    after_line: int
    element_type: str  # "polygon" | "path"
    vertices: list[float]  # WASM world coords
    layer: int
    datatype: int = 0
    width: float | None = None  # paths only, WASM world coords
    cell_var: str = ""  # e.g. "triangle_cell"


@dataclass
class ModifyPathWidth:
    file: str
    line: int
    old_code: str | None
    width: float  # WASM world coords


@dataclass
class MoveRef:
    file: str
    line: int
    old_code: str | None
    dx: float  # delta X in WASM world coords
    dy: float  # delta Y in WASM world coords


# =============================================================================
# Patch result
# =============================================================================


@dataclass
class PatchResult:
    success: bool
    error: str | None = None


# =============================================================================
# Helpers
# =============================================================================


def _get_func_name(func: cst.BaseExpression) -> str | None:
    """Get the simple name of a function call target."""
    if isinstance(func, cst.Name):
        return func.value
    if isinstance(func, cst.Attribute):
        return func.attr.value
    return None


def _is_polygon_rect(func: cst.BaseExpression) -> bool:
    """Check if func is Polygon.rect (Attribute with value=Polygon, attr=rect)."""
    if isinstance(func, cst.Attribute):
        if isinstance(func.value, cst.Name) and func.value.value == "Polygon":
            return func.attr.value == "rect"
    return False


def _vertices_to_rect(
    vertices_um: list[tuple[float, float]],
) -> tuple[float, float, float, float] | None:
    """If 4 vertices form an axis-aligned rectangle, return (x, y, w, h). Else None."""
    if len(vertices_um) != 4:
        return None
    xs = [round(p[0], 6) for p in vertices_um]
    ys = [round(p[1], 6) for p in vertices_um]
    unique_x = sorted(set(xs))
    unique_y = sorted(set(ys))
    if len(unique_x) != 2 or len(unique_y) != 2:
        return None
    x = unique_x[0]
    y = unique_y[0]
    w = unique_x[1] - unique_x[0]
    h = unique_y[1] - unique_y[0]
    return (x, y, w, h)


# =============================================================================
# CST Transformers (all use PositionProvider directly via self.get_metadata)
# =============================================================================


class _VertexReplacer(cst.CSTTransformer):
    """Replace the point list inside add_polygon/add_path calls.

    Handles:
    - Polygon([Point(x,y), ...]) — replaces point list
    - Polygon.rect(Point(x,y), w, h) — updates rect params or converts to point list
    - add_polygon([Point(...)], layer) — replaces point list
    - add_path([Point(...)], layer) — replaces point list
    """

    METADATA_DEPENDENCIES = (PositionProvider,)

    def __init__(
        self, target_line: int, new_points_code: str, vertices_um: list[tuple[float, float]]
    ) -> None:
        super().__init__()
        self.target_line = target_line
        self.new_points_code = new_points_code
        self.vertices_um = vertices_um
        self.replaced = False

    def leave_Call(
        self, original_node: cst.Call, updated_node: cst.Call
    ) -> cst.BaseExpression:
        if self.replaced:
            return updated_node

        try:
            pos = self.get_metadata(PositionProvider, original_node)
            line = pos.start.line
        except KeyError:
            return updated_node
        if line != self.target_line:
            return updated_node

        func_name = _get_func_name(updated_node.func)

        if func_name == "Polygon":
            return self._replace_first_list_arg(updated_node)
        elif func_name in ("add_polygon", "add_path"):
            return self._replace_in_add_call(updated_node)

        return updated_node

    def _replace_first_list_arg(self, node: cst.Call) -> cst.Call:
        """Replace the first List argument in a Polygon([...]) call."""
        if not node.args:
            return node
        first_arg = node.args[0].value
        if isinstance(first_arg, cst.List):
            new_list = cst.parse_expression(self.new_points_code)
            new_args = list(node.args)
            new_args[0] = node.args[0].with_changes(value=new_list)
            self.replaced = True
            return node.with_changes(args=new_args)
        return node

    def _replace_in_add_call(self, node: cst.Call) -> cst.Call:
        """Replace geometry in add_polygon/add_path calls."""
        if not node.args:
            return node

        first_arg = node.args[0].value

        # Direct list: add_polygon([Point(...), ...], layer)
        if isinstance(first_arg, cst.List):
            new_list = cst.parse_expression(self.new_points_code)
            new_args = list(node.args)
            new_args[0] = node.args[0].with_changes(value=new_list)
            self.replaced = True
            return node.with_changes(args=new_args)

        if not isinstance(first_arg, cst.Call):
            return node

        # Polygon([...]) wrapper
        if isinstance(first_arg.func, cst.Name) and first_arg.func.value == "Polygon":
            if first_arg.args:
                inner_first = first_arg.args[0].value
                if isinstance(inner_first, cst.List):
                    new_list = cst.parse_expression(self.new_points_code)
                    new_inner_args = list(first_arg.args)
                    new_inner_args[0] = first_arg.args[0].with_changes(value=new_list)
                    new_polygon_call = first_arg.with_changes(args=new_inner_args)
                    new_args = list(node.args)
                    new_args[0] = node.args[0].with_changes(value=new_polygon_call)
                    self.replaced = True
                    return node.with_changes(args=new_args)

        # Polygon.rect(Point(x,y), w, h) — update rect params or convert
        if _is_polygon_rect(first_arg.func):
            return self._replace_rect(node, first_arg)

        return node

    def _replace_rect(self, outer: cst.Call, rect_call: cst.Call) -> cst.Call:
        """Handle Polygon.rect(Point(x,y), w, h) replacement."""
        rect_params = _vertices_to_rect(self.vertices_um)

        if rect_params is not None:
            # Still a rectangle — update origin, width, height in-place
            x, y, w, h = rect_params
            origin_code = f"Point({_format_num(x)}, {_format_num(y)})"
            origin_expr = cst.parse_expression(origin_code)
            w_expr = cst.parse_expression(_format_num(w))
            h_expr = cst.parse_expression(_format_num(h))

            new_rect_args = list(rect_call.args)
            if len(new_rect_args) >= 3:
                new_rect_args[0] = rect_call.args[0].with_changes(value=origin_expr)
                new_rect_args[1] = rect_call.args[1].with_changes(value=w_expr)
                new_rect_args[2] = rect_call.args[2].with_changes(value=h_expr)
                new_rect_call = rect_call.with_changes(args=new_rect_args)
                new_args = list(outer.args)
                new_args[0] = outer.args[0].with_changes(value=new_rect_call)
                self.replaced = True
                return outer.with_changes(args=new_args)

        # Not a rectangle anymore (or can't parse rect args) — convert to Polygon([...])
        new_polygon_code = f"Polygon({self.new_points_code})"
        new_polygon_expr = cst.parse_expression(new_polygon_code)
        new_args = list(outer.args)
        new_args[0] = outer.args[0].with_changes(value=new_polygon_expr)
        self.replaced = True
        return outer.with_changes(args=new_args)


class _LayerReplacer(cst.CSTTransformer):
    """Replace the layer argument in an add_polygon/add_path call."""

    METADATA_DEPENDENCIES = (PositionProvider,)

    def __init__(self, target_line: int, layer: int, datatype: int) -> None:
        super().__init__()
        self.target_line = target_line
        self.layer = layer
        self.datatype = datatype
        self.replaced = False

    def leave_Call(
        self, original_node: cst.Call, updated_node: cst.Call
    ) -> cst.BaseExpression:
        if self.replaced:
            return updated_node

        try:
            pos = self.get_metadata(PositionProvider, original_node)
            line = pos.start.line
        except KeyError:
            return updated_node
        if line != self.target_line:
            return updated_node

        func_name = _get_func_name(updated_node.func)
        if func_name not in ("add_polygon", "add_path"):
            return updated_node

        if len(updated_node.args) < 2:
            return updated_node

        layer_expr = cst.parse_expression(f"Layer({self.layer}, {self.datatype})")
        new_args = list(updated_node.args)
        new_args[1] = updated_node.args[1].with_changes(value=layer_expr)
        self.replaced = True
        return updated_node.with_changes(args=new_args)


class _StatementDeleter(cst.CSTTransformer):
    """Delete the statement at a target line."""

    METADATA_DEPENDENCIES = (PositionProvider,)

    def __init__(self, target_line: int) -> None:
        super().__init__()
        self.target_line = target_line
        self.deleted = False

    def leave_SimpleStatementLine(
        self,
        original_node: cst.SimpleStatementLine,
        updated_node: cst.SimpleStatementLine,
    ) -> cst.BaseStatement | cst.RemovalSentinel:
        try:
            pos = self.get_metadata(PositionProvider, original_node)
            line = pos.start.line
        except KeyError:
            return updated_node
        if line == self.target_line:
            self.deleted = True
            return cst.RemovalSentinel.REMOVE
        return updated_node


class _PathWidthReplacer(cst.CSTTransformer):
    """Replace the width argument in an add_path call."""

    METADATA_DEPENDENCIES = (PositionProvider,)

    def __init__(self, target_line: int, width_um: float) -> None:
        super().__init__()
        self.target_line = target_line
        self.width_um = width_um
        self.replaced = False

    def leave_Call(
        self, original_node: cst.Call, updated_node: cst.Call
    ) -> cst.BaseExpression:
        if self.replaced:
            return updated_node

        try:
            pos = self.get_metadata(PositionProvider, original_node)
            line = pos.start.line
        except KeyError:
            return updated_node
        if line != self.target_line:
            return updated_node

        func_name = _get_func_name(updated_node.func)
        if func_name != "add_path":
            return updated_node

        width_expr = cst.parse_expression(_format_num(self.width_um))
        new_args = list(updated_node.args)

        for i, arg in enumerate(updated_node.args):
            if arg.keyword and arg.keyword.value == "width":
                new_args[i] = arg.with_changes(value=width_expr)
                self.replaced = True
                return updated_node.with_changes(args=new_args)

        # No keyword 'width' — check 3rd positional arg: add_path(points, layer, width)
        if len(updated_node.args) >= 3:
            new_args[2] = updated_node.args[2].with_changes(value=width_expr)
            self.replaced = True
            return updated_node.with_changes(args=new_args)

        return updated_node


class _RefPositionUpdater(cst.CSTTransformer):
    """Update the .at(x, y) arguments in an add_ref call by a delta.

    Handles: cell.at(x, y) → cell.at(x + dx, y + dy)
    """

    METADATA_DEPENDENCIES = (PositionProvider,)

    def __init__(self, target_line: int, dx_um: float, dy_um: float) -> None:
        super().__init__()
        self.target_line = target_line
        self.dx_um = dx_um
        self.dy_um = dy_um
        self.replaced = False

    def leave_Call(
        self, original_node: cst.Call, updated_node: cst.Call
    ) -> cst.BaseExpression:
        if self.replaced:
            return updated_node

        try:
            pos = self.get_metadata(PositionProvider, original_node)
            line = pos.start.line
        except KeyError:
            return updated_node
        if line != self.target_line:
            return updated_node

        func_name = _get_func_name(updated_node.func)
        if func_name != "at":
            return updated_node

        # .at(x, y) — update both positional args
        if len(updated_node.args) >= 2:
            old_x = self._eval_num(updated_node.args[0].value)
            old_y = self._eval_num(updated_node.args[1].value)
            if old_x is not None and old_y is not None:
                new_x = old_x + self.dx_um
                new_y = old_y + self.dy_um
                new_args = list(updated_node.args)
                new_args[0] = updated_node.args[0].with_changes(
                    value=cst.parse_expression(_format_num(new_x))
                )
                new_args[1] = updated_node.args[1].with_changes(
                    value=cst.parse_expression(_format_num(new_y))
                )
                self.replaced = True
                return updated_node.with_changes(args=new_args)

        return updated_node

    @staticmethod
    def _eval_num(node: cst.BaseExpression) -> float | None:
        """Try to evaluate a numeric literal (including unary minus)."""
        if isinstance(node, cst.Integer):
            return float(node.evaluated_value)
        if isinstance(node, cst.Float):
            return float(node.evaluated_value)
        if isinstance(node, cst.UnaryOperation) and isinstance(
            node.operator, cst.Minus
        ):
            inner = _RefPositionUpdater._eval_num(node.expression)
            return -inner if inner is not None else None
        return None


# =============================================================================
# SemanticPatcher
# =============================================================================


class SemanticPatcher:
    """Apply semantic edit operations to Python source files using libcst."""

    def apply(self, op) -> PatchResult:
        """Route to the appropriate handler based on operation type."""
        if isinstance(op, ModifyVertices):
            return self._modify_vertices(op)
        elif isinstance(op, ModifyLayer):
            return self._modify_layer(op)
        elif isinstance(op, DeleteElement):
            return self._delete_element(op)
        elif isinstance(op, AddElement):
            return self._add_element(op)
        elif isinstance(op, ModifyPathWidth):
            return self._modify_path_width(op)
        elif isinstance(op, MoveRef):
            return self._move_ref(op)
        else:
            return PatchResult(success=False, error=f"Unknown operation type: {type(op).__name__}")

    def _read_and_validate(
        self, file_path: str, line: int, old_code: str | None
    ) -> tuple[str, None] | tuple[None, PatchResult]:
        """Read file and validate old_code. Returns (source, None) or (None, error)."""
        path = Path(file_path)
        if not path.exists():
            return None, PatchResult(success=False, error=f"File not found: {file_path}")

        source = path.read_text()
        lines = source.splitlines()

        if line < 1 or line > len(lines):
            return None, PatchResult(
                success=False, error=f"Line {line} out of range (file has {len(lines)} lines)"
            )

        if old_code is not None:
            actual_line = lines[line - 1]
            if old_code.strip() != actual_line.strip():
                return None, PatchResult(
                    success=False,
                    error=f"old_code mismatch at line {line}: "
                    f"expected {old_code.strip()!r}, got {actual_line.strip()!r}",
                )

        return source, None

    def _wrap(self, source: str) -> MetadataWrapper:
        """Parse source and wrap with metadata."""
        tree = cst.parse_module(source)
        return MetadataWrapper(tree)

    def _modify_vertices(self, op: ModifyVertices) -> PatchResult:
        source, err = self._read_and_validate(op.file, op.line, op.old_code)
        if err:
            return err

        # Convert world coords to µm
        vertices_um = []
        points_code_parts = []
        for i in range(0, len(op.vertices), 2):
            x_um, y_um = world_to_um(op.vertices[i], op.vertices[i + 1])
            vertices_um.append((x_um, y_um))
            points_code_parts.append(f"Point({_format_num(x_um)}, {_format_num(y_um)})")
        points_code = "[" + ", ".join(points_code_parts) + "]"

        try:
            wrapper = self._wrap(source)
            transformer = _VertexReplacer(op.line, points_code, vertices_um)
            new_tree = wrapper.visit(transformer)
        except cst.ParserSyntaxError as e:
            return PatchResult(success=False, error=f"Failed to parse file: {e}")

        if not transformer.replaced:
            return PatchResult(
                success=False,
                error=f"Could not find editable geometry at line {op.line}. "
                "Supported patterns: Polygon([Point(...)]), Polygon.rect(), add_path([...]).",
            )

        Path(op.file).write_text(new_tree.code)
        return PatchResult(success=True)

    def _modify_layer(self, op: ModifyLayer) -> PatchResult:
        source, err = self._read_and_validate(op.file, op.line, op.old_code)
        if err:
            return err

        try:
            wrapper = self._wrap(source)
            transformer = _LayerReplacer(op.line, op.layer, op.datatype)
            new_tree = wrapper.visit(transformer)
        except cst.ParserSyntaxError as e:
            return PatchResult(success=False, error=f"Failed to parse file: {e}")

        if not transformer.replaced:
            return PatchResult(
                success=False,
                error=f"Could not find add_polygon/add_path call at line {op.line}.",
            )

        Path(op.file).write_text(new_tree.code)
        return PatchResult(success=True)

    def _delete_element(self, op: DeleteElement) -> PatchResult:
        source, err = self._read_and_validate(op.file, op.line, op.old_code)
        if err:
            return err

        try:
            wrapper = self._wrap(source)
            transformer = _StatementDeleter(op.line)
            new_tree = wrapper.visit(transformer)
        except cst.ParserSyntaxError as e:
            return PatchResult(success=False, error=f"Failed to parse file: {e}")

        if not transformer.deleted:
            return PatchResult(
                success=False,
                error=f"Could not find statement to delete at line {op.line}.",
            )

        Path(op.file).write_text(new_tree.code)
        return PatchResult(success=True)

    def _add_element(self, op: AddElement) -> PatchResult:
        path = Path(op.file)
        if not path.exists():
            return PatchResult(success=False, error=f"File not found: {op.file}")

        source = path.read_text()
        lines = source.splitlines(keepends=True)

        if op.after_line < 1 or op.after_line > len(lines):
            return PatchResult(
                success=False,
                error=f"after_line {op.after_line} out of range (file has {len(lines)} lines)",
            )

        # Find the actual end of the statement at after_line using libcst.
        # This handles multi-line calls where after_line is the first line.
        insert_after = op.after_line  # default: insert after the given line
        try:
            wrapper = MetadataWrapper(cst.parse_module(source))
            positions = wrapper.resolve(PositionProvider)
            for node, pos in positions.items():
                if isinstance(node, (cst.SimpleStatementLine, cst.BaseCompoundStatement)):
                    if pos.start.line <= op.after_line <= pos.end.line:
                        insert_after = pos.end.line
                        break
        except Exception:
            pass  # Fall back to raw after_line on parse failure

        # Detect indentation from the target line
        target_line = lines[op.after_line - 1]
        indent = len(target_line) - len(target_line.lstrip())
        indent_str = target_line[:indent]

        # Convert world coords to µm
        vertices_um = []
        points_code_parts = []
        for i in range(0, len(op.vertices), 2):
            x_um, y_um = world_to_um(op.vertices[i], op.vertices[i + 1])
            vertices_um.append((x_um, y_um))
            points_code_parts.append(f"Point({_format_num(x_um)}, {_format_num(y_um)})")
        points_code = "[" + ", ".join(points_code_parts) + "]"

        cell_var = op.cell_var or "cell"

        if op.element_type == "path":
            width_str = f", width={_format_num(op.width / WORLD_PER_UM)}" if op.width else ""
            new_line = (
                f"{indent_str}{cell_var}.add_path("
                f"{points_code}, Layer({op.layer}, {op.datatype}){width_str})\n"
            )
        else:
            # Use Polygon.rect() for axis-aligned rectangles, Polygon([...]) otherwise
            rect_params = _vertices_to_rect(vertices_um)
            if rect_params is not None:
                x, y, w, h = rect_params
                geom = (
                    f"Polygon.rect(Point({_format_num(x)}, {_format_num(y)}), "
                    f"{_format_num(w)}, {_format_num(h)})"
                )
            else:
                geom = f"Polygon({points_code})"
            new_line = (
                f"{indent_str}{cell_var}.add_polygon("
                f"{geom}, Layer({op.layer}, {op.datatype}))\n"
            )

        # Insert after the end of the statement
        lines.insert(insert_after, new_line)
        path.write_text("".join(lines))
        return PatchResult(success=True)

    def _modify_path_width(self, op: ModifyPathWidth) -> PatchResult:
        source, err = self._read_and_validate(op.file, op.line, op.old_code)
        if err:
            return err

        width_um = op.width / WORLD_PER_UM

        try:
            wrapper = self._wrap(source)
            transformer = _PathWidthReplacer(op.line, width_um)
            new_tree = wrapper.visit(transformer)
        except cst.ParserSyntaxError as e:
            return PatchResult(success=False, error=f"Failed to parse file: {e}")

        if not transformer.replaced:
            return PatchResult(
                success=False,
                error=f"Could not find add_path call with width at line {op.line}.",
            )

        Path(op.file).write_text(new_tree.code)
        return PatchResult(success=True)

    def _move_ref(self, op: MoveRef) -> PatchResult:
        source, err = self._read_and_validate(op.file, op.line, op.old_code)
        if err:
            return err

        dx_um, dy_um = world_to_um(op.dx, op.dy)
        # world_to_um flips Y and divides by WORLD_PER_UM, but for a delta
        # we only want the scale+flip, not the absolute conversion.
        # world_to_um(dx, dy) = (dx/WORLD_PER_UM, -dy/WORLD_PER_UM) which is correct for deltas too.

        try:
            wrapper = self._wrap(source)
            transformer = _RefPositionUpdater(op.line, dx_um, dy_um)
            new_tree = wrapper.visit(transformer)
        except cst.ParserSyntaxError as e:
            return PatchResult(success=False, error=f"Failed to parse file: {e}")

        if not transformer.replaced:
            return PatchResult(
                success=False,
                error=f"Could not find .at(x, y) call at line {op.line}.",
            )

        Path(op.file).write_text(new_tree.code)
        return PatchResult(success=True)


# =============================================================================
# Legacy line patcher (for raw code edits from SourceSection)
# =============================================================================


class CodePatcher:
    """Simple line-replacement patcher for manual code edits."""

    def patch_line(
        self,
        file_path: str,
        line_number: int,
        old_code: str | None = None,
        new_code: str = "",
    ) -> bool:
        """Replace a line in a source file.

        Args:
            file_path: Path to the Python file
            line_number: 1-indexed line number
            old_code: Expected current content (for validation, optional)
            new_code: New content for the line (stripped, re-indented)

        Returns:
            True if patch was applied successfully
        """
        path = Path(file_path)
        if not path.exists():
            return False

        lines = path.read_text().splitlines(keepends=True)
        idx = line_number - 1

        if idx < 0 or idx >= len(lines):
            return False

        # Validate old content if provided
        if old_code is not None and old_code.strip() != lines[idx].strip():
            return False

        # Preserve original indentation
        current_line = lines[idx]
        indent = len(current_line) - len(current_line.lstrip())
        indent_str = current_line[:indent]

        # Build new line with preserved indentation
        new_line = indent_str + new_code.strip() + "\n"
        lines[idx] = new_line

        path.write_text("".join(lines))
        return True

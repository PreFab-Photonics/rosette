"""Tests for rosette CLI: init, build, update commands.

These tests call CLI functions directly (no subprocess) for speed.
"""

from pathlib import Path
from unittest.mock import patch

import pytest

from rosette.cli import build_design, init_project, main, update_project


def _make_uv_project(project_dir: Path):
    """Create a minimal uv-style project (pyproject.toml + .gitignore)."""
    project_dir.mkdir(exist_ok=True)
    (project_dir / "pyproject.toml").write_text('[project]\nname = "test"\nversion = "0.1.0"\n')
    (project_dir / ".gitignore").write_text("# Python\n__pycache__/\n*.py[cod]\n.venv/\n")


class TestRosetteInit:
    """Tests for 'rosette init' command."""

    def test_init_creates_complete_structure(self, tmp_path: Path, monkeypatch):
        """rosette init creates all expected files in current directory."""
        project_dir = tmp_path / "my_project"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("blank", tool="opencode")

        # Core project files
        assert (project_dir / "rosette.toml").exists()
        assert (project_dir / "AGENTS.md").exists()
        assert (project_dir / ".gitignore").exists()

        # Directories
        assert (project_dir / "designs").is_dir()
        assert (project_dir / "output").is_dir()
        assert (project_dir / ".rosette").is_dir()

        # designs/ starts empty (no example files)
        assert list((project_dir / "designs").iterdir()) == []

        # Config content
        toml_content = (project_dir / "rosette.toml").read_text()
        assert 'name = "my_project"' in toml_content

        # AGENTS.md content: has markers and directive
        agents_content = (project_dir / "AGENTS.md").read_text()
        assert "<!-- BEGIN:rosette-agent-rules -->" in agents_content
        assert "<!-- END:rosette-agent-rules -->" in agents_content
        assert "ALWAYS read the reference files" in agents_content

        # .gitignore appends rosette entries to existing content
        gitignore = (project_dir / ".gitignore").read_text()
        assert ".rosette/" in gitignore
        # Original uv content preserved
        assert "__pycache__/" in gitignore

    def test_init_copies_api_stub(self, tmp_path: Path, monkeypatch):
        """rosette init copies API stub to .rosette/ for agent reference."""
        project_dir = tmp_path / "test"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("blank", tool="opencode")

        # API stub - contains core types and Route
        api_stub = project_dir / ".rosette" / "api.pyi"
        assert api_stub.exists()
        stub_content = api_stub.read_text()
        assert "class Route" in stub_content
        assert "class Cell" in stub_content

        # Rust source files are NOT bundled (agents work in Python only)
        src_dir = project_dir / ".rosette" / "src"
        assert not src_dir.exists()

        # Components are local Python files (not in .rosette)
        components_dir = project_dir / "components"
        assert components_dir.is_dir()
        assert (components_dir / "waveguide.py").exists()
        assert (components_dir / "bend.py").exists()
        assert (components_dir / "mmi.py").exists()

    def test_init_uses_dir_name_as_default(self, tmp_path: Path, monkeypatch):
        """rosette init uses directory name for project name."""
        project_dir = tmp_path / "my_project_dir"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("blank", tool="opencode")

        content = (project_dir / "rosette.toml").read_text()
        assert 'name = "my_project_dir"' in content

    def test_init_requires_pyproject_toml(self, tmp_path: Path, monkeypatch):
        """rosette init fails without pyproject.toml (user must run uv init first)."""
        monkeypatch.chdir(tmp_path)

        with pytest.raises(SystemExit) as exc_info:
            init_project("blank", tool="opencode")
        assert exc_info.value.code == 1

    def test_init_fails_if_already_initialized(self, tmp_path: Path, monkeypatch):
        """rosette init fails if rosette.toml already exists."""
        project_dir = tmp_path / "test"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        # First init
        init_project("blank", tool="opencode")

        # Second init should fail
        with pytest.raises(SystemExit) as exc_info:
            init_project("blank", tool="opencode")
        assert exc_info.value.code == 1

    def test_init_with_template_flag(self, tmp_path: Path, monkeypatch, capsys):
        """rosette init --template blank works."""
        project_dir = tmp_path / "my_project"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("blank", tool="opencode")

        assert (project_dir / "rosette.toml").exists()
        assert (project_dir / "AGENTS.md").exists()

        captured = capsys.readouterr()
        assert "template: blank" in captured.out

    def test_init_generic_template(self, tmp_path: Path, monkeypatch):
        """rosette init --template generic creates project with pre-configured layers."""
        project_dir = tmp_path / "my_project"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("generic", tool="opencode")

        toml_content = (project_dir / "rosette.toml").read_text()
        assert 'template = "generic"' in toml_content
        assert "[layers.silicon]" in toml_content

        # AGENTS.md has markers and directive
        agents_content = (project_dir / "AGENTS.md").read_text()
        assert "<!-- BEGIN:rosette-agent-rules -->" in agents_content
        assert "ALWAYS read the reference files" in agents_content

    def test_init_stores_template_in_toml(self, tmp_path: Path, monkeypatch):
        """rosette init records the template name in rosette.toml."""
        project_dir = tmp_path / "my_project"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("blank", tool="opencode")

        toml_content = (project_dir / "rosette.toml").read_text()
        assert 'template = "blank"' in toml_content

    def test_init_with_invalid_template(self, tmp_path: Path, monkeypatch, capsys):
        """rosette init --template nonexistent fails with helpful message."""
        project_dir = tmp_path / "test"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        with pytest.raises(SystemExit) as exc_info:
            init_project("nonexistent", tool="opencode")
        assert exc_info.value.code == 1

        captured = capsys.readouterr()
        assert "not found" in captured.out.lower()
        assert "blank" in captured.out  # Lists available templates

    def test_init_no_tool(self, tmp_path: Path, monkeypatch):
        """rosette init --tool none skips agent file creation."""
        project_dir = tmp_path / "my_project"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("blank", tool="none")

        assert (project_dir / "rosette.toml").exists()
        assert not (project_dir / "AGENTS.md").exists()
        assert not (project_dir / "CLAUDE.md").exists()

    def test_init_claude_tool(self, tmp_path: Path, monkeypatch):
        """rosette init with tool='claude' creates CLAUDE.md that imports AGENTS.md."""
        project_dir = tmp_path / "my_project"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("blank", tool="claude")

        assert (project_dir / "CLAUDE.md").exists()
        # AGENTS.md is also created because CLAUDE.md imports it
        assert (project_dir / "AGENTS.md").exists()

        # CLAUDE.md uses @import instead of duplicating content
        claude_content = (project_dir / "CLAUDE.md").read_text()
        assert "@AGENTS.md" in claude_content

    def test_init_appends_gitignore(self, tmp_path: Path, monkeypatch):
        """rosette init appends entries to existing .gitignore without duplicating."""
        project_dir = tmp_path / "my_project"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("blank", tool="opencode")

        gitignore = (project_dir / ".gitignore").read_text()
        # Original uv entries preserved
        assert "__pycache__/" in gitignore
        assert ".venv/" in gitignore
        # Rosette entries appended
        assert ".rosette/" in gitignore
        assert "output/*.gds" in gitignore
        # Section header added
        assert "# Rosette" in gitignore


class TestRosetteBuild:
    """Tests for 'rosette build' command."""

    def test_build_design(self, tmp_path: Path, monkeypatch):
        """rosette build compiles a design to GDS."""
        project_dir = tmp_path / "test"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("blank", tool="opencode")

        # Create a minimal design
        (project_dir / "designs" / "test_design.py").write_text("""
from rosette import Cell, Layer, Polygon, Point

design = Cell("test")
design.add_polygon(Polygon.rect(Point(0, 0), 10, 10), Layer(1, 0))
""")

        # Build design
        build_design("designs/test_design.py", "output", verbose=False)

        assert (project_dir / "output" / "test_design.gds").exists()

    def test_build_custom_output_directory(self, tmp_path: Path, monkeypatch):
        """rosette build respects output directory argument."""
        monkeypatch.chdir(tmp_path)

        # Create a minimal design that follows the 'design' convention
        designs_dir = tmp_path / "designs"
        designs_dir.mkdir()
        (designs_dir / "env_output.py").write_text("""
from rosette import Cell, Layer, Polygon, Point

design = Cell("test")
design.add_polygon(Polygon.rect(Point(0, 0), 10, 10), Layer(1, 0))
""")

        custom_output = tmp_path / "custom_output"
        build_design("designs/env_output.py", str(custom_output), verbose=False)

        assert (custom_output / "env_output.gds").exists()

    def test_build_nonexistent_file(self, tmp_path: Path, monkeypatch):
        """rosette build fails for nonexistent file."""
        monkeypatch.chdir(tmp_path)

        with pytest.raises(SystemExit) as exc_info:
            build_design("nonexistent.py", "output", verbose=False)
        assert exc_info.value.code == 1

    def test_build_creates_output_dir(self, tmp_path: Path, monkeypatch):
        """rosette build creates output directory if needed."""
        project_dir = tmp_path / "test"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("blank", tool="opencode")

        # Create a minimal design
        (project_dir / "designs" / "test_design.py").write_text("""
from rosette import Cell, Layer, Polygon, Point

design = Cell("test")
design.add_polygon(Polygon.rect(Point(0, 0), 10, 10), Layer(1, 0))
""")

        # Remove output directory
        (project_dir / "output").rmdir()

        # Build should recreate it
        build_design("designs/test_design.py", "output", verbose=False)

        assert (project_dir / "output").is_dir()


class TestBuildAutoDetect:
    """Tests for auto-detecting the design Cell when no 'design' variable exists."""

    def test_auto_detect_single_cell(self, tmp_path: Path, monkeypatch):
        """Build auto-detects the Cell when there's exactly one."""
        monkeypatch.chdir(tmp_path)

        designs_dir = tmp_path / "designs"
        designs_dir.mkdir()
        (designs_dir / "chip.py").write_text("""
from rosette import Cell, Layer, Polygon, Point

my_chip = Cell("chip")
my_chip.add_polygon(Polygon.rect(Point(0, 0), 10, 10), Layer(1, 0))
""")

        output_dir = tmp_path / "output"
        build_design("designs/chip.py", str(output_dir), verbose=False)

        assert (output_dir / "chip.gds").exists()

    def test_auto_detect_multiple_cells_fails(self, tmp_path: Path, monkeypatch, capsys):
        """Build fails with helpful message when multiple Cells exist."""
        monkeypatch.chdir(tmp_path)

        designs_dir = tmp_path / "designs"
        designs_dir.mkdir()
        (designs_dir / "multi.py").write_text("""
from rosette import Cell, Layer, Polygon, Point

cell_a = Cell("a")
cell_a.add_polygon(Polygon.rect(Point(0, 0), 10, 10), Layer(1, 0))

cell_b = Cell("b")
cell_b.add_polygon(Polygon.rect(Point(0, 0), 5, 5), Layer(1, 0))
""")

        with pytest.raises(SystemExit):
            build_design("designs/multi.py", "output", verbose=False)

        captured = capsys.readouterr()
        assert "cell_a" in captured.out
        assert "cell_b" in captured.out

    def test_auto_detect_no_cells_fails(self, tmp_path: Path, monkeypatch, capsys):
        """Build fails with helpful message when no Cells exist."""
        monkeypatch.chdir(tmp_path)

        designs_dir = tmp_path / "designs"
        designs_dir.mkdir()
        (designs_dir / "empty.py").write_text("""
x = 42
""")

        with pytest.raises(SystemExit):
            build_design("designs/empty.py", "output", verbose=False)

        captured = capsys.readouterr()
        assert "Cell" in captured.out

    def test_design_variable_takes_priority(self, tmp_path: Path, monkeypatch):
        """When 'design' variable exists, it's used even if other Cells exist."""
        monkeypatch.chdir(tmp_path)

        designs_dir = tmp_path / "designs"
        designs_dir.mkdir()
        (designs_dir / "priority.py").write_text("""
from rosette import Cell, Layer, Polygon, Point

helper = Cell("helper")
helper.add_polygon(Polygon.rect(Point(0, 0), 5, 5), Layer(1, 0))

design = Cell("main")
design.add_polygon(Polygon.rect(Point(0, 0), 10, 10), Layer(1, 0))
""")

        output_dir = tmp_path / "output"
        build_design("designs/priority.py", str(output_dir), verbose=False)

        assert (output_dir / "priority.gds").exists()


class TestRosetteUpdate:
    """Tests for 'rosette update' command."""

    def test_update_requires_project(self, tmp_path: Path, monkeypatch, capsys):
        """rosette update fails outside a project."""
        monkeypatch.chdir(tmp_path)

        with pytest.raises(SystemExit) as exc_info:
            update_project()
        assert exc_info.value.code == 1

        captured = capsys.readouterr()
        assert "not" in captured.out.lower()

    def test_update_refreshes_files(self, tmp_path: Path, monkeypatch):
        """rosette update refreshes AGENTS.md managed section and .rosette/ files."""
        project_dir = tmp_path / "test"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("blank", tool="opencode")

        # Completely replace AGENTS.md (no markers -- legacy behavior)
        agents_md = project_dir / "AGENTS.md"
        agents_md.write_text("modified content without markers")

        # Delete a managed file from .rosette/
        api_stub = project_dir / ".rosette" / "api.pyi"
        assert api_stub.exists()
        api_stub.unlink()

        # Update should restore everything (legacy overwrite since no markers)
        update_project()

        restored = agents_md.read_text()
        assert "<!-- BEGIN:rosette-agent-rules -->" in restored
        assert "ALWAYS read the reference files" in restored
        assert api_stub.exists()

    def test_update_preserves_user_content(self, tmp_path: Path, monkeypatch):
        """rosette update preserves user content outside markers in AGENTS.md."""
        project_dir = tmp_path / "test"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("blank", tool="opencode")

        # Append user content after the managed section
        agents_md = project_dir / "AGENTS.md"
        original = agents_md.read_text()
        user_notes = "\n## My custom rules\n\n- Always use Layer(1, 0) for waveguides\n"
        agents_md.write_text(original + user_notes)

        # Update should preserve user content
        update_project()

        updated = agents_md.read_text()
        assert "<!-- BEGIN:rosette-agent-rules -->" in updated
        assert "ALWAYS read the reference files" in updated
        assert "My custom rules" in updated
        assert "Always use Layer(1, 0) for waveguides" in updated

    def test_update_uses_template_from_toml(self, tmp_path: Path, monkeypatch, capsys):
        """rosette update reads the template name from rosette.toml."""
        project_dir = tmp_path / "test"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("generic", tool="opencode")

        # Modify AGENTS.md (no markers -- triggers legacy overwrite)
        agents_md = project_dir / "AGENTS.md"
        agents_md.write_text("modified content")

        # Update should use generic template (from rosette.toml)
        update_project()

        # The rosette.toml should NOT be overwritten (it's user-owned)
        toml_content = (project_dir / "rosette.toml").read_text()
        assert 'template = "generic"' in toml_content

        # AGENTS.md should be restored with markers
        agents_content = agents_md.read_text()
        assert "<!-- BEGIN:rosette-agent-rules -->" in agents_content

    def test_update_no_tool_does_not_create_agents(self, tmp_path: Path, monkeypatch):
        """rosette update on a tool=none project does not create AGENTS.md."""
        project_dir = tmp_path / "test"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("blank", tool="none")

        assert not (project_dir / "AGENTS.md").exists()
        assert not (project_dir / "CLAUDE.md").exists()

        # Update should not create tool files
        update_project()

        assert not (project_dir / "AGENTS.md").exists()
        assert not (project_dir / "CLAUDE.md").exists()


class TestCliHelp:
    """Tests for CLI help messages via argparse."""

    def test_main_help(self, capsys):
        """rosette --help shows usage."""
        with pytest.raises(SystemExit) as exc_info:
            import sys

            with patch.object(sys, "argv", ["rosette", "--help"]):
                main()
        assert exc_info.value.code == 0

        captured = capsys.readouterr()
        assert "init" in captured.out
        assert "build" in captured.out

    def test_init_help(self, capsys):
        """rosette init --help shows usage."""
        with pytest.raises(SystemExit) as exc_info:
            import sys

            with patch.object(sys, "argv", ["rosette", "init", "--help"]):
                main()
        assert exc_info.value.code == 0

        captured = capsys.readouterr()
        assert "--template" in captured.out  # Shows template flag
        assert "--tool" in captured.out  # Shows tool flag

    def test_build_help(self, capsys):
        """rosette build --help shows usage."""
        with pytest.raises(SystemExit) as exc_info:
            import sys

            with patch.object(sys, "argv", ["rosette", "build", "--help"]):
                main()
        assert exc_info.value.code == 0

        captured = capsys.readouterr()
        # Check for output option
        assert "-o" in captured.out or "output" in captured.out.lower()

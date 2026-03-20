"""Tests for rosette CLI: init, build, update commands.

These tests call CLI functions directly (no subprocess) for speed.
The _setup_venv function is mocked to skip venv creation.
"""

from pathlib import Path
from unittest.mock import patch

import pytest

from rosette.cli import build_design, init_project, main, update_project


# Mock _setup_venv and _init_git globally for all CLI tests
@pytest.fixture(autouse=True)
def skip_slow_setup():
    """Skip venv setup and git init in all CLI tests."""
    with patch("rosette.cli._setup_venv"), patch("rosette.cli._init_git"):
        yield


class TestRosetteInit:
    """Tests for 'rosette init' command."""

    def test_init_creates_complete_structure(self, tmp_path: Path, monkeypatch):
        """rosette init <name> creates new directory with all expected files."""
        monkeypatch.chdir(tmp_path)

        init_project("my_project", "blank")

        # Should create subdirectory
        project_dir = tmp_path / "my_project"
        assert project_dir.is_dir()

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

        # AGENTS.md content
        agents_content = (project_dir / "AGENTS.md").read_text()
        assert "rosette" in agents_content
        assert "rosette build" in agents_content

        # .gitignore content
        gitignore = (project_dir / ".gitignore").read_text()
        assert ".rosette/" in gitignore

    def test_init_copies_source_files(self, tmp_path: Path, monkeypatch):
        """rosette init copies source files to .rosette/ for agent reference."""
        monkeypatch.chdir(tmp_path)

        init_project("test", "blank")

        project_dir = tmp_path / "test"

        # API stub (most useful for agents) - contains core types and Route
        api_stub = project_dir / ".rosette" / "api.pyi"
        assert api_stub.exists()
        stub_content = api_stub.read_text()
        assert "class Route" in stub_content
        assert "class Cell" in stub_content

        # Components are now local Python files (not in .rosette)
        components_dir = project_dir / "components"
        assert components_dir.is_dir()
        assert (components_dir / "waveguide.py").exists()
        assert (components_dir / "bend.py").exists()
        assert (components_dir / "mmi.py").exists()

        # Source files for agent reference
        src_dir = project_dir / ".rosette" / "src"
        assert src_dir.is_dir()

    def test_init_uses_dir_name_as_default(self, tmp_path: Path, monkeypatch):
        """rosette init uses directory name when no name given."""
        project_dir = tmp_path / "my_project_dir"
        project_dir.mkdir()
        monkeypatch.chdir(project_dir)

        init_project(None, "blank")

        content = (project_dir / "rosette.toml").read_text()
        assert 'name = "my_project_dir"' in content

    def test_init_fails_if_directory_exists(self, tmp_path: Path, monkeypatch):
        """rosette init <name> fails if directory already exists."""
        monkeypatch.chdir(tmp_path)

        # First init creates directory
        init_project("test", "blank")

        # Second init should fail (directory exists)
        with pytest.raises(SystemExit) as exc_info:
            init_project("test", "blank")
        assert exc_info.value.code == 1

    def test_init_in_place_fails_if_already_initialized(self, tmp_path: Path, monkeypatch):
        """rosette init (no name) fails if rosette.toml exists."""
        monkeypatch.chdir(tmp_path)

        # First init in place
        init_project(None, "blank")

        # Second init should fail
        with pytest.raises(SystemExit) as exc_info:
            init_project(None, "blank")
        assert exc_info.value.code == 1

    def test_init_with_template_flag(self, tmp_path: Path, monkeypatch, capsys):
        """rosette init --template blank works."""
        monkeypatch.chdir(tmp_path)

        init_project("my_project", "blank")

        project_dir = tmp_path / "my_project"
        assert (project_dir / "rosette.toml").exists()
        assert (project_dir / "AGENTS.md").exists()

        captured = capsys.readouterr()
        assert "template: blank" in captured.out

    def test_init_generic_template(self, tmp_path: Path, monkeypatch):
        """rosette init --template generic creates project with pre-configured layers."""
        monkeypatch.chdir(tmp_path)

        init_project("my_project", "generic")

        project_dir = tmp_path / "my_project"
        toml_content = (project_dir / "rosette.toml").read_text()
        assert 'template = "generic"' in toml_content
        assert "[layers.silicon]" in toml_content

    def test_init_stores_template_in_toml(self, tmp_path: Path, monkeypatch):
        """rosette init records the template name in rosette.toml."""
        monkeypatch.chdir(tmp_path)

        init_project("my_project", "blank")

        project_dir = tmp_path / "my_project"
        toml_content = (project_dir / "rosette.toml").read_text()
        assert 'template = "blank"' in toml_content

    def test_init_with_invalid_template(self, tmp_path: Path, monkeypatch, capsys):
        """rosette init --template nonexistent fails with helpful message."""
        monkeypatch.chdir(tmp_path)

        with pytest.raises(SystemExit) as exc_info:
            init_project("test", "nonexistent")
        assert exc_info.value.code == 1

        captured = capsys.readouterr()
        assert "not found" in captured.out.lower()
        assert "blank" in captured.out  # Lists available templates


class TestRosetteBuild:
    """Tests for 'rosette build' command."""

    def test_build_design(self, tmp_path: Path, monkeypatch):
        """rosette build compiles a design to GDS."""
        monkeypatch.chdir(tmp_path)

        # Initialize project (creates test/ subdirectory)
        init_project("test", "blank")

        project_dir = tmp_path / "test"
        monkeypatch.chdir(project_dir)

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
        monkeypatch.chdir(tmp_path)

        init_project("test", "blank")

        project_dir = tmp_path / "test"
        monkeypatch.chdir(project_dir)

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
        """rosette update refreshes AGENTS.md and managed .rosette/ files."""
        monkeypatch.chdir(tmp_path)

        # Initialize project (creates test/ subdirectory)
        init_project("test", "blank")

        project_dir = tmp_path / "test"
        monkeypatch.chdir(project_dir)

        # Modify AGENTS.md
        agents_md = project_dir / "AGENTS.md"
        original_content = agents_md.read_text()
        agents_md.write_text("modified content")

        # Delete a managed file from .rosette/
        api_stub = project_dir / ".rosette" / "api.pyi"
        assert api_stub.exists()
        api_stub.unlink()

        # Update should restore everything
        update_project()

        assert agents_md.read_text() == original_content
        assert api_stub.exists()

    def test_update_uses_template_from_toml(self, tmp_path: Path, monkeypatch, capsys):
        """rosette update reads the template name from rosette.toml."""
        monkeypatch.chdir(tmp_path)

        init_project("test", "generic")

        project_dir = tmp_path / "test"
        monkeypatch.chdir(project_dir)

        # Modify AGENTS.md
        agents_md = project_dir / "AGENTS.md"
        agents_md.write_text("modified content")

        # Update should use generic template (from rosette.toml)
        update_project()

        # The rosette.toml should NOT be overwritten (it's user-owned)
        toml_content = (project_dir / "rosette.toml").read_text()
        assert 'template = "generic"' in toml_content


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

"""Tests for rosette CLI: init, build, update commands.

These tests call CLI functions directly (no subprocess) for speed.
The _setup_venv function is mocked to skip venv creation.
"""

from pathlib import Path
from unittest.mock import patch

import pytest

from rosette.cli import build_design, init_project, main, update_project


# Mock _setup_venv globally for all CLI tests (venv creation is slow)
@pytest.fixture(autouse=True)
def skip_venv_setup():
    """Skip venv setup in all CLI tests."""
    with patch("rosette.cli._setup_venv"):
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

        # Example design
        example = project_dir / "designs" / "basic_shapes.py"
        assert example.exists()
        content = example.read_text()
        assert "rosette" in content
        assert "Polygon" in content

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

        # Patterns doc
        patterns = project_dir / ".rosette" / "patterns.md"
        assert patterns.exists()
        patterns_content = patterns.read_text()
        assert "Rosette Patterns" in patterns_content

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

    def test_build_example_design(self, tmp_path: Path, monkeypatch):
        """rosette build compiles example design to GDS."""
        monkeypatch.chdir(tmp_path)

        # Initialize project (creates test/ subdirectory)
        init_project("test", "blank")

        project_dir = tmp_path / "test"
        monkeypatch.chdir(project_dir)

        # Build example design
        build_design("designs/basic_shapes.py", "output", verbose=False)

        assert (project_dir / "output" / "basic_shapes.gds").exists()

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

        # Remove output directory
        (project_dir / "output").rmdir()

        # Build should recreate it
        build_design("designs/basic_shapes.py", "output", verbose=False)

        assert (project_dir / "output").is_dir()


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
        patterns_file = project_dir / ".rosette" / "patterns.md"
        assert patterns_file.exists()
        patterns_file.unlink()

        # Update should restore everything
        update_project()

        assert agents_md.read_text() == original_content
        assert patterns_file.exists()


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

"""Tests for rosette CLI: init, build, update commands.

These tests call CLI functions directly (no subprocess) for speed.
"""

from pathlib import Path
from unittest.mock import patch

import pytest

from rosette.cli import (
    _parse_tool_spec,
    _sanitize_project_name,
    build_design,
    init_project,
    main,
    update_project,
)


def _make_uv_project(project_dir: Path):
    """Create a minimal uv-style project (pyproject.toml + .gitignore)."""
    project_dir.mkdir(exist_ok=True)
    (project_dir / "pyproject.toml").write_text('[project]\nname = "test"\nversion = "0.1.0"\n')
    (project_dir / ".gitignore").write_text("# Python\n__pycache__/\n*.py[cod]\n.venv/\n")


def _make_fake_run(calls: list[list[str]], *, project_name: str = "fresh"):
    """Build a fake `subprocess.run` for bootstrap tests.

    Records each command in ``calls``. Mimics `uv init --bare` by writing a
    pyproject.toml into the command's cwd, and answers `git rev-parse
    --is-inside-work-tree` based on whether a ``.git`` dir exists in cwd (so
    tests can simulate an already-existing repo).
    """
    from subprocess import CompletedProcess

    def fake_run(cmd, *args, **kwargs):
        calls.append(cmd)
        cwd = Path(kwargs.get("cwd", Path.cwd()))
        if cmd[:3] == ["uv", "init", "--bare"]:
            (cwd / "pyproject.toml").write_text(
                f'[project]\nname = "{project_name}"\nversion = "0.1.0"\n'
            )
        if cmd[:2] == ["git", "rev-parse"]:
            inside = "true" if (cwd / ".git").exists() else "false"
            return CompletedProcess(cmd, 0, stdout=inside + "\n", stderr="")
        return CompletedProcess(cmd, 0, stdout="", stderr="")

    return fake_run


class TestSanitizeProjectName:
    """Tests for _sanitize_project_name."""

    def test_keeps_normal_name(self):
        assert _sanitize_project_name("my-chip", "fallback") == "my-chip"

    def test_strips_whitespace(self):
        assert _sanitize_project_name("  my chip  ", "fallback") == "my chip"

    def test_drops_double_quotes(self):
        # A double quote would corrupt the TOML string value.
        assert _sanitize_project_name('my "chip"', "fallback") == "my chip"

    def test_falls_back_when_empty(self):
        assert _sanitize_project_name("", "fallback") == "fallback"
        assert _sanitize_project_name("   ", "fallback") == "fallback"
        assert _sanitize_project_name('"', "fallback") == "fallback"


class TestParseToolSpec:
    """Tests for _parse_tool_spec harness resolution."""

    def test_none_and_empty(self):
        assert _parse_tool_spec(None) == []
        assert _parse_tool_spec("none") == []
        assert _parse_tool_spec("NONE") == []
        assert _parse_tool_spec("") == []

    def test_canonical_keys(self):
        assert _parse_tool_spec("agents") == ["agents"]
        assert _parse_tool_spec("claude") == ["claude"]

    def test_aliases_resolve_to_agents(self):
        for alias in ("opencode", "codex", "cursor", "gemini", "copilot"):
            assert _parse_tool_spec(alias) == ["agents"]

    def test_comma_separated_and_dedupe(self):
        assert _parse_tool_spec("agents,claude") == ["agents", "claude"]
        # opencode and codex both collapse to agents; claude stays distinct.
        assert _parse_tool_spec("opencode, codex , claude") == ["agents", "claude"]

    def test_unknown_exits(self):
        with pytest.raises(SystemExit) as exc_info:
            _parse_tool_spec("bogus")
        assert exc_info.value.code == 1


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
        assert 'template = "blank"' in toml_content

        # "Blank means blank": [project] only — no layers, DRC, DFM, or checks,
        # and none of the dead config keys ([build], [project] version). Parse
        # the TOML so prose in comments doesn't trip substring checks.
        import tomllib

        parsed = tomllib.loads(toml_content)
        assert set(parsed) == {"project"}
        assert set(parsed["project"]) == {"name", "template"}

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

        # Blank template ships a minimal components/ scaffold so that
        # `from components import ...` doesn't ModuleNotFoundError.
        components_dir = project_dir / "components"
        assert components_dir.is_dir()
        assert (components_dir / "__init__.py").exists()
        assert (components_dir / "_utils.py").exists()
        assert (components_dir / "_curves.py").exists()
        assert (components_dir / "_tapers.py").exists()
        # No public component modules are pre-seeded.
        assert not (components_dir / "mmi.py").exists()
        assert not (components_dir / "ring.py").exists()
        # The minimal __init__.py has an empty __all__ and no re-exports.
        init_content = (components_dir / "__init__.py").read_text()
        assert "__all__" in init_content
        assert "from components.mmi" not in init_content
        # __pycache__ must not leak into user projects.
        assert not (components_dir / "__pycache__").exists()

    def test_init_uses_dir_name_as_default(self, tmp_path: Path, monkeypatch):
        """rosette init uses directory name for project name."""
        project_dir = tmp_path / "my_project_dir"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("blank", tool="opencode")

        content = (project_dir / "rosette.toml").read_text()
        assert 'name = "my_project_dir"' in content

    def test_init_explicit_name_overrides_dir(self, tmp_path: Path, monkeypatch):
        """An explicit name overrides the directory name and lands in rosette.toml."""
        project_dir = tmp_path / "my_project_dir"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("blank", tool="opencode", name="Fancy Chip")

        content = (project_dir / "rosette.toml").read_text()
        assert 'name = "Fancy Chip"' in content
        assert "my_project_dir" not in content

    def test_init_explicit_name_sanitized(self, tmp_path: Path, monkeypatch):
        """A name with quotes is sanitized so the TOML stays valid."""
        project_dir = tmp_path / "my_project_dir"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("blank", tool="opencode", name='Bad"Name')

        content = (project_dir / "rosette.toml").read_text()
        assert 'name = "BadName"' in content

    def test_init_requires_pyproject_toml(self, tmp_path: Path, monkeypatch):
        """rosette init fails without pyproject.toml when uv is unavailable."""
        monkeypatch.chdir(tmp_path)

        # No uv on PATH -> no bootstrap, fall back to manual recipe + exit 1.
        with patch("rosette.cli.shutil.which", return_value=None):
            with pytest.raises(SystemExit) as exc_info:
                init_project("blank", tool="opencode")
        assert exc_info.value.code == 1

    def test_init_uv_absent_message_mentions_pip(self, tmp_path: Path, monkeypatch, capsys):
        """When uv is missing, the guidance points at the pip + venv flow."""
        monkeypatch.chdir(tmp_path)

        with patch("rosette.cli.shutil.which", return_value=None):
            with pytest.raises(SystemExit):
                init_project("blank", tool="opencode")

        out = capsys.readouterr().out
        assert "pip install librosette" in out
        assert "python -m venv" in out

    def test_init_non_tty_without_yes_does_not_bootstrap(self, tmp_path: Path, monkeypatch):
        """uv present but non-interactive and no --yes: error, no subprocess calls."""
        monkeypatch.chdir(tmp_path)

        with (
            patch("rosette.cli.shutil.which", return_value="/usr/bin/uv"),
            patch("rosette.cli.sys.stdin.isatty", return_value=False),
            patch("rosette.cli.subprocess.run") as mock_run,
        ):
            with pytest.raises(SystemExit) as exc_info:
                init_project("blank", tool="opencode", assume_yes=False)

        assert exc_info.value.code == 1
        mock_run.assert_not_called()

    def test_init_bootstraps_uv_project_with_yes(self, tmp_path: Path, monkeypatch):
        """uv present + assume_yes runs uv init/add + git init, then scaffolds."""
        project_dir = tmp_path / "fresh"
        project_dir.mkdir()
        monkeypatch.chdir(project_dir)

        calls: list[list[str]] = []

        with (
            patch("rosette.cli.shutil.which", return_value="/usr/bin/uv"),
            patch("rosette.cli.subprocess.run", side_effect=_make_fake_run(calls)),
        ):
            init_project("blank", tool="opencode", assume_yes=True)

        assert ["uv", "init", "--bare"] in calls
        assert ["uv", "add", "librosette"] in calls
        assert ["git", "init"] in calls
        assert (project_dir / "rosette.toml").exists()
        assert (project_dir / "AGENTS.md").exists()

    def test_init_bootstrap_no_git(self, tmp_path: Path, monkeypatch):
        """--no-git (git=False) skips git init during bootstrap."""
        project_dir = tmp_path / "fresh"
        project_dir.mkdir()
        monkeypatch.chdir(project_dir)

        calls: list[list[str]] = []

        with (
            patch("rosette.cli.shutil.which", return_value="/usr/bin/uv"),
            patch("rosette.cli.subprocess.run", side_effect=_make_fake_run(calls)),
        ):
            init_project("blank", tool="opencode", assume_yes=True, git=False)

        assert ["git", "init"] not in calls
        assert (project_dir / "rosette.toml").exists()

    def test_init_bootstrap_no_install(self, tmp_path: Path, monkeypatch):
        """--no-install (install=False) skips `uv add librosette` during bootstrap.

        Used in local dev so the project's venv doesn't shadow a rosette on
        PATH. The project still gets `uv init --bare` and is scaffolded.
        """
        project_dir = tmp_path / "fresh"
        project_dir.mkdir()
        monkeypatch.chdir(project_dir)

        calls: list[list[str]] = []

        with (
            patch("rosette.cli.shutil.which", return_value="/usr/bin/uv"),
            patch("rosette.cli.subprocess.run", side_effect=_make_fake_run(calls)),
        ):
            init_project("blank", tool="opencode", assume_yes=True, install=False)

        assert ["uv", "init", "--bare"] in calls
        assert ["uv", "add", "librosette"] not in calls
        assert (project_dir / "rosette.toml").exists()
        assert (project_dir / "AGENTS.md").exists()

    def test_init_bootstrap_skips_git_if_already_repo(self, tmp_path: Path, monkeypatch):
        """git init is skipped when the directory is already a git repo."""
        project_dir = tmp_path / "fresh"
        project_dir.mkdir()
        (project_dir / ".git").mkdir()
        monkeypatch.chdir(project_dir)

        calls: list[list[str]] = []

        with (
            patch("rosette.cli.shutil.which", return_value="/usr/bin/uv"),
            patch("rosette.cli.subprocess.run", side_effect=_make_fake_run(calls)),
        ):
            init_project("blank", tool="opencode", assume_yes=True)

        assert ["git", "init"] not in calls

    def test_init_bootstrap_skips_git_inside_parent_repo(self, tmp_path: Path, monkeypatch):
        """git init is skipped when an ancestor directory is a git repo.

        Running `rosette init subdir` inside an existing repo shouldn't nest a
        new repo. The new dir has no `.git`, but `git rev-parse` reports it is
        inside the parent's work tree.
        """
        monkeypatch.chdir(tmp_path)
        calls: list[list[str]] = []

        def fake_run(cmd, *args, **kwargs):
            from subprocess import CompletedProcess

            calls.append(cmd)
            cwd = Path(kwargs.get("cwd", Path.cwd()))
            if cmd[:3] == ["uv", "init", "--bare"]:
                (cwd / "pyproject.toml").write_text('[project]\nname = "x"\nversion = "0.1.0"\n')
            if cmd[:2] == ["git", "rev-parse"]:
                # Simulate an ancestor repo: always inside a work tree.
                return CompletedProcess(cmd, 0, stdout="true\n", stderr="")
            return CompletedProcess(cmd, 0, stdout="", stderr="")

        with (
            patch("rosette.cli.shutil.which", return_value="/usr/bin/uv"),
            patch("rosette.cli.subprocess.run", side_effect=fake_run),
        ):
            init_project("blank", tool="opencode", assume_yes=True, path="subdir")

        assert ["git", "init"] not in calls

    def test_init_path_creates_new_directory(self, tmp_path: Path, monkeypatch):
        """rosette init <path> creates the dir and scaffolds inside it."""
        monkeypatch.chdir(tmp_path)

        calls: list[list[str]] = []

        with (
            patch("rosette.cli.shutil.which", return_value="/usr/bin/uv"),
            patch(
                "rosette.cli.subprocess.run",
                side_effect=_make_fake_run(calls, project_name="x"),
            ),
        ):
            init_project("blank", tool="opencode", assume_yes=True, path="my-chip")

        project_dir = tmp_path / "my-chip"
        assert project_dir.is_dir()
        assert (project_dir / "rosette.toml").exists()
        # No project files leaked into the parent (cwd).
        assert not (tmp_path / "rosette.toml").exists()
        # Default name comes from the path basename.
        assert 'name = "my-chip"' in (project_dir / "rosette.toml").read_text()

    def test_init_path_bootstrap_runs_in_new_dir(self, tmp_path: Path, monkeypatch):
        """Bootstrap subprocesses run with cwd set to the new directory."""
        monkeypatch.chdir(tmp_path)

        cwds: list[str] = []

        def fake_run(cmd, *args, **kwargs):
            from subprocess import CompletedProcess

            cwds.append(str(kwargs.get("cwd")))
            cwd = Path(kwargs["cwd"])
            if cmd[:3] == ["uv", "init", "--bare"]:
                (cwd / "pyproject.toml").write_text('[project]\nname = "x"\nversion = "0.1.0"\n')
            if cmd[:2] == ["git", "rev-parse"]:
                return CompletedProcess(cmd, 0, stdout="false\n", stderr="")
            return CompletedProcess(cmd, 0, stdout="", stderr="")

        with (
            patch("rosette.cli.shutil.which", return_value="/usr/bin/uv"),
            patch("rosette.cli.subprocess.run", side_effect=fake_run),
        ):
            init_project("blank", tool="opencode", assume_yes=True, path="nested/chip")

        expected = str(tmp_path / "nested" / "chip")
        assert cwds and all(c == expected for c in cwds)

    def test_init_path_with_name_override(self, tmp_path: Path, monkeypatch):
        """--name overrides the project name; the dir still comes from path."""
        monkeypatch.chdir(tmp_path)

        _make_uv_project(tmp_path / "my-chip")

        init_project("blank", tool="opencode", name="Fancy Chip", path="my-chip")

        toml = (tmp_path / "my-chip" / "rosette.toml").read_text()
        assert 'name = "Fancy Chip"' in toml

    def test_init_path_existing_project_errors(self, tmp_path: Path, monkeypatch):
        """rosette init <path> fails if the target is already a rosette project."""
        monkeypatch.chdir(tmp_path)
        target = tmp_path / "my-chip"
        _make_uv_project(target)
        (target / "rosette.toml").write_text('[project]\nname = "x"\n')

        with pytest.raises(SystemExit) as exc_info:
            init_project("blank", tool="opencode", path="my-chip")
        assert exc_info.value.code == 1

    def test_init_path_includes_cd_in_next_steps(self, tmp_path: Path, monkeypatch, capsys):
        """Next-steps output tells the user to cd into the new directory."""
        monkeypatch.chdir(tmp_path)
        _make_uv_project(tmp_path / "my-chip")

        init_project("blank", tool="opencode", path="my-chip")

        out = capsys.readouterr().out
        assert "cd my-chip" in out

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

        # Enriched, realistic silicon-photonics baseline: multi-layer stack,
        # per-layer DRC, and inter-layer rules — exercises DRC out of the box.
        # Assert against parsed structure so comment prose doesn't interfere.
        import tomllib

        parsed = tomllib.loads(toml_content)
        assert {"silicon", "p_doping", "n_doping", "exclusion"} <= set(parsed["layers"])
        assert {"silicon", "p_doping"} <= set(parsed["drc"]["layers"])
        rule_names = {r.get("name") for r in parsed["drc"]["rules"]}
        assert {"PN_SPC", "PN_NOOVLP", "EXCL_KEEPOUT"} <= rule_names
        # DFM is experimental and ships commented-out, so it must not be active.
        assert "dfm" not in parsed
        # Dead config is dropped here too.
        assert "build" not in parsed
        assert "version" not in parsed["project"]

        # AGENTS.md has markers and directive
        agents_content = (project_dir / "AGENTS.md").read_text()
        assert "<!-- BEGIN:rosette-agent-rules -->" in agents_content
        assert "ALWAYS read the reference files" in agents_content

        # Generic template includes components
        components_dir = project_dir / "components"
        assert components_dir.is_dir()
        assert (components_dir / "mmi.py").exists()
        assert (components_dir / "ring.py").exists()
        # __pycache__ must not leak into user projects.
        assert not (components_dir / "__pycache__").exists()

    def test_init_generic_components_import_roundtrip(self, tmp_path: Path, monkeypatch):
        """`from components import mmi` resolves to the *local* copy.

        Shadcn-style components are useless if edits to
        ``components/mmi.py`` in a user project are silently shadowed by
        the installed ``rosette.components`` package. This test runs
        ``rosette init --template generic``, imports ``components``, and
        asserts each public re-export resolves to a function whose
        ``__module__`` lives under the user's ``components`` package --
        not under ``rosette.components``. Regression test for ROS-530.
        """
        project_dir = tmp_path / "my_project"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("generic", tool="opencode")

        # Put the project root at the front of sys.path, import `components`,
        # and verify the public re-exports resolve to the local copies.
        import importlib
        import sys

        sys.path.insert(0, str(project_dir))
        # Evict any prior `components` module from other tests / repo root.
        for mod in list(sys.modules):
            if mod == "components" or mod.startswith("components."):
                del sys.modules[mod]
        try:
            components = importlib.import_module("components")
            for name in ("mmi", "ring", "grating_coupler", "bragg_grating"):
                assert hasattr(components, name), f"components.{name} missing"
                func = getattr(components, name)
                assert callable(func)
                # The re-exports must come from the project-local package,
                # not from the installed rosette.components package.
                assert func.__module__.startswith("components."), (
                    f"components.{name}.__module__ = {func.__module__!r}; "
                    "expected it to live under the project-local `components` package. "
                    "If this fails, `_copy_components` is shipping absolute "
                    "`rosette.components.*` imports verbatim and user edits to "
                    "`components/<x>.py` will be silently ignored."
                )
            # Same check for the submodule form (`from components.mmi import ...`).
            # This also catches transitive imports of `_utils`/`_curves` leaking
            # back to the installed package.
            mmi_mod = importlib.import_module("components.mmi")
            assert mmi_mod.mmi.__module__ == "components.mmi"
            assert mmi_mod.mmi is components.mmi
        finally:
            sys.path.remove(str(project_dir))
            for mod in list(sys.modules):
                if mod == "components" or mod.startswith("components."):
                    del sys.modules[mod]

    def test_init_generic_components_edits_take_effect(self, tmp_path: Path, monkeypatch):
        """Edits to `components/<x>.py` in a user project are honored.

        This is the shadcn-style contract: users should be able to tweak a
        copied component and have their edits drive subsequent imports.
        Regression test for ROS-530 (companion to the __module__ check).
        """
        project_dir = tmp_path / "my_project"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("generic", tool="opencode")

        # Mutate the local copy in a way that doesn't require running the
        # component: add a sentinel attribute. If imports resolve against
        # the installed package, the attribute will be missing.
        mmi_path = project_dir / "components" / "mmi.py"
        mmi_src = mmi_path.read_text()
        mmi_path.write_text(mmi_src + "\n_ROS_530_LOCAL_EDIT = True\n")

        import importlib
        import sys

        sys.path.insert(0, str(project_dir))
        for mod in list(sys.modules):
            if mod == "components" or mod.startswith("components."):
                del sys.modules[mod]
        try:
            mmi = importlib.import_module("components.mmi")
            assert getattr(mmi, "_ROS_530_LOCAL_EDIT", False) is True, (
                "Local edits to components/mmi.py did not take effect -- "
                "imports are resolving against the installed rosette.components package."
            )
        finally:
            sys.path.remove(str(project_dir))
            for mod in list(sys.modules):
                if mod == "components" or mod.startswith("components."):
                    del sys.modules[mod]

    def test_minimal_scaffold_includes_all_primitives(self):
        """Every ``_*.py`` primitive must be in ``_MINIMAL_COMPONENT_FILES``.

        The blank-template scaffold is an explicit allow-list. A blank user
        who copies in any stdlib component (per ``components/__init__.py``)
        may transitively need any primitive -- ``mmi``/``grating_coupler``/
        ``edge_coupler`` import ``_tapers``, several import ``_curves``, all
        import ``_utils``. If a new primitive is extracted but not added to
        the allow-list, blank silently breaks with ``ModuleNotFoundError``
        (this is exactly how ``_tapers`` was missed -- ROS-612). This cheap
        structural guardrail asserts the allow-list stays in sync with the
        actual primitive modules on disk so the failure mode can't recur.
        """
        from rosette.cli import _MINIMAL_COMPONENT_FILES, COMPONENTS_DIR

        primitives = {p.name for p in COMPONENTS_DIR.glob("_*.py") if p.name != "__init__.py"}
        assert primitives, "no `_*.py` primitive modules found in components/"
        missing = primitives - set(_MINIMAL_COMPONENT_FILES)
        assert not missing, (
            f"primitive module(s) {sorted(missing)} are not in "
            "_MINIMAL_COMPONENT_FILES; the blank template scaffold would omit "
            "them and any copied-in component that needs them would fail with "
            "ModuleNotFoundError. Add them to the allow-list in cli.py."
        )

    def test_init_blank_copied_component_using_tapers_imports(self, tmp_path: Path, monkeypatch):
        """A copied stdlib component needing ``_tapers`` imports in a blank project.

        The blank scaffold tells users to add components one file at a time by
        copying from the rosette source tree. A component like ``mmi`` (which
        imports ``_tapers``) must then import cleanly. Regression test for
        ROS-612: blank previously shipped ``_utils`` + ``_curves`` but not
        ``_tapers``, so ``from components import mmi`` raised
        ``ModuleNotFoundError: components._tapers``.
        """
        from rosette.cli import COMPONENTS_DIR, _rewrite_component_imports

        project_dir = tmp_path / "my_project"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("blank", tool="opencode")

        components_dir = project_dir / "components"
        # The minimal scaffold must ship the _tapers primitive.
        assert (components_dir / "_tapers.py").exists()

        # Simulate the user copying in mmi.py (which depends on _tapers). The
        # copied module's body is rewritten exactly as `_copy_components` does
        # (absolute `rosette.components.*` imports -> package-relative).
        stdlib_mmi = (COMPONENTS_DIR / "mmi.py").read_text()
        (components_dir / "mmi.py").write_text(_rewrite_component_imports(stdlib_mmi))
        # Re-export it from the scaffold __init__.py, as the docstring instructs.
        # This line is already project-relative, so no rewrite applies to it.
        init_path = components_dir / "__init__.py"
        init_path.write_text(
            init_path.read_text() + "\nfrom components.mmi import mmi\n\n__all__ = ['mmi']\n"
        )

        import importlib
        import sys

        sys.path.insert(0, str(project_dir))
        for mod in list(sys.modules):
            if mod == "components" or mod.startswith("components."):
                del sys.modules[mod]
        try:
            components = importlib.import_module("components")
            assert hasattr(components, "mmi")
            assert components.mmi.__module__ == "components.mmi"
        finally:
            sys.path.remove(str(project_dir))
            for mod in list(sys.modules):
                if mod == "components" or mod.startswith("components."):
                    del sys.modules[mod]

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
        """rosette init with tool='claude' creates standalone CLAUDE.md."""
        project_dir = tmp_path / "my_project"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("blank", tool="claude")

        assert (project_dir / "CLAUDE.md").exists()
        # AGENTS.md is NOT created for claude tool
        assert not (project_dir / "AGENTS.md").exists()

        # CLAUDE.md contains full instructions with markers
        claude_content = (project_dir / "CLAUDE.md").read_text()
        assert "<!-- BEGIN:rosette-agent-rules -->" in claude_content
        assert "ALWAYS read the reference files" in claude_content

    def test_init_opencode_skills_location(self, tmp_path: Path, monkeypatch):
        """Generic template skills land in .agents/skills for OpenCode."""
        project_dir = tmp_path / "my_project"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("generic", tool="opencode")

        skill = project_dir / ".agents" / "skills" / "layout-design" / "SKILL.md"
        assert skill.exists()
        assert "name: layout-design" in skill.read_text()
        # Not placed in the Claude location.
        assert not (project_dir / ".claude").exists()

    def test_init_claude_skills_location(self, tmp_path: Path, monkeypatch):
        """Generic template skills land in .claude/skills for Claude Code.

        Regression: skills used to ship only under .agents/skills, which
        Claude Code never reads.
        """
        project_dir = tmp_path / "my_project"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("generic", tool="claude")

        skill = project_dir / ".claude" / "skills" / "layout-design" / "SKILL.md"
        assert skill.exists()
        # OpenCode location is not created for a Claude-only project.
        assert not (project_dir / ".agents").exists()

    def test_init_blank_ships_no_skills(self, tmp_path: Path, monkeypatch):
        """Blank template has no skills, so no skills dir is created."""
        project_dir = tmp_path / "my_project"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("blank", tool="opencode")

        assert not (project_dir / ".agents").exists()
        assert not (project_dir / ".claude").exists()

    def test_init_agents_baseline(self, tmp_path: Path, monkeypatch):
        """tool='agents' writes the AGENTS.md standard files."""
        project_dir = tmp_path / "my_project"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("blank", tool="agents")

        assert (project_dir / "AGENTS.md").exists()
        assert not (project_dir / "CLAUDE.md").exists()

    def test_init_codex_alias_maps_to_agents(self, tmp_path: Path, monkeypatch):
        """Codex/Cursor aliases resolve to the AGENTS.md standard (no separate files)."""
        for alias in ("codex", "cursor", "opencode"):
            project_dir = tmp_path / f"proj_{alias}"
            _make_uv_project(project_dir)
            monkeypatch.chdir(project_dir)

            init_project("generic", tool=alias)

            # All aliases produce identical AGENTS.md + .agents/skills output.
            assert (project_dir / "AGENTS.md").exists()
            assert (project_dir / ".agents" / "skills" / "layout-design" / "SKILL.md").exists()
            assert not (project_dir / "CLAUDE.md").exists()
            assert not (project_dir / ".cursor").exists()
            assert not (project_dir / ".codex").exists()

    def test_init_multiple_harnesses(self, tmp_path: Path, monkeypatch):
        """A comma-separated --tool spec writes files for every selected harness."""
        project_dir = tmp_path / "my_project"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("generic", tool="agents,claude")

        # Both instruction files and both skills dirs are present.
        assert (project_dir / "AGENTS.md").exists()
        assert (project_dir / "CLAUDE.md").exists()
        assert (project_dir / ".agents" / "skills" / "layout-design" / "SKILL.md").exists()
        assert (project_dir / ".claude" / "skills" / "layout-design" / "SKILL.md").exists()

    def test_init_dedupes_alias_and_canonical(self, tmp_path: Path, monkeypatch):
        """opencode + codex + agents all collapse to one 'agents' harness."""
        project_dir = tmp_path / "my_project"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("blank", tool="opencode,codex,agents")

        assert (project_dir / "AGENTS.md").exists()
        assert not (project_dir / "CLAUDE.md").exists()

    def test_init_unknown_tool_errors(self, tmp_path: Path, monkeypatch, capsys):
        """An unrecognized tool name exits with an error listing valid options."""
        project_dir = tmp_path / "my_project"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        with pytest.raises(SystemExit) as exc_info:
            init_project("blank", tool="bogus")
        assert exc_info.value.code == 1
        captured = capsys.readouterr()
        assert "Unknown tool: bogus" in captured.out

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
        # Rosette entries appended under their section header
        assert ".rosette/" in gitignore
        assert "output/*.gds" in gitignore
        assert "# Rosette" in gitignore
        # The uv project already had .venv/, __pycache__/, *.py[cod], so those
        # are not duplicated. But .env is new (it lives under the Python / uv
        # section in the rosette template), so that section header is retained
        # to carry the new pattern.
        assert gitignore.count(".venv/") == 1
        assert ".env" in gitignore
        assert "# Python / uv" in gitignore

    def test_append_gitignore_partial_overlap(self, tmp_path: Path):
        """A section with some pre-existing patterns keeps its header and only
        the new patterns; sections fully covered are dropped."""
        from rosette.cli import _append_gitignore

        src = tmp_path / "template_gitignore"
        src.write_text(
            "# Python / uv\n.venv/\n__pycache__/\n*.py[cod]\n\n# Rosette\n.rosette/\noutput/*.gds\n"
        )
        dest = tmp_path / ".gitignore"
        # Pre-existing file already has .venv/ but not the other Python entries.
        dest.write_text("# Existing\n.venv/\n")

        _append_gitignore(src, dest)
        result = dest.read_text()

        # .venv/ not duplicated; the new Python patterns are added under their
        # header (section retained because it still has new patterns).
        assert result.count(".venv/") == 1
        assert "# Python / uv" in result
        assert "__pycache__/" in result
        assert "*.py[cod]" in result
        # Rosette section fully new.
        assert "# Rosette" in result
        assert ".rosette/" in result


class TestRewriteComponentImports:
    """Tests for `_rewrite_component_imports` (see ROS-530).

    The rewriter is what makes copied components self-contained. Without
    it, `from components import mmi` in a user project resolves
    against the installed `rosette.components` package instead of the
    local copy.
    """

    def test_rewrites_submodule_imports(self):
        from rosette.cli import _rewrite_component_imports

        src = "from rosette.components._utils import safe_cell_name\n"
        assert _rewrite_component_imports(src) == "from ._utils import safe_cell_name\n"

    def test_rewrites_init_reexports(self):
        from rosette.cli import _rewrite_component_imports

        src = "from rosette.components.mmi import mmi\n"
        assert _rewrite_component_imports(src) == "from .mmi import mmi\n"

    def test_rewrites_from_package_import(self):
        """`from rosette.components import X` -> `from . import X`."""
        from rosette.cli import _rewrite_component_imports

        src = "from rosette.components import mmi\n"
        assert _rewrite_component_imports(src) == "from . import mmi\n"

    def test_leaves_core_rosette_import_alone(self):
        """`from rosette import ...` points at the core package and must not be touched."""
        from rosette.cli import _rewrite_component_imports

        src = "from rosette import Cell, Layer, Point\n"
        assert _rewrite_component_imports(src) == src

    def test_leaves_indented_docstring_examples_alone(self):
        """Docstring examples teach the installed-package import path; leave them."""
        from rosette.cli import _rewrite_component_imports

        src = (
            '"""My docstring.\n\n'
            "Example::\n\n"
            "    >>> from rosette.components import mmi\n"
            "    >>> mmi(...)\n"
            '"""\n'
        )
        assert _rewrite_component_imports(src) == src

    def test_preserves_other_lines_verbatim(self):
        from rosette.cli import _rewrite_component_imports

        src = (
            "from rosette import Cell\n"
            "from rosette.components._utils import safe_cell_name\n"
            "\n"
            "def f(): pass\n"
        )
        expected = "from rosette import Cell\nfrom ._utils import safe_cell_name\n\ndef f(): pass\n"
        assert _rewrite_component_imports(src) == expected

    def test_raises_on_unsupported_import_form(self):
        """`import rosette.components` at column 0 must raise, not silently ship."""
        from rosette.cli import _rewrite_component_imports

        with pytest.raises(RuntimeError, match="unsupported import form"):
            _rewrite_component_imports("import rosette.components.mmi\n")

        with pytest.raises(RuntimeError, match="unsupported import form"):
            _rewrite_component_imports("import rosette.components\n")


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

    def test_update_refreshes_skills(self, tmp_path: Path, monkeypatch):
        """rosette update restores a deleted skill into the harness skills dir."""
        project_dir = tmp_path / "test"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("generic", tool="claude")

        skill = project_dir / ".claude" / "skills" / "layout-design" / "SKILL.md"
        assert skill.exists()
        skill.unlink()

        update_project()

        assert skill.exists()
        assert "name: layout-design" in skill.read_text()

    def test_update_restores_deleted_instruction_via_skills_dir(self, tmp_path: Path, monkeypatch):
        """A harness stays configured (and its instruction file is restored) as
        long as its skills dir survives -- deleting only CLAUDE.md doesn't drop it."""
        project_dir = tmp_path / "test"
        _make_uv_project(project_dir)
        monkeypatch.chdir(project_dir)

        init_project("generic", tool="agents,claude")

        # Delete the Claude instruction file but leave .claude/skills/ in place.
        (project_dir / "CLAUDE.md").unlink()
        assert (project_dir / ".claude" / "skills").is_dir()

        update_project()

        # Claude is still recognized via its skills dir and the file is restored.
        restored = project_dir / "CLAUDE.md"
        assert restored.exists()
        assert "<!-- BEGIN:rosette-agent-rules -->" in restored.read_text()

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

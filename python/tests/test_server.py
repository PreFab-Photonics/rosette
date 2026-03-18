"""Tests for rosette._server module."""

import json
import threading
import time
from urllib.request import Request, urlopen

import pytest

from rosette._server import RosetteHandler, RosetteServer


@pytest.fixture(autouse=True)
def reset_handler_state():
    """Reset class-level handler state between tests."""
    RosetteHandler.design_json = None
    RosetteHandler.design_cells = None
    RosetteHandler.design_layers = None
    RosetteHandler.design_filename = None
    RosetteHandler.design_version = 0
    RosetteHandler.design_source_map = None
    RosetteHandler.design_child_source_maps = None
    RosetteHandler.design_cell_vars = None
    RosetteHandler.webapp_dir = None
    yield


@pytest.fixture
def webapp_dir(tmp_path):
    """Create a minimal webapp directory with index.html."""
    webapp = tmp_path / "webapp"
    webapp.mkdir()
    (webapp / "index.html").write_text("<html><body>test</body></html>")
    (webapp / "style.css").write_text("body { color: red; }")
    assets = webapp / "assets"
    assets.mkdir()
    (assets / "app.js").write_text("console.log('hello');")
    return webapp


@pytest.fixture
def server(webapp_dir):
    """Start a RosetteServer in the background and yield (server, base_url)."""
    import socket

    # Find a truly free port by letting the OS assign one
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("", 0))
        free_port = s.getsockname()[1]

    srv = RosetteServer(webapp_dir, port=free_port)
    _, actual_port = srv.start_background()
    base_url = f"http://localhost:{actual_port}"
    # Give the server a moment to start accepting connections
    time.sleep(0.1)
    yield srv, base_url
    srv.shutdown()


def _get(url: str, timeout: float = 5) -> tuple[int, bytes, dict]:
    """Helper: GET a URL, return (status, body, headers)."""
    req = Request(url)
    resp = urlopen(req, timeout=timeout)
    return resp.status, resp.read(), dict(resp.headers)


def _post(url: str, data: dict, timeout: float = 5) -> tuple[int, bytes]:
    """Helper: POST JSON to a URL, return (status, body)."""
    body = json.dumps(data).encode("utf-8")
    req = Request(url, data=body, headers={"Content-Type": "application/json"})
    resp = urlopen(req, timeout=timeout)
    return resp.status, resp.read()


class TestStaticFileServing:
    """Test serving static files from the webapp directory."""

    def test_serves_index_html_at_root(self, server):
        _, base_url = server
        status, body, _ = _get(base_url + "/")
        assert status == 200
        assert b"<html>" in body

    def test_serves_css_file(self, server):
        _, base_url = server
        status, body, headers = _get(base_url + "/style.css")
        assert status == 200
        assert b"color: red" in body
        assert "text/css" in headers.get("Content-Type", "")

    def test_serves_nested_file(self, server):
        _, base_url = server
        status, body, _ = _get(base_url + "/assets/app.js")
        assert status == 200
        assert b"console.log" in body

    def test_spa_fallback_for_unknown_routes(self, server):
        """Unknown routes should serve index.html (SPA behavior)."""
        _, base_url = server
        status, body, _ = _get(base_url + "/some/unknown/route")
        assert status == 200
        assert b"<html>" in body

    def test_cors_headers_present(self, server):
        _, base_url = server
        _, _, headers = _get(base_url + "/")
        assert headers.get("Access-Control-Allow-Origin") == "*"


class TestDesignAPI:
    """Test the /api/design endpoint."""

    def test_empty_design(self, server):
        _, base_url = server
        status, body, _ = _get(base_url + "/api/design")
        assert status == 200
        data = json.loads(body)
        assert data["version"] == 0
        assert data["json"] is None

    def test_design_after_set(self, server):
        srv, base_url = server
        design_json = '{"cells": []}'
        cells = {"name": "top", "children": []}
        layers = [{"id": 1, "name": "silicon"}]
        srv.set_design_json(
            design_json,
            cells=cells,
            layers=layers,
            filename="test.py",
        )

        status, body, _ = _get(base_url + "/api/design")
        assert status == 200
        data = json.loads(body)
        assert data["version"] == 1
        assert data["json"] == design_json
        assert data["cells"] == cells
        assert data["layers"] == layers
        assert data["filename"] == "test.py"

    def test_version_increments(self, server):
        srv, base_url = server
        srv.set_design_json('{"v": 1}')
        srv.set_design_json('{"v": 2}')
        srv.set_design_json('{"v": 3}')

        _status, body, _ = _get(base_url + "/api/design")
        data = json.loads(body)
        assert data["version"] == 3
        assert data["json"] == '{"v": 3}'

    def test_source_map_included(self, server):
        srv, base_url = server
        source_map = [{"file": "test.py", "line": 1, "type": "polygon"}]
        srv.set_design_json("{}", source_map=source_map)

        _status, body, _ = _get(base_url + "/api/design")
        data = json.loads(body)
        assert data["source_map"] == source_map

    def test_no_cache_headers(self, server):
        _, base_url = server
        _, _, headers = _get(base_url + "/api/design")
        assert "no-cache" in headers.get("Cache-Control", "")


class TestSSE:
    """Test the Server-Sent Events endpoint."""

    def test_sse_initial_event(self, server):
        """SSE should send the current design state immediately on connect."""
        srv, base_url = server
        srv.set_design_json('{"initial": true}', filename="sse_test.py")

        # Open SSE connection manually
        req = Request(base_url + "/api/design/events")
        resp = urlopen(req, timeout=5)
        assert resp.status == 200
        assert "text/event-stream" in resp.headers.get("Content-Type", "")

        # Read the initial event
        lines = []
        for raw_line in resp:
            line = raw_line.decode("utf-8").strip()
            lines.append(line)
            if line == "":  # Empty line marks end of SSE event
                break

        # Parse the SSE event
        event_type = None
        event_data = None
        for line in lines:
            if line.startswith("event: "):
                event_type = line[7:]
            elif line.startswith("data: "):
                event_data = json.loads(line[6:])

        assert event_type == "design"
        assert event_data is not None
        assert event_data["json"] == '{"initial": true}'
        assert event_data["filename"] == "sse_test.py"
        resp.close()

    def test_sse_receives_update(self, server):
        """SSE should receive updates when design changes."""
        srv, base_url = server
        srv.set_design_json('{"v": 0}')

        req = Request(base_url + "/api/design/events")
        resp = urlopen(req, timeout=5)

        # Read initial event
        for raw_line in resp:
            if raw_line.decode("utf-8").strip() == "":
                break

        # Update the design from another thread
        def update():
            time.sleep(0.2)
            srv.set_design_json('{"v": 1}', filename="updated.py")

        t = threading.Thread(target=update)
        t.start()

        # Read the update event
        lines = []
        for raw_line in resp:
            line = raw_line.decode("utf-8").strip()
            lines.append(line)
            if line == "" and any(x.startswith("data:") for x in lines):
                break

        t.join(timeout=5)

        event_data = None
        for line in lines:
            if line.startswith("data: "):
                event_data = json.loads(line[6:])

        assert event_data is not None
        assert event_data["json"] == '{"v": 1}'
        assert event_data["filename"] == "updated.py"
        resp.close()


class TestCORSPreflight:
    """Test CORS OPTIONS handling."""

    def test_options_returns_200(self, server):
        _, base_url = server
        req = Request(base_url + "/api/design", method="OPTIONS")
        resp = urlopen(req, timeout=5)
        assert resp.status == 200
        assert resp.headers.get("Access-Control-Allow-Origin") == "*"
        assert "GET" in resp.headers.get("Access-Control-Allow-Methods", "")


class TestRosetteServer:
    """Test the RosetteServer wrapper class."""

    def test_set_design_json_updates_handler(self, webapp_dir):
        srv = RosetteServer(webapp_dir)
        srv.set_design_json('{"test": true}', filename="test.py")

        assert RosetteHandler.design_json == '{"test": true}'
        assert RosetteHandler.design_filename == "test.py"
        assert RosetteHandler.design_version == 1

    def test_set_design_with_all_fields(self, webapp_dir):
        srv = RosetteServer(webapp_dir)
        source_map = [{"file": "a.py", "line": 1}]
        child_maps = {"child": [{"file": "b.py", "line": 2}]}
        cell_vars = {"top": {"var_name": "design", "file": "a.py", "line": 1}}

        srv.set_design_json(
            "{}",
            cells={"name": "top", "children": []},
            layers=[{"id": 1}],
            filename="full.py",
            source_map=source_map,
            child_source_maps=child_maps,
            cell_vars=cell_vars,
        )

        assert RosetteHandler.design_source_map == source_map
        assert RosetteHandler.design_child_source_maps == child_maps
        assert RosetteHandler.design_cell_vars == cell_vars

    def test_get_design_version(self, webapp_dir):
        srv = RosetteServer(webapp_dir)
        assert srv.get_design_version() == 0
        srv.set_design_json("{}")
        assert srv.get_design_version() == 1
        srv.set_design_json("{}")
        assert srv.get_design_version() == 2

    def test_find_available_port(self, webapp_dir):
        srv = RosetteServer(webapp_dir, port=19273)
        port = srv.find_available_port()
        assert port >= 19273

    def test_shutdown_without_start(self, webapp_dir):
        """Shutdown should be safe to call even if server never started."""
        srv = RosetteServer(webapp_dir)
        srv.shutdown()  # Should not raise


class TestPathTraversal:
    """Test that path traversal attacks are blocked."""

    def test_path_traversal_blocked(self, server):
        """Attempting to escape webapp_dir should return 403 Forbidden."""
        from urllib.error import HTTPError

        _, base_url = server
        with pytest.raises(HTTPError) as exc_info:
            _get(base_url + "/../../../etc/passwd")
        assert exc_info.value.code == 403

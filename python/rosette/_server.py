"""HTTP server for rosette serve command.

This module provides a simple HTTP server that:
1. Serves the bundled web application
2. Provides an API endpoint for design JSON
3. Supports live-reload via Server-Sent Events (SSE)
"""

import http.server
import json
import logging
import mimetypes
import socket
import socketserver
import sys
import threading
from collections.abc import Callable
from pathlib import Path
from urllib.parse import urlparse

log = logging.getLogger("rosette.server")


class ThreadingTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    """TCPServer with threading support for concurrent connections."""

    daemon_threads = True  # Threads die when main thread exits
    allow_reuse_address = True

    def handle_error(self, request, client_address):
        """Suppress noisy connection reset errors from browser refreshes."""
        exc_type = sys.exc_info()[0]
        if exc_type in (BrokenPipeError, ConnectionResetError):
            # Browser closed connection (refresh, tab close, etc.) - ignore
            return
        # Log other errors normally
        super().handle_error(request, client_address)


class RosetteHandler(http.server.BaseHTTPRequestHandler):
    """HTTP request handler for rosette serve."""

    # Class-level state shared across all handlers
    webapp_dir: Path | None = None
    design_json: str | None = None
    design_cells: dict | None = None  # Hierarchy tree: {name, children}
    design_layers: list[dict] | None = None  # Layer definitions from rosette.toml
    design_filename: str | None = None  # Source filename (e.g., "layout.py" or "mmi.gds")
    design_version: int = 0
    design_source_map: list[dict | None] | None = None  # Source map for two-way editing
    design_child_source_maps: dict | None = None  # {cell_name: [source, ...]} for child cells
    design_cell_vars: dict | None = None  # {cell_name: {var_name, file, line}} for cell definitions
    on_error: Callable[[str], None] | None = None

    # Condition variable for SSE notifications
    _condition: threading.Condition = threading.Condition()

    def log_message(self, format: str, *args) -> None:
        """Suppress default logging."""
        pass

    def send_cors_headers(self) -> None:
        """Send CORS headers for local development."""
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self) -> None:
        """Handle CORS preflight requests."""
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def do_GET(self) -> None:
        """Handle GET requests."""
        parsed = urlparse(self.path)
        path = parsed.path

        # SSE endpoint for live design updates
        if path == "/api/design/events":
            self.handle_design_events()
            return

        # API endpoint for design JSON (kept for backwards compatibility)
        if path == "/api/design":
            self.handle_design_api()
            return

        # Static file serving for web app
        self.handle_static_file(path)

    def do_POST(self) -> None:
        """Handle POST requests."""
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/design/edit":
            self.handle_edit()
            return

        self.send_error(404, "Not Found")

    def handle_edit(self) -> None:
        """Handle POST /api/design/edit — patch source code from the viewer.

        Two paths:
        - Semantic ops (has "op" field): dispatched to SemanticPatcher with libcst.
        - Raw line replacement (no "op" field, has "new_code"): uses CodePatcher
          for the SourceSection inline code editor.

        Response: {"ok": true} on success, {"ok": false, "error": "..."} on failure.
        """
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            data = json.loads(body)
            op_type = data.get("op")

            if op_type:
                # Semantic operation — dispatch to SemanticPatcher
                self._handle_semantic_edit(op_type, data)
            else:
                # Raw line replacement (SourceSection editor)
                self._handle_raw_edit(data)

        except (json.JSONDecodeError, ValueError) as e:
            log.error("handle_edit JSON/value error: %s", e)
            self.send_error(400, f"Invalid request: {e}")
        except Exception as e:
            log.exception("handle_edit unexpected error")
            self.send_error(500, f"Internal error: {e}")

    def _handle_semantic_edit(self, op_type: str, data: dict) -> None:
        """Dispatch a semantic edit operation to SemanticPatcher."""
        from rosette._patcher import (
            AddCell,
            AddElement,
            AddRef,
            DeleteCell,
            DeleteElement,
            ModifyLayer,
            ModifyPathWidth,
            ModifyVertices,
            MoveRef,
            SemanticPatcher,
        )

        op_map = {
            "modify_vertices": lambda d: ModifyVertices(
                file=d["file"], line=d["line"],
                old_code=d.get("old_code"), vertices=d["vertices"],
            ),
            "modify_layer": lambda d: ModifyLayer(
                file=d["file"], line=d["line"],
                old_code=d.get("old_code"), layer=d["layer"], datatype=d.get("datatype", 0),
            ),
            "delete_element": lambda d: DeleteElement(
                file=d["file"], line=d["line"], old_code=d.get("old_code"),
            ),
            "add_element": lambda d: AddElement(
                file=d["file"], after_line=d["after_line"],
                element_type=d.get("element_type", "polygon"),
                vertices=d["vertices"], layer=d["layer"],
                datatype=d.get("datatype", 0), width=d.get("width"),
                cell_var=d.get("cell_var", "cell"),
            ),
            "modify_path_width": lambda d: ModifyPathWidth(
                file=d["file"], line=d["line"],
                old_code=d.get("old_code"), width=d["width"],
            ),
            "move_ref": lambda d: MoveRef(
                file=d["file"], line=d["line"],
                old_code=d.get("old_code"), dx=d["dx"], dy=d["dy"],
            ),
            "add_cell": lambda d: AddCell(
                file=d["file"], def_after_line=d["def_after_line"],
                ref_after_line=d["ref_after_line"],
                cell_name=d["cell_name"], parent_var=d["parent_var"],
            ),
            "add_ref": lambda d: AddRef(
                file=d["file"], after_line=d["after_line"],
                cell_name=d["cell_name"], parent_var=d["parent_var"],
                transform=d["transform"],
            ),
            "delete_cell": lambda d: DeleteCell(
                file=d["file"], cell_name=d["cell_name"],
                var_name=d["var_name"],
            ),
        }

        builder = op_map.get(op_type)
        if not builder:
            self.send_error(400, f"Unknown operation: {op_type}")
            return

        try:
            op = builder(data)
        except KeyError as e:
            self.send_error(400, f"Missing required field: {e}")
            return

        patcher = SemanticPatcher()
        result = patcher.apply(op)

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_cors_headers()
        self.end_headers()

        if result.success:
            self.wfile.write(json.dumps({"ok": True}).encode("utf-8"))
        else:
            self.wfile.write(
                json.dumps({"ok": False, "error": result.error}).encode("utf-8")
            )

    def _handle_raw_edit(self, data: dict) -> None:
        """Handle a raw line-replacement edit from the SourceSection editor."""
        file_path = data.get("file")
        line = data.get("line")
        new_code = data.get("new_code")

        if not file_path or not line or not new_code:
            self.send_error(400, "Missing required fields: file, line, new_code")
            return

        from rosette._patcher import CodePatcher

        patcher = CodePatcher()
        success = patcher.patch_line(
            file_path, line, old_code=data.get("old_code"), new_code=new_code
        )

        if success:
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({"ok": True}).encode("utf-8"))
        else:
            self.send_error(
                409, "Patch failed — source may have changed since last reload"
            )

    def handle_design_events(self) -> None:
        """Handle SSE endpoint for live design updates.

        Clients connect to /api/design/events and receive:
        - Immediate: current design state
        - On change: updated design state
        - Every 15s: keepalive comment (to detect dead connections)
        """
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Connection", "keep-alive")
        self.send_header("X-Accel-Buffering", "no")  # Disable proxy buffering
        self.send_cors_headers()
        self.end_headers()

        # Send initial state immediately
        last_version = self.__class__.design_version
        self._send_sse_event(
            "design",
            {
                "version": last_version,
                "json": self.__class__.design_json,
                "cells": self.__class__.design_cells,
                "source_map": self.__class__.design_source_map,
                "child_source_maps": self.__class__.design_child_source_maps,
                "cell_vars": self.__class__.design_cell_vars,
                "layers": self.__class__.design_layers,
                "filename": self.__class__.design_filename,
            },
        )

        try:
            while True:
                # Wait for change notification or timeout (for keepalive)
                with self.__class__._condition:
                    # Wait up to 15 seconds for a change
                    self.__class__._condition.wait(timeout=15)

                current_version = self.__class__.design_version
                if current_version != last_version:
                    # Design changed - send update
                    self._send_sse_event(
                        "design",
                        {
                            "version": current_version,
                            "json": self.__class__.design_json,
                            "cells": self.__class__.design_cells,
                            "source_map": self.__class__.design_source_map,
                            "child_source_maps": self.__class__.design_child_source_maps,
                            "cell_vars": self.__class__.design_cell_vars,
                            "layers": self.__class__.design_layers,
                            "filename": self.__class__.design_filename,
                        },
                    )
                    last_version = current_version
                else:
                    # Timeout - send keepalive comment
                    self.wfile.write(b": keepalive\n\n")
                    self.wfile.flush()

        except (BrokenPipeError, ConnectionResetError, OSError):
            # Client disconnected - exit gracefully
            pass

    def _send_sse_event(self, event_type: str, data: dict) -> None:
        """Send an SSE event to the client."""
        self.wfile.write(f"event: {event_type}\n".encode())
        self.wfile.write(f"data: {json.dumps(data)}\n\n".encode())
        self.wfile.flush()

    def handle_design_api(self) -> None:
        """Handle /api/design endpoint (legacy polling, kept for compatibility)."""
        response = {
            "version": self.__class__.design_version,
            "json": self.__class__.design_json,
            "cells": self.__class__.design_cells,
            "source_map": self.__class__.design_source_map,
            "child_source_maps": self.__class__.design_child_source_maps,
            "layers": self.__class__.design_layers,
            "filename": self.__class__.design_filename,
        }

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_cors_headers()
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.end_headers()
        self.wfile.write(json.dumps(response).encode("utf-8"))

    def handle_static_file(self, path: str) -> None:
        """Serve static files from webapp directory."""
        webapp_dir = self.__class__.webapp_dir
        if webapp_dir is None:
            self.send_error(500, "Web app directory not configured")
            return

        # Default to index.html
        if path == "/" or path == "":
            path = "/index.html"

        # Remove leading slash and resolve path
        file_path = webapp_dir / path.lstrip("/")

        # Security: ensure path is within webapp_dir
        try:
            file_path = file_path.resolve()
            if not str(file_path).startswith(str(webapp_dir.resolve())):
                self.send_error(403, "Forbidden")
                return
        except (ValueError, OSError):
            self.send_error(404, "Not Found")
            return

        # Check if file exists
        if not file_path.exists() or not file_path.is_file():
            # SPA fallback: serve index.html for unknown routes
            file_path = webapp_dir / "index.html"
            if not file_path.exists():
                self.send_error(404, "Not Found")
                return

        # Serve the file
        try:
            content = file_path.read_bytes()
            content_type, _ = mimetypes.guess_type(str(file_path))
            if content_type is None:
                content_type = "application/octet-stream"

            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(content)))
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(content)
        except OSError as e:
            self.send_error(500, f"Error reading file: {e}")


class RosetteServer:
    """HTTP server for rosette serve command.

    Serves the web application and provides an API endpoint for design JSON.

    Usage:
        server = RosetteServer(webapp_dir, port=5173)
        server.set_design_json(json_str)
        server.start()  # Blocking
        # or
        thread = server.start_background()
    """

    def __init__(self, webapp_dir: Path, port: int = 5173) -> None:
        """Initialize the server.

        Args:
            webapp_dir: Path to the bundled web application
            port: Port to listen on (default: 5173)
        """
        self.webapp_dir = webapp_dir
        self.port = port
        self._httpd: socketserver.TCPServer | None = None
        self._thread: threading.Thread | None = None

    def set_design_json(
        self,
        json_str: str,
        cells: dict | None = None,
        layers: list[dict] | None = None,
        filename: str | None = None,
        source_map: list[dict | None] | None = None,
        child_source_maps: dict | None = None,
        cell_vars: dict | None = None,
    ) -> None:
        """Update the design JSON and increment version.

        Args:
            json_str: JSON string of the serialized library
            cells: Optional cell hierarchy tree: {name, children}
            layers: Optional layer definitions from rosette.toml (LayerMap.to_dict_list())
            filename: Optional source filename (e.g., "layout.py" or "mmi.gds")
            source_map: Optional source map for two-way editing (indexed by element position)
            child_source_maps: Optional {cell_name: [source, ...]} for child cell elements
            cell_vars: Optional {cell_name: {var_name, file, line}} for cell definitions
        """
        RosetteHandler.design_json = json_str
        RosetteHandler.design_cells = cells
        RosetteHandler.design_layers = layers
        RosetteHandler.design_filename = filename
        RosetteHandler.design_source_map = source_map
        RosetteHandler.design_child_source_maps = child_source_maps
        RosetteHandler.design_cell_vars = cell_vars
        RosetteHandler.design_version += 1

        # Notify all SSE connections of the change
        with RosetteHandler._condition:
            RosetteHandler._condition.notify_all()

    def get_design_version(self) -> int:
        """Get the current design version number."""
        return RosetteHandler.design_version

    def start(self) -> None:
        """Start the server (blocking).

        This method blocks until the server is shut down.
        """
        # Configure handler
        RosetteHandler.webapp_dir = self.webapp_dir

        with ThreadingTCPServer(("", self.port), RosetteHandler) as httpd:
            self._httpd = httpd
            httpd.serve_forever()

    def _is_port_available(self, port: int) -> bool:
        """Check if a port is available on both IPv4 and IPv6."""
        # Check IPv4
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(("127.0.0.1", port))
        except OSError:
            return False

        # Check IPv6 (if available)
        try:
            with socket.socket(socket.AF_INET6, socket.SOCK_STREAM) as s:
                s.bind(("::1", port))
        except OSError:
            # Could be IPv6 not available, or port in use
            # Try to distinguish by checking if IPv6 is supported
            try:
                with socket.socket(socket.AF_INET6, socket.SOCK_STREAM) as s:
                    s.bind(("::1", 0))  # Bind to any port
                # IPv6 works, so port must be in use
                return False
            except OSError:
                # IPv6 not available on this system, that's fine
                pass

        return True

    def find_available_port(self, max_attempts: int = 10) -> int:
        """Find an available port, starting from self.port.

        Args:
            max_attempts: Maximum number of ports to try

        Returns:
            An available port number

        Raises:
            OSError: If no available port is found within max_attempts
        """
        for i in range(max_attempts):
            port = self.port + i
            if self._is_port_available(port):
                return port
        raise OSError(f"No available port found (tried {self.port}-{self.port + max_attempts - 1})")

    def start_background(self) -> tuple[threading.Thread, int]:
        """Start the server in a background thread.

        Automatically finds an available port if the requested port is in use.

        Returns:
            Tuple of (thread, actual_port) where actual_port may differ from
            the originally requested port if it was in use.

        Raises:
            OSError: If no available port is found after 10 attempts
        """
        actual_port = self.find_available_port()
        self.port = actual_port

        self._thread = threading.Thread(target=self.start, daemon=True)
        self._thread.start()
        return self._thread, actual_port

    def shutdown(self) -> None:
        """Shut down the server."""
        if self._httpd is not None:
            self._httpd.shutdown()

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
from urllib.parse import parse_qs, urlparse

log = logging.getLogger("rosette.server")

_TRUSTED_NATIVE_ORIGINS = {
    "tauri://localhost",
    "http://tauri.localhost",
    "https://tauri.localhost",
}
_VIEWER_PROTOCOL = 1


class ThreadingTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    """TCPServer with threading support for concurrent connections."""

    daemon_threads = True  # Threads die when main thread exits
    allow_reuse_address = True

    def handle_error(
        self,
        request: socket.socket | tuple[bytes, socket.socket],
        client_address: tuple[str, int],
    ) -> None:
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
    design_cells: dict[str, object] | None = None  # Hierarchy tree: {name, children}
    design_layers: list[dict[str, object]] | None = None  # Layer definitions from rosette.toml
    design_filename: str | None = None  # Source filename (e.g., "layout.py" or "mmi.gds")
    design_source: dict[str, object] | None = None  # Authoritative external source, if any
    design_drc: dict[str, object] | None = (
        None  # DRC result: {violations, error_count, ...} or None
    )
    design_version: int = 0
    on_error: Callable[[str], None] | None = None

    # Condition variable for SSE notifications
    _condition: threading.Condition = threading.Condition()

    def log_message(self, format: str, *args: object) -> None:
        """Suppress default logging."""
        pass

    def send_cors_headers(self) -> None:
        """Allow API reads from the bundled native viewer only."""
        origin = self.headers.get("Origin")
        if origin is not None and self.request_origin_allowed():
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def request_origin_allowed(self) -> bool:
        """Reject browser cross-origin API reads outside the native viewer."""
        origin = self.headers.get("Origin")
        if origin is None or origin in _TRUSTED_NATIVE_ORIGINS:
            return True
        parsed = urlparse(origin)
        host = self.headers.get("Host")
        return (
            parsed.scheme == "http"
            and parsed.netloc == host
            and parsed.hostname in {"localhost", "127.0.0.1", "::1"}
        )

    @classmethod
    def design_payload(cls) -> dict[str, object]:
        """Build the current design envelope shared by GET and SSE."""
        return {
            "viewerProtocol": _VIEWER_PROTOCOL,
            "version": cls.design_version,
            "json": cls.design_json,
            "cells": cls.design_cells,
            "layers": cls.design_layers,
            "filename": cls.design_filename,
            "source": cls.design_source,
            "drc": cls.design_drc,
        }

    def do_OPTIONS(self) -> None:
        """Handle CORS preflight requests."""
        if not self.request_origin_allowed():
            self.send_error(403, "Forbidden origin")
            return
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def do_GET(self) -> None:
        """Handle GET requests."""
        parsed = urlparse(self.path)
        path = parsed.path

        if path.startswith("/api/") and not self.request_origin_allowed():
            self.send_error(403, "Forbidden origin")
            return

        # SSE endpoint for live design updates
        if path == "/api/design/events":
            protocol = parse_qs(parsed.query).get("viewerProtocol")
            if protocol != [str(_VIEWER_PROTOCOL)]:
                self.send_error(409, "Incompatible viewer protocol")
                return
            self.handle_design_events()
            return

        # API endpoint for design JSON (kept for backwards compatibility)
        if path == "/api/design":
            self.handle_design_api()
            return

        # Static file serving for web app
        self.handle_static_file(path)

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
            self.__class__.design_payload(),
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
                        self.__class__.design_payload(),
                    )
                    last_version = current_version
                else:
                    # Timeout - send keepalive comment
                    self.wfile.write(b": keepalive\n\n")
                    self.wfile.flush()

        except (BrokenPipeError, ConnectionResetError, OSError):
            # Client disconnected - exit gracefully
            pass

    def _send_sse_event(self, event_type: str, data: dict[str, object]) -> None:
        """Send an SSE event to the client."""
        self.wfile.write(f"event: {event_type}\n".encode())
        self.wfile.write(f"data: {json.dumps(data)}\n\n".encode())
        self.wfile.flush()

    def handle_design_api(self) -> None:
        """Handle /api/design endpoint (legacy polling, kept for compatibility)."""
        response = self.__class__.design_payload()

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
        json_str: str | None,
        cells: dict[str, object] | None = None,
        layers: list[dict[str, object]] | None = None,
        filename: str | None = None,
        source: dict[str, object] | None = None,
        drc: dict[str, object] | None = None,
    ) -> None:
        """Update the design JSON and increment version.

        Args:
            json_str: JSON string of the serialized library, or None for an
                empty canvas (no design loaded).
            cells: Optional cell hierarchy tree: {name, children}
            layers: Optional viewer layer definitions derived from rosette.toml
            filename: Optional source filename (e.g., "layout.py" or "mmi.gds")
            source: Optional description of the authoritative external source.
                A null value means the app document is authoritative.
            drc: Optional DRC result dict (violations + counts), or None when DRC
                is not configured.
        """
        RosetteHandler.design_json = json_str
        RosetteHandler.design_cells = cells
        RosetteHandler.design_layers = layers
        RosetteHandler.design_filename = filename
        RosetteHandler.design_source = source
        RosetteHandler.design_drc = drc
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

        with ThreadingTCPServer(("127.0.0.1", self.port), RosetteHandler) as httpd:
            self._httpd = httpd
            httpd.serve_forever()

    def _is_port_available(self, port: int) -> bool:
        """Check if a port is available on the loopback interface."""
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(("127.0.0.1", port))
        except OSError:
            return False
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

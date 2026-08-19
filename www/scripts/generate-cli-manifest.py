#!/usr/bin/env python3
"""Regenerate the website's CLI manifest from the authoritative parser."""

from pathlib import Path

from rosette.cli import _cli_manifest_json

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "www" / "public" / "cli.json"


def main() -> None:
    OUTPUT.write_text(_cli_manifest_json())


if __name__ == "__main__":
    main()

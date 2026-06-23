#!/usr/bin/env python3
"""Verify the committed wasm-bindgen type stub matches a fresh build.

The app type-checks against a checked-in cache of wasm-pack's TypeScript output
(`app/src/wasm/rosette_wasm.d.ts`). CI rebuilds wasm and runs this script to fail
if the committed stub drifted from the `rosette-wasm` crate's actual public API.

A plain `git diff` is too brittle: the internal `InitOutput` interface lists the
raw wasm export table, whose member ordering is NOT stable across wasm-bindgen /
Rust toolchains (it follows Rust definition order + codegen, not a sorted order).
Two toolchains that expose the identical API can emit that block in different
orders, which would fail a byte-exact comparison even though nothing real changed.

So we compare a normalized view: the public API surface (export class / function /
const / type declarations) is compared verbatim — that's the actual Rust<->TS
contract callers depend on — while the members inside `InitOutput` are sorted
before comparison. Reordering is tolerated; genuine additions, removals, and
signature changes (anywhere, including in InitOutput) still surface as drift.

Usage:
    python scripts/check_wasm_stub.py <committed.d.ts> <rebuilt.d.ts>

Exits 0 if the normalized stubs match, 1 (with a diff) otherwise.
"""

import difflib
import sys
from pathlib import Path

INIT_MARKER = "export interface InitOutput {"


def normalize(text: str) -> list[str]:
    """Return stub lines with the InitOutput member block sorted."""
    lines = text.splitlines()
    out: list[str] = []
    i = 0
    n = len(lines)
    while i < n:
        line = lines[i]
        out.append(line)
        if line.strip() == INIT_MARKER:
            i += 1
            members: list[str] = []
            # InitOutput closes with a "}" at column 0.
            while i < n and lines[i] != "}":
                members.append(lines[i])
                i += 1
            out.extend(sorted(members))
            if i < n:
                out.append(lines[i])  # the closing "}"
        i += 1
    return out


def main() -> int:
    if len(sys.argv) != 3:
        print(f"usage: {sys.argv[0]} <committed.d.ts> <rebuilt.d.ts>", file=sys.stderr)
        return 2

    committed = normalize(Path(sys.argv[1]).read_text())
    rebuilt = normalize(Path(sys.argv[2]).read_text())

    if committed == rebuilt:
        return 0

    diff = difflib.unified_diff(
        committed,
        rebuilt,
        fromfile="committed (app/src/wasm/rosette_wasm.d.ts)",
        tofile="freshly built from rosette-wasm",
        lineterm="",
    )
    print("\n".join(diff))
    print(
        "\nThe committed wasm type stub does not match the rosette-wasm crate's "
        "public API.\nRun 'bun run build:wasm' in app/ and commit the regenerated "
        "stub with 'git add -f app/src/wasm/rosette_wasm.d.ts'.",
        file=sys.stderr,
    )
    return 1


if __name__ == "__main__":
    sys.exit(main())

"""Shared internal utilities for component modules."""

import hashlib

# GDS-II cell name maximum length
_MAX_CELL_NAME_LEN = 32


def safe_cell_name(name: str) -> str:
    """Normalize and truncate a cell name for GDS-II Release 6.

    Unsupported characters are replaced with underscores. If the normalized
    name is too long, a hash suffix avoids collisions between truncated names.
    """
    original = name
    name = "".join(
        char if char.isascii() and (char.isalnum() or char in "_?$") else "_" for char in name
    )
    if name == original and len(name) <= _MAX_CELL_NAME_LEN:
        return name
    # Keep a readable prefix and enough digest bits to make accidental
    # collisions negligible even in large generated component libraries.
    digest = hashlib.sha256(original.encode()).hexdigest()[:16]
    prefix_len = _MAX_CELL_NAME_LEN - len(digest) - 1  # 1 for separator
    return f"{name[:prefix_len]}_{digest}"

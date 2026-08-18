"""Shared internal utilities for component modules."""

import hashlib

# GDS-II cell name maximum length
_MAX_CELL_NAME_LEN = 32


def safe_cell_name(name: str) -> str:
    """Truncate a cell name to fit the 32-character GDS-II limit.

    If the name already fits, it is returned unchanged. Otherwise the name is
    truncated and a short hash suffix is appended to avoid collisions between
    different parameters that would otherwise produce the same truncated prefix.
    """
    if len(name) <= _MAX_CELL_NAME_LEN:
        return name
    # Keep a readable prefix and enough digest bits to make accidental
    # collisions negligible even in large generated component libraries.
    digest = hashlib.sha256(name.encode()).hexdigest()[:16]
    prefix_len = _MAX_CELL_NAME_LEN - len(digest) - 1  # 1 for separator
    return f"{name[:prefix_len]}_{digest}"

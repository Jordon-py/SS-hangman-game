"""
Application configuration loaded from environment variables.

The settings defined here control runtime behaviour such as CORS policy,
maximum upload sizes, job timeouts and the location of the AuralMind
mastering script. Defaults are provided for development but can be
overridden in production via environment variables.

Because configuration values are read once at import time, changes to
environment variables after startup will not have any effect until the
application is restarted.
"""

from __future__ import annotations

import os
from typing import List


def get_list(value: str | None) -> List[str]:
    """Split a comma-separated string into a list of stripped values."""
    if not value:
        return []
    return [segment.strip() for segment in value.split(",") if segment.strip()]


class Settings:
    """Container for configuration values."""

    FASTAPI_HOST: str = os.getenv("FASTAPI_HOST", "0.0.0.0")
    FASTAPI_PORT: int = int(os.getenv("FASTAPI_PORT", "8000"))
    ALLOWED_ORIGINS: List[str] = get_list(os.getenv("ALLOWED_ORIGINS", "http://localhost:5173"))
    MAX_UPLOAD_MB: int = int(os.getenv("MAX_UPLOAD_MB", "200"))
    JOB_TIMEOUT_SEC: int = int(os.getenv("JOB_TIMEOUT_SEC", "3600"))
    AURALMIND_SCRIPT_PATH: str = os.getenv(
        "AURALMIND_SCRIPT_PATH",
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "auralmind_match_maestro_v7_3_expert1.py")),
    )
    DATA_DIR: str = os.getenv(
        "DATA_DIR", os.path.abspath(os.path.join(os.path.dirname(__file__), "data", "jobs"))
    )


settings = Settings()

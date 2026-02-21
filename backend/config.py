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
from typing import List, Optional

try:
    from dotenv import load_dotenv
except Exception:  # pragma: no cover - optional at runtime
    load_dotenv = None

if load_dotenv:
    # Local development convenience. Heroku/Netlify provide env vars directly.
    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))


def _clean_env(value: str | None) -> str:
    return str(value or "").strip().strip("'\"")


def get_list(value: str | None) -> List[str]:
    """Split a comma-separated string into a list of stripped values."""
    raw = _clean_env(value)
    if not raw:
        return []

    normalized: List[str] = []
    seen = set()
    for segment in raw.split(","):
        origin = segment.strip()
        if not origin:
            continue
        if origin == "*":
            if origin not in seen:
                normalized.append(origin)
                seen.add(origin)
            continue
        if origin.endswith("/*"):
            origin = origin[:-2]
        origin = origin.rstrip("/")
        # CORS origin must be scheme + host (+ optional port), no path.
        if "://" in origin:
            scheme, rest = origin.split("://", 1)
            host = rest.split("/", 1)[0]
            origin = f"{scheme}://{host}"
        if origin not in seen:
            normalized.append(origin)
            seen.add(origin)
    return normalized


def get_optional(value: str | None) -> Optional[str]:
    cleaned = _clean_env(value)
    return cleaned or None


class Settings:
    """Container for configuration values."""

    FASTAPI_HOST: str = os.getenv("FASTAPI_HOST", "0.0.0.0")
    FASTAPI_PORT: int = int(os.getenv("PORT", os.getenv("FASTAPI_PORT", "8000")))
    ALLOWED_ORIGINS: List[str] = get_list(
        os.getenv(
            "ALLOWED_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173",
        )
    )
    ALLOWED_ORIGIN_REGEX: Optional[str] = get_optional(os.getenv("ALLOWED_ORIGIN_REGEX"))
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

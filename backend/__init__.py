"""
Backend package initializer for AuralMind mastering web service.

This package contains the FastAPI application and all supporting modules
for asynchronous job management, request/response schemas, and configuration.

The API exposes endpoints for creating and tracking audio mastering jobs
that wrap the existing `auralmind_match_maestro_v7_3_expert1.py` script. Jobs
are executed in the background using a thread pool so that HTTP requests do
not block. A simple in-memory job registry maintains status and metadata
throughout the lifecycle of each job.
"""

from .main import app  # noqa: F401

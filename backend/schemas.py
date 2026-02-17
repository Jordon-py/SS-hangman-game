"""Pydantic models defining request and response shapes for the API."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class JobSettings(BaseModel):
    """Settings controlling how the mastering job will run."""

    preset: str = Field(default="hi_fi_streaming", description="Name of the mastering preset.")
    enable_demucs: bool = Field(default=False, description="Reserved flag for stem separation pipeline.")
    mono_sub: bool = Field(default=False, description="Mono-anchor low frequencies below ~120 Hz.")
    dynamic_eq: bool = Field(default=False, description="Masking-aware dynamic EQ in the 200-500 Hz band.")
    truepeak_limiter: bool = Field(default=False, description="True-peak safer limiter + soft clip stage.")
    target_lufs: Optional[float] = Field(default=None, description="Desired integrated loudness estimate.")
    true_peak_ceiling: float = Field(default=-1.0, description="Limiter output ceiling in dBTP.")


class JobCreateResponse(BaseModel):
    id: str
    status: str
    settings: JobSettings


class JobStatusResponse(BaseModel):
    id: str
    status: str
    progress: float = Field(..., ge=0.0, le=100.0)
    created_at: datetime
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None
    error: Optional[str] = None
    settings: JobSettings


class JobReportResponse(BaseModel):
    report: Dict[str, Any]


class ErrorResponse(BaseModel):
    detail: str

"""
Job management for the AuralMind mastering service.

This module contains classes and functions to create, execute and track
long-running mastering jobs. Jobs are executed asynchronously in a
thread pool so that HTTP requests remain non-blocking. Each job runs
the AuralMind script as a separate subprocess in a sandboxed working
directory.
"""

from __future__ import annotations

import datetime as dt
import os
import re
import subprocess
import sys
import time
import uuid
from concurrent.futures import Future, ThreadPoolExecutor
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, Optional

import soundfile as sf

from .config import settings
from .schemas import JobSettings

_DURATION_RE = re.compile(r"dur=([0-9]+(?:\.[0-9]+)?)s")
_STAGE_HINTS = (
    ("[master] preset=", "Preparing mastering graph", 3.0),
    ("[master] audio loaded", "Source analysis and resampling", 12.0),
    ("[master] match-EQ + FIR convolution", "Reference match EQ + phase-safe convolution", 36.0),
    ("[master] stereo enhancements", "Stereo field and width refinement", 58.0),
    ("[master] microdetail recovery", "Micro-detail recovery in the side image", 68.0),
    ("[master] transient sculpt", "Transient contour shaping", 78.0),
    ("[master] governor + limiter + write", "Final loudness, true-peak control, and render", 94.0),
    ("[master] TOTAL runtime", "Finalizing artifacts", 98.0),
)


@dataclass
class Job:
    """Represents a single mastering job."""

    id: str
    settings: JobSettings
    created_at: dt.datetime = field(default_factory=lambda: dt.datetime.utcnow())
    started_at: Optional[dt.datetime] = None
    finished_at: Optional[dt.datetime] = None
    status: str = "queued"  # queued, processing, completed, failed, cancelled
    progress: float = 0.0
    current_stage: str = "Queued"
    stage_detail: Optional[str] = "Waiting for an available worker"
    eta_seconds: Optional[int] = None
    error: Optional[str] = None
    workdir: Path = field(default_factory=Path)
    target_path: Path = field(default_factory=Path)
    reference_path: Optional[Path] = None
    output_path: Path = field(default_factory=Path)
    report_path: Path = field(default_factory=Path)
    log_path: Path = field(default_factory=Path)
    process: Optional[subprocess.Popen] = None
    future: Optional[Future] = None
    estimated_runtime_seconds: Optional[float] = None
    _log_offset: int = field(default=0, init=False, repr=False)
    _stage_floor: float = field(default=0.0, init=False, repr=False)


class JobManager:
    """Central registry and executor for mastering jobs."""

    def __init__(self) -> None:
        self.data_dir = Path(settings.DATA_DIR)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.jobs: Dict[str, Job] = {}
        self.executor = ThreadPoolExecutor(max_workers=2)

    def _estimate_audio_duration_seconds(self, path: Path) -> Optional[float]:
        """Best-effort audio duration estimate from file metadata."""
        try:
            info = sf.info(str(path))
        except Exception:
            return None
        if info.samplerate <= 0 or info.frames <= 0:
            return None
        return float(info.frames) / float(info.samplerate)

    def _estimate_runtime_seconds(self, job: Job) -> Optional[float]:
        """
        Estimate runtime for smoother progress/ETA.
        Model is intentionally simple and conservative.
        """
        duration_s = self._estimate_audio_duration_seconds(job.target_path)
        if duration_s is None:
            return None
        rtf = 0.16  # base real-time factor for no-stem runs
        if job.reference_path:
            rtf += 0.04
        if job.settings.enable_demucs:
            rtf += 0.55
        if job.settings.section_aware_mastering:
            rtf += 0.05
        if job.settings.groove_transient_sculpting is not False:
            rtf += 0.03
        return max(14.0, 6.0 + duration_s * rtf)

    def _set_stage(self, job: Job, stage: str, floor: float, detail: Optional[str] = None) -> None:
        """Update human-friendly stage text and progress floor."""
        job.current_stage = stage
        if detail:
            job.stage_detail = detail
        job._stage_floor = max(job._stage_floor, float(floor))
        job.progress = max(job.progress, job._stage_floor)

    def _parse_log_line(self, job: Job, line: str) -> None:
        if not line:
            return
        stripped = line.strip()
        for marker, stage, floor in _STAGE_HINTS:
            if marker in stripped:
                detail = stripped.split("[master]", 1)[1].strip() if "[master]" in stripped else stripped
                self._set_stage(job, stage, floor, detail=detail)
                break

        # Update runtime estimate from script-reported audio duration when available.
        if job.estimated_runtime_seconds is None and "[master] audio loaded" in stripped:
            duration_match = _DURATION_RE.search(stripped)
            if duration_match:
                try:
                    duration_s = float(duration_match.group(1))
                    job.estimated_runtime_seconds = max(14.0, 6.0 + duration_s * 0.22)
                except Exception:
                    pass

    def _ingest_log_updates(self, job: Job) -> None:
        """Read appended log content and extract stage transitions."""
        if not job.log_path.exists():
            return
        try:
            with open(job.log_path, "r", encoding="utf-8", errors="ignore") as log_reader:
                log_reader.seek(job._log_offset)
                chunk = log_reader.read()
                job._log_offset = log_reader.tell()
        except Exception:
            return

        if not chunk:
            return
        for raw_line in chunk.splitlines():
            self._parse_log_line(job, raw_line)

    def _update_progress(self, job: Job) -> None:
        """Progress model: stage floors + elapsed-time estimate."""
        self._ingest_log_updates(job)
        if job.started_at is None:
            return
        elapsed = max(0.0, (dt.datetime.utcnow() - job.started_at).total_seconds())
        if job.estimated_runtime_seconds:
            est = max(1.0, float(job.estimated_runtime_seconds))
            time_progress = min(95.0, 2.0 + (elapsed / est) * 93.0)
            job.eta_seconds = max(0, int(round(est - elapsed)))
        else:
            # Fallback when duration metadata is not available.
            time_progress = min(90.0, 2.0 + elapsed * 0.35)
            job.eta_seconds = None
        job.progress = max(job.progress, job._stage_floor, float(time_progress))

    def create_job(self, settings_obj: JobSettings) -> Job:
        """Create a new job and register it in the registry."""
        job_id = uuid.uuid4().hex
        workdir = self.data_dir / job_id
        (workdir / "input").mkdir(parents=True, exist_ok=True)
        (workdir / "output").mkdir(parents=True, exist_ok=True)
        (workdir / "logs").mkdir(parents=True, exist_ok=True)

        job = Job(
            id=job_id,
            settings=settings_obj,
            workdir=workdir,
        )
        job.target_path = workdir / "input" / "target"
        job.reference_path = None
        job.output_path = workdir / "output" / "mastered.wav"
        job.report_path = workdir / "output" / "report.json"
        job.log_path = workdir / "logs" / "stdout.log"
        self.jobs[job_id] = job
        return job

    def run_job(self, job_id: str) -> None:
        """Schedule execution of the job in a background thread."""
        job = self.jobs[job_id]
        job.estimated_runtime_seconds = self._estimate_runtime_seconds(job)
        future = self.executor.submit(self._execute_job, job)
        job.future = future

    def _execute_job(self, job: Job) -> None:
        """Worker function executed in a background thread."""
        job.started_at = dt.datetime.utcnow()
        job.status = "processing"
        job.progress = 2.0
        job.eta_seconds = None
        job._log_offset = 0
        job._stage_floor = 2.0
        self._set_stage(job, "Booting mastering engine", 2.0, "Launching DSP worker")
        script = settings.AURALMIND_SCRIPT_PATH
        cmd = [
            sys.executable,
            script,
            "--target",
            str(job.target_path),
            "--out",
            str(job.output_path),
        ]
        if job.reference_path:
            cmd.extend(["--reference", str(job.reference_path)])
        if job.settings.preset:
            cmd.extend(["--preset", job.settings.preset])
        if job.settings.enable_demucs is True:
            cmd.append("--stems")
        elif job.settings.enable_demucs is False:
            cmd.append("--no-stems")
        if job.settings.mono_sub is True:
            cmd.append("--mono-sub")
        elif job.settings.mono_sub is False:
            cmd.append("--no-mono-sub")
        if job.settings.dynamic_eq is True:
            cmd.append("--masking-eq")
        elif job.settings.dynamic_eq is False:
            cmd.append("--no-masking-eq")
        if job.settings.truepeak_limiter is False:
            cmd.append("--no-limiter")
        if job.settings.target_lufs is not None:
            cmd.extend(["--target-lufs", str(job.settings.target_lufs)])
        if job.settings.true_peak_ceiling is not None:
            cmd.extend(["--ceiling", str(job.settings.true_peak_ceiling)])
        if job.settings.warmth and job.settings.warmth > 0:
            warmth = max(0.0, min(float(job.settings.warmth), 100.0)) / 100.0
            cmd.extend(["--warmth", f"{warmth:.4f}"])

        if job.settings.section_aware_mastering is True:
            if job.settings.section_lift_mix is not None:
                cmd.extend(["--hooklift-mix", str(job.settings.section_lift_mix)])
        elif job.settings.section_aware_mastering is False:
            cmd.append("--no-hooklift")

        if job.settings.groove_transient_sculpting is False:
            cmd.extend(["--transient-mix", "0.0"])
        elif job.settings.groove_transient_boost_db is not None:
            cmd.extend(["--transient-boost", str(job.settings.groove_transient_boost_db)])

        out_subtype = "PCM_16" if int(job.settings.output_pcm_bits) == 16 else "PCM_24"
        cmd.extend(["--out-subtype", out_subtype])

        env = os.environ.copy()
        env["PYTHONUNBUFFERED"] = "1"
        env.setdefault("PYTHONIOENCODING", "utf-8")
        log_file = open(job.log_path, "w", encoding="utf-8", buffering=1)
        try:
            job.process = subprocess.Popen(
                cmd,
                stdout=log_file,
                stderr=subprocess.STDOUT,
                cwd=str(job.workdir),
                env=env,
            )
            while True:
                if job.process.poll() is not None:
                    break
                self._update_progress(job)
                time.sleep(0.5)
            self._update_progress(job)
            retcode = job.process.wait(timeout=0)
            if job.status == "cancelled":
                job.current_stage = "Job cancelled"
                job.stage_detail = "Cancelled by user request"
                job.progress = 100.0
                job.eta_seconds = 0
                return
            if retcode == 0:
                job.status = "completed"
                job.current_stage = "Master complete"
                job.stage_detail = "Mastered output and report are ready"
                job.progress = 100.0
                job.eta_seconds = 0
            else:
                job.status = "failed"
                job.current_stage = "Master failed"
                job.stage_detail = f"Engine exited with code {retcode}"
                job.progress = 100.0
                job.error = f"Script exited with code {retcode}"
        except subprocess.TimeoutExpired:
            job.status = "failed"
            job.current_stage = "Master failed"
            job.stage_detail = "Job timed out"
            job.error = "Job timed out"
            if job.process:
                job.process.kill()
        except Exception as exc:
            job.status = "failed"
            job.current_stage = "Master failed"
            job.stage_detail = str(exc)
            job.error = str(exc)
            if job.process:
                job.process.kill()
        finally:
            job.finished_at = dt.datetime.utcnow()
            job.progress = max(job.progress, 100.0)
            if job.eta_seconds is None:
                job.eta_seconds = 0
            log_file.close()

    def cancel_job(self, job_id: str) -> bool:
        """Attempt to cancel a running job."""
        job = self.jobs.get(job_id)
        if not job:
            return False
        if job.status not in {"queued", "processing"}:
            return False
        if job.process and job.process.poll() is None:
            try:
                job.process.kill()
                job.status = "cancelled"
                job.current_stage = "Job cancelled"
                job.stage_detail = "Cancelled by user request"
                job.finished_at = dt.datetime.utcnow()
                job.progress = 100.0
                job.eta_seconds = 0
                return True
            except Exception:
                return False
        job.status = "cancelled"
        job.current_stage = "Job cancelled"
        job.stage_detail = "Cancelled by user request"
        job.finished_at = dt.datetime.utcnow()
        job.progress = 100.0
        job.eta_seconds = 0
        return True


job_manager = JobManager()

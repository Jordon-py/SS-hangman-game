# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AuralMind Match Maestro is a full-stack audio mastering web application. It wraps the `auralmind_match_maestro_v7_3_expert1.py` Python script with a FastAPI backend and React frontend, allowing users to upload audio files for professional mastering with configurable settings.

## Common Commands

### Backend (FastAPI)
```bash
# Activate virtual environment
venv/Scripts/activate  # Windows

# Install dependencies
pip install fastapi uvicorn pydantic python-multipart requests

# Run backend server
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (React + Vite)
```bash
cd frontend

# Install dependencies
npm install

# Run development server (proxies /api to backend)
npm run dev

# Build for production
npm run build
```

## Architecture

### Backend (`backend/`)
- **main.py**: FastAPI application with REST endpoints under `/api`
  - `POST /api/jobs` - Create mastering job (multipart upload)
  - `GET /api/jobs/{id}` - Get job status
  - `GET /api/jobs/{id}/download` - Download mastered audio
  - `GET /api/jobs/{id}/report` - Get JSON report
  - `GET /api/jobs/{id}/logs` - Get job logs
  - `POST /api/jobs/{id}/cancel` - Cancel running job
  - `GET /api/health` - Health check

- **jobs.py**: JobManager class handles async job execution via ThreadPoolExecutor (max 2 workers). Each job runs the AuralMind script as a subprocess with arguments based on job settings. Job state is stored in-memory.

- **schemas.py**: Pydantic models for API validation (JobSettings, JobStatusResponse, etc.)

- **config.py**: Settings loaded from environment variables (DATA_DIR, MAX_UPLOAD_MB, AURALMIND_SCRIPT_PATH)

### Frontend (`frontend/src/`)
- **App.jsx**: Main component with 3-second polling interval for active jobs
- **api.js**: Fetch wrapper with timeout and error handling
- **components/UploadPanel.jsx**: File upload with mastering settings
- **components/JobList.jsx**: List of all jobs with status
- **components/JobDetail.jsx**: Selected job details with download/report

### Data Flow
1. User uploads audio file(s) via UploadPanel
2. POST /api/jobs creates job and saves files to `backend/data/jobs/{job_id}/input/`
3. JobManager executes AuralMind script as subprocess in background thread
4. Frontend polls GET /api/jobs/{id} every 3 seconds
5. On completion, output saved to `backend/data/jobs/{job_id}/output/mastered.wav`

### Job Settings
- `preset`: Mastering preset (default: "hi_fi_streaming")
- `mono_sub`: Mono-anchor low frequencies below ~120 Hz
- `dynamic_eq`: Masking-aware dynamic EQ in 200-500 Hz band
- `truepeak_limiter`: True-peak safer limiter + soft clip
- `target_lufs`: Desired integrated loudness
- `true_peak_ceiling`: Limiter output ceiling in dBTP
- `warmth`: Analog-style warmth (0-100%)

### Job States
`queued` → `processing` → `completed` | `failed` | `cancelled`

## Environment Variables

**Backend** (`backend/.env`):
- `FASTAPI_HOST`, `FASTAPI_PORT`
- `MAX_UPLOAD_MB` (default: 200)
- `AURALMIND_SCRIPT_PATH`
- `DATA_DIR` (default: `backend/data/jobs`)

**Frontend** (`frontend/.env`):
- `VITE_API_BASE_URL` - Override API base URL

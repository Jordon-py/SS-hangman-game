# AuralMind Match Maestro Web App

This repository contains a full-stack wrapper around `auralmind_match_maestro_v7_3_expert1.py`.

## Project structure

```text
.
├─ README.md
├─ auralmind_match_maestro_v7_3_expert1.py
├─ backend/
│  ├─ __init__.py
│  ├─ config.py
│  ├─ jobs.py
│  ├─ main.py
│  ├─ schemas.py
│  ├─ .env.example
│  └─ smoke_test.py
└─ frontend/
   ├─ package.json
   ├─ vite.config.js
   ├─ .env.example
   └─ src/
      ├─ main.jsx
      ├─ App.jsx
      ├─ api.js
      ├─ components/
      │  ├─ UploadPanel.jsx
      │  ├─ JobList.jsx
      │  └─ JobDetail.jsx
      └─ styles.css
```

## Backend (FastAPI)

### Run

```bash
python -m venv .venv
venv/script /activate
pip install fastapi uvicorn pydantic python-multipart requests
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

## Frontend (React + Vite)

### Run

```bash
cd frontend
npm install
npm run dev
```

Default frontend URL: `http://localhost:5173`

## Notes

- The backend executes jobs asynchronously in a thread pool.
- Job state is in-memory and resets on restart.
- Update environment variables using `backend/.env.example` and `frontend/.env.example`.

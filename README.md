# AuralMind Match Maestro Web App

Full-stack mastering wrapper around `auralmind_match_maestro_v7_3_expert1.py` with FastAPI + React/Vite.

## Project structure

```text
.
├─ auralmind_match_maestro_v7_3_expert1.py
├─ backend/
│  ├─ main.py
│  ├─ jobs.py
│  ├─ schemas.py
│  ├─ config.py
│  ├─ smoke_test.py
│  └─ .env.example
└─ frontend/
   ├─ src/
   │  ├─ App.jsx
   │  ├─ api.js
   │  ├─ styles.css
   │  └─ components/
   ├─ package.json
   └─ vite.config.js
```

## Backend run

```bash
python -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn pydantic python-multipart requests numpy
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

## Frontend run

```bash
cd frontend
npm install
npm run dev
```

## DSP modules (all default OFF)

The CLI preserves original contract and adds optional flags:

- `--enable-mono-sub`: sub-band mono + phase anchor (<120 Hz)
- `--enable-masking-dynamic-eq`: dynamic low-mid cleanup (200–500 Hz)
- `--enable-truepeak-limiter`: true-peak safer limiter + soft clip
- `--target-lufs <float>`: optional LUFS estimate target
- `--true-peak-ceiling <float>`: default `-1.0` dBTP

### Theory-grounded implemented enhancements

1. **Sub-band mono + phase anchor**
   - Fixes: low-end cancellation and unstable mono playback.
   - Why: very low frequencies localize poorly; phase mismatch hurts punch.
   - Safety: toggle only, stereo mids/highs preserved.

2. **Masking-aware dynamic EQ (200–500 Hz)**
   - Fixes: intermittent mud masking vocals/snare harmonics.
   - Why: dynamic masking is program-dependent; static cuts remove warmth.
   - Safety: reduction cap (~2.5 dB), toggle only.

## Innovative trap-mastering blueprints (not fully implemented)

1. **Hook Energy Lens**
   - Detect hook sections from RMS + spectral flux, then add +0.5 dB width only in hooks.
   - Trap fit: enhances chorus lift while keeping verses tight.
   - Risk/fallback: hard bypass if section detection confidence < threshold.

2. **808 Harmonic Guardrail Exciter**
   - Generate keyed harmonics above 808 fundamental while protecting 35–65 Hz crest.
   - Trap fit: keeps 808 audible on small speakers without flattening sub impact.
   - Risk/fallback: bypass if crest factor drop > 1.5 dB.

## Next-gen rhythm perception ideas

1. **Groove-Locked Transient Sculptor**
   - Place after dynamic EQ, before limiter.
   - Detect onsets + tempo and apply capped transient boosts (default +0.8 dB, 8 ms attack, 45 ms release).

2. **Swing-Aware Hat Tamer**
   - Place after tonal shaping.
   - Dynamic control in 6–12 kHz with release tied to rhythmic density (default 30–80 ms).

## Notes

- Backend jobs are asynchronous and in-memory.
- `report.json` includes before/after estimated LUFS, true-peak estimate, crest factor, and dynamic range.
- Non-WAV inputs are copied unchanged (DSP safely skipped).

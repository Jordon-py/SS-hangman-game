# Frontend One-Command Deploy (Netlify)

## Prereqs
- Netlify CLI access token (`NETLIFY_AUTH_TOKEN`)
- Netlify site ID (`NETLIFY_SITE_ID`)
- Deployed backend URL (`HEROKU_API_URL`)

Your production backend URL:
- `https://auralmind-master-778194383141.herokuapp.com`

## One Command
Run this from the repository root:

```bash
NETLIFY_AUTH_TOKEN="YOUR_NETLIFY_TOKEN" \
NETLIFY_SITE_ID="YOUR_NETLIFY_SITE_ID" \
HEROKU_API_URL="https://auralmind-master-778194383141.herokuapp.com" \
bash -lc 'set -euo pipefail; cd frontend; npm ci; VITE_API_BASE_URL="$HEROKU_API_URL" npm run build; npx netlify deploy --prod --dir=dist --site="$NETLIFY_SITE_ID" --auth="$NETLIFY_AUTH_TOKEN"'
```

## Local API Reachability Check (`npm run serve` on `4173`)
If you see `Cannot reach API at http://localhost:8000...`, run:

Start backend first (repo root):

```bash
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Then verify CORS preflight:

```bash
curl -i -X OPTIONS http://localhost:8000/api/jobs \
  -H "Origin: http://localhost:4173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type"
```

Expected: `HTTP/1.1 200 OK` and `access-control-allow-origin: http://localhost:4173`.

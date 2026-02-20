# Docker Build Cloud + Deployment Guide

This guide connects this project to your Docker Build Cloud builder and deploys the mastering backend image.

Builder to use:

- `cloud-cmjordon-auralmind`

---

## 1. Prerequisites

Run these once on your local machine:

```bash
docker --version
docker buildx version
docker login
```

Make sure your cloud builder exists:

```bash
docker buildx ls
```

You should see `cloud-cmjordon-auralmind` in the list.

---

## 2. Connect to Your Cloud Builder

Set your builder as active:

```bash
docker buildx use cloud-cmjordon-auralmind
```

Bootstrap it:

```bash
docker buildx inspect --builder cloud-cmjordon-auralmind --bootstrap
```

---

## 3. Build and Push Image with Docker Build Cloud

From repo root, run (replace `<DOCKERHUB_USER>`):

```bash
docker buildx build \
  --builder cloud-cmjordon-auralmind \
  --platform linux/amd64,linux/arm64 \
  -t <DOCKERHUB_USER>/auralmind-mastering-backend:1.0.0 \
  -t <DOCKERHUB_USER>/auralmind-mastering-backend:latest \
  --push \
  .
```

If you only want to test a cloud build without pushing:

```bash
docker buildx build --builder cloud-cmjordon-auralmind .
```

Note: without `--push` or `--load`, output stays in the remote build cache and is not available as a local image.

---

## 4. Verify Pushed Image

Inspect manifest and platforms:

```bash
docker buildx imagetools inspect <DOCKERHUB_USER>/auralmind-mastering-backend:1.0.0
```

---

## 5. Deploy on a Server (Single Container)

On your deployment host:

```bash
docker login
docker pull <DOCKERHUB_USER>/auralmind-mastering-backend:1.0.0
docker volume create auralmind_jobs
```

Run container:

```bash
docker run -d \
  --name auralmind-mastering-backend \
  --restart unless-stopped \
  -p 8000:8000 \
  --cpus="4.0" \
  --memory="8g" \
  --ulimit nofile=65536:65536 \
  --read-only \
  --tmpfs /tmp:size=512m,noexec,nosuid \
  -e FASTAPI_HOST=0.0.0.0 \
  -e FASTAPI_PORT=8000 \
  -e MAX_UPLOAD_MB=300 \
  -e JOB_TIMEOUT_SEC=7200 \
  -e ALLOWED_ORIGINS=http://localhost:5173 \
  -e DATA_DIR=/data/jobs \
  -e OMP_NUM_THREADS=1 \
  -e OPENBLAS_NUM_THREADS=1 \
  -e MKL_NUM_THREADS=1 \
  -e NUMEXPR_NUM_THREADS=1 \
  -v auralmind_jobs:/data/jobs \
  <DOCKERHUB_USER>/auralmind-mastering-backend:1.0.0
```

Health check:

```bash
curl http://localhost:8000/api/health
```

Expected response:

```json
{"status":"ok"}
```

---

## 6. Deploy with Docker Compose

If using `docker-compose.yml`, set the image to your pushed tag:

```yaml
image: <DOCKERHUB_USER>/auralmind-mastering-backend:1.0.0
```

Then deploy:

```bash
docker compose pull
docker compose up -d
docker compose ps
```

---

## 7. Update / Roll Forward

Build and push a new version:

```bash
docker buildx build \
  --builder cloud-cmjordon-auralmind \
  --platform linux/amd64,linux/arm64 \
  -t <DOCKERHUB_USER>/auralmind-mastering-backend:1.0.1 \
  --push \
  .
```

On server:

```bash
docker pull <DOCKERHUB_USER>/auralmind-mastering-backend:1.0.1
docker stop auralmind-mastering-backend
docker rm auralmind-mastering-backend
# re-run docker run with :1.0.1 (or update compose tag and redeploy)
```

---

## 8. Troubleshooting

- Builder not found:
  - `docker buildx ls` and confirm the exact builder name.
- Auth errors on push:
  - re-run `docker login`.
- Image built but not found locally:
  - add `--load` for local single-platform testing, or use `--push` for remote registry output.
- Container unhealthy:
  - check logs: `docker logs auralmind-mastering-backend`
  - check endpoint inside container namespace: `/api/health` on port `8000`.

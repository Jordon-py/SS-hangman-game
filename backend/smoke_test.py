"""Minimal smoke test for the AuralMind API."""

import argparse
import json
import os
import time

import requests

API_BASE = os.environ.get("API_BASE", "http://localhost:8000")


def submit_job(target_path: str, preset: str = "hi_fi_streaming") -> str:
    with open(target_path, "rb") as f:
        files = {"target": (os.path.basename(target_path), f, "audio/wav")}
        settings = {"preset": preset}
        res = requests.post(
            f"{API_BASE}/api/jobs",
            files=files,
            data={"settings_json": json.dumps(settings)},
            timeout=60,
        )
    res.raise_for_status()
    return res.json()["id"]


def poll_job(job_id: str) -> dict:
    while True:
        res = requests.get(f"{API_BASE}/api/jobs/{job_id}", timeout=30)
        res.raise_for_status()
        data = res.json()
        print(f"Status: {data['status']} Progress: {data['progress']}%")
        if data["status"] in {"completed", "failed", "cancelled"}:
            return data
        time.sleep(5)


def download_output(job_id: str) -> None:
    res = requests.get(f"{API_BASE}/api/jobs/{job_id}/download", timeout=60)
    res.raise_for_status()
    output_name = f"master_{job_id}.wav"
    with open(output_name, "wb") as f:
        f.write(res.content)
    print(f"Downloaded {output_name}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Smoke test the mastering API")
    parser.add_argument("target", help="Path to target audio file")
    parser.add_argument("--preset", default="hi_fi_streaming", help="Mastering preset")
    args = parser.parse_args()

    job_id = submit_job(args.target, args.preset)
    print(f"Submitted job {job_id}")
    result = poll_job(job_id)
    print("Job finished", result)
    if result["status"] == "completed":
        download_output(job_id)

"""CLI placeholder for AuralMind Match Maestro.

This file acts as a drop-in executable for the web wrapper. Replace internals
with your original mastering implementation if needed.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description="AuralMind mastering script")
    parser.add_argument("--target", required=True, help="Path to target audio")
    parser.add_argument("--reference", required=False, help="Optional reference audio")
    parser.add_argument("--out", required=True, help="Output mastered file path")
    parser.add_argument("--preset", default="hi_fi_streaming", help="Mastering preset")
    args = parser.parse_args()

    target = Path(args.target)
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    if not target.exists():
        raise FileNotFoundError(f"Target file not found: {target}")

    # Placeholder behavior: copy input bytes to output.
    out_path.write_bytes(target.read_bytes())

    report = {
        "status": "ok",
        "preset": args.preset,
        "target": str(target),
        "reference": args.reference,
        "output": str(out_path),
    }
    report_path = out_path.parent / "report.json"
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")

    print("Mastering complete")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

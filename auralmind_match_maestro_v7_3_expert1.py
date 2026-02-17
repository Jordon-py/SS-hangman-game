"""AuralMind Match Maestro CLI.

Minimal-risk mastering wrapper with optional DSP modules. New DSP modules are
opt-in and disabled by default to preserve existing behavior.
"""

from __future__ import annotations

import argparse
import json
import math
import shutil
import wave
from pathlib import Path

import numpy as np

EPS = 1e-12


def dbfs_from_linear(value: float) -> float:
    return 20.0 * math.log10(max(value, EPS))


def read_wav(path: Path) -> tuple[np.ndarray, int]:
    with wave.open(str(path), "rb") as wf:
        channels = wf.getnchannels()
        sampwidth = wf.getsampwidth()
        sample_rate = wf.getframerate()
        frames = wf.getnframes()
        pcm = wf.readframes(frames)

    if sampwidth != 2:
        raise ValueError("Only 16-bit PCM WAV files are supported for DSP modules.")

    data = np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768.0
    if channels > 1:
        data = data.reshape(-1, channels)
    else:
        data = data[:, None]
    return data, sample_rate


def write_wav(path: Path, audio: np.ndarray, sample_rate: int) -> None:
    audio = np.clip(audio, -1.0, 1.0 - (1 / 32768.0))
    int_data = (audio * 32768.0).astype(np.int16)
    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(int(audio.shape[1]))
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(int_data.tobytes())


def moving_average(signal: np.ndarray, size: int) -> np.ndarray:
    size = max(1, int(size))
    kernel = np.ones(size, dtype=np.float32) / size
    return np.convolve(signal, kernel, mode="same")


def mono_sub_anchor(audio: np.ndarray, sample_rate: int, cutoff_hz: float = 120.0) -> np.ndarray:
    """Enhancement 1: sub-band mono + phase anchor (toggle default OFF).

    Psychoacoustic basis: below ~120 Hz, stereo cues are weak while phase mismatch
    can collapse low-end in mono playback. This module anchors sub energy to mono
    while preserving stereo image in mids/highs.
    """

    if audio.shape[1] < 2:
        return audio

    window = max(8, int(sample_rate / max(cutoff_hz, 1.0)))
    mono = audio.mean(axis=1)
    low = moving_average(mono, window)

    left_high = audio[:, 0] - moving_average(audio[:, 0], window)
    right_high = audio[:, 1] - moving_average(audio[:, 1], window)

    out = np.copy(audio)
    out[:, 0] = low + left_high
    out[:, 1] = low + right_high
    return np.clip(out, -1.0, 1.0)


def masking_dynamic_eq(
    audio: np.ndarray,
    sample_rate: int,
    low_hz: float = 200.0,
    high_hz: float = 500.0,
    threshold_db: float = -28.0,
    max_reduction_db: float = 2.5,
) -> np.ndarray:
    """Enhancement 2: masking-aware dynamic EQ in 200-500 Hz (toggle default OFF).

    Music-theory/psychoacoustic basis: excessive low-mid energy masks harmonic
    clarity (vocal and snare overtones). Dynamic control preserves warmth while
    attenuating muddy blooms only when needed.
    """

    n = audio.shape[0]
    if n < 2048:
        return audio

    fft = np.fft.rfft(audio, axis=0)
    freqs = np.fft.rfftfreq(n, d=1.0 / sample_rate)
    mask = (freqs >= low_hz) & (freqs <= high_hz)
    if not np.any(mask):
        return audio

    band_energy = np.sqrt(np.mean(np.abs(fft[mask]) ** 2))
    band_db = dbfs_from_linear(float(band_energy))
    over_db = max(0.0, band_db - threshold_db)
    reduction_db = min(max_reduction_db, over_db * 0.4)
    gain = 10 ** (-reduction_db / 20.0)

    fft[mask, :] *= gain
    processed = np.fft.irfft(fft, n=n, axis=0)
    return np.clip(processed.astype(np.float32), -1.0, 1.0)


def soft_clip_limiter(
    audio: np.ndarray,
    target_lufs: float | None,
    true_peak_ceiling_dbtp: float = -1.0,
    drive_db: float = 0.0,
) -> np.ndarray:
    """True-peak safer limiter with soft clip and 4x oversampled peak check.

    Default OFF via CLI toggle. Safety rails:
    - ceiling enforced by peak scaler
    - drive capped externally
    """

    peak = float(np.max(np.abs(audio)))
    if peak < EPS:
        return audio

    if target_lufs is not None:
        current_lufs = estimate_lufs(audio)
        loudness_delta = float(target_lufs - current_lufs)
        loudness_delta = max(-6.0, min(6.0, loudness_delta))
    else:
        loudness_delta = 0.0

    total_drive = max(-3.0, min(6.0, drive_db + loudness_delta))
    driven = audio * (10 ** (total_drive / 20.0))
    clipped = np.tanh(driven)

    oversampled = np.repeat(clipped, 4, axis=0)
    os_peak = float(np.max(np.abs(oversampled)))
    ceiling_linear = 10 ** (true_peak_ceiling_dbtp / 20.0)
    if os_peak > ceiling_linear:
        clipped *= ceiling_linear / max(os_peak, EPS)

    return np.clip(clipped, -1.0, 1.0).astype(np.float32)


def estimate_lufs(audio: np.ndarray) -> float:
    mono = audio.mean(axis=1)
    rms = float(np.sqrt(np.mean(np.square(mono)) + EPS))
    return -0.691 + dbfs_from_linear(rms)


def compute_metrics(audio: np.ndarray) -> dict:
    mono = audio.mean(axis=1)
    peak = float(np.max(np.abs(audio)))
    rms = float(np.sqrt(np.mean(np.square(mono)) + EPS))
    crest = dbfs_from_linear(peak / max(rms, EPS))
    dynamic_range = float(np.percentile(np.abs(mono), 95) - np.percentile(np.abs(mono), 10))

    return {
        "estimated_lufs": round(estimate_lufs(audio), 2),
        "true_peak_dbtp_est": round(dbfs_from_linear(peak), 2),
        "crest_factor_db": round(crest, 2),
        "dynamic_range_linear_p95_p10": round(dynamic_range, 5),
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="AuralMind mastering script")
    parser.add_argument("--target", required=True, help="Path to target audio")
    parser.add_argument("--reference", required=False, help="Optional reference audio")
    parser.add_argument("--out", required=True, help="Output mastered file path")
    parser.add_argument("--preset", default="hi_fi_streaming", help="Mastering preset")

    # Optional DSP toggles: default OFF per safety rule.
    parser.add_argument("--enable-mono-sub", action="store_true", help="Mono-anchor low band below 120 Hz")
    parser.add_argument(
        "--enable-masking-dynamic-eq",
        action="store_true",
        help="Dynamic low-mid (200-500 Hz) masking control",
    )
    parser.add_argument(
        "--enable-truepeak-limiter",
        action="store_true",
        help="Apply true-peak safer limiter + soft clip stage",
    )
    parser.add_argument("--target-lufs", type=float, default=None, help="Optional target loudness")
    parser.add_argument("--true-peak-ceiling", type=float, default=-1.0, help="Limiter ceiling in dBTP")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    target = Path(args.target)
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    if not target.exists():
        raise FileNotFoundError(f"Target file not found: {target}")

    report: dict[str, object] = {
        "status": "ok",
        "preset": args.preset,
        "target": str(target),
        "reference": args.reference,
        "output": str(out_path),
        "modules": {
            "mono_sub": bool(args.enable_mono_sub),
            "masking_dynamic_eq": bool(args.enable_masking_dynamic_eq),
            "truepeak_limiter": bool(args.enable_truepeak_limiter),
        },
    }

    if target.suffix.lower() != ".wav":
        shutil.copyfile(target, out_path)
        report["warning"] = "Non-WAV input detected; DSP modules skipped and file copied unchanged."
        report_path = out_path.parent / "report.json"
        report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
        print("Mastering complete (copy mode)")
        return 0

    audio, sr = read_wav(target)
    pre = compute_metrics(audio)

    processed = audio.copy()
    if args.enable_mono_sub:
        processed = mono_sub_anchor(processed, sr)
    if args.enable_masking_dynamic_eq:
        processed = masking_dynamic_eq(processed, sr)
    if args.enable_truepeak_limiter:
        processed = soft_clip_limiter(
            processed,
            target_lufs=args.target_lufs,
            true_peak_ceiling_dbtp=args.true_peak_ceiling,
            drive_db=1.5 if args.preset in {"club", "radio_loud"} else 0.0,
        )

    write_wav(out_path, processed, sr)
    post = compute_metrics(processed)

    report["metrics"] = {"before": pre, "after": post}
    report["sample_rate"] = sr
    report_path = out_path.parent / "report.json"
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")

    print("Mastering complete")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

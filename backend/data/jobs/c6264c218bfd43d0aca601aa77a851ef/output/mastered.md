# AuralMind Maestro v7.3 expert — Report

## Summary
- Preset: **cinematic**
- Sample rate: **48000 Hz**
- LUFS (pre): **-18.78**
- LUFS (post): **-17.91**
- True peak (approx): **-1.00 dBFS**
- Limiter min gain (approx GR): **-11.54 dB**

## Low-end / music theory anchors
- Estimated sub fundamental f0: **69.76318359375 Hz**
- Mono-sub v2 cutoff: **110.0 Hz**
- Mono-sub v2 adaptive mix: **0.5188587473383579**

## Stereo enhancements
- Spatial Realism Enhancer: frequency-dependent width + correlation guard
- NEW CGMS MicroShift: micro-delay applied to SIDE high-band only, correlation-guarded

- MicroDetail recovery: **1.0** (corr=0.8762746462647826, eff_amount=0.16)

## Movement / HookLift
- Movement enabled: **True** (amount=0.1)
- HookLift enabled: **True** (mix=0.28)
  - Auto mask percentile: **75.0**

## Stem separation (HT-Demucs)
- Enabled: **False**

## Loudness Governor
- Requested target LUFS: **-11.0**
- Governor final target LUFS: **-12.8**
- Governor steps: **11** (binary search)
- Limiter mode: **v2**
- Limiter avg gain (dB): **-4.37** (closer to 0 = less overall limiting)
  If limiter GR exceeded the ceiling, the governor backed off the LUFS target.

## JSON dump
```json
{
  "preset": "cinematic",
  "sr": 48000,
  "target_lufs_requested": -11.0,
  "governor_target_lufs": -12.8,
  "governor_steps": 11,
  "governor_gr_limit_db": -0.8,
  "lufs_pre": -18.77591622136401,
  "lufs_post": -17.907071193951996,
  "true_peak_dbfs": -0.9999991282316669,
  "limiter_mode": "v2",
  "limiter_min_gain_db": -11.543548407268819,
  "limiter_avg_gr_db": -4.366982188076919,
  "sub_f0_hz": 69.76318359375,
  "mono_sub_cutoff_hz": 110.0,
  "mono_sub_mix": 0.5188587473383579,
  "microdetail": {
    "enabled": 1.0,
    "corr": 0.8762746462647826,
    "guard": 1.0,
    "eff_amount": 0.16,
    "threshold_db": -36.0,
    "max_boost_db": 2.5,
    "mix": 0.5
  },
  "movement": {
    "enabled": true,
    "amount": 0.1
  },
  "hooklift": {
    "enabled": true,
    "mix": 0.28,
    "air_hz": 7200.0,
    "width_gain": 0.18,
    "air_gain": 0.14,
    "auto": true,
    "auto_percentile": 75.0
  },
  "stems": {
    "enabled": false
  },
  "transient_sculpt": {
    "enabled": false,
    "crest_db": 19.24807342925032,
    "guard": 0.01140040498048922
  },
  "runtime_sec": 1754.3895387649536,
  "out_path": "C:\\Users\\goku\\Documents\\SS-hangman-game\\backend\\data\\jobs\\c6264c218bfd43d0aca601aa77a851ef\\output\\mastered.wav"
}
```

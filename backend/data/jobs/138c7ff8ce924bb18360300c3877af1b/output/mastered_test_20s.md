# AuralMind Maestro v7.3 expert — Report

## Summary
- Preset: **hi_fi_streaming**
- Sample rate: **48000 Hz**
- LUFS (pre): **-27.02**
- LUFS (post): **-17.07**
- True peak (approx): **-1.00 dBFS**
- Limiter min gain (approx GR): **-8.09 dB**

## Low-end / music theory anchors
- Estimated sub fundamental f0: **101.98974609375 Hz**
- Mono-sub v2 cutoff: **110.0 Hz**
- Mono-sub v2 adaptive mix: **0.5941529758915777**

## Stereo enhancements
- Spatial Realism Enhancer: frequency-dependent width + correlation guard
- NEW CGMS MicroShift: micro-delay applied to SIDE high-band only, correlation-guarded

- MicroDetail recovery: **1.0** (corr=0.8796852136517213, eff_amount=0.18)

## Movement / HookLift
- Movement enabled: **False** (amount=None)
- HookLift enabled: **False** (mix=None)

## Stem separation (HT-Demucs)
- Enabled: **False**

## Loudness Governor
- Requested target LUFS: **-12.8**
- Governor final target LUFS: **-14.600000000000001**
- Governor steps: **11** (binary search)
- Limiter mode: **v2**
- Limiter avg gain (dB): **-2.15** (closer to 0 = less overall limiting)
  If limiter GR exceeded the ceiling, the governor backed off the LUFS target.

## JSON dump
```json
{
  "preset": "hi_fi_streaming",
  "sr": 48000,
  "target_lufs_requested": -12.8,
  "governor_target_lufs": -14.600000000000001,
  "governor_steps": 11,
  "governor_gr_limit_db": -1.0,
  "lufs_pre": -27.01872598447392,
  "lufs_post": -17.07483708468067,
  "true_peak_dbfs": -1.000000870903717,
  "limiter_mode": "v2",
  "limiter_min_gain_db": -8.0894962416973,
  "limiter_avg_gr_db": -2.15321719393611,
  "sub_f0_hz": 101.98974609375,
  "mono_sub_cutoff_hz": 110.0,
  "mono_sub_mix": 0.5941529758915777,
  "microdetail": {
    "enabled": 1.0,
    "corr": 0.8796852136517213,
    "guard": 1.0,
    "eff_amount": 0.18,
    "threshold_db": -35.0,
    "max_boost_db": 3.0,
    "mix": 0.55
  },
  "movement": {
    "enabled": false
  },
  "hooklift": {
    "enabled": false
  },
  "stems": {
    "enabled": false
  },
  "transient_sculpt": {
    "enabled": true,
    "boost_db": 1.1416072097517898,
    "mix": 0.32,
    "crest_db": 17.310624420559822,
    "guard": 0.5708036048758949,
    "max_transient_gain_db": 1.1416071653366089
  },
  "runtime_sec": 78.60740828514099,
  "out_path": "backend/data/jobs/138c7ff8ce924bb18360300c3877af1b/output/mastered_test_20s.wav"
}
```

# AuralMind Maestro v7.3 expert — Report

## Summary
- Preset: **hi_fi_streaming**
- Sample rate: **48000 Hz**
- LUFS (pre): **-21.27**
- LUFS (post): **-16.48**
- True peak (approx): **-1.00 dBFS**
- Limiter min gain (approx GR): **-6.21 dB**

## Low-end / music theory anchors
- Estimated sub fundamental f0: **101.98974609375 Hz**
- Mono-sub v2 cutoff: **110.0 Hz**
- Mono-sub v2 adaptive mix: **0.5**

## Stereo enhancements
- Spatial Realism Enhancer: frequency-dependent width + correlation guard
- NEW CGMS MicroShift: micro-delay applied to SIDE high-band only, correlation-guarded

- MicroDetail recovery: **1.0** (corr=0.9172516721217747, eff_amount=0.18)

## Movement / HookLift
- Movement enabled: **True** (amount=0.1)
- HookLift enabled: **True** (mix=0.18)
  - Auto mask percentile: **75.0**

## Stem separation (HT-Demucs)
- Enabled: **False**

## Loudness Governor
- Requested target LUFS: **-12.8**
- Governor final target LUFS: **-14.600000000000001**
- Governor steps: **11** (binary search)
- Limiter mode: **v2**
- Limiter avg gain (dB): **-1.61** (closer to 0 = less overall limiting)
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
  "lufs_pre": -21.272466848360757,
  "lufs_post": -16.48470270004563,
  "true_peak_dbfs": -0.9999991282316669,
  "limiter_mode": "v2",
  "limiter_min_gain_db": -6.208353150517802,
  "limiter_avg_gr_db": -1.609005987586328,
  "sub_f0_hz": 101.98974609375,
  "mono_sub_cutoff_hz": 110.0,
  "mono_sub_mix": 0.5,
  "microdetail": {
    "enabled": 1.0,
    "corr": 0.9172516721217747,
    "guard": 1.0,
    "eff_amount": 0.18,
    "threshold_db": -35.0,
    "max_boost_db": 3.0,
    "mix": 0.55
  },
  "movement": {
    "enabled": true,
    "amount": 0.1
  },
  "hooklift": {
    "enabled": true,
    "mix": 0.18,
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
    "enabled": true,
    "boost_db": 2.0,
    "mix": 0.32,
    "crest_db": 15.214004881750508,
    "guard": 1.0,
    "max_transient_gain_db": 2.0
  },
  "runtime_sec": 575.2703719139099,
  "out_path": "C:\\Users\\goku\\Documents\\SS-hangman-game\\backend\\data\\jobs\\993e824c743e4d91b5b1248793cde4b4\\output\\mastered.wav"
}
```

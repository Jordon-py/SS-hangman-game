# AuralMind Maestro v7.3 expert — Report

## Summary
- Preset: **cinematic**
- Sample rate: **48000 Hz**
- LUFS (pre): **-20.46**
- LUFS (post): **-18.66**
- True peak (approx): **-1.00 dBFS**
- Limiter min gain (approx GR): **-8.59 dB**

## Low-end / music theory anchors
- Estimated sub fundamental f0: **90.27099609375 Hz**
- Mono-sub v2 cutoff: **110.0 Hz**
- Mono-sub v2 adaptive mix: **0.48**

## Stereo enhancements
- Spatial Realism Enhancer: frequency-dependent width + correlation guard
- NEW CGMS MicroShift: micro-delay applied to SIDE high-band only, correlation-guarded

- MicroDetail recovery: **1.0** (corr=0.8225424447924871, eff_amount=0.16)

## Movement / HookLift
- Movement enabled: **True** (amount=0.1)
- HookLift enabled: **True** (mix=0.14)
  - Auto mask percentile: **75.0**

## Stem separation (HT-Demucs)
- Enabled: **False**

## Loudness Governor
- Requested target LUFS: **-14.5**
- Governor final target LUFS: **-16.3**
- Governor steps: **11** (binary search)
- Limiter mode: **v2**
- Limiter avg gain (dB): **-2.11** (closer to 0 = less overall limiting)
  If limiter GR exceeded the ceiling, the governor backed off the LUFS target.

## JSON dump
```json
{
  "preset": "cinematic",
  "sr": 48000,
  "target_lufs_requested": -14.5,
  "governor_target_lufs": -16.3,
  "governor_steps": 11,
  "governor_gr_limit_db": -0.8,
  "lufs_pre": -20.459781995033737,
  "lufs_post": -18.65795374206138,
  "true_peak_dbfs": -0.9999991282316669,
  "limiter_mode": "v2",
  "limiter_min_gain_db": -8.585059348767048,
  "limiter_avg_gr_db": -2.1080149630955667,
  "sub_f0_hz": 90.27099609375,
  "mono_sub_cutoff_hz": 110.0,
  "mono_sub_mix": 0.48,
  "microdetail": {
    "enabled": 1.0,
    "corr": 0.8225424447924871,
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
    "mix": 0.14,
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
    "crest_db": 19.780951807963557,
    "guard": 0.0
  },
  "runtime_sec": 931.5069196224213,
  "out_path": "C:\\Users\\goku\\Documents\\SS-hangman-game\\backend\\data\\jobs\\68333e17b7a44c4d9c9414d3ea417230\\output\\mastered.wav"
}
```

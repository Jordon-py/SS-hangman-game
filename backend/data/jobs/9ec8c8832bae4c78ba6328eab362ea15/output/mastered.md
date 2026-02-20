# AuralMind Maestro v7.3 expert — Report

## Summary
- Preset: **hi_fi_streaming**
- Sample rate: **48000 Hz**
- LUFS (pre): **-20.22**
- LUFS (post): **-17.20**
- True peak (approx): **-1.00 dBFS**
- Limiter min gain (approx GR): **-9.90 dB**

## Low-end / music theory anchors
- Estimated sub fundamental f0: **90.27099609375 Hz**
- Mono-sub v2 cutoff: **110.0 Hz**
- Mono-sub v2 adaptive mix: **0.5**

## Stereo enhancements
- Spatial Realism Enhancer: frequency-dependent width + correlation guard
- NEW CGMS MicroShift: micro-delay applied to SIDE high-band only, correlation-guarded

- MicroDetail recovery: **1.0** (corr=0.8170465897862038, eff_amount=0.18)

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
- Limiter avg gain (dB): **-2.01** (closer to 0 = less overall limiting)
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
  "lufs_pre": -20.219237398034853,
  "lufs_post": -17.1997588197072,
  "true_peak_dbfs": -1.0000014517944777,
  "limiter_mode": "v2",
  "limiter_min_gain_db": -9.902062809513097,
  "limiter_avg_gr_db": -2.0065347375676046,
  "sub_f0_hz": 90.27099609375,
  "mono_sub_cutoff_hz": 110.0,
  "mono_sub_mix": 0.5,
  "microdetail": {
    "enabled": 1.0,
    "corr": 0.8170465897862038,
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
    "enabled": false,
    "crest_db": 20.066136275486933,
    "guard": 0.0
  },
  "runtime_sec": 941.5436034202576,
  "out_path": "C:\\Users\\goku\\Documents\\SS-hangman-game\\backend\\data\\jobs\\9ec8c8832bae4c78ba6328eab362ea15\\output\\mastered.wav"
}
```

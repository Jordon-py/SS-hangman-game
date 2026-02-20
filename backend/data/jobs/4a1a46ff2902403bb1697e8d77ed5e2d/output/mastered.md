# AuralMind Maestro v7.3 expert — Report

## Summary
- Preset: **hi_fi_streaming**
- Sample rate: **48000 Hz**
- LUFS (pre): **-18.89**
- LUFS (post): **-16.92**
- True peak (approx): **-1.00 dBFS**
- Limiter min gain (approx GR): **-10.86 dB**

## Low-end / music theory anchors
- Estimated sub fundamental f0: **46.5087890625 Hz**
- Mono-sub v2 cutoff: **86.041259765625 Hz**
- Mono-sub v2 adaptive mix: **0.5**

## Stereo enhancements
- Spatial Realism Enhancer: frequency-dependent width + correlation guard
- NEW CGMS MicroShift: micro-delay applied to SIDE high-band only, correlation-guarded

- MicroDetail recovery: **1.0** (corr=0.7281629435995979, eff_amount=0.18)

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
- Limiter avg gain (dB): **-3.64** (closer to 0 = less overall limiting)
  If limiter GR exceeded the ceiling, the governor backed off the LUFS target.

## JSON dump
```json
{
  "preset": "hi_fi_streaming",
  "sr": 48000,
  "target_lufs_requested": -11.0,
  "governor_target_lufs": -12.8,
  "governor_steps": 11,
  "governor_gr_limit_db": -1.0,
  "lufs_pre": -18.889342638390428,
  "lufs_post": -16.92015721716818,
  "true_peak_dbfs": -1.0000014517944777,
  "limiter_mode": "v2",
  "limiter_min_gain_db": -10.859136471192084,
  "limiter_avg_gr_db": -3.639814684338228,
  "sub_f0_hz": 46.5087890625,
  "mono_sub_cutoff_hz": 86.041259765625,
  "mono_sub_mix": 0.5,
  "microdetail": {
    "enabled": 1.0,
    "corr": 0.7281629435995979,
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
    "enabled": true,
    "boost_db": 0.7582961230818497,
    "mix": 0.32,
    "crest_db": 17.962387723178196,
    "guard": 0.32969396655732597,
    "max_transient_gain_db": 0.7582961320877075
  },
  "runtime_sec": 873.4923317432404,
  "out_path": "C:\\Users\\goku\\Documents\\SS-hangman-game\\backend\\data\\jobs\\4a1a46ff2902403bb1697e8d77ed5e2d\\output\\mastered.wav"
}
```

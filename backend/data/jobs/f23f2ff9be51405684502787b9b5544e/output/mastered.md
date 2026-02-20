# AuralMind Maestro v7.3 expert — Report

## Summary
- Preset: **cinematic**
- Sample rate: **48000 Hz**
- LUFS (pre): **-18.72**
- LUFS (post): **-18.33**
- True peak (approx): **-1.00 dBFS**
- Limiter min gain (approx GR): **-12.41 dB**

## Low-end / music theory anchors
- Estimated sub fundamental f0: **92.83447265625 Hz**
- Mono-sub v2 cutoff: **110.0 Hz**
- Mono-sub v2 adaptive mix: **0.48**

## Stereo enhancements
- Spatial Realism Enhancer: frequency-dependent width + correlation guard
- NEW CGMS MicroShift: micro-delay applied to SIDE high-band only, correlation-guarded

- MicroDetail recovery: **1.0** (corr=0.9665607557750937, eff_amount=0.16)

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
- Limiter avg gain (dB): **-3.80** (closer to 0 = less overall limiting)
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
  "lufs_pre": -18.721405442026246,
  "lufs_post": -18.32673226562082,
  "true_peak_dbfs": -0.9999991282316669,
  "limiter_mode": "v2",
  "limiter_min_gain_db": -12.412176653509263,
  "limiter_avg_gr_db": -3.8014045273358037,
  "sub_f0_hz": 92.83447265625,
  "mono_sub_cutoff_hz": 110.0,
  "mono_sub_mix": 0.48,
  "microdetail": {
    "enabled": 1.0,
    "corr": 0.9665607557750937,
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
    "enabled": true,
    "boost_db": 0.841372365254989,
    "mix": 0.26,
    "crest_db": 17.861774933582424,
    "guard": 0.36581407184999526,
    "max_transient_gain_db": 0.8413723707199097
  },
  "runtime_sec": 941.0141813755035,
  "out_path": "C:\\Users\\goku\\Documents\\SS-hangman-game\\backend\\data\\jobs\\f23f2ff9be51405684502787b9b5544e\\output\\mastered.wav"
}
```

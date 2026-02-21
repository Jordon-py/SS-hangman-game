# AuralMind Maestro v7.3 expert — Report

## Summary
- Preset: **cinematic**
- Sample rate: **48000 Hz**
- LUFS (pre): **-23.03**
- LUFS (post): **-20.24**
- True peak (approx): **-1.00 dBFS**
- Limiter min gain (approx GR): **-15.27 dB**

- Effective softclip mix: **0.086**

## Low-end / music theory anchors
- Estimated sub fundamental f0: **109.68017578125 Hz**
- Mono-sub v2 cutoff: **110.0 Hz**
- Mono-sub v2 adaptive mix: **0.48**

## Stereo enhancements
- Spatial Realism Enhancer: frequency-dependent width + correlation guard
- NEW CGMS MicroShift: micro-delay applied to SIDE high-band only, correlation-guarded

- MicroDetail recovery: **1.0** (corr=0.9680232813757443, eff_amount=0.16)

## Movement / HookLift
- Movement enabled: **True** (amount=0.1)
- HookLift enabled: **False** (mix=None)

## Stem separation (HT-Demucs)
- Enabled: **False**

## Loudness Governor
- Requested target LUFS: **-11.0**
- Governor final target LUFS: **-12.8**
- Governor steps: **11** (binary search)
- Limiter mode: **v2**
- Limiter avg gain (dB): **-5.04** (closer to 0 = less overall limiting)
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
  "lufs_pre": -23.027990017700382,
  "lufs_post": -20.2367738098097,
  "true_peak_dbfs": -1.0000002900129947,
  "limiter_mode": "v2",
  "limiter_min_gain_db": -15.26706521462467,
  "limiter_avg_gr_db": -5.035580280200681,
  "softclip_mix_effective": 0.08639999999999999,
  "sub_f0_hz": 109.68017578125,
  "mono_sub_cutoff_hz": 110.0,
  "mono_sub_mix": 0.48,
  "microdetail": {
    "enabled": 1.0,
    "corr": 0.9680232813757443,
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
    "enabled": false
  },
  "stems": {
    "enabled": false
  },
  "transient_sculpt": {
    "enabled": false
  },
  "runtime_sec": 482.54336881637573,
  "out_path": "C:\\Users\\goku\\Documents\\SS-hangman-game\\backend\\data\\jobs\\03777ca0553e4d72a9dd1699b0713003\\output\\mastered.wav"
}
```

# AuralMind Maestro v7.3 expert — Report

## Summary
- Preset: **radio_loud**
- Sample rate: **48000 Hz**
- LUFS (pre): **-22.63**
- LUFS (post): **-19.02**
- True peak (approx): **-1.00 dBFS**
- Limiter min gain (approx GR): **-14.19 dB**

- Effective softclip mix: **0.158**

## Low-end / music theory anchors
- Estimated sub fundamental f0: **109.68017578125 Hz**
- Mono-sub v2 cutoff: **110.0 Hz**
- Mono-sub v2 adaptive mix: **0.52**

## Stereo enhancements
- Spatial Realism Enhancer: frequency-dependent width + correlation guard
- NEW CGMS MicroShift: micro-delay applied to SIDE high-band only, correlation-guarded

- MicroDetail recovery: **1.0** (corr=0.9656792644101913, eff_amount=0.2)

## Movement / HookLift
- Movement enabled: **True** (amount=0.1)
- HookLift enabled: **True** (mix=0.23)
  - Auto mask percentile: **75.0**

## Stem separation (HT-Demucs)
- Enabled: **True**
- Model: **htdemucs**
- Sources: **['drums', 'bass', 'other', 'vocals']**

## Loudness Governor
- Requested target LUFS: **-11.0**
- Governor final target LUFS: **-12.8**
- Governor steps: **11** (binary search)
- Limiter mode: **v2**
- Limiter avg gain (dB): **-3.58** (closer to 0 = less overall limiting)
  If limiter GR exceeded the ceiling, the governor backed off the LUFS target.

## JSON dump
```json
{
  "preset": "radio_loud",
  "sr": 48000,
  "target_lufs_requested": -11.0,
  "governor_target_lufs": -12.8,
  "governor_steps": 11,
  "governor_gr_limit_db": -1.3,
  "lufs_pre": -22.62530277726857,
  "lufs_post": -19.017528681584047,
  "true_peak_dbfs": -0.9999997091223114,
  "limiter_mode": "v2",
  "limiter_min_gain_db": -14.190360802038535,
  "limiter_avg_gr_db": -3.5818024820360828,
  "softclip_mix_effective": 0.15839999999999999,
  "sub_f0_hz": 109.68017578125,
  "mono_sub_cutoff_hz": 110.0,
  "mono_sub_mix": 0.52,
  "microdetail": {
    "enabled": 1.0,
    "corr": 0.9656792644101913,
    "guard": 1.0,
    "eff_amount": 0.2,
    "threshold_db": -34.0,
    "max_boost_db": 3.2,
    "mix": 0.6
  },
  "movement": {
    "enabled": true,
    "amount": 0.1
  },
  "hooklift": {
    "enabled": true,
    "mix": 0.23,
    "air_hz": 7200.0,
    "width_gain": 0.18,
    "air_gain": 0.14,
    "auto": true,
    "auto_percentile": 75.0
  },
  "stems": {
    "enabled": true,
    "model_name": "htdemucs",
    "device": "cpu",
    "split": true,
    "overlap": 0.25,
    "shifts": 1,
    "model_sr": 48000,
    "sr": 48000,
    "sources": [
      "drums",
      "bass",
      "other",
      "vocals"
    ]
  },
  "transient_sculpt": {
    "enabled": false,
    "crest_db": 20.276006495165788,
    "guard": 0.0
  },
  "runtime_sec": 828.1307282447815,
  "out_path": "C:\\Users\\goku\\Documents\\SS-hangman-game\\backend\\data\\jobs\\71f6c53a8bb44840af69ccc8524e4143\\output\\mastered.wav"
}
```

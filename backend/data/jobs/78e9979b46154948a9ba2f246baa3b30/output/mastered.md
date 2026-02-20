# AuralMind Maestro v7.3 expert — Report

## Summary
- Preset: **club**
- Sample rate: **48000 Hz**
- LUFS (pre): **-18.73**
- LUFS (post): **-16.64**
- True peak (approx): **-1.00 dBFS**
- Limiter min gain (approx GR): **-10.95 dB**

## Low-end / music theory anchors
- Estimated sub fundamental f0: **86.7919921875 Hz**
- Mono-sub v2 cutoff: **110.0 Hz**
- Mono-sub v2 adaptive mix: **0.55**

## Stereo enhancements
- Spatial Realism Enhancer: frequency-dependent width + correlation guard
- NEW CGMS MicroShift: micro-delay applied to SIDE high-band only, correlation-guarded

- MicroDetail recovery: **1.0** (corr=0.6321069228622809, eff_amount=0.22)

## Movement / HookLift
- Movement enabled: **True** (amount=0.1)
- HookLift enabled: **True** (mix=0.22)
  - Auto mask percentile: **75.0**

## Stem separation (HT-Demucs)
- Enabled: **True**
- Model: **htdemucs**
- Sources: **['drums', 'bass', 'other', 'vocals']**

## Loudness Governor
- Requested target LUFS: **-10.4**
- Governor final target LUFS: **-12.2**
- Governor steps: **11** (binary search)
- Limiter mode: **v2**
- Limiter avg gain (dB): **-3.29** (closer to 0 = less overall limiting)
  If limiter GR exceeded the ceiling, the governor backed off the LUFS target.

## JSON dump
```json
{
  "preset": "club",
  "sr": 48000,
  "target_lufs_requested": -10.4,
  "governor_target_lufs": -12.2,
  "governor_steps": 11,
  "governor_gr_limit_db": -1.6,
  "lufs_pre": -18.733632249693844,
  "lufs_post": -16.63957249230634,
  "true_peak_dbfs": -1.0000002900129947,
  "limiter_mode": "v2",
  "limiter_min_gain_db": -10.950561870628512,
  "limiter_avg_gr_db": -3.2890466698293466,
  "sub_f0_hz": 86.7919921875,
  "mono_sub_cutoff_hz": 110.0,
  "mono_sub_mix": 0.55,
  "microdetail": {
    "enabled": 1.0,
    "corr": 0.6321069228622809,
    "guard": 1.0,
    "eff_amount": 0.22,
    "threshold_db": -34.0,
    "max_boost_db": 3.5,
    "mix": 0.65
  },
  "movement": {
    "enabled": true,
    "amount": 0.1
  },
  "hooklift": {
    "enabled": true,
    "mix": 0.22,
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
    "crest_db": 19.29913457233497,
    "guard": 0.007311788088728899
  },
  "runtime_sec": 623.6196374893188,
  "out_path": "C:\\Users\\goku\\Documents\\SS-hangman-game\\backend\\data\\jobs\\78e9979b46154948a9ba2f246baa3b30\\output\\mastered.wav"
}
```

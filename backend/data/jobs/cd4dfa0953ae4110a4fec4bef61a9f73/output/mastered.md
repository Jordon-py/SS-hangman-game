# AuralMind Maestro v7.3 expert — Report

## Summary
- Preset: **club**
- Sample rate: **48000 Hz**
- LUFS (pre): **-17.70**
- LUFS (post): **-16.06**
- True peak (approx): **-1.00 dBFS**
- Limiter min gain (approx GR): **-10.78 dB**

## Low-end / music theory anchors
- Estimated sub fundamental f0: **86.24267578125 Hz**
- Mono-sub v2 cutoff: **110.0 Hz**
- Mono-sub v2 adaptive mix: **0.55**

## Stereo enhancements
- Spatial Realism Enhancer: frequency-dependent width + correlation guard
- NEW CGMS MicroShift: micro-delay applied to SIDE high-band only, correlation-guarded

- MicroDetail recovery: **1.0** (corr=0.8499948603678829, eff_amount=0.22)

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
- Limiter avg gain (dB): **-2.26** (closer to 0 = less overall limiting)
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
  "lufs_pre": -17.696471027813676,
  "lufs_post": -16.058804378531914,
  "true_peak_dbfs": -1.000000870903717,
  "limiter_mode": "v2",
  "limiter_min_gain_db": -10.784100694244586,
  "limiter_avg_gr_db": -2.256368892903807,
  "sub_f0_hz": 86.24267578125,
  "mono_sub_cutoff_hz": 110.0,
  "mono_sub_mix": 0.55,
  "microdetail": {
    "enabled": 1.0,
    "corr": 0.8499948603678829,
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
    "enabled": true,
    "boost_db": 0.09752824411737694,
    "mix": 0.38,
    "crest_db": 19.01439209302351,
    "guard": 0.040636768382240396,
    "max_transient_gain_db": 0.09752824157476425
  },
  "runtime_sec": 935.5982851982117,
  "out_path": "C:\\Users\\goku\\Documents\\SS-hangman-game\\backend\\data\\jobs\\cd4dfa0953ae4110a4fec4bef61a9f73\\output\\mastered.wav"
}
```

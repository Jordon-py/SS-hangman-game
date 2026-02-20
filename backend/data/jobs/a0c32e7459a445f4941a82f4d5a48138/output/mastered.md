# AuralMind Maestro v7.3 expert — Report

## Summary
- Preset: **radio_loud**
- Sample rate: **48000 Hz**
- LUFS (pre): **-21.44**
- LUFS (post): **-15.88**
- True peak (approx): **-1.00 dBFS**
- Limiter min gain (approx GR): **-9.16 dB**

## Low-end / music theory anchors
- Estimated sub fundamental f0: **96.6796875 Hz**
- Mono-sub v2 cutoff: **110.0 Hz**
- Mono-sub v2 adaptive mix: **0.52**

## Stereo enhancements
- Spatial Realism Enhancer: frequency-dependent width + correlation guard
- NEW CGMS MicroShift: micro-delay applied to SIDE high-band only, correlation-guarded

- MicroDetail recovery: **1.0** (corr=0.9241123957274092, eff_amount=0.2)

## Movement / HookLift
- Movement enabled: **True** (amount=0.1)
- HookLift enabled: **True** (mix=0.2)
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
- Limiter avg gain (dB): **-1.98** (closer to 0 = less overall limiting)
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
  "lufs_pre": -21.436221293747835,
  "lufs_post": -15.877463131966456,
  "true_peak_dbfs": -0.9999997091223114,
  "limiter_mode": "v2",
  "limiter_min_gain_db": -9.160465025965939,
  "limiter_avg_gr_db": -1.9794826547983955,
  "sub_f0_hz": 96.6796875,
  "mono_sub_cutoff_hz": 110.0,
  "mono_sub_mix": 0.52,
  "microdetail": {
    "enabled": 1.0,
    "corr": 0.9241123957274092,
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
    "mix": 0.2,
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
    "boost_db": 0.2490785807369545,
    "mix": 0.34,
    "crest_db": 18.662254435922424,
    "guard": 0.11321753669861567,
    "max_transient_gain_db": 0.24907858669757843
  },
  "runtime_sec": 884.1171395778656,
  "out_path": "C:\\Users\\goku\\Documents\\SS-hangman-game\\backend\\data\\jobs\\a0c32e7459a445f4941a82f4d5a48138\\output\\mastered.wav"
}
```

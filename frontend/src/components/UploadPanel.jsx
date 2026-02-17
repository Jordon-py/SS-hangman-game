import React, { useMemo, useState } from 'react';

const PRESETS = [
  { id: 'hi_fi_streaming', name: 'Hi-Fi Streaming', description: 'Balanced clarity, streaming-safe headroom.' },
  { id: 'radio_loud', name: 'Radio Loud', description: 'Forward energy with tasteful loudness push.' },
  { id: 'cinematic', name: 'Wide Cinematic', description: 'Open spatial feel with preserved dynamics.' },
  { id: 'club', name: 'Club Impact', description: 'Low-end focus and punch for louder systems.' },
];

export default function UploadPanel({ onSubmit, loading }) {
  const [target, setTarget] = useState(null);
  const [reference, setReference] = useState(null);
  const [preset, setPreset] = useState('hi_fi_streaming');
  const [monoSub, setMonoSub] = useState(false);
  const [dynamicEq, setDynamicEq] = useState(false);
  const [truepeakLimiter, setTruepeakLimiter] = useState(false);
  const [targetLufs, setTargetLufs] = useState('');
  const [truePeakCeiling, setTruePeakCeiling] = useState('-1.0');
  const [openAdvanced, setOpenAdvanced] = useState(false);
  const [formError, setFormError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const selectedTargetName = useMemo(() => target?.name || 'Drop target audio here or click to browse', [target]);

  const onDropTarget = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setTarget(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);
    if (!target) {
      setFormError('Please choose a target file');
      return;
    }

    const formData = new FormData();
    formData.append('target', target);
    if (reference) formData.append('reference', reference);

    const settings = {
      preset,
      mono_sub: monoSub,
      dynamic_eq: dynamicEq,
      truepeak_limiter: truepeakLimiter,
      target_lufs: targetLufs ? parseFloat(targetLufs) : undefined,
      true_peak_ceiling: truePeakCeiling ? parseFloat(truePeakCeiling) : -1.0,
    };
    onSubmit(formData, settings);
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <fieldset disabled={loading}>
        <legend>Upload & Mastering Settings</legend>

        <div
          className={`dropzone ${dragActive ? 'is-dragging' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDropTarget}
        >
          <label htmlFor="target-input" className="dropzone-label">{selectedTargetName}</label>
          <input
            id="target-input"
            type="file"
            accept=".wav,.mp3,.aiff,.flac,.ogg"
            required
            onChange={(e) => setTarget(e.target.files?.[0] || null)}
          />
        </div>

        <div className="field">
          <label htmlFor="reference-input">Reference track (optional)</label>
          <input
            id="reference-input"
            type="file"
            accept=".wav,.mp3,.aiff,.flac,.ogg"
            onChange={(e) => setReference(e.target.files?.[0] || null)}
          />
        </div>

        <div className="preset-grid" role="radiogroup" aria-label="Mastering presets">
          {PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`preset-card ${preset === item.id ? 'is-active' : ''}`}
              onClick={() => setPreset(item.id)}
            >
              <strong>{item.name}</strong>
              <span>{item.description}</span>
            </button>
          ))}
        </div>

        <details className="advanced" open={openAdvanced} onToggle={(e) => setOpenAdvanced(e.currentTarget.open)}>
          <summary>Advanced modules (all default OFF for safety)</summary>
          <div className="field checkbox-group">
            <label>
              <input type="checkbox" checked={monoSub} onChange={(e) => setMonoSub(e.target.checked)} />
              Sub-band mono + phase anchor
            </label>
            <label>
              <input type="checkbox" checked={dynamicEq} onChange={(e) => setDynamicEq(e.target.checked)} />
              Masking-aware dynamic EQ (200–500Hz)
            </label>
            <label>
              <input type="checkbox" checked={truepeakLimiter} onChange={(e) => setTruepeakLimiter(e.target.checked)} />
              True-peak safe limiter + soft clip
            </label>
          </div>
          <div className="field field-grid">
            <div>
              <label htmlFor="target-lufs">Target LUFS (optional)</label>
              <input id="target-lufs" type="number" step="0.1" value={targetLufs} onChange={(e) => setTargetLufs(e.target.value)} placeholder="-11 to -9" />
            </div>
            <div>
              <label htmlFor="truepeak">True Peak Ceiling (dBTP)</label>
              <input id="truepeak" type="number" step="0.1" value={truePeakCeiling} onChange={(e) => setTruePeakCeiling(e.target.value)} />
            </div>
          </div>
        </details>

        {formError && <p className="error" role="alert">{formError}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Uploading…' : 'Start Mastering'}</button>
      </fieldset>
    </form>
  );
}

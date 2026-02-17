import React, { useState } from 'react';

export default function UploadPanel({ onSubmit, loading }) {
  const [target, setTarget] = useState(null);
  const [reference, setReference] = useState(null);
  const [preset, setPreset] = useState('hi_fi_streaming');
  const [enableDemucs, setEnableDemucs] = useState(false);
  const [monoSub, setMonoSub] = useState(true);
  const [dynamicEq, setDynamicEq] = useState(true);
  const [targetLufs, setTargetLufs] = useState('');
  const [formError, setFormError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);
    if (!target) {
      setFormError('Please choose a target file');
      return;
    }

    const formData = new FormData();
    formData.append('target', target);
    if (reference) {
      formData.append('reference', reference);
    }

    const settings = {
      preset,
      enable_demucs: enableDemucs,
      mono_sub: monoSub,
      dynamic_eq: dynamicEq,
      target_lufs: targetLufs ? parseFloat(targetLufs) : undefined,
    };
    onSubmit(formData, settings);
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <fieldset disabled={loading}>
        <legend>Upload &amp; Settings</legend>
        <div className="field">
          <label htmlFor="target-input">Target audio *</label>
          <input
            id="target-input"
            type="file"
            accept=".wav,.mp3,.aiff,.flac,.ogg"
            required
            onChange={(e) => setTarget(e.target.files[0])}
          />
        </div>
        <div className="field">
          <label htmlFor="reference-input">Reference track (optional)</label>
          <input
            id="reference-input"
            type="file"
            accept=".wav,.mp3,.aiff,.flac,.ogg"
            onChange={(e) => setReference(e.target.files[0])}
          />
        </div>
        <div className="field">
          <label htmlFor="preset-select">Preset</label>
          <select id="preset-select" value={preset} onChange={(e) => setPreset(e.target.value)}>
            <option value="hi_fi_streaming">Hi-Fi Streaming</option>
            <option value="radio_loud">Radio Loud</option>
            <option value="cinematic">Cinematic</option>
            <option value="club">Club</option>
          </select>
        </div>
        <div className="field checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={enableDemucs}
              onChange={(e) => setEnableDemucs(e.target.checked)}
            />
            Enable Demucs separation
          </label>
          <label>
            <input type="checkbox" checked={monoSub} onChange={(e) => setMonoSub(e.target.checked)} />
            Mono sub
          </label>
          <label>
            <input type="checkbox" checked={dynamicEq} onChange={(e) => setDynamicEq(e.target.checked)} />
            Dynamic EQ
          </label>
        </div>
        <div className="field">
          <label htmlFor="target-lufs">Target LUFS (optional)</label>
          <input
            id="target-lufs"
            type="number"
            step="0.1"
            placeholder="e.g. -14"
            value={targetLufs}
            onChange={(e) => setTargetLufs(e.target.value)}
          />
        </div>
        {formError && <p className="error" role="alert">{formError}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading…' : 'Start Mastering'}
        </button>
      </fieldset>
    </form>
  );
}

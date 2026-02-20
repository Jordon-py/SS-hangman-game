import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider.jsx';
import Scene from '../components/Scene.jsx';
import '../styles/landing.css';

const FEATURE_ITEMS = [
  {
    title: 'Reference-Aware Tone Match',
    description: 'Preserve intent while aligning spectral balance with your reference aesthetic.',
  },
  {
    title: 'Stage-by-Stage Visibility',
    description: 'Inspect queue, processing, logs, and report output in one clean workspace.',
  },
  {
    title: 'Modern Stereo Translation',
    description: 'Built for impact on headphones, streaming platforms, and club playback.',
  },
];

const LIVE_METRICS = [
  { label: 'Real-Time Pipeline', value: '4 Stages' },
  { label: 'Preset Architectures', value: '4 Modes' },
  { label: 'Delivery Focus', value: 'Streaming + WAV' },
];

const COMMAND_RAIL = ['Spatial Engine', 'Spectral Match', 'True-Peak Guard'];

export default function Landing() {
  const { user, loading } = useAuth();

  return (
    <div className="landing-page">
      <div className="landing-canvas-wrap" aria-hidden="true">
        <Scene />
      </div>

      <main className="landing-overlay">
        <section className="landing-grid">
          <article className="landing-hero-card" aria-label="AuralMind landing hero">
            <p className="hero-eyebrow">Cinematic Audio Intelligence</p>
            <p className="hero-nameplate" aria-hidden="true">
              AuralMind
            </p>
            <h1 className="hero-title">AuralMind</h1>
            <p className="hero-subtitle">
              Master your sessions with a spatial interface tuned for precision, clarity, and modern impact.
            </p>

            <div className="hero-command-rail" aria-label="AuralMind core systems">
              {COMMAND_RAIL.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="hero-actions">
              {loading ? (
                <span className="hero-loading" role="status" aria-live="polite">
                  Restoring session...
                </span>
              ) : (
                <Link className="btn-primary" to={user ? '/app' : '/signin'}>
                  {user ? 'Go to App' : 'Sign In'}
                </Link>
              )}
              <Link className="btn-secondary" to="/signin">
                Open Sign In
              </Link>
            </div>

            <div className="hero-metric-grid">
              {LIVE_METRICS.map((metric) => (
                <article key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </article>
              ))}
            </div>
          </article>

          <aside className="landing-info-card" aria-label="AuralMind feature highlights">
            <p className="hero-eyebrow">Platform Highlights</p>
            <h2>Built for engineers who care about translation.</h2>
            <p className="landing-info-copy">
              Precision-first controls with cinematic feedback for faster mastering decisions.
            </p>
            <ul className="landing-feature-list">
              {FEATURE_ITEMS.map((item) => (
                <li key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="landing-ticker" aria-label="Mastering capabilities">
          <div className="landing-ticker-track">
            <span>Adaptive Match EQ</span>
            <span>True-Peak Safe Limiting</span>
            <span>Dynamic MID Control</span>
            <span>Reference-Aware Workflow</span>
            <span>Phase-Safe Stereo Imaging</span>
            <span>Adaptive Match EQ</span>
            <span>True-Peak Safe Limiting</span>
            <span>Dynamic MID Control</span>
            <span>Reference-Aware Workflow</span>
            <span>Phase-Safe Stereo Imaging</span>
          </div>
        </section>
      </main>
    </div>
  );
}

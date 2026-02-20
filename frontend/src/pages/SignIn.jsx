import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider.jsx';
import '../styles/auth.css';

export default function SignIn() {
  const { user, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!loading && user) {
    return <Navigate to="/app" replace />;
  }

  const from = location.state?.from?.pathname === '/app' ? '/app' : '/app';
  const isBusy = loading || submitting;

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (authError) {
      setError(authError?.message || 'Unable to sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="signin-title">
        <p className="auth-eyebrow">AuralMind Access</p>
        <h1 id="signin-title">Sign In</h1>
        <p className="auth-copy">Use any valid email and a password with at least 6 characters.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label className="auth-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary auth-submit" disabled={isBusy}>
            {isBusy ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <Link className="auth-link" to="/">
          Back to Landing
        </Link>
      </section>
    </main>
  );
}

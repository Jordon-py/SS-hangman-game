import React, { useEffect, useMemo, useState } from 'react';
import { createJob, fetchJobStatus } from './api.js';
import JobDetail from './components/JobDetail.jsx';
import JobList from './components/JobList.jsx';
import UploadPanel from './components/UploadPanel.jsx';

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (jobs.length === 0) return undefined;

    const interval = setInterval(async () => {
      const activeJobs = jobs.filter((job) => ['queued', 'processing'].includes(job.status));
      if (activeJobs.length === 0) return;

      try {
        const updatedStatuses = await Promise.all(activeJobs.map((job) => fetchJobStatus(job.id)));
        const statusById = new Map(updatedStatuses.map((job) => [job.id, job]));
        setJobs((prevJobs) => prevJobs.map((job) => statusById.get(job.id) ?? job));
      } catch (pollError) {
        console.error(pollError);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [jobs]);

  const handleSubmit = async (formData, settings) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createJob(formData, settings);
      setJobs((prev) => [res, ...prev]);
      setSelectedJobId(res.id);
    } catch (submitError) {
      setError(submitError.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  const selectedJob = jobs.find((job) => job.id === selectedJobId) || null;
  const activeCount = useMemo(
    () => jobs.filter((job) => ['queued', 'processing'].includes(job.status)).length,
    [jobs]
  );
  const completedCount = useMemo(() => jobs.filter((job) => job.status === 'completed').length, [jobs]);
  const failedCount = useMemo(
    () => jobs.filter((job) => ['failed', 'cancelled'].includes(job.status)).length,
    [jobs]
  );
  const averageProgress = useMemo(
    () => (jobs.length ? Math.round(jobs.reduce((sum, job) => sum + (job.progress || 0), 0) / jobs.length) : 0),
    [jobs]
  );

  return (
    <div className="app-shell">
      <div className="ambient" aria-hidden="true">
        <span className="blob blob-a" />
        <span className="blob blob-b" />
        <span className="blob blob-c" />
      </div>
      <div className="grain" aria-hidden="true" />

      <div className="container">
        <header className="app-header hero-panel">
          <p className="eyebrow">AuralMind Mastering Lab</p>
          <h1>Precision Mastering for Modern Records</h1>
          <p className="subtle">Premium workflow tuned for impact, translation, and stereo confidence.</p>

          <div className="metric-ribbon">
            <article className="metric-card">
              <span>Active</span>
              <strong>{activeCount}</strong>
            </article>
            <article className="metric-card">
              <span>Completed</span>
              <strong>{completedCount}</strong>
            </article>
            <article className="metric-card">
              <span>Issues</span>
              <strong>{failedCount}</strong>
            </article>
            <article className="metric-card">
              <span>Avg Progress</span>
              <strong>{averageProgress}%</strong>
            </article>
          </div>
          <div className="signal-strip" aria-hidden="true">
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>
        </header>

        <UploadPanel onSubmit={handleSubmit} loading={loading} />
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <JobList jobs={jobs} onSelect={setSelectedJobId} />
        {selectedJob && (
        <JobDetail
          job={selectedJob}
        />
      )}
      </div>
    </div>
  );
}

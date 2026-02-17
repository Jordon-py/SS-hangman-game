import React, { useEffect, useMemo, useState } from 'react';
import { createJob, fetchJobStatus, fetchLogs, fetchReport } from './api.js';
import JobDetail from './components/JobDetail.jsx';
import JobList from './components/JobList.jsx';
import UploadPanel from './components/UploadPanel.jsx';

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (jobs.length === 0) return;
    const interval = setInterval(async () => {
      try {
        const updated = await Promise.all(jobs.map((job) => fetchJobStatus(job.id)));
        setJobs(updated);
      } catch (err) {
        console.error(err);
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [jobs.length]);

  const handleSubmit = async (formData, settings) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createJob(formData, settings);
      setJobs((prev) => [res, ...prev]);
      setSelectedJobId(res.id);
    } catch (err) {
      setError(err.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || null;
  const activeCount = useMemo(() => jobs.filter((j) => ['queued', 'processing'].includes(j.status)).length, [jobs]);

  return (
    <div className="container">
      <header className="app-header">
        <h1>AuralMind Mastering</h1>
        <p className="subtle">Premium mastering workflow • Active jobs: {activeCount}</p>
      </header>
      <UploadPanel onSubmit={handleSubmit} loading={loading} />
      {error && <p className="error" role="alert">{error}</p>}
      <JobList jobs={jobs} onSelect={setSelectedJobId} />
      {selectedJob && (
        <JobDetail
          job={selectedJob}
          fetchReport={() => fetchReport(selectedJob.id)}
          fetchLogs={(lines) => fetchLogs(selectedJob.id, lines)}
        />
      )}
    </div>
  );
}

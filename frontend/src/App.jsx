import React, { useEffect, useMemo, useState } from 'react';
import React, { useEffect, useState } from 'react';
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
        const activeJobs = jobs.filter((job) => ['queued', 'processing'].includes(job.status));
        if (activeJobs.length === 0) return;

        const updatedStatuses = await Promise.all(activeJobs.map((job) => fetchJobStatus(job.id)));
        
        setJobs((prevJobs) => {
          const newJobs = [...prevJobs];
          updatedStatuses.forEach((updatedJob) => {
            const index = newJobs.findIndex((j) => j.id === updatedJob.id);
            if (index !== -1) {
              newJobs[index] = updatedJob;
            }
          });
          return newJobs;
        });
      } catch (err) {
        console.error(err);
      }
    }, 2500);
    }, 3000);
    return () => clearInterval(interval);
  }, [jobs.length]);

  const handleSubmit = async (formData, settings) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createJob(formData, settings);
      setJobs((prev) => [res, ...prev]);
      setSelectedJobId(res.id);
      setJobs((prev) => [...prev, res]);
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

  return (
    <div className="container">
      <h1>AuralMind Mastering</h1>
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

import React, { useEffect, useState } from 'react';
import { cancelJob, downloadOutput, fetchLogs as fetchJobLogs, fetchReport as fetchJobReport } from '../api.js';

export default function JobDetail({ job }) {
  const [report, setReport] = useState(null);
  const [logs, setLogs] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let inFlight = false;

    async function load() {
      if (inFlight) return;
      inFlight = true;
      setLoading(true);
      setError(null);
      try {
        const reportPromise =
          job.status === 'completed' ? fetchJobReport(job.id).catch(() => null) : Promise.resolve(null);
        const logsPromise = fetchJobLogs(job.id, 80).catch(() => '');
        const [rep, log] = await Promise.all([reportPromise, logsPromise]);
        if (!cancelled) {
          setReport(rep?.report || null);
          setLogs(log || '');
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to fetch details');
      } finally {
        inFlight = false;
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const shouldPoll = ['queued', 'processing'].includes(job.status);
    if (!shouldPoll) {
      return () => {
        cancelled = true;
      };
    }

    const interval = setInterval(load, 4000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [job.id, job.status]);

  const handleDownloadMaster = async () => {
    try {
      const { blob, filename } = await downloadOutput(job.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Download failed');
    }
  };

  const handleDownloadReport = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${job.id}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this job?')) return;
    try {
      await cancelJob(job.id);
      // Ideally, we should refresh the job status here, but the main loop in App will pick it up
      // Or we can manually trigger a refresh if passed a prop
    } catch (err) {
      setError(err.message || 'Failed to cancel job');
    }
  };

  return (
    <div className="job-detail" aria-labelledby={`job-${job.id}`}>
      <h2 id={`job-${job.id}`}>Job {job.id.slice(0, 8)} details</h2>
      {loading && <p>Loading details…</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {!loading && !error && (
        <>
          <div className="actions-row">
            <button type="button" onClick={handleDownloadReport} disabled={!report}>
              Download Report
            </button>
            {job.status === 'completed' && <button type="button" onClick={handleDownloadMaster}>Download Master</button>}
          </div>
          <section className="logs">
            <h3>Logs (tail)</h3>
            <pre>{logs || 'No logs yet.'}</pre>
          </section>
          <section className="report">
            <h3>Report</h3>
            {report ? <pre>{JSON.stringify(report, null, 2)}</pre> : <p>No report available yet.</p>}
          </section>
          <div className="actions-row">
            {job.status !== 'completed' && job.status !== 'cancelled' && job.status !== 'failed' && (
              <button type="button" onClick={handleCancel} className="cancel-btn">
                Cancel Job
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { downloadOutput } from '../api.js';

export default function JobDetail({ job, fetchReport, fetchLogs }) {
  const [report, setReport] = useState(null);
  const [logs, setLogs] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [rep, log] = await Promise.all([fetchReport().catch(() => null), fetchLogs(80).catch(() => '')]);
        if (!cancelled) {
          setReport(rep?.report || null);
          setLogs(log || '');
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to fetch details');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [job.id, fetchLogs, fetchReport]);

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

  return (
    <div className="job-detail" aria-labelledby={`job-${job.id}`}>
      <h2 id={`job-${job.id}`}>Job {job.id.slice(0, 8)} details</h2>
      {loading && <p>Loading details…</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {!loading && !error && (
        <>
          <div className="actions-row">
            <button type="button" onClick={handleDownloadReport} disabled={!report}>Download Report</button>
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
        </>
      )}
    </div>
  );
}

import React from 'react';

function formatProgress(value) {
  const safe = Number.isFinite(value) ? Math.min(Math.max(value, 0), 100) : 0;
  return safe.toFixed(1);
}

function formatEta(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  const total = Math.max(0, Math.round(seconds));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  if (mins === 0) return `${secs}s left`;
  if (secs === 0) return `${mins}m left`;
  return `${mins}m ${secs}s left`;
}

export default function JobList({ jobs, onSelect }) {
  if (jobs.length === 0) {
    return <p>No jobs yet. Start by uploading a track above.</p>;
  }

  return (
    <table className="job-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Progress</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => {
          const progressText = formatProgress(job.progress);
          const etaText = ['queued', 'processing'].includes(job.status) ? formatEta(job.eta_seconds) : null;
          return (
            <tr key={job.id} onClick={() => onSelect(job.id)} className="job-row" aria-label={`Open job ${job.id}`}>
              <td>{job.id.slice(0, 8)}</td>
              <td><span className={`badge status-${job.status}`}>{job.status}</span></td>
              <td>
                <div className="progress-bar" aria-valuenow={Number(progressText)} aria-valuemin="0" aria-valuemax="100" role="progressbar">
                  <div className="progress" style={{ width: `${progressText}%` }} />
                </div>
                <div className="progress-meta">
                  <small>{progressText}%</small>
                  {etaText && <small>{etaText}</small>}
                </div>
                <small className="progress-stage">{job.current_stage || 'Waiting for stage info'}</small>
              </td>
              <td>{job.created_at ? new Date(job.created_at).toLocaleTimeString() : '—'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

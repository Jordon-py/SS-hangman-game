import React from 'react';

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
        {jobs.map((job) => (
          <tr key={job.id} onClick={() => onSelect(job.id)} className="job-row" aria-label={`Open job ${job.id}`}>
            <td>{job.id.slice(0, 8)}</td>
            <td><span className={`badge status-${job.status}`}>{job.status}</span></td>
            <td>
              <div className="progress-bar" aria-valuenow={job.progress} aria-valuemin="0" aria-valuemax="100" role="progressbar">
                <div className="progress" style={{ width: `${job.progress}%` }} />
              </div>
              <small>{Math.round(job.progress)}%</small>
            </td>
            <td>{new Date(job.created_at).toLocaleTimeString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

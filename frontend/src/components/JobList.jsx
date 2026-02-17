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
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => (
          <tr key={job.id} onClick={() => onSelect(job.id)} className="job-row">
            <td>{job.id.slice(0, 8)}</td>
            <td>{job.status}</td>
            <td>
              <div className="progress-bar" aria-valuenow={job.progress} aria-valuemin="0" aria-valuemax="100">
                <div className="progress" style={{ width: `${job.progress}%` }} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

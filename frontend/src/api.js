const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function apiFetch(path, { method = 'GET', headers = {}, body = null, timeout = 30000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body,
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      const errorBody = await res.text();
      let msg = `Request failed: ${res.status}`;
      try {
        const data = JSON.parse(errorBody);
        msg = data.detail || data.message || msg;
      } catch (_) {
        msg = errorBody || msg;
      }
      throw new Error(msg);
    }
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await res.json();
    }
    return res;
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw err;
  }
}

export async function createJob(formData, settings) {
  const multipart = new FormData();
  for (const [key, value] of formData.entries()) {
    multipart.append(key, value);
  }
  multipart.append('settings_json', JSON.stringify(settings));
  return await apiFetch('/api/jobs', { method: 'POST', body: multipart });
}

export async function fetchJobStatus(id) {
  return await apiFetch(`/api/jobs/${id}`);
}

export async function fetchReport(id) {
  return await apiFetch(`/api/jobs/${id}/report`);
}

export async function fetchLogs(id, lines = 50) {
  const res = await apiFetch(`/api/jobs/${id}/logs?lines=${lines}`);
  return await res.text();
}

export async function cancelJob(id) {
  return await apiFetch(`/api/jobs/${id}/cancel`, { method: 'POST' });
}

export async function downloadOutput(id) {
  const res = await apiFetch(`/api/jobs/${id}/download`);
  const blob = await res.blob();
  const filename =
    res.headers.get('content-disposition')?.split('filename=')[1] || `master_${id}.wav`;
  return { blob, filename };
}

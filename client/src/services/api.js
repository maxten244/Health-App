const API_URL = import.meta.env.VITE_API_URL || '';

function getCredentials() {
  return 'include';
}

export async function api(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_URL}${path}`;
  const hasJsonBody =
    options.body !== undefined &&
    options.body !== null &&
    !(options.body instanceof FormData);

  const res = await fetch(url, {
    ...options,
    credentials: getCredentials(),
    headers: {
      ...(hasJsonBody ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText || 'Request failed');
  return data;
}

export async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    credentials: getCredentials(),
    headers: {
      ...options.headers,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || res.statusText || 'Request failed');
  }

  return res;
}

export function apiGet(path) {
  return api(path, { method: 'GET' });
}

export function apiPost(path, body) {
  return api(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
}

export function apiPatch(path, body) {
  return api(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined });
}

export function apiDelete(path) {
  return api(path, { method: 'DELETE' });
}

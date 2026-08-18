const DEFAULT_BASE_URL = 'https://mate.academy/students-api';

const configuredBaseUrl = import.meta.env?.VITE_API_URL;

export const API_BASE_URL = (configuredBaseUrl || DEFAULT_BASE_URL).replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json; charset=utf-8' } : {}),
      ...options.headers,
    },
  });

  let data = null;
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = text || null;
  }

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'error' in data
        ? data.error
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status);
  }

  return data;
}

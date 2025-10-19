const BASE_URL = 'https://mate-academy.github.io/fe-students-api';

export const get = async (endpoint) => {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to load ${endpoint}`);
  }
  return response.json();
};

export const post = async (endpoint, data) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to post to ${endpoint}`);
  }

  return response.json();
};

export const put = async (endpoint, data) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update ${endpoint}`);
  }

  return response.json();
};

export const remove = async (endpoint) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete ${endpoint}`);
  }
};

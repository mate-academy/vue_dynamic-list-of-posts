const BASE_URL = 'https://mate.academy/students-api';

export const client = {
  async get(url) {
    const response = await fetch(`${BASE_URL}${url}`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return response.json();
  },

  async post(url, data) {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create data');
    }
    return response.json();
  },

  async patch(url, data) {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update data');
    }
    return response.json();
  },

  async delete(url) {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete data');
    }
    return response.json();
  },
};

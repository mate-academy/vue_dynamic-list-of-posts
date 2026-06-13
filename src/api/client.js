const BASE_URL = 'https://mate.academy/students-api';

function request(url, options) {
  return fetch(`${BASE_URL}${url}`, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      return response.json();
    });
}

export const client = {
  get(url) {
    return request(url);
  },

  post(url, data) {
    return request(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  },

  patch(url, data) {
    return request(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  },

  delete(url) {
    return request(url, {
      method: 'DELETE',
    });
  },
};

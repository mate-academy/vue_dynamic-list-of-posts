const BASE_URL = 'https://mate.academy/students-api';

function wait(delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

const requestMethod = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

function request(url, method = requestMethod.GET, data = null) {
  const options = { method };

  if (data) {
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  return wait(100)
    .then(() => fetch(BASE_URL + url, options))
    .then(response => {
      if (!response.ok) {
        throw new Error();
      }

      return response.json();
    });
}

export const client = {
  get(url) {
    return request(url);
  },
  post(url, data) {
    return request(url, 'POST', data);
  },
  patch(url, data) {
    return request(url, 'PATCH', data);
  },
  delete(url) {
    return request(url, 'DELETE');
  },
};

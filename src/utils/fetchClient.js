const BASE_URL = 'https://mate.academy/students-api';


function wait(delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

function request(url, method = 'GET', data = null) {
  const options = { 
    method,
    body: data ? JSON.stringify(data) : undefined,
    headers: data 
    ? { 'Content-Type': 'application/json; charset=utf-8'}
    : undefined
   };

    return wait(300)
    .then(() => fetch(BASE_URL + url, options))
    .then(response => response.json());
  }

export const client = {
  get: (url) => request(url),
  post: (url, data) => request(url, 'POST', data),
  patch: (url, data) => request(url, 'PATCH', data),
  delete: (url) => request(url, 'DELETE'),
};


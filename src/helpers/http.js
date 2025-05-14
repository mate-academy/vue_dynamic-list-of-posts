const BASE_URL = 'https://mate.academy/students-api';

function wait(delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

async function request(
  url ,
  method,
  data = null,
) {
  const options= { method };

  if (data) {
        options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  await wait(1000);
  const response = await fetch(BASE_URL + url, options);
  return await response.json();
}

export const client = {
  get:(url) => request(url),
  post: (url, data) => request(url, 'POST', data),
  patch: (url, data) => request(url, 'PATCH', data),
  delete: (url) => request(url, 'DELETE'),
};

const BASE_URL = 'https://mate-academy.github.io/fe-students-api';
const wait = (delay) => {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
};

function request(url, method, data) {
    const options = { method };

    if (data) {
      options.body = JSON.stringify(data);
      options.headers = {
        'Content-Type': 'application/json',
      };
    }

    const fullUrl = `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;

    return wait(100)
    .then(() => fetch(fullUrl, options))
    .then(async response => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      // Виправлено одрук: "application/json" замість "aplication/json"
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }

      return response.text();
    });
};

  export const client = {
    get: (url) => request(url, 'GET'),
    post: (url, data) => request(url, 'POST', data),
    patch: (url, data) => request(url, 'PATCH', data),
    delete: (url) => request(url, 'DELETE'),
  };
 
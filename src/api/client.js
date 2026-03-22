// URL base para todas as requisições da API
const BASE_URL = 'https://mate.academy/students-api';

// Função auxiliar genérica para fazer as requisições usando o fetch nativo
function request(url, options) {
  return fetch(`${BASE_URL}${url}`, options)
    .then((response) => {
      // Se a resposta não for ok (status fora de 200-299), lançamos um erro
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      // Convertemos a resposta para JSON
      return response.json();
    });
}

// Exportamos um objeto client com métodos simples para os verbos HTTP
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

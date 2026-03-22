import { client } from './client';

// Busca todos os usuários
export function getUsers() {
  return client.get('/users');
}

// Busca um usuário específico pelo e-mail
export function getUserByEmail(email) {
  return client.get(`/users?email=${encodeURIComponent(email)}`);
}

// Cria um novo usuário
export function createUser(data) {
  return client.post('/users', data);
}

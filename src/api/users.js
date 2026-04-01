import { client } from '../utils/http';

export async function getUsers() {
  const { data }  = await client.get('/users');

  return data;
};
export async function getUser(id) {
  const { data }  = await client.get(`/users/${id}`);

  return data;
};

export async function createUser(name, email) {
  const { data } = await client.post('/users', {
    name,
    email,
  });

  return data;
}

export async function updateUser({ id, name, email }) {
  const { data } = await client.patch(`/users/${id}`, {
    name,
    email,
  });

  return data;
}

export async function deleteUser(id) {
  const { data } = await client.delete(`/users/${id}`);

  return data;
}




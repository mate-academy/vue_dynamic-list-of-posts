import { client } from "@/utils/http";

export const login = async ({ email }) => {
  const response = await client.get(`/users?email=${encodeURIComponent(email)}`);

  const data = response.data;

  return Array.isArray(data) ? (data[0] || null) : null;
}

export const register = async ({ email, name }) => {
  const response = await client.post('/users', {
    userId: Date.now(),
    email,
    name,
  });

  return response.data;
}

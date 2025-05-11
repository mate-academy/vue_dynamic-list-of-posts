import { client } from "@/utils/http";

export const getUserByEmail = async (email) => {
  const response = await client.get(`/users?email=${email}`);

  return response.data;
};

export const createUser = async (body) => {
  const response = await client.post(`/users`, body);

  return response.data;
}
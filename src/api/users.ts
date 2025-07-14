import { client } from "./clientHttp.ts";

export const getUserByEmail = (email: string) => {
  console.log('getUserByEmail')
  return client.get(`/users?email=${email}`);
};

export const addUser = async ({ name, email }: { name: string; email: string }) => {
  try {
    return await client.post("/users", { name, email });
  } catch (err) {
    console.error('addUser error:', err);
    throw err;
  }
};


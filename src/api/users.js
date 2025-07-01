import { client } from "@/utils/http";

export const getUserByEmail = async (email) => {
  try {
    const response = await client.get(`/users?email=${email}`);
    return response;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error; //new
  }
};

export const createUser = async ({ name, email }) => {
  try {
    return await client.post('/users', {
      name,
      email
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error; //new
  }
}

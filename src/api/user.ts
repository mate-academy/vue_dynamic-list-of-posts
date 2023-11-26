import axios from "axios";

import { BASE_URL } from "./const";

export const getUserByEmail = async (
  email: string
): Promise<User.Data | null> => {
  try {
    const { data } = await axios.get(`${BASE_URL}/users?email=${email}`);

    return data[0] || null;
  } catch (err) {
    return null;
  }
};

export const createUser = async ({
  email,
  name,
}: {
  email: string;
  name: string;
}): Promise<User.Data | null> => {
  try {
    const { data } = await axios.post(`${BASE_URL}/users?email=${email}`, {
      name,
      email,
    });

    return data;
  } catch (err) {
    return null;
  }
};

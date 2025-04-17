import { client } from "../utils/httpClient";

export const loginUser = (email) => client.get(`/users`, {
  params: { email },
});

export const registerUser = (email, name) => client.post(`/users`, { email, name });

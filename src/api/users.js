import { client } from "../utils/httpClient";

export const getUserbyEmail = (email) => {
    return client.get(`/users?email=${email}`)
}

export const createUser = async ({ name, username, email, phone }) => {
    return client.post("/users", { name, username, email, phone });
  };
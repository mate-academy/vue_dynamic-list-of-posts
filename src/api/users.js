import client from "../utils/httpClient.js";

export const getUser = (email) => {
  return client.get(`/users?email=${email}`).then((response) => {
    return response.data[0] || null;
  });
};

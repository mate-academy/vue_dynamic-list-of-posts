import { client } from "@/client/client";

export const getUser = (email) => {
  return client.get(`/users?email=${email}`)
}

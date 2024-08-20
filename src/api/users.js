import { client } from "@/utils/httpClient"

export const getUsers = () => {
  return client.get('/users');
}
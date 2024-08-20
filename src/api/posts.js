import { client } from "@/utils/httpClient"

export const getPosts = (userId) => {
  return client.get(`/posts?userId=${userId}`)
}
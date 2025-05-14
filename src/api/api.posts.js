import { client } from "@/utils/fetchClient"
import { getUserId } from "@/utils/UserLocaleStorage"

export const getPosts = async () => {
  return client.get(`/posts?userId=${getUserId()}`);
}

export const getPost = async (id) => {
  return await client.get(`/posts/${id}`);
}

export const deletePost = async (id) => {
  return await client.delete(`/posts/${id}`);
}

export const editPost = async (id, title, body) => {
  return await client.patch(`/posts/${id}`, {
    userId: getUserId(), title, body
  })
}

export const createPost = async (title, body) => {
  return await client.post("/posts", {userId: getUserId(), title, body});
}

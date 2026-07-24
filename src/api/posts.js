import { client } from "@/utils/http";

export const getPosts = async userId => {
  const response = await client.get(`/posts?userId=${userId}`);

  return response.data;
};

export const createPost = async ( body ) => {
  const response = await client.post("/posts", body);

  return response.data;
};

export const updatePost = async ( idPost, body ) => {
  const response = await client.patch(`/posts/${idPost}`, body);

  return response.data;
};

export const deletePost = async ( idPost ) => {
  const response = await client.delete(`/posts/${idPost}`);

  return response.data;
};

import { client } from "@/utils/http";

export const getComments = async (postId) => {
  const response = await client.get(`/comments?postId=${postId}`);

  return response.data;
};

export const createComment = async (body) => {
  const response = await client.post("/comments", body);

  return response.data;
};

export const deleteComment = async (id) => {
  const response = await client.delete(`/comments/${id}`);

  return response.data;
};

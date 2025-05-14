import { client } from "@/utils/fetchClient";

export const getComments = (id) => {
  return client.get(`/comments?postId=${id}`);
};

export const removeComments = (id) => {
  return client.delete(`/comments/${id}`);
};

export const addComments = (
  postId,
  name,
  email,
  body,
) => {
  return client.post('/comments', { postId, name, email, body });
};

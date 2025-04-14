import { client } from "./httpClients";

// export const getPosts = () => {
//   return client.get(`/posts?userId=1831`);
// };
export const getPosts = (userId) => {
  return client.get(`/posts?userId=${userId}`);
};

export const addPost = (data) => {
  return client.post("/posts", data);
};

export const deletePost = (postId) => {
  return client.delete(`/posts/${postId}`);
};

export const updatePost = ({ postId, title, body }) => {
  return client.patch(`/posts/${postId}`, {
    title,
    body,
  });
};
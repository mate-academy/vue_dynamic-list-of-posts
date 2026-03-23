import { client } from "@/utils/httpClient";

export const getPosts = () => {
  return client.get("/posts");
};

export const getPostById = (postId) => {
  return client.get("/posts/" + postId);
};

export const getPostsByUserId = (userId) => {
  return client.get("/posts?userId=" + userId);
};

export const createPost = (postData) => {
  return client.post("/posts", postData);
};

export const patchPost = (postId, postData) => {
  return client.patch("/posts/" + postId, postData);
};

export const deletePost = (postId) => {
  return client.delete("/posts/" + postId);
};

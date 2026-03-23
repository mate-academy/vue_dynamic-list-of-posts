import { client } from "@/utils/httpClient";

export const getComments = () => {
  return client.get("/comments");
};

export const getCommentById = (commentId) => {
  return client.get("/comments/" + commentId);
};

export const getCommentsByPostId = (postId) => {
  return client.get("/comments?postId=" + postId);
};

export const createComment = (commentData) => {
  return client.post("/comments", commentData);
};

export const updateComment = (commentId, commentData) => {
  return client.patch("/comments/" + commentId, commentData);
};

export const deleteComment = (commentId) => {
  return client.delete("/comments/" + commentId);
};

import { client } from "@/utils/http";

export const getCommentsByPostId = async (postId) => {
  try {
    const response = await client.get(`/comments?postId=${postId}`);
    return response;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const addNewComment = async ({postId, name, email, body}) => {
  try {
    const response = await client.post("/comments", {
      postId,
      name,
      email,
      body,
    });
    return response;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await client.delete(`/comments/${commentId}`);
    return response;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

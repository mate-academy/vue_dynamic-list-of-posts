import axios from "axios";
import { BASE_URL } from "./const";

export const getPostComments = async (
  postId: number
): Promise<Posts.Comment[] | null> => {
  try {
    const { data } = await axios.get(`${BASE_URL}/comments/?postId=${postId}`);

    return data;
  } catch {
    return null;
  }
};

export const addPostComment = async (
  newComment: Posts.NewComment & { postId: number }
): Promise<Posts.Comment | null> => {
  try {
    const { data } = await axios.post(`${BASE_URL}/comments`, newComment);

    return data;
  } catch {
    return null;
  }
};

export const removePostComment = async (commentId: number) => {
  try {
    await axios.delete(`${BASE_URL}/comments/${commentId}`);
  } catch {
    throw new Error("Can't delete post");
  }
};

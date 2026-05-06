import type { PostComment } from "../types/Comment";
import { client } from "../utils/fetchClient";

export const getCommentsByPostId = (postId: number) =>
  client.get<PostComment[]>(`/comments?postId=${postId}`);

export const createComment = (data: Omit<PostComment, "id">) =>
  client.post<PostComment>("/comments", data);

export const deleteComment = (commentId: number) =>
  client.delete(`/comments/${commentId}`);

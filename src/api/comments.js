import { client } from "@/utils/fetchClient"


export const getPostComments = postId => client.get(`/comments?postId=${postId}`);

export const deleteComment = commentId => client.delete(`/comments/${commentId}`);

export const createComment = data => client.post('/comments', data);

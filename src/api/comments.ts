import { client } from "./clientHttp.ts";

export const getCommentsByPostId = (id: number) => {
  console.log('getCommentsByPostId')
  return client.get(`/comments?postId=${id}`);
};

export const addNewComment = async ({ postId, name, email, body }: { postId: number; name: string; email: string; body: string }) => {
  try {
    return await client.post("/comments", { postId, name, email, body });
  } catch (err) {
    console.error('addNewComment error:', err);
    throw err;
  }
};

export const updatePost = async ( post : { id: number; userId: number; title: string; body: string }) => {
  try {
    return await client.patch(`/posts/${post.id}`, { post });
  } catch (err) {
    console.error('updatePost error:', err);
    throw err;
  }
};
export const deleteComment = async ( id : number) => {
  try {
    return await client.delete(`/comments/${id}`);
  } catch (err) {
    console.error('deleteComment error:', err);
    throw err;
  }
};


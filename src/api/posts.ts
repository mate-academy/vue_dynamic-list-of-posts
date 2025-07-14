import { client } from "./clientHttp.ts";

export const getPostsByUserId = (id: number) => {
  console.log('getPostsByUserId')
  return client.get(`/posts?userId=${id}`);
};

export const addNewPost = async ({ userId, title, body }: { userId: number; title: string; body: string }) => {
  try {
    return await client.post("/posts", { userId, title, body });
  } catch (err) {
    console.error('addPost error:', err);
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
export const deletePost = async ( postId : number) => {
  try {
    return await client.delete(`/posts/${postId}`);
  } catch (err) {
    console.error('updatePost error:', err);
    throw err;
  }
};


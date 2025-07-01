import { client } from "../utils/http";

export const getPostsByUserId = (id ) => {
  console.log('getPostsByUserId')
  return client.get(`/posts?userId=${id}`);
};

export const addNewPost = async ({ userId, title, body }) => {
  try {
    return await client.post("/posts", { userId, title, body });
  } catch (err) {
    console.error('addPost error:', err);
    throw err;
  }
};

export const updatePost = async ( post ) => {
  try {
    return await client.patch(`/posts/${post.id}`,  post );
  } catch (err) {
    console.error('updatePost error:', err);
    throw err;
  }
};

export const deletePost = async ( postId ) => {
  try {
    return await client.delete(`/posts/${postId}`);
  } catch (err) {
    console.error('deletePost error:', err);
    throw err;
  }
};

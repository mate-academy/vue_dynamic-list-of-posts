import { client } from "../client/client.js";

export const getPosts = (userId) => {
  return client.get(`/posts?userId=${userId}`);
};

export const createPost = async (title, body) => {
  try {
    const response = await client.post("/posts", {
      userId: 237,
      title,
      body, 
    });
    return response;
  } catch (error) {
    throw new Error("Error creating post: " + error.message);
  }
};

export const removePost = async (postId) => {
  try {
    const response = await client.delete(`/posts/${postId}`)

    return response;
  } catch (error) {
    throw new Error('error removing post', error)
  }
}

export const updatePost = async (title, body, postId) => {
  try {
    const response = await client.patch(`/posts/${postId}`, {
      title,
      body
    })

    return response
  } catch (error) {
    throw new Error('error update post', error)
  }
}

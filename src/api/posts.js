import { client } from "../utils/httpClient";

export const getPostsByUserId = (userId) => {
    return client.get(`/posts?userId=${userId}`);
}

export const createPost = (payload) => {
    return client.post(`/posts`, payload)
}

export const deletePost = (postId) => {
    return client.delete(`/posts/${postId}`)
}

export const updatePost = (postId, payload) => {
    return client.patch(`/posts/${postId}`, payload);
}
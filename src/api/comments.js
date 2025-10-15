import { client } from "../utils/httpClient";

export const getCommentsByPostId = (postId) => {
    return client.get(`/comments?postId=${postId}`)
}

export const deleteComment = (commentId) => {
    return client.delete(`/comments/${commentId}`)
}

export const createComment = (payload) => {
    return client.post(`/comments`, payload)
}
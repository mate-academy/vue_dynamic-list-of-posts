import { client } from "./httpClient"

export const getCommentsByPostId = (postId) => {
    return client.get('/comments?postId=' + postId);
}

export const addCommentsByPostId = (postId, comment) => {
    return client.post('/comments', {
        ...comment,
        postId
    });
}

export const deleteComment = (commentId) => {
    return client.delete('/comments/' + commentId);
} 
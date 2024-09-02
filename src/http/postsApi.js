import { client } from "./httpClient";

const USER_ID = 1373;

export const getPosts = () => {
    return client.get('/posts?userId=' + USER_ID);
}

export const addPost = (post) => {
    return client.post('/posts', {
        ...post,
        userId: USER_ID,
    });
}

export const editPostOnServer = (updated) => {
    return client.patch('/posts/' + updated.id, {
        ...updated,
        userId: USER_ID,
    });
}

export const removePost = (postId) => {
    return client.delete('/posts/' + postId);
}
const BASE_URL = 'https://mate.academy/students-api';

export function getPosts(userId) {
  return fetch(`${BASE_URL}/posts?userId=${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load posts');
      }

      return response.json();
    });
}

export function createPost(post) {
  return fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  }).then(response => {
    if (!response.ok) {
      throw new Error('Failed to create post');
    }

    return response.json();
  });
}

export function deletePost(postId) {
  return fetch(`${BASE_URL}/posts/${postId}`, {
    method: 'DELETE',
  }).then(response => {
    if (!response.ok) {
      throw new Error('Failed to delete post');
    }

    return response;
  });
}

export function updatePost(post) {
  return fetch(`${BASE_URL}/posts/${post.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: post.title,
      body: post.body,
    }),
  }).then(response => {
    if (!response.ok) {
      throw new Error('Failed to update post');
    }

    return response.json();
  });
}

export function getComments(postId) {
  return fetch(`${BASE_URL}/comments?postId=${postId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load comments');
      }

      return response.json();
    });
}
export function deleteComment(commentId) {
  return fetch(`${BASE_URL}/comments/${commentId}`, {
    method: 'DELETE',
  }).then(response => {
    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }

    return response;
  });
}

export function createComment(comment) {
  return fetch(`${BASE_URL}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(comment),
  }).then(response => {
    if (!response.ok) {
      throw new Error('Failed to create comment');
    }

    return response.json();
  });
}

const API_URL = 'https://mate.academy/students-api'
const POSTS_URL = `${API_URL}/posts`
const COMMENTS_URL = `${API_URL}/comments`

export const getPostsByUserId = async (userId) => {
  const response = await fetch(`${POSTS_URL}?userId=${encodeURIComponent(userId)}`)

  if (!response.ok) {
    throw new Error('Unable to load posts right now')
  }

  const posts = await response.json()

  return Array.isArray(posts) ? posts : [posts]
}

export const createPost = async ({ userId, title, body }) => {
  const response = await fetch(POSTS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ userId, title, body }),
  })

  if (!response.ok) {
    throw new Error('Unable to create a post right now')
  }

  return response.json()
}

export const updatePost = async ({ id, title, body }) => {
  const response = await fetch(`${POSTS_URL}/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ title, body }),
  })

  if (!response.ok) {
    throw new Error('Unable to update a post right now')
  }

  return response.json()
}

export const deletePost = async (postId) => {
  const response = await fetch(`${POSTS_URL}/${encodeURIComponent(postId)}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Unable to delete a post right now')
  }
}

export const getCommentsByPostId = async (postId) => {
  const response = await fetch(`${COMMENTS_URL}?postId=${encodeURIComponent(postId)}`)

  if (!response.ok) {
    throw new Error('Unable to load comments right now')
  }

  const comments = await response.json()

  return Array.isArray(comments) ? comments : [comments]
}

export const createComment = async ({ postId, name, email, body }) => {
  const response = await fetch(COMMENTS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ postId, name, email, body }),
  })

  if (!response.ok) {
    throw new Error('Unable to create a comment right now')
  }

  return response.json()
}

export const deleteComment = async (commentId) => {
  const response = await fetch(`${COMMENTS_URL}/${encodeURIComponent(commentId)}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Unable to delete a comment right now')
  }
}

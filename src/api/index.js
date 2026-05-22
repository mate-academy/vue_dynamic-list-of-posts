const BASE_URL = 'https://mate.academy/students-api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}`)
  }
  return res.json()
}

export const usersApi = {
  getByEmail: (email) => request(`/users?email=${encodeURIComponent(email)}`),
}

export const postsApi = {
  getByUser: (userId) => request(`/posts?userId=${userId}`),
  create: (data) => request('/posts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/posts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
}

export const commentsApi = {
  getByPost: (postId) => request(`/comments?postId=${postId}`),
  create: (data) => request('/comments', { method: 'POST', body: JSON.stringify(data) }),
  remove: (id) => request(`/comments/${id}`, { method: 'DELETE' }),
}

import axios from 'axios'

const client = axios.create({
  baseURL: 'https://mate.academy/students-api',
})

export interface Post {
  id: number
  userId: number
  title: string
  body: string
}

export interface Comment {
  id: number
  postId: number
  name: string
  email: string
  body: string
}

export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
}

// --- Users ---
export const getUserByEmail = (email: string) =>
  client.get<User[]>(`/users?email=${email}`).then((res) => res.data[0] ?? null)

export const createUser = (data: Pick<User, 'name' | 'email'>) =>
  client
    .post<User>('/users', {
      name: data.name,
      username: data.name.toLowerCase().replace(/\s+/g, '_'),
      email: data.email,
      phone: '0000000000',
    })
    .then((res) => res.data)

// --- Posts ---
export const getPostsByUser = (userId: number) =>
  client.get<Post[]>(`/posts?userId=${userId}`).then((res) => res.data)

export const createPost = (userId: number, data: Omit<Post, 'id' | 'userId'>) =>
  client.post<Post>('/posts', { ...data, userId }).then((res) => res.data)

export const updatePost = (id: number, data: Partial<Omit<Post, 'id'>>) =>
  client.patch<Post>(`/posts/${id}`, data).then((res) => res.data)

export const deletePost = (id: number) => client.delete(`/posts/${id}`)

// --- Comments ---
export const getComments = (postId: number) =>
  client.get<Comment[]>(`/comments?postId=${postId}`).then((res) => res.data)

export const createComment = (data: Omit<Comment, 'id'>) =>
  client.post<Comment>('/comments', data).then((res) => res.data)

export const deleteComment = (id: number) => client.delete(`/comments/${id}`)

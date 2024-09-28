import axios from 'axios'
import type { Post } from './types/Post'
import type { Comment } from './types/Comments'

const BASE_URL = 'https://mate.academy/students-api'

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const api = {
  getUser: async (email: string) => {
    try {
      const response = await client.get(`users?email=${email}`)
      return response.data
    } catch (error) {
      throw new Error('Get user error')
    }
  },

  postUser: async (email: string, name: string) => {
    try {
      const response = await client.post(`users?email=${email}`, {
        email,
        name
      })
      return response.data
    } catch (error) {
      throw new Error('Post user error')
    }
  },

  getPosts: async (userId: number) => {
    try {
      const response = await client.get(`/posts?userId=${userId}`)
      return response.data
    } catch (error) {
      throw new Error('Get posts error')
    }
  },

  addPost: async (data: Omit<Post, 'id'>) => {
    try {
      const response = await client.post('/posts', data)
      return response.data
    } catch (error) {
      throw new Error('Add post error')
    }
  },

  deletePost: async (postId: number) => {
    try {
      client.delete(`/posts/${postId}`)      
    } catch (error) {
      throw new Error('Delete post error')
      
    }
  },

  patchPost: async (postId: number, data: Post) => {
    try {
      const response = await client.patch(`/posts/${postId}`, data)
      return response.data
    } catch (error) {
      throw new Error('Patch post error')
    }
  },

  getComments: async (postId: number) => {
    try {
      const response = await client.get(`/comments/?postId=${postId}`)
      return response.data
    } catch (error) {
      throw new Error('Get comments error')
    }
  },

  postComments: async (data: Omit<Comment, 'id'>) => {
    try {
      const response = await client.post('/comments', data)
      return response.data
    } catch (error) {
      throw new Error('Post comment error')
    }
  },

  deleteComment: async (commentId: number) => {
    try {
      await client.delete(`/comments/${commentId}`)
    } catch (error) {
      throw new Error('Delete comment error')
    }
  }
}

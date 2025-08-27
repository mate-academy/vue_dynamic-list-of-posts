import axios from 'axios'
const BASE_URL = 'https://mate.academy/students-api'

export const fetchUserByEmail = async (email) => {
  const res = await axios.get(`${BASE_URL}/users?email=${email}`)
  return res.data[0] || null
}
export const fetchPosts = async (userId) => {
  const res = await axios.get(`${BASE_URL}/posts?userId=${userId}`)
  return res.data
}
export const createPost = async (post) => {
  const res = await axios.post(`${BASE_URL}/posts`, post)
  return res.data
}
export const updatePost = async (post) => {
  const res = await axios.put(`${BASE_URL}/posts/${post.id}`, post)
  return res.data
}
export const deletePostApi = async (postId) => await axios.delete(`${BASE_URL}/posts/${postId}`)
export const fetchComments = async (postId) => {
  const res = await axios.get(`${BASE_URL}/comments?postId=${postId}`)
  return res.data
}
export const addCommentApi = async (comment) => {
  const res = await axios.post(`${BASE_URL}/comments`, comment)
  return res.data
}
export const deleteCommentApi = async (commentId) => await axios.delete(`${BASE_URL}/comments/${commentId}`)
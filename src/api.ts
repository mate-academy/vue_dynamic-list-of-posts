export const API_URL = 'https://mate-academy.github.io/fe-students-api';

export type User = { id: number; name: string; email: string };
export type Post = { id: number; userId: number; title: string; body: string };
export type Comment = {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
};

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
};

export const api = {
  getUsers: () => request<User[]>('/users'),
  createUser: (data: Omit<User, 'id'>) =>
    request<User>('/users', { method: 'POST', body: JSON.stringify(data) }),
  getPosts: (userId: number) => request<Post[]>(`/posts?userId=${userId}`),
  createPost: (data: Omit<Post, 'id'>) =>
    request<Post>('/posts', { method: 'POST', body: JSON.stringify(data) }),
  updatePost: (post: Post) =>
    request<Post>(`/posts/${post.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title: post.title, body: post.body }),
    }),
  deletePost: (id: number) => request<unknown>(`/posts/${id}`, { method: 'DELETE' }),
  getComments: (postId: number) =>
    request<Comment[]>(`/comments?postId=${postId}`),
  createComment: (data: Omit<Comment, 'id'>) =>
    request<Comment>('/comments', { method: 'POST', body: JSON.stringify(data) }),
  deleteComment: (id: number) =>
    request<unknown>(`/comments/${id}`, { method: 'DELETE' }),
};

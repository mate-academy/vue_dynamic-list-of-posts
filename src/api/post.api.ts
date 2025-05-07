import { AxiosPromise } from 'axios';
import { client } from '@/utils/httpClient';

import { User } from '@/types/User';
import { Post } from '@/types/Post';

export class PostsApi {
  static async getAll(userId: User['id']): AxiosPromise<Post[]> {
    return client.get(`/posts?userId=${userId}`);
  };

  static async create(newPost: Omit<Post, 'id'>): AxiosPromise<Post> {
    return client.post('/posts', newPost);
  }

  static async update(updatedPost: Omit<Post, 'userId'>): AxiosPromise<Post> {
    return client.patch(`/posts/${updatedPost.id}`, updatedPost);
  }

  static async delete(postId: Post['id']): AxiosPromise<void> {
    return client.delete(`/posts/${postId}`);
  }
}

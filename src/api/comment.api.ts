import { AxiosPromise } from 'axios';
import { client } from '@/utils/httpClient';

import type { Post } from '@/types/Post'
import type { Comment } from '@/types/Comment'

export class CommentApi {
  static async getAll(postId: Post['id']): AxiosPromise<Comment[]> {
    return client.get(`/comments/postId=${postId}`);
  };

  static async create(newComment: Omit<Comment, 'id'>): AxiosPromise<Comment> {
    const body = JSON.stringify(newComment);

    return client.post('/comments/', body);
  };

  static async delete(commentId: Comment['id']): AxiosPromise<void> {
    return client.delete(`/comments/${commentId}}`);
  };
}

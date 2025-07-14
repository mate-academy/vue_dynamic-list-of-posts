export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}
export interface Comment {
  id: number;
  postId: number;
  name: string;
  body: string;
  email: string;
}

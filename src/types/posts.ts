declare namespace Posts {
  export interface Data {
    id: number;
    userId: number;
    title: string;
    body: string;
    createdAt: string;
    updatedAt: string;
  }

  export type New = Pick<Data, "body" | "title">;

  export interface Comment {
    id: number;
    postId: number;
    name: string;
    email: string;
    body: string;
  }

  export type NewComment = Pick<Comment, "name" | "email" | "body">;
}

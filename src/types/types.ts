export type User = {
  id: number,
  name: string,
  username: string,
  email: string,
  phone: string,
  website: string,
  createdAt: string,
  updatedAt: string,
  address: {
    id: number,
    userId: number,
    street: string,
    suite: string,
    city: string,
    zipcode: string,
    createdAt: string,
    updatedAt: string,
  }
}

export type PostUserBody = {
  name: string,
  email: string,
}

export type Post = {
  id: number,
  createdAt: string,
  updatedAt: string,
  userId: number,
  title: string,
  body: string,
}

export type PostPostBody = {
  userId: number,
  title: string,
  body: string,
}

export type PatchPostBody = {
  userId?: number,
  title?: string,
  body?: string,
}

export type Comment = {
  id: number,
  postId: number,
  name: string,
  email: string,
  body: string,
  createdAt: string,
  updatedAt: string,
}

export type PostCommentBody = {
  postId: number,
  name: string,
  email: string,
  body: string,
}

export enum Stage {
 isLogin = 'isLogin',
 isLoggedin = 'isLoggedin',
 isRegister = 'isRegister',
}
export enum Sidebar {
 isClosed = 'isClosed',
 showComment = 'showComment',
 showPost = 'showPost',
 addPost = 'addPost',
 addComment = 'addComment',
 editPost = 'editPost',
}

export interface Post {
  id: number,
  userId: number,
  title: string,
  body: string,
  createdAt: string,
  updatedAt: string
}
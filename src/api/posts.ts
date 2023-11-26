import axios from "axios";
import { BASE_URL } from "./const";
import { getUserFromLS } from "../utils/getUser";

export const getUserPosts = async (): Promise<Posts.Data[] | null> => {
  try {
    const user = getUserFromLS();

    if (!user) {
      return null;
    }

    const { data } = await axios.get(`${BASE_URL}/posts?userId=${user.id}`);

    return data;
  } catch {
    return null;
  }
};

export const createPost = async ({
  body,
  title,
}: Pick<Posts.Data, "body" | "title">): Promise<Posts.Data | null> => {
  try {
    const user = getUserFromLS();

    if (!user) {
      return null;
    }

    const { data } = await axios.post(`${BASE_URL}/posts`, {
      body,
      title,
      userId: user.id,
    });

    return data;
  } catch {
    console.log("Can`t create post");

    return null;
  }
};

export const deletePost = async (
  postId: number,
  onSuccess?: () => void
): Promise<number | void> => {
  try {
    await axios.delete(`${BASE_URL}/posts/${postId}`);

    onSuccess?.();
  } catch {
    console.log(`can't remove post`);
  }
};

export const updatePost = async (
  postId: number,
  body: Posts.New,
  onSuccess?: () => void
): Promise<number | void> => {
  try {
    await axios.patch(`${BASE_URL}/posts/${postId}`, body);

    onSuccess?.();
  } catch {
    console.log(`can't remove post`);
  }
};

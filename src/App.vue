<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import {
  createComment,
  createNewPost,
  deleteComment,
  deletePost,
  getPostComments,
  getPosts,
  getUser,
  patchPost,
} from "./apiClient";
import { Post } from "./types/post";
import { User } from "./types/user";
import PostsPage from "./components/PostsPage/PostsPage.vue";
import LoginPage from "./components/LoginPage/LoginPage.vue";
import { Comment } from "./types/comment";
import { SidebarStatus } from "./types/sidebar";

const userIdData = localStorage.getItem("userId");
const user = ref<User | null>(null)!;
const userId = ref<number | null>(userIdData ? JSON.parse(userIdData) : null);
const postComments = ref<Comment[] | null>(null);
const chosenPost = ref<Post | null>(null);
const postList = ref<Post[]>([]);
const userName = ref<User | null>(user.value || null);
const commentsLoading = ref<boolean>(false);
const isCommentsEditing = ref<boolean>(false);
const sidebarStatus = ref<SidebarStatus>(null);

const fetchUserData = async (id: number) => {
  try {
    const postsData = await getPosts(id);
    const userData = await getUser(id);

    postList.value = postsData;
    user.value = userData;
  } catch (err) {
    alert(`An error occurred: ${err}`);
    userId.value = null;
  }
};

watch(
  userId,
  async (newValue: number | null) => {
    if (newValue !== null) {
      localStorage.setItem("userId", JSON.stringify(newValue));
      await fetchUserData(newValue);
    } else {
      localStorage.removeItem("userId");
      postList.value = [];
      user.value = null;
    }
  },
  { deep: true }
);

onMounted(async () => {
  if (userId.value !== null) {
    await fetchUserData(userId.value);
  }
});

const handleClickLogout = () => {
  userId.value = null;
};

const handleSubmitUserId = (newUserId: number) => {
  userId.value = newUserId;
};

const setNewUser = (newUser: User) => {
  user.value = newUser;
};

const deleteChosenPost = async (postId: number) => {
  try {
    await deletePost(postId);

    postList.value = postList.value.filter((el) => el.id !== postId);
    chosenPost.value = null;
  } catch {
    console.error("Cannot get comments from post");
  } finally {
    sidebarStatus.value = null;
  }
};

const changeChosenPost = async (postId: number) => {
  sidebarStatus.value = "Post";
  const findedPost = postList.value.find((el) => el.id === postId)!;

  chosenPost.value = findedPost;
  isCommentsEditing.value = false;
  postComments.value = null;
  commentsLoading.value = true;

  try {
    const comments = await getPostComments(postId);

    postComments.value = comments;
  } catch {
    console.error("Cannot get comments from post");
  } finally {
    commentsLoading.value = false;
  }
};

const closeCurrentPost = () => {
  chosenPost.value = null;
  sidebarStatus.value = null;
};

const closePostEditing = () => {
  if (sidebarStatus.value === "Post Editing") {
    return (sidebarStatus.value = "Post");
  }

  sidebarStatus.value = null;
};

const openCreateNewPost = () => {
  chosenPost.value = null;
  sidebarStatus.value = "Post Adding";
  postComments.value = null;
};

const editPost = () => {
  sidebarStatus.value = "Post Editing";
};

const submitPostChange = async ({ id, userId, title, body }: Post) => {
  if (sidebarStatus.value === "Post Editing") {
    try {
      const updatedPost = await patchPost({ id, title, body });

      postList.value = postList.value.map((el) => {
        if (el.id === id) {
          return { ...el, title, body };
        }

        return el;
      });
      changeChosenPost(updatedPost?.id!);
    } catch {
      console.error("Failed to update post");
    } finally {
      sidebarStatus.value = "Post";
      return;
    }
  }

  try {
    const addedPost = await createNewPost({ userId, title, body });

    postList.value = [...postList.value, addedPost];
    changeChosenPost(addedPost?.id!);
  } catch {
    console.error("Failed to add new post");
  }
};

const changeCommentAddingState = () => {
  isCommentsEditing.value = !isCommentsEditing.value;
};

const addNewComment = async ({ postId, name, body, email }: Comment) => {
  try {
    const newComment = await createComment({ postId, name, body, email });

    postComments.value = [...postComments.value!, newComment];
    isCommentsEditing.value = false;
  } catch {
    console.error("failed to added comment");
  }
};

const deletePostComment = async (commentId: number) => {
  try {
    await deleteComment(commentId);

    postComments.value = postComments.value!.filter((el) => el.id !== commentId);
  } catch {
    console.error("Failing to delete comment");
  }
};
</script>

<template>
  <template v-if="!userId">
    <LoginPage :handle-submit-user-id="handleSubmitUserId" :set-new-user="setNewUser" />
  </template>
  <template v-else>
    <PostsPage
      :chosen-post="chosenPost"
      :user="user!"
      :post-list="postList"
      :handle-click-logout="handleClickLogout"
      :delete-chosen-post="deleteChosenPost"
      :change-chosen-post="changeChosenPost"
      :close-current-post="closeCurrentPost"
      :userName="userName"
      :post-comments="postComments"
      :comments-loading="commentsLoading"
      :open-create-new-post="openCreateNewPost"
      :sidebar-status="sidebarStatus"
      :close-post-editing="closePostEditing"
      :edit-post="editPost"
      :submitPostChange="submitPostChange"
      :is-comments-editing="isCommentsEditing"
      :change-comment-adding-state="changeCommentAddingState"
      :add-new-comment="addNewComment"
      :deletePostComment="deletePostComment"
    />
  </template>
</template>

<style scoped></style>

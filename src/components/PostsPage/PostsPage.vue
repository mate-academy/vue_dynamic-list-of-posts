<script setup lang="ts">
import { Post } from "../../types/post";
import { User } from "../../types/user";
import Header from "./Header.vue";
import PostList from "./PostList/PostList.vue";
import Sidebar from "./Sidebar/Sidebar.vue";
import { Comment } from "../../types/comment";
import { SidebarStatus } from "../../types/sidebar";
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
} from "../../apiClient";

const props = defineProps<{
  currentUser: User | null;
  currentUserId: number | null;
}>();

const user = ref<User | null>(props.currentUser);
const userId = ref<number | null>(props.currentUserId);

watch(
  () => props.currentUser,
  (newUser) => {
    user.value = newUser;
  }
);

watch(
  () => props.currentUserId,
  (newUserId) => {
    userId.value = newUserId;
  }
);

const postComments = ref<Comment[] | null>(null);
const chosenPost = ref<Post | null>(null);
const postList = ref<Post[]>([]);
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
  <Header :user="user!" :handle-click-logout="handleClickLogout" />
  <main class="section">
    <div class="container">
      <div class="tile is-ancestor">
        <PostList
          :posts="postList"
          :chosenPost="chosenPost"
          :change-chosen-post="changeChosenPost"
          :close-current-post="closeCurrentPost"
          :open-create-new-post="openCreateNewPost"
          :sidebarStatus="sidebarStatus"
        />
        <Sidebar
          :user="user!"
          :submit-post-change="submitPostChange"
          :editPost="editPost"
          :close-post-editing="closePostEditing"
          :chosen-post="chosenPost"
          :comments-loading="commentsLoading"
          :post-comments="postComments"
          :delete-chosen-post="deleteChosenPost"
          :sidebar-status="sidebarStatus"
          :is-comments-editing="isCommentsEditing"
          :changeCommentAddingState="changeCommentAddingState"
          :add-new-comment="addNewComment"
          :deletePostComment="deletePostComment"
        />
      </div>
    </div>
  </main>
</template>

<style>
@media screen and (min-width: 769px), print {
  .tile:not(.is-child) {
    display: flex;
  }
}

.tile.is-ancestor {
  margin-left: -0.75rem;
  margin-right: -0.75rem;
  margin-top: -0.75rem;
}
</style>

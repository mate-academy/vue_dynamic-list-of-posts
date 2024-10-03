<script setup lang="ts">
import { Post } from "../../types/post";
import { User } from "../../types/user";
import Header from "./Header.vue";
import PostList from "./PostList/PostList.vue";
import Sidebar from "./Sidebar/Sidebar.vue";
import { Comment } from "../../types/comment";
import { SidebarStatus } from "../../types/sidebar";

defineProps<{
  user: User;
  postList: Post[];
  handleClickLogout: () => void;
  deleteChosenPost: (postId: number) => Promise<void>;
  chosenPost: Post | null;
  changeChosenPost: (postId: number) => Promise<void>;
  closePostEditing: () => void;
  closeCurrentPost: () => void;
  userName: User | null;
  postComments: Comment[] | null;
  commentsLoading: boolean;
  openCreateNewPost: () => void;
  sidebarStatus: SidebarStatus;
  editPost: () => void;
  submitPostChange: ({ id, userId, title, body }: Post) => Promise<void>;
}>();
</script>

<template>
  <Header :user="user" :handle-click-logout="handleClickLogout" />
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
          :user="user"
          :submit-post-change="submitPostChange"
          :editPost="editPost"
          :close-post-editing="closePostEditing"
          :chosen-post="chosenPost"
          :comments-loading="commentsLoading"
          :post-comments="postComments"
          :delete-chosen-post="deleteChosenPost"
          :sidebar-status="sidebarStatus"
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

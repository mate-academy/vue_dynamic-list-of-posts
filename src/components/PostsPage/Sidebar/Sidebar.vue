<script setup lang="ts">
import { Comment } from "../../../types/comment";
import { Post } from "../../../types/post";
import { SidebarStatus } from "../../../types/sidebar";
import { User } from "../../../types/user";
import Loading from "../../Loading/Loading.vue";
import PostEditing from "./PostEditing/PostEditing.vue";
import SidebarComments from "./SidebarPost/SidebarComments.vue";
import SidebarPost from "./SidebarPost/SidebarPost.vue";

defineProps<{
  user: User;
  submitPostChange: ({ id, userId, title, body }: Post) => Promise<void>;
  chosenPost: Post | null;
  commentsLoading: boolean;
  postComments: Comment[] | null;
  deleteChosenPost: (postId: number) => Promise<void>;
  closePostEditing: () => void;
  sidebarStatus: SidebarStatus;
  editPost: () => void;
}>();
</script>

<template>
  <div class="tile is-parent is-8-desktop Sidebar" :class="{ 'Sidebar--open': sidebarStatus !== null }">
    <div class="tile is-child box is-success">
      <div class="content">
        <template v-if="sidebarStatus === 'Post'">
          <SidebarPost :chosen-post="chosenPost" :delete-chosen-post="deleteChosenPost" :edit-post="editPost" />
          <Loading v-if="commentsLoading" />
          <SidebarComments v-else :post-comments="postComments" />
        </template>
        <template v-else-if="sidebarStatus === 'Post Adding'">
          <PostEditing :user="user" :submit-post-change="submitPostChange" :close-post-editing="closePostEditing">
            <template #title>
              <h2>Create new post</h2>
            </template>
            <template #button>Create</template>
          </PostEditing>
        </template>
        <template v-else-if="sidebarStatus === 'Post Editing'">
          <PostEditing
            :user="user"
            :submit-post-change="submitPostChange"
            :close-post-editing="closePostEditing"
            :chosen-post="chosenPost!"
          >
            <template #title>
              <h2>Post {{ chosenPost?.id }} editing</h2>
            </template>
            <template #button>Save</template>
          </PostEditing>
        </template>
      </div>
    </div>
  </div>
</template>

<style>
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;

  @media (min-width: 769px) {
    max-width: 0;
  }
}

.Sidebar--open {
  opacity: 1;

  @media (min-width: 769px) {
    max-width: 50%;
  }
}
</style>

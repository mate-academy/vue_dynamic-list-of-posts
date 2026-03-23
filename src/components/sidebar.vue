<script setup lang="ts">
import { onMounted } from "vue";
import NoCommentsYet from "./noCommentsYet.vue";
import PostPreview from "./postPreview.vue";
import WriteCommentBtn from "./writeCommentBtn.vue";
import useCommentsStore from "@/stores/commentsStore";
import usePostsStore from "@/stores/postsStore";
import Comment from "./comment.vue";
import useSidebarStore from "@/stores/sidebarStore";
import AddPost from "./addPost.vue";
import CommentForm from "./commentForm.vue";
import Loader from "./loader.vue";
import EditPost from "./editPost.vue";

const commentsStore = useCommentsStore();
const postsStore = usePostsStore();
const sidebarStore = useSidebarStore();

onMounted(async () => {
  commentsStore.init(postsStore.activePostId);
});

const handleDeleteError = () => {
  commentsStore.commentsError = "";
};
</script>

<template>
  <div
    class="tile is-parent is-8-desktop Sidebar"
    :class="{ 'Sidebar--open': sidebarStore.isOpen }"
  >
    <div class="tile is-child box is-success">
      <div class="tile is-child box is-success">
        <div class="content">
          <AddPost v-if="sidebarStore.openNewPost && !sidebarStore.editPost" />

          <PostPreview
            v-if="!sidebarStore.openNewPost && !sidebarStore.editPost"
          />

          <Loader v-if="commentsStore.isLoading" />

          <EditPost v-if="!sidebarStore.openNewPost && sidebarStore.editPost" />

          <NoCommentsYet
            v-if="
              commentsStore.comments.length === 0 &&
              !sidebarStore.openNewPost &&
              !sidebarStore.editPost &&
              !commentsStore.isLoading
            "
          />

          <div
            v-if="
              !sidebarStore.openNewPost &&
              !sidebarStore.editPost &&
              !commentsStore.isLoading
            "
          >
            <TransitionGroup name="comment" tag="div">
              <Comment
                v-for="comment in commentsStore.comments"
                :key="comment.id"
                :comment="comment"
                :post-id="postsStore.activePostId"
              />
            </TransitionGroup>
          </div>

          <WriteCommentBtn
            v-if="
              !sidebarStore.writeACommentBtn &&
              !sidebarStore.openNewPost &&
              !sidebarStore.editPost &&
              !commentsStore.isLoading
            "
          />

          <CommentForm
            v-if="
              sidebarStore.writeACommentBtn &&
              !sidebarStore.openNewPost &&
              !sidebarStore.editPost
            "
          />

          <article
            v-if="commentsStore.commentsError"
            class="message is-danger"
            style="margin-top: 10px"
          >
            <div class="message-header">
              <p>Error Message</p>
              <button
                @click="handleDeleteError"
                class="delete"
                aria-label="delete"
              ></button>
            </div>
            <div class="message-body">
              {{ commentsStore.commentsError }}
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.Sidebar {
  overflow: hidden;
  max-width: 0;
  transition: max-width 0.5s ease-in-out;
}

.Sidebar--open {
  max-width: 100%;

  @media (min-width: 769px) {
    max-width: 50%;
  }
}

.comment-enter-active,
.comment-leave-active {
  transition: transform 0.3s ease;
}

.comment-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.comment-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { usePosts } from "./composables/usePosts";
import { useComments } from "./composables/useComments";
import { useSidebar } from "./composables/useSidebar";
import { usePostDeletion } from "./composables/usePostDeletion";
import { useCommentDeletion } from "./composables/useCommentDeletion";
import { useCommentFormState } from "./composables/useCommentFormState";
import type { Post } from "./types/Post";

import AppHeader from "./components/AppHeader.vue";
import SidebarLayout from "./components/SidebarLayout.vue";
import PostsList from "./components/PostsList.vue";
import PostForm from "./components/PostForm.vue";
import PostPreview from "./components/PostPreview.vue";
import Loader from "./components/AppLoader.vue";
import NoCommentsYet from "./components/NoCommentsYet.vue";
import CommentItem from "./components/CommentItem.vue";
import WriteCommentButton from "./components/WriteCommentButton.vue";
import CommentForm from "./components/CommentForm.vue";

import { deletePost } from "./api/posts";
import { deleteComment } from "./api/comments";

type User = {
  id: number;
  name: string;
};

const user = ref<User | null>({
  id: 3698,
  name: "Nazar",
});

const { posts, isLoading, error, loadPosts } = usePosts();

const {
  comments,
  isLoading: commentsLoading,
  error: commentsError,
  loadComments,
  clear: clearComments,
} = useComments();

const {
  sidebarMode,
  selectedPost,
  selectedPostId,
  isSidebarOpen,
  openCreate,
  openPost,
  openEdit,
  viewPost,
  closeSidebar,
} = useSidebar();

const {
  isCommentFormVisible,
  commentAuthor,
  showCommentForm,
  hideCommentForm,
  resetCommentFormUI,
  onSavedAuthor,
  onCommentSubmitted,
} = useCommentFormState({ comments });

onMounted(() => {
  if (!user.value) return;
  loadPosts();
});

function resetSidebarErrors() {
  resetPostDeleteState();
  resetCommentDeleteState();
}

function handleCloseSidebar() {
  closeSidebar();
  clearComments();
  resetCommentFormUI();
  resetSidebarErrors();
}

function handleOpenCreate() {
  openCreate();
  clearComments();
  resetCommentFormUI();
  resetSidebarErrors();
}

function handleOpenPost(post: Post) {
  openPost(post);

  if (sidebarMode.value === "none") {
    clearComments();
  } else {
    loadComments(post.id);
  }

  resetCommentFormUI();
  resetSidebarErrors();
}

function handleOpenEdit() {
  openEdit();
  resetCommentFormUI();
  resetSidebarErrors();
}

function handleCancelEdit() {
  if (!selectedPost.value) {
    handleCloseSidebar();
    return;
  }

  viewPost(selectedPost.value);
}

function onPostCreated(newPost: Post) {
  posts.value.push(newPost);
  viewPost(newPost);
}

function onPostUpdated(updated: Post) {
  posts.value = posts.value.map((p) => (p.id === updated.id ? updated : p));
  viewPost(updated);
}

const {
  isDeletingPost,
  deletePostError,
  handleDeletePost,
  resetPostDeleteState,
} = usePostDeletion({
  posts,
  selectedPost,
  onAfterOptimisticDelete: handleCloseSidebar,
  deletePostApi: deletePost,
});

const {
  deletingCommentIds,
  deleteCommentError,
  failedDeleteCommentId,
  handleDeleteComment,
  resetCommentDeleteState,
} = useCommentDeletion({
  comments,
  deleteCommentApi: deleteComment,
});

function logout() {
  user.value = null;
  posts.value = [];
  handleCloseSidebar();
}
</script>

<template>
  <AppHeader :user="user" @logout="logout" />

  <div class="container is-fluid py-5">
    <div v-if="!user" class="notification is-warning">
      Ви вийшли з акаунта. Увійдіть знову, щоб побачити пости.
    </div>

    <div v-else class="columns">
      <div class="column" :class="isSidebarOpen ? 'is-7' : 'is-12'">
        <PostsList
          :posts="posts"
          :is-loading="isLoading"
          :error="error"
          :selected-post-id="selectedPostId"
          :is-sidebar-open="isSidebarOpen"
          @open="handleOpenPost"
          @create="handleOpenCreate"
        />
      </div>

      <div v-if="isSidebarOpen" class="column is-5">
        <SidebarLayout :is-open="isSidebarOpen">
          <div class="level">
            <div class="level-left">
              <h2 class="title is-4 mb-0">Sidebar</h2>
            </div>
          </div>

          <div v-if="sidebarMode === 'none'" class="has-text-grey">
            Виберіть пост або натисніть Create new post
          </div>

          <div v-else-if="sidebarMode === 'create'">
            <PostForm
              mode="create"
              :user-id="user.id"
              @created="onPostCreated"
              @cancel="handleCloseSidebar"
            />
          </div>

          <div v-else-if="sidebarMode === 'edit' && selectedPost">
            <PostForm
              mode="edit"
              :user-id="user.id"
              :post-id="selectedPost.id"
              :initial-title="selectedPost.title"
              :initial-body="selectedPost.body"
              @updated="onPostUpdated"
              @cancel="handleCancelEdit"
            />
          </div>

          <div v-else-if="selectedPost">
            <PostPreview
              :post="selectedPost"
              :is-deleting="isDeletingPost"
              @edit="handleOpenEdit"
              @delete="handleDeletePost"
            />

            <p v-if="deletePostError" class="help is-danger mt-2">
              {{ deletePostError }}
            </p>

            <h4 class="title is-5 mt-5">Коментарі</h4>

            <div
              v-if="commentsLoading"
              class="is-flex is-justify-content-center is-align-items-center mt-2"
            >
              <Loader />
            </div>

            <div v-else-if="commentsError" class="notification is-danger">
              CommentsError: {{ commentsError }}
            </div>

            <NoCommentsYet v-else-if="comments.length === 0" />

            <div v-else>
              <div v-for="c in comments" :key="c.id" class="mb-3">
                <CommentItem
                  :comment="c"
                  :is-deleting="deletingCommentIds.includes(c.id)"
                  @delete="handleDeleteComment"
                />
              </div>
            </div>

            <div v-if="deleteCommentError" class="notification is-danger mt-3">
              <p class="mb-2">
                {{ deleteCommentError }}
              </p>

              <button
                v-if="failedDeleteCommentId !== null"
                class="button is-danger is-light"
                type="button"
                @click="handleDeleteComment(failedDeleteCommentId)"
              >
                Retry delete
              </button>
            </div>

            <WriteCommentButton
              v-if="!isCommentFormVisible"
              class="mt-3"
              @click="showCommentForm"
            />

            <CommentForm
              v-else
              :post-id="selectedPost.id"
              :initial-name="commentAuthor.name"
              :initial-email="commentAuthor.email"
              @submitted="onCommentSubmitted"
              @saved-author="onSavedAuthor"
              @cancel="hideCommentForm"
            />
          </div>

          <div v-else class="notification is-danger">
            Selected post is missing
          </div>
        </SidebarLayout>
      </div>
    </div>
  </div>
</template>

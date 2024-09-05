<script setup lang="ts">
export type PostModeType = "add" | "edit" | "preview" | "comment";

import { addPost, getPosts, removePost, updatePost } from "@/assets/api/api";
import type { Post } from "@/assets/types/Post";
import { onMounted, ref } from "vue";
import Loader from "./Loader.vue";
import AddPost from "./AddPost.vue";
import PostPreview from "./PostPreview.vue";
import EditPost from "./EditPost.vue";

const postArr = ref<Post[] | null>(null);
const selectedPost = ref<Post | null>(null);
const postMode = ref<PostModeType | null>(null);
const lodingError = ref(false);

const props = defineProps<{
  userId: number;
}>();

onMounted(() => {
  getPosts(props.userId)
    .then((res) => {
      postArr.value = res;
    })
    .catch(() => (lodingError.value = true));
});

const handleClosePost = () => {
  postMode.value = null;
  selectedPost.value = null;
};

const handleOpenPreviewPost = (post: Post) => {
  postMode.value = "preview";
  selectedPost.value = post;
};

const handleOpenAddPost = () => {
  postMode.value = "add";
  selectedPost.value = null;
};

const handleOpenEditPost = (post: Post) => {
  postMode.value = "edit";
  selectedPost.value = post;
};

const handleAddPost = (title: string, body: string) => {
  const post = { userId: props.userId, title, body };

  addPost(post).then((res) => {
    postArr.value?.push(res);
    handleOpenPreviewPost(res);
  });
};

const handleUpdatePost = (title: string, body: string) => {
  if (selectedPost.value) {
    const post = {
      id: selectedPost.value.id,
      userId: props.userId,
      title,
      body,
    };

    updatePost(selectedPost.value.id, post).then((res) => {
      postArr.value
        ? postArr.value?.map((el) => (el.id === res.id ? res : el))
        : null;
      handleOpenPreviewPost(res);
    });
  }
};

const handleRemovePost = (postId: Number) => {
  removePost(postId).then(() => {
    postArr.value = postArr.value
      ? postArr.value?.filter((el) => el.id !== postId)
      : null;
    handleClosePost();
  });
};
</script>

<template>
  <div class="tile is-ancestor flex-container">
    <div class="tile is-parent flex-item">
      <div class="tile is-child is-success box flex-itemDown">
        <div class="block">
          <div class="block is-flex is-justify-content-space-between">
            <p class="title">Posts</p>
            <button
              type="button"
              class="button is-link"
              :class="{
                'is-light': postMode === 'add',
              }"
              @click="handleOpenAddPost"
            >
              Add New Post
            </button>
          </div>

          <div></div>

          <div v-if="!postArr" class="block is-flex is-justify-content-center">
            <p class="has-text-danger is-size-4" v-if="lodingError">
              Loading Error
            </p>
            <Loader v-else />
          </div>

          <div
            class="block is-flex is-justify-content-center"
            v-else-if="postArr?.length === 0"
          >
            <p class="title is-4">No posts yet</p>
          </div>

          <table
            class="table is-fullwidth is-striped is-hoverable is-narrow"
            v-else
          >
            <thead>
              <tr class="has-background-link-light">
                <th>ID</th>
                <th>Title</th>
                <th class="has-text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="post in postArr" :key="post.id">
                <td>{{ post.id }}</td>
                <td>{{ post.title }}</td>
                <td class="has-text-right is-vcentered">
                  <button
                    v-if="selectedPost?.id === post.id"
                    type="button"
                    class="button is-link"
                    @click="handleClosePost"
                  >
                    Close
                  </button>
                  <button
                    v-else
                    type="button"
                    class="button is-link is-light"
                    @click="handleOpenPreviewPost(post)"
                  >
                    Open
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      class="tile is-parent flex-item Sidebar"
      :class="{ ' Sidebar--open ': postMode }"
    >
      <AddPost
        v-if="postMode === 'add'"
        :handleClose="handleClosePost"
        :handleAddPost="handleAddPost"
      />
      <PostPreview
        v-else-if="postMode === 'preview'"
        :post="selectedPost"
        :handleRemovePost="handleRemovePost"
        :handleOpenEditPost="handleOpenEditPost"
      />
      <EditPost
        v-else-if="postMode === 'edit'"
        :post="selectedPost"
        :handleClose="handleClosePost"
        :handleUpdatePost="handleUpdatePost"
      />
    </div>
  </div>
</template>

<style scoped>
.flex-container {
  display: flex;
  gap: 1.5rem;

  @media (max-width: 769px) {
    flex-direction: row;
  }
}

.flex-item {
  flex: 1;
  display: flex;
}

.flex-itemDown {
  flex: 1;
}

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
  overflow: visible;

  @media (min-width: 769px) {
    max-width: 50%;
  }
}
</style>

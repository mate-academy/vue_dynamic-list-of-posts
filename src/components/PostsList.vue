<script setup>
import { usePostsStore } from "@/store/storePosts";
import Loader from "./loader/index.vue";
import { onMounted, watch } from "vue";
import { useUserStore } from "@/store/storeUser";
import { storeToRefs } from "pinia";

const postStore = usePostsStore();

const { posts, isLoading, error, isCreating, selectedPost } =
  storeToRefs(postStore);

const { fetchPosts, setIsCreating, fetchPostById, setSelectedPost } =
  usePostsStore();
const { user } = useUserStore();

onMounted(async () => {
  await fetchPosts(user.id);
});

const handleSelect = async (post) => {
  if (selectedPost.value?.id === post.id) {
    setSelectedPost(null);
    return;
  }

  await setSelectedPost(post);
  await fetchPostById(post.id);
};
</script>
<template>
  <div
    class="tile is-parent"
    :class="{ 'is-child': !isCreating && !selectedPost }"
  >
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button
            type="button"
            class="button is-link"
            :class="{ 'is-light': isCreating }"
            @click="setIsCreating(true)"
          >
            Add New Post
          </button>
        </div>

        <div
          class="is-flex is-justify-content-center is-align-items-center mt-2"
        >
          <Loader v-if="isLoading" />
        </div>
        <table
          v-if="!isLoading && posts.length !== 0"
          class="table is-fullwidth is-striped is-hoverable is-narrow"
        >
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts" :key="post.id">
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button
                  type="button"
                  class="button is-link"
                  :class="{
                    'is-light': selectedPost && selectedPost.id !== post.id,
                  }"
                  @click="handleSelect(post)"
                >
                  {{
                    selectedPost && selectedPost.id === post.id
                      ? "Close"
                      : "Open"
                  }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <h3 class="mt-2 has-text-centered" v-if="posts.length === 0">
          No posts yet.
        </h3>
      </div>
    </div>
  </div>
</template>

<style>
@import "./loader/index.css";
</style>

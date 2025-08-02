<script setup>
import { ref, onMounted } from 'vue';
import { getPostsByUserId, removePost, createPost, updatePost } from '@/api/posts';
import AppLoader from './AppLoader.vue';
import AppSidebar from './AppSidebar.vue';

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
});

const posts = ref([]);
const isLoading = ref(false);
const selectedPost = ref({});
const isSidebarActive = ref(false);

onMounted(async () => {
  isLoading.value = true;

  try {
    const { data } = await getPostsByUserId(props.userId);

    posts.value = data;
  } catch (error) {
    console.error('Failed to load posts:', error);
  } finally {
    isLoading.value = false;
  }
});

const openSidebar = (post = {}) => {
  selectedPost.value = { ...post };
  isSidebarActive.value = true;
};

const closeSidebar = () => {
  selectedPost.value = {};
  isSidebarActive.value = false;
};

const handleDeletePost = async (postId) => {
  try {
    await removePost(postId);

    posts.value = posts.value.filter((post) => post.id !== postId);
    closeSidebar();
  } catch (error) {
    console.error('Failed to delete post:', error);
  }
};

const handleCreatePost = async (newPostData) => {
  try {
    const postData = { ...newPostData, userId: props.userId };

    const { data } = await createPost(postData);

    posts.value.push(data);
    selectedPost.value = data;
  } catch (error) {
    console.error('Failed to create post:', error);
  }
};

const handleUpdatePost = async (updatedPost) => {
  try {
    const postData = { ...updatedPost, userId: props.userId };

    const { data } = await updatePost(updatedPost.id, postData);

    const index = posts.value.findIndex((post) => post.id === data.id);

    if (index !== -1) {
      posts.value[index] = data;
    }

    selectedPost.value = data;
  } catch (error) {
    console.error('Failed to update post:', error);
  }
};

const togglePostSelection = (post) => {
  if (post.id === selectedPost.value.id) {
    closeSidebar();
  } else {
    openSidebar(post);
  }
};

const isPostSelected = (post) => post.id === selectedPost.value.id;
</script>

<template>
  <div class="tile box is-parent is-flex-grow-1 mb-0">
    <div class="tile is-child">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>

          <button type="button" class="button is-link" @click="openSidebar()">Add New Post</button>
        </div>

        <div class="is-flex is-justify-content-center is-align-items-center mt-2" v-if="isLoading">
          <AppLoader />
        </div>

        <p
          class="is-flex is-justify-content-center is-align-items-center mt-2"
          v-else-if="posts.length === 0"
        >
          No posts yet
        </p>

        <table class="table is-fullwidth is-striped is-hoverable is-narrow" v-else>
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
                  :class="{ 'is-light': !isPostSelected(post) }"
                  @click="togglePostSelection(post)"
                >
                  {{ isPostSelected(post) ? 'Close' : 'Open' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <AppSidebar
    class="is-flex-grow-1"
    :is-active="isSidebarActive"
    :selected-post="selectedPost"
    @delete-post="handleDeletePost"
    @create-post="handleCreatePost"
    @update-post="handleUpdatePost"
    @close-sidebar="closeSidebar"
  />
</template>

<style></style>

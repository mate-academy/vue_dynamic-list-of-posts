<script setup lang="ts">
import { ref, onBeforeMount, defineProps } from 'vue'
import { getPostsByUserId, deletePost as apiDeletePost } from '../api/posts'
import Loader from '../loader/Loader.vue';
import Sidebar from './Sidebar.vue';

const { userId } = defineProps(['userId'])
const posts = ref([])
const loading = ref(false);
const isActiveSidebar = ref(false);
const selectedPost= ref(null);

const closeSidebar = () => {
  isActiveSidebar.value = false;
}

const openSidebar = () => {
  isActiveSidebar.value = true;
}
const handleAddNewPost = () => {
  selectedPost.value = null;
  openSidebar();
}

const fetchPosts = async () => {
  loading.value = true;
  try {
    const res = await getPostsByUserId(+userId)
    posts.value = res.data || []
  } catch (error) {
    console.error('Failed to fetch posts', error)
  } finally {
    loading.value = false;
  }
}

const openPost = (post) => {
  if (!selectedPost.value || selectedPost.value.id !== post.id) {
    selectedPost.value = post;
    openSidebar();
  } else {
    closeSidebar();
    setTimeout(() => {
      selectedPost.value = null;
    }, 1000)
  }
}

const addPost = (newPost) => {
  posts.value.push(newPost);
}

const updatePost = (newPost) => {
  posts.value = posts.value.map(post => post.id === newPost.id ? newPost : post);
}

const deletePost = async (postId) => {
  await apiDeletePost(postId);
  posts.value = posts.value.filter(post => post.id !== postId);
}

onBeforeMount(fetchPosts);
</script>

<template>
  <div class="tile is-parent mr-6 ml-6 mt-6 flex" :class="{'is-align-items-center mt-2 is-flex is-justify-content-center': loading }">
    <Loader v-if="loading"/>
    <div v-else class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button type="button" class="button is-link" @click="handleAddNewPost">Add New Post</button>
        </div>

        <table v-if="posts.length" class="table is-fullwidth is-striped is-hoverable is-narrow">
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post of posts" :key="post.id">
              <td>{{post.id}}</td>
              <td>{{post.title}}</td>
              <td class="has-text-right is-vcentered">
                <button type="button" @click="openPost(post)" class="button is-link">{{ isActiveSidebar && selectedPost?.id === post.id ? 'Close' : 'Open'}}</button>
              </td>
            </tr>
          </tbody>
        </table>

        <h1 v-else class="has-text-centered is-size-5">No posts yet</h1>
      </div>
    </div>
    <Sidebar :isActiveSidebar="isActiveSidebar" :selectedPost="selectedPost" @addPost="addPost" @deletePost="deletePost" @closeSidebar="closeSidebar" @updatePost="updatePost"/>
  </div>
</template>

<style>
.flex {
  display: flex;
  gap: 24px;
}
.flex > div {
  flex:1;
  box-sizing: border-box;
}
</style>

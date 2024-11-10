<script setup>
import { ref, onMounted } from 'vue'
import { addPostToServer, deletePost, getPosts, editServerPost } from '../API/posts';
import PostLoader from './PostLoader.vue';
import Message from './Message.vue';
import PostList from './PostList.vue';
import Sidebar from './Sidebar.vue';
import PostForm from './PostForm.vue';
import PostPreview from './PostPreview.vue';

const props = defineProps({
  userId: Number,
})

const loading = ref(false);
const posts = ref([]);
const error = ref(null);
const sidebar = ref(false);
const currentPost = ref(null);
const editing = ref(false);

onMounted(async () => {
  error.value = posts.value = null;
  loading.value = true;

  try {
    posts.value = await getPosts(props.userId) || [];
  } catch (err) {
    error.value = 'Unable to load posts';
  } finally {
    loading.value = false;
  }
});

const handleAddNewPost = () => {
  sidebar.value = true;
  currentPost.value = null;
};

const closeSidebar = () => {
  sidebar.value = false;
  currentPost.value = null;
  editing.value = false;
}

const togglePost = (post) => {
  if (post.id === currentPost.value?.id) {
    closeSidebar();
    return;
  }
  sidebar.value = true;
  currentPost.value = post;
};

const addPost = async (postData) => {
  try {
    const newPostData = await addPostToServer(props.userId, postData);
    posts.value.push(newPostData);
    currentPost.value = newPostData;
  } catch (err) {
    error.value = 'Unable to add post';
  }
}

const editPost = async (postData) => {
  if (currentPost.title === postData.title && currentPost.body === postData.body) {
    return;
  }

  try {
    const editPostId = currentPost.value.id;
    const updatedPost = await editServerPost(editPostId, postData);
    const editPost = posts.value.find(({ id }) => id === editPostId);
    Object.assign(editPost, updatedPost);
    editing.value = false;
  } catch {
    error.value = 'Unable edit post';
  }
}

const handleDeletePost = async (postId) => {
  try {
    await deletePost(postId);
    posts.value = posts.value.filter(({ id }) => id !== postId);
    closeSidebar();
  } catch {
    error.value = 'Unable to delete post';
  }
}

const handleEditPost = async (post) => {
  currentPost.value = post;
  editing.value = true;
}
</script>

<template>
  <main class="section">
    <div class="container">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <div class="tile is-child box is-success">
            <div class="block">
              <div class="block is-flex is-justify-content-space-between">
                <p class="title">Posts</p>
                <button type="button" class="button is-link"
                  :class="{ 'is-light': sidebar && !currentPost && !editing }" @click="handleAddNewPost()">Add New
                  Post</button>
              </div>

              <PostLoader v-if="loading" />

              <Message v-else-if="error" class="is-danger">
                <p>{{ error }}</p>
              </Message>

              <PostList v-else :posts="posts" @toggle-post="togglePost($event)" :open-post-id="currentPost?.id" />
            </div>
          </div>
        </div>

        <Transition name="sidebar">
          <Sidebar v-if="sidebar">
            <PostForm v-if="!currentPost" title="Create new post" @update="addPost($event)"
              @close-sidebar="closeSidebar" />

            <PostForm v-else-if="editing" title="Post editing" :post="currentPost" @update="editPost($event)"
              @close-sidebar="closeSidebar" />

            <PostPreview v-else :post="currentPost" @edit="handleEditPost($event)" @delete="handleDeletePost($event)" />

          </Sidebar>
        </Transition>
      </div>
    </div>
  </main>
</template>

<style scoped>
.sidebar-enter-active {
  animation: sidebar-in-small 0.5s;
}

.sidebar-leave-active {
  animation: sidebar-in-small 0.5s reverse;
}

@keyframes sidebar-in-small {

  0% {
    max-height: 0;
    opacity: 0;
  }

  100% {
    max-height: 50%;
    opacity: 1;
  }
}

@media (min-width: 769px) {
  .sidebar-enter-active {
    animation: sidebar-in-large 0.5s;
  }

  .sidebar-leave-active {
    animation: sidebar-in-large 0.5s reverse;
  }

  @keyframes sidebar-in-large {
    0% {
      max-width: 0;
      opacity: 0;
    }

    100% {
      max-width: 50%;
      opacity: 1;
    }
  }
}
</style>

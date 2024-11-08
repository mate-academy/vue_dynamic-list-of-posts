<script setup>
import { ref, onMounted } from 'vue'
import { addPostToServer, getPosts } from './API/posts';
import PostLoader from './components/PostLoader.vue';
import Message from './components/Message.vue';
import PostList from './components/PostList.vue';
import Sidebar from './components/Sidebar.vue';


const loading = ref(false)
const posts = ref([])
const error = ref(null)
const sidebar = ref(false)

onMounted(async () => {
  error.value = posts.value = null
  loading.value = true

  try {
    posts.value = await getPosts() || []
    console.log('posts', posts.value)
  } catch (err) {
    console.log("error here")

    error.value = 'Unable to load posts'
  } finally {
    loading.value = false
  }
});

const showSidebar = () => {
  sidebar.value = true;
}

const updatePosts = async (postData) => {
  try {
    const newPostData = await addPostToServer(postData);
    posts.value.push(newPostData);
  } catch (err) {
    error.value = 'Unable to add post'
  }

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
                <button type="button" class="button is-link" @click="showSidebar()">Add New Post</button>
              </div>

              <PostLoader v-if="loading" />

              <Message v-else-if="error" class="is-danger">
                <p>{{ error }}</p>
              </Message>

              <PostList v-else :posts="posts" />


            </div>
          </div>
        </div>
        <Transition name="sidebar">
          <Sidebar v-if="sidebar" @update="updatePosts($event)" @close-sidebar="sidebar = false" />
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

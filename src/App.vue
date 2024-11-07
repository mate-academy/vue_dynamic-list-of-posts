<script setup>
import { ref, onMounted } from 'vue'
import { getPosts } from './API/posts';
import PostLoader from './components/PostLoader.vue';
import Message from './components/Message.vue';
import PostList from './components/PostList.vue';
import Sidebar from './components/Sidebar.vue';


const loading = ref(false)
const posts = ref(null)
const error = ref(null)
const sidebar = ref(false)

onMounted(async () => {
  error.value = posts.value = null
  loading.value = true

  try {
    posts.value = await getPosts()
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
        <Sidebar :class="{'Sidebar--open': sidebar}" />
      </div>
    </div>
  </main>
</template>

<style scoped></style>

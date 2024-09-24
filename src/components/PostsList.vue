<script setup>
import { ref, onMounted } from 'vue'
import { getPostsByUserId } from '@/api/posts'
import PostsItem from './PostsItem.vue'
import Loader from './Loader.vue'

const { user } = defineProps({
  user: {
    type: Object
  }
})

const posts = ref([])
const isLoading = ref(false)
const isError = ref(false)

onMounted(() => {
  isError.value = false
  isLoading.value = true
  getPostsByUserId(user.id)
    .then(({ data }) => {
      posts.value = data
    })
    .catch(() => {
      isError.value = true
    })
    .finally(() => {
      isLoading.value = false
    })
})
</script>
<template>
  <div className="tile is-parent">
    <div className="tile is-child box is-success">
      <div className="block">
        <div className="block is-flex is-justify-content-space-between">
          <p className="title">Posts</p>
          <button type="button" className="button is-link">Add New Post</button>
        </div>
        <div
          v-if="isLoading"
          className="is-flex is-justify-content-center is-align-items-center mt-2"
        >
          <Loader />
        </div>

        <table
          v-if="!isLoading && !isError"
          className="table is-fullwidth is-striped is-hoverable is-narrow"
        >
          <thead>
            <tr className="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th className="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <PostsItem v-for="post in posts" :key="post.id" :post="post" />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

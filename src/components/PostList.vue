<script>
import Loader from './Loader.vue'

export default {
  name: 'PostList',
  components: { Loader },
  props: {
    posts: Array,
    open: Function,
    openPost: Function,
    isLoading: Boolean,
  },
}
</script>
<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button type="button" class="button is-link" @click="open">Add New Post</button>
        </div>
        <Loader v-if="isLoading" />

        <table
          v-if="posts.length > 0 && !isLoading"
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
            <tr v-for="post of posts" :key="post.id">
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button type="button" class="button is-link" @click="openPost(post)">Open</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="posts.length === 0 && !isLoading" class="block">
          <p class="title is-4">No posts yet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button
            type="button"
            class="button is-link"
            @click="$emit('create-post')"
          >
            Add New Post
          </button>
        </div>

        <Loader v-if="loading" />

        <div v-else-if="error" class="notification is-danger">
          <button class="delete" @click="$emit('retry')"></button>
          {{ error }}
        </div>

        <div v-else-if="posts.length === 0" class="notification is-info">
          No posts yet
        </div>

        <table
          v-else
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
                  @click="$emit('open-post', post)"
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
</template>

<script>
import Loader from './Loader.vue'

export default {
  name: 'PostsList',
  components: {
    Loader
  },
  props: {
    posts: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    }
  },
  emits: ['create-post', 'open-post', 'retry']
}
</script>

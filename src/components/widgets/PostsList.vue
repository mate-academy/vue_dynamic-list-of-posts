<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button type="button" class="button is-link" @click="$emit('add-new-post')">
            Add New Post
          </button>
        </div>

        <div v-if="loading" class="is-flex is-justify-content-center is-align-items-center mt-2">
          <Loader />
        </div>

        <div v-else-if="error" class="notification is-danger">
          Something went wrong while loading posts!
        </div>

        <div v-else-if="posts.length === 0" class="notification is-warning">No posts yet</div>

        <table v-else class="table is-fullwidth is-striped is-hoverable is-narrow">
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="post in posts"
              :key="post.id"
              :class="{ 'has-background-info': selectedPostId === post.id }"
            >
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button
                  type="button"
                  class="button is-link"
                  :class="{ 'is-light': selectedPostId === post.id }"
                  @click="$emit('select-post', selectedPostId === post.id ? null : post)"
                >
                  {{ selectedPostId === post.id ? 'Close' : 'Open' }}
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
import Loader from './../ui/Loader.vue'

export default {
  name: 'PostsList',
  components: { Loader },
  props: {
    posts: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
    selectedPostId: {
      type: Number,
      default: null,
    },
  },
  emits: ['select-post', 'add-new-post'],
}
</script>

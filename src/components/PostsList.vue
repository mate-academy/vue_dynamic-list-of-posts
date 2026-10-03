<script>
export default {
  name: 'PostsList',
  props: {
    posts: {
      type: Array,
      required: true,
    },
    selectedPostId: {
      type: Number,
      default: null,
    },
  },
  emits: ['add', 'select', 'close'],
};
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between is-align-items-center">
          <p class="title">Posts</p>
          <button type="button" class="button is-link" @click="$emit('add')">
            Add New Post
          </button>
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
            <tr v-for="post in posts" :key="post.id">
              <td>{{ post.id }}</td>
              <td class="post-title">{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button
                  v-if="selectedPostId === post.id"
                  type="button"
                  class="button is-link is-light"
                  @click="$emit('close')"
                >
                  Close
                </button>
                <button v-else type="button" class="button is-link" @click="$emit('select', post.id)">
                  Open
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-else class="empty-state">
          <p>No posts yet</p>
        </div>
      </div>
    </div>
  </div>
</template>

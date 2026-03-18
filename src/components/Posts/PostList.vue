<script setup>
defineProps({
  posts: { type: Array, required: true },
  selectedPostId: { type: Number, default: null },
});
const emit = defineEmits(['select', 'add']);
</script>

<template>
  <div class="tile is-parent is-4-desktop">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between is-align-items-center">
          <h2 class="title is-4">Posts</h2>
          <button type="button" class="button is-link" @click="emit('add')">
            Add New Post
          </button>
        </div>

        <table v-if="posts.length > 0" class="table is-fullwidth is-striped is-hoverable is-narrow">
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
              <td class="post-title-cell">{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button
                  type="button"
                  class="button is-link"
                  :class="{ 'is-light': post.id === selectedPostId }"
                  @click="emit('select', post)"
                >
                  {{ post.id === selectedPostId ? 'Close' : 'Open' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <h3 v-else class="mt-2 has-text-centered">No posts yet.</h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Narzucamy styl, by tabela nie wypychała Sidebaru */
.table {
  table-layout: fixed;
}

.post-title-cell {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
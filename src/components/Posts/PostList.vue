<script setup>
defineProps({
  posts: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['select', 'add']);
</script>

<template>
  <div class="tile is-parent is-4-desktop">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <h2 class="title">Posts</h2>
          <button type="button" class="button is-link" @click="$emit('add')">
            Add New Post
          </button>
        </div>

        <table
          v-if="posts.length > 0"
          class="table is-fullwidth is-striped is-hoverable"
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
              <td class="is-vcentered">{{ post.id }}</td>
              <td class="is-vcentered">{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button
                  type="button"
                  class="button is-link"
                  @click="$emit('select', post)"
                >
                  Open
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

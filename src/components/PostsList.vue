<script setup>
defineProps({
  posts: {
    type: Array,
    required: true,
  },
  selectedPostId: {
    type: Number,
    default: null,
  },
});

defineEmits(['select-post', 'deselect-post', 'open-create-form']);
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button
            @click="$emit('open-create-form')"
            type="button"
            class="button is-link"
          >
            Add New Post
          </button>
        </div>

        <table class="table is-fullwidth is-striped is-hoverable is-narrow">
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
                  v-if="selectedPostId === post.id"
                  @click="$emit('deselect-post')"
                  type="button"
                  class="button is-link"
                >
                  Close
                </button>
                <button
                  v-else
                  @click="$emit('select-post', post)"
                  type="button"
                  class="button is-link is-light"
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

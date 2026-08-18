<script setup>
defineProps({
  posts: {
    type: Array,
    required: true,
  },
  selectedPostId: {
    type: [Number, String],
    default: null,
  },
  creatingPost: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['add', 'toggle']);
</script>

<template>
  <div class="tile is-parent" data-cy="PostsList">
    <div class="tile is-child box">
      <div class="block is-flex is-justify-content-space-between is-align-items-center is-flex-wrap-wrap gap-2">
        <p class="title mb-0">
          Posts
        </p>
        <button
          type="button"
          class="button is-link"
          :class="{ 'is-light': creatingPost }"
          data-cy="AddNewPostButton"
          @click="$emit('add')"
        >
          Add New Post
        </button>
      </div>

      <div class="table-container">
        <table class="table is-fullwidth is-striped is-hoverable is-narrow">
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts" :key="post.id" data-cy="Post">
              <td data-cy="PostId">
                {{ post.id }}
              </td>
              <td data-cy="PostTitle">
                {{ post.title }}
              </td>
              <td class="has-text-right is-vcentered">
                <button
                  type="button"
                  class="button is-link"
                  :class="{ 'is-light': selectedPostId !== post.id }"
                  data-cy="PostButton"
                  @click="$emit('toggle', post)"
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

<script setup>
const props = defineProps({
  posts: Array,
  isLoading: Boolean,
  error: String,
  selectedPost: Object,
});

const emit = defineEmits(['selectedPost', 'openNew']);

</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button 
            type="button" 
            class="button is-link"
            @click="$emit('openNew')"
          >
            Add New Post
          </button>
        </div>

        <PostLoader v-if="isLoading" />
        <div v-else-if="error"> Error: {{ error }}</div>
        <div v-else-if="posts.length === 0">No posts yet</div>

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
                  class="button"
                  :class="{
                    'is-link': selectedPost && selectedPost.id === post.id,
                    'is-light': !selectedPost || selectedPost.id !== post.id,
                  }"
                  @click="$emit('selectedPost', selectedPost && selectedPost.id === post.id ? null : post)"
                >
                  {{ selectedPost && selectedPost.id === post.id ? 'Close' : 'Open' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
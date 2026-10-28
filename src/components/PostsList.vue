<script setup>
defineProps({
  posts: {
    type: Array,
    required: true
  }, 
  isSidebarOpen: {
    type: Boolean,
    required: true,
  },
  selectedPost: {
    type: Object,
    required: false,
  }
});

defineEmits(['add-post', 'open-post', 'close-post']);
</script>

<template>
 <div
    class="PostsList tile is-parent"
    :class="{ 'PostsList--half': isSidebarOpen }"
  >
  <div class="tile is-child box is-success">
    <div class="block">
      <div class="block is-flex is-justify-content-space-between">
        <p class="title">Posts</p>
        <button type="button" 
            class="button is-link" 
            @click="$emit('add-post')"
        >
        Add New Post</button>
      </div>

      <table v-if="posts.length"
      class="table is-fullwidth is-striped is-hoverable is-narrow">
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
              <button type="button"
                v-if="!selectedPost || selectedPost.id !== post.id"
                class="button is-link"
                :class="{ 'is-light': !selectedPost || selectedPost.id !== post.id }"
                @click="$emit('open-post', post)"
              >
                Open
              </button>
              <button type="button" 
                v-else
                class="button is-link"
                @click="$emit('close-post', post)"
              >
                Close
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p
        v-else
        class="has-text-centered py-4"
      >
        No posts yet.
      </p>
    </div>
  </div>
</div>

</template>

<style scoped>
.PostsList {
  width: 100%;
  transition: width 0.5s ease-in-out;
}

.PostsList--half {
  width: 50%;
}
</style>
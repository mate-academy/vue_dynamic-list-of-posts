<!-- filepath: c:\git-repos\course\vue\vue_dynamic-list-of-posts___\src\components\PostsList.vue -->
<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <h2 class="title">Posts</h2>
          <button type="button" class="button is-link" @click="$emit('add-post')">
            Add New Post
          </button>
        </div>

        <!-- Loader Spinner -->
        <div v-if="loading" class="has-text-centered">
          <AppLoader />
        </div>

        <div v-if="!loading" >
          <!-- No Posts Message -->
          <h3 v-if="posts.length === 0" class="mt-2 has-text-centered">No posts yet.</h3>

          <!-- Posts Table -->
          <table v-else class="table is-fullwidth is-striped is-hoverable is-narrow">
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
                <td class="has-text-right">
                  <button
                    type="button"
                    class="button is-link"
                    @click="$emit('open-post', post.id)"
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
  </div>
</template>

<script>
import AppLoader from './loader/AppLoader.vue';

export default {
  name: 'PostsList',
  components: {
    AppLoader, // Register the loader component
  },
  props: {
    posts: {
      type: Array,
      required: true,
    },
    selectedPostId: {
      type: Number,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false, // Indicates whether posts are being fetched
    },
  },
};
</script>

<style scoped>
.mt-2 {
  margin-top: 0.5rem;
}

.has-text-centered {
  text-align: center;
}
</style>
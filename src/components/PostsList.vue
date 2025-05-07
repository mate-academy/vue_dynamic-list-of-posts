<script>
  import Loader from './Loader.vue';
  import Post from './Post.vue';
import PostLoader from './PostLoader.vue';

  export default {
    name: 'PostsList',
    components: {
    Post,
    Loader,
    PostLoader
},
    props: {
      statusForm: String,
      posts: Array,
      previewId: Number,
      isLoading: Boolean,
    },
    emits: ['update-status-form', 'update-preview-id'],
  }
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <h2 class="title">Posts</h2>

          <button
            type="button"
            class="button is-link"
            :class="{ 'is-light': statusForm === 'create' }"
            @click="$emit('update-status-form', 'create')"
          >
              Add New Post
          </button>
        </div>

        <table
          v-if="posts.length > 0 && !isLoading"
          class="table is-fullwidth is-striped is-hoverable is-narrow"
        >
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>

          <Post
            v-for="post of posts"
            :key="post.id"
            :post="post"
            :previewId="previewId"
            @update-preview-id="$emit('update-preview-id', $event)"
          />
        </table>

        <h3
          v-if="posts.length <= 0 && !isLoading"
          class="mt-2 has-text-centered"
        >
          No posts yet.
        </h3>

        <PostLoader v-if="isLoading">
          <Loader />
        </PostLoader>
      </div>
    </div>
  </div>
</template>
<script>
  import Post from './Post.vue';

  export default {
    name: 'PostsList',
    components: {
      Post,
    },
    props: {
      statusForm: String,
      posts: Array,
      previewId: Number,
      isPreview: Boolean,
    },
    emits: ['setStatusForm', 'setPreviewId', 'setIsPreview'],
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
            @click="$emit('setStatusForm', 'create')"
          >
              Add New Post
          </button>
        </div>

        <table
          v-if="posts.length > 0"
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
            :isPreview="isPreview"
            @setPreviewId="$emit('setPreviewId', $event)"
            @setIsPreview="$emit('setIsPreview', $event)"
          />
        </table>
        <h3
          v-else
          class="mt-2 has-text-centered"
        >
          No posts yet.
        </h3>
      </div>
    </div>
  </div>
</template>
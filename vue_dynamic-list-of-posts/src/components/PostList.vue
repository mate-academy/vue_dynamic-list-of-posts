<script>
import Post from './Post.vue';
export default {
  name: 'PostsList',
  props: {
    posts: [],
    previewId: Number,  
  },
  emits: ['addNew','togglePreview'],
  components: {
    Post,
  }
}
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
            :class="{ 'is-light': false }" 
            @click="$emit('addNew')"
          >
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
            <Post 
              v-for="post of posts" 
              :key="post.id" 
              :post="post"
              :isOnPreview="post.id === previewId" 
              @closePreview="$emit('togglePreview')"
              @openPreview="$emit('togglePreview', post)"
            />
          </tbody>
        </table>

        <h3 v-else class="mt-2 has-text-centered">
          No posts yet.
        </h3>
      </div>
    </div>
  </div>
</template>

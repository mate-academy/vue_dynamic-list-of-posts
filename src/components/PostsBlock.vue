<script>

import AppLoader from './AppLoader.vue';

export default {
  name: 'PostBlock',
  emits: ['selectPost', 'showForm'],
  props: {
    selectedPost: Object,
    isFormShown: Boolean,
    editingPost: Object,
    posts: Array,
    arePostsLoading: Boolean,
  },
  components: { AppLoader }
}
</script>

<template>
  <div className="tile is-parent post__list">  
    <div className="tile is-child box is-success">
      <div className="block">
        <div className="block is-flex is-justify-content-space-between">
          <p className="title">Posts</p>
          <button 
            type="button" 
            class="button is-link"
            :class="{ 'is-light': isFormShown && !editingPost }"
            @click="this.$emit('showForm', null)"
          >
            Add New Post
          </button>
        </div>

        <div 
          className="is-flex is-justify-content-center is-align-items-center mt-2"
          v-if="arePostsLoading"
        >
          <AppLoader />
        </div>

        <div 
          className="block" 
          v-if="!this.arePostsLoading && this.posts.length === 0"
        >
          <h3 class="mt-2 has-text-centered">No posts yet.</h3>
        </div>

        <table 
          className="table is-fullwidth is-striped is-hoverable is-narrow"
          v-else
        >
          <thead>
            <tr className="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th className="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post of this.posts" :key="post.id">
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td className="has-text-right is-vcentered">
                <button 
                  type="button" 
                  class="button is-link"
                  :class="{
                    'is-light': !this.selectedPost || this.selectedPost.id !== post.id,
                  }"
                  @click="this.$emit('selectPost', post)"
                >
                  {{ this.selectedPost && this.selectedPost.id === post.id ? 'Close' : 'Open' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
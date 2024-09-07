<script>
  import Post from './Post.vue';
  import Loader from '../components/Loader.vue';

  export default {
    props: {
      posts: Array,
      errorMessages: String,
      loader: Boolean,
      selectedPost: Object,
    },
    emits: ['sidebar:change', 'openPost', 'closePost'],
    components: {
      Post,
      Loader,
    }
  }
</script>
<template>
  <div className="tile is-parent is-flex">
    <div className="tile is-child box is-success">
      <div className="block">
        <div className="block is-flex is-justify-content-space-between">
          <p className="title">Posts</p>
          <button type="button" className="button is-link" @click="$emit('sidebar:change', true)">Add New Post</button>
        </div>

        <table className="table is-fullwidth is-striped is-hoverable is-narrow" v-if="posts.length > 0">
          <thead>
            <tr className="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th className="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <Post v-for="post of posts" :key="post.id" :post="post" :selectedPost="selectedPost" @openPost="$emit('openPost', post)" @closePost="$emit('closePost')"/>
          </tbody>
        </table>
        <h3 class="mt-2 has-text-centered" v-if="!errorMessages && posts.length === 0 && !loader">No posts yet.</h3>
        <h3 class="mt-2 has-text-centered has-text-danger" v-if="errorMessages && !loader">{{ errorMessages }}</h3>
        <Loader v-if="loader && !selectedPost"/>
      </div>
    </div>
  </div>

</template>
<style></style>

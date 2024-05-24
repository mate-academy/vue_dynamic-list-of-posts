<template>
  <div class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>{{ `#${post.id}: ${post.title}` }}</h2>
      <div class="is-flex">
        <span class="icon is-small is-right is-clickable" @click="editPost">
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span class="icon is-small is-right has-text-danger is-clickable ml-3" @click="deletePost">
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p>{{ post.body }}</p>
  </div>
</template>
<script>
import { removePost } from '@/api/posts';

export default {
  name: 'PostPreview',
  props: {
    post: Object
  },
  methods: {
    deletePost() {
      removePost(this.post.id).then(() => this.$emit('post-deleted', this.post.id));
    },
    editPost() {
      this.$emit('post-editing', this.post);
    }
  }
};
</script>

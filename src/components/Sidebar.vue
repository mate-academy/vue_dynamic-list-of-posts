<template>
  <div :class="['Sidebar', { 'Sidebar--open': isCreating || selectedPost }]">
    <PostForm
      v-if="isEditing"
      :post="selectedPost"
      @updated="onUpdated"
      @cancel="isEditing=false"
    />
    <PostPreview
      v-else-if="selectedPost"
      :post="selectedPost"
      @edit="isEditing=true"
      @delete="handleDelete"
    />
  </div>
</template>

<script>
import PostForm from './PostForm.vue';
import PostPreview from './PostPreview.vue';

export default {
  components: { PostForm, PostPreview },
  props: {
    selectedPost: Object,
    isCreating: Boolean
  },
  data() {
    return { isEditing: false };
  },
  methods: {
    handleDelete(postId) {
      this.$emit('deleted', postId);
      this.isEditing = false;
    },
    onUpdated(post) {
      this.$emit('updated', post);
      this.isEditing = false;
    }
  }
};
</script>

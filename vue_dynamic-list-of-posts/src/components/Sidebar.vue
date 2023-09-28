<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-reserved-component-names -->
<script>
import PostForm from './PostForm.vue';
import PostPreview from './PostPreview.vue';
export default {
  name: 'Sidebar',
  props: {
    isOpen: Boolean,
    previewPost: Object,
  },
  components: {
    PostForm,
    PostPreview,
  },
  data () {
    return {
     isUpdating: false,
    };
  },
  emits: ['close', 'postCreating', 'postRemoving', 'postUpdating'],
}
</script>

<template>
  <div class="tile is-parent is-8-desktop Sidebar" :class="{ 'Sidebar--open': isOpen }">
    <div class="tile is-child box is-success ">
      <div v-if="isOpen" class="content">
        <PostPreview
          v-if="!!previewPost && !isUpdating"
          :post="previewPost"
          @removePost="$emit('postRemoving', $event)"
          @updatePost="isUpdating = true"
          />

        <PostForm 
          v-if="isUpdating"
          :postForUpdating="previewPost"
          @close="$emit('close'); isUpdating = false"
          @postUpdating="$emit('postUpdating', $event); isUpdating = false"
        />
        <PostForm 
          v-if="!previewPost && !isUpdating"
          @close="$emit('close')"
          @postCreating="$emit('postCreating', $event)"
        />
      </div>
    </div>
  </div>
</template>

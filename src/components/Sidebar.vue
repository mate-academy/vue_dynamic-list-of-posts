<template>
  <div :class="['Sidebar', { 'Sidebar--open': isCreating || selectedPost }]">
    <!-- PostForm para criação -->
    <PostForm
      v-if="isCreating"
      :userId="currentUserId"
      @created="onCreated"
      @cancel="onCancel"
    />
    
    <!-- PostForm para edição -->
    <PostForm
      v-else-if="isEditing"
      :post="selectedPost"
      :userId="currentUserId"
      @updated="onUpdated"
      @cancel="isEditing = false"
    />
    
    <!-- Preview do post -->
    <PostPreview
      v-else-if="selectedPost"
      :post="selectedPost"
      @edit="isEditing = true"
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
    isCreating: Boolean,
    currentUserId: {
      type: Number,
      required: true
    }
  },
  data() {
    return { 
      isEditing: false 
    };
  },
  methods: {
    handleDelete(postId) {
      this.$emit('deleted', postId);
      this.closeSidebar(); // ✅ USAR closeSidebar EM VEZ DE isEditing = false
    },
    onUpdated(post) {
      this.$emit('updated', post);
      this.isEditing = false;
    },
    onCreated(post) {
      this.$emit('created', post);
    },
    onCancel() {
      this.$emit('cancel');
    },
    closeSidebar() {
      this.isEditing = false;
      this.$emit('close'); // ✅ GARANTIR QUE EMITE EVENTO close
    }
  }
};
</script>
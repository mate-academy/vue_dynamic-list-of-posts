<script setup>
import PostDetails from '../Posts/PostDetails.vue';
import PostForm from '../Posts/PostForm.vue';

defineProps({
  post: { type: Object, default: null },
  isOpen: { type: Boolean, required: true },
  mode: { type: String, required: true },
  comments: { type: Array, default: () => [] },
  isLoadingComments: { type: Boolean, default: false },
  isCommentSubmitting: { type: Boolean, default: false },
  userId: { type: Number, required: true },
});

const emit = defineEmits(['close', 'save', 'delete', 'edit', 'add-comment', 'delete-comment']);
</script>

<template>
  <div
    class="tile is-parent is-8-desktop Sidebar"
    :class="{ 'Sidebar--open': isOpen }"
  >
    <div class="tile is-child box is-success">
      <div class="content">
        <div class="block is-flex is-justify-content-end">
          <button class="delete" @click="emit('close')"></button>
        </div>

        <template v-if="mode === 'view' && post">
          <PostDetails
            :post="post"
            :comments="comments"
            :is-loading-comments="isLoadingComments"
            :is-comment-submitting="isCommentSubmitting"
            @delete="emit('delete', $event)"
            @edit="emit('edit')"
            @add-comment="emit('add-comment', $event)"
            @delete-comment="emit('delete-comment', $event)"
          />
        </template>

        <template v-else-if="mode === 'add' || mode === 'edit'">
          <PostForm
            :user-id="userId"
            :post="mode === 'edit' ? post : null"
            @save="emit('save', $event)"
            @cancel="emit('close')"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition: all 0.5s ease-in-out;
}

.Sidebar--open {
  opacity: 1;
}

@media (min-width: 769px) {
  .Sidebar {
    max-width: 0;
  }

  .Sidebar--open {
    max-width: 66.66667%; 
  }
}
</style>
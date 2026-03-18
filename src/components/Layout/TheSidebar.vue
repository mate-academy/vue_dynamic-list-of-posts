<script setup>
import PostDetails from '../Posts/PostDetails.vue';
import PostForm from '../Posts/PostForm.vue';

defineProps({
  post: { type: Object, default: null },
  isOpen: { type: Boolean, required: true },
  mode: { type: String, required: true },
  comments: { type: Array, default: () => [] },
  isLoadingComments: { type: Boolean, default: false },
  userId: { type: Number, required: true },
});

const emit = defineEmits(['close', 'save', 'delete']);
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
            @delete="emit('delete', $event)"
          />
        </template>

        <template v-else-if="mode === 'add'">
          <PostForm
            :user-id="userId"
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
}

.Sidebar--open {
  opacity: 1;

  @media (min-width: 769px) {
    max-width: 50%;
  }
}
</style>

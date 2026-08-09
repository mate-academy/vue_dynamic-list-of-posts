<template>
  <div
    class="tile is-parent is-8-desktop Sidebar"
    :class="{ 'Sidebar--open': isOpen }"
  >
    <div class="tile is-child box">
      <div class="content">
        <EditPost
          v-if="isEditing && post"
          :post="post"
          :is-submitting="isUpdatingPost"
          @save="$emit('save', $event)"
          @cancel="$emit('cancel-edit')"
        />

        <AddPost
          v-else-if="isCreating"
          :is-submitting="isSubmitting"
          @create="$emit('create', $event)"
          @cancel="$emit('close')"
        />

        <PostPreview
          v-else-if="post"
          :post="post"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AddPost from './AddPost.vue';
import EditPost from './EditPost.vue';
import PostPreview from './PostPreview.vue';

export default {
  name: 'Sidebar',

  components: {
    AddPost,
    EditPost,
    PostPreview,
  },

  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },

    isCreating: {
      type: Boolean,
      default: false,
    },

    isEditing: {
      type: Boolean,
      default: false,
    },

    isSubmitting: {
      type: Boolean,
      default: false,
    },

    isUpdatingPost: {
      type: Boolean,
      default: false,
    },

    post: {
      type: Object,
      default: null,
    },
  },

  emits: [
    'close',
    'create',
    'edit',
    'delete',
    'save',
    'cancel-edit',
  ],
};
</script>

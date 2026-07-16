<script setup>
import CommentsList from './CommentsList.vue'

defineProps({
  post: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div>
    <h2 class="title is-4">
      {{ post.title }}
    </h2>

    <p class="mb-5">
      {{ post.body }}
    </p>

    <div class="buttons">
      <button
        class="button is-warning"
        @click="emit('edit')"
      >
        Edit
      </button>

      <button
        class="button is-danger"
        @click="emit('delete')"
      >
        Delete
      </button>
    </div>

    <hr>

    <h3 class="title is-5">
      Comments
    </h3>

    <CommentsList
      :post-id="post.id"
    />
  </div>
</template>
<script setup>
defineProps({
  comments: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['delete']);
</script>

<template>
  <div class="block">
    <h3 class="title is-5">
      Comments
    </h3>

    <article
      v-for="comment of comments"
      :key="comment.id"
      class="message is-small"
    >
      <div class="message-header">
        <a :href="`mailto:${comment.email}`">
          {{ comment.name }}
        </a>

        <button
          type="button"
          class="delete is-small"
          aria-label="delete"
          @click="emit('delete', comment.id)"
        ></button>
      </div>

      <div class="message-body">
        {{ comment.body }}
      </div>
    </article>
  </div>
</template>
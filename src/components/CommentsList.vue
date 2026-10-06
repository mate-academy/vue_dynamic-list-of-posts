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
  <div>
    <article
      v-for="comment in comments"
      :key="comment.id"
      class="box"
    >
      <strong>{{ comment.name }}</strong>

      <p class="is-size-7 has-text-grey">
        {{ comment.email }}
      </p>

      <p class="mt-2">
        {{ comment.body }}
      </p>

      <button
        class="button is-small is-danger mt-2"
        @click="emit('delete', comment)"
      >
        Delete
      </button>
    </article>
  </div>
</template>
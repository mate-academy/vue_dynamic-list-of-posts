<script setup lang="ts">
defineProps<{
  name: string;
  email: string;
  body: string;
}>();
</script>
<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${email}`">
        {{ name }}
      </a>

      <button
        type="button"
        class="delete is-small"
        aria-label="delete"
      >
        delete button
      </button>
    </div>

    <div class="message-body">
      {{ body }}
    </div>
  </article>
</template>
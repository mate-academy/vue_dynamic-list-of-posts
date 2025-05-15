<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { getUser } from '@/utils/localStorage'
import { computed } from 'vue'

const props = defineProps(['comment'])
const emit = defineEmits('delete')

const userEmail = computed(() => {
  return getUser()?.email
})
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${props.comment.email}`"> {{ props.comment?.name }} </a>
      <button
        type="button"
        class="delete is-small"
        aria-label="delete"
        @click="emit('delete')"
      ></button>
    </div>
    <div class="message-body">{{ props.comment?.body }}</div>
  </article>
</template>

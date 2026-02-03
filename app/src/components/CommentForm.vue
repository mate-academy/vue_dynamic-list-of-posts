<template>
  <div class="mt-3">
    <div class="field">
      <input
        class="input"
        placeholder="Name"
        v-model="form.name"
        :class="{ 'is-danger': submitted && !form.name }"
      />
    </div>

    <div class="field">
      <input
        class="input"
        placeholder="Email"
        v-model="form.email"
        :class="{ 'is-danger': submitted && !form.email }"
      />
    </div>

    <div class="field">
      <textarea
        class="textarea"
        placeholder="Comment"
        v-model="form.body"
        :class="{ 'is-danger': submitted && !form.body }"
      />
    </div>

    <p v-if="error" class="has-text-danger mb-2">
      Failed to submit comment. Try again.
    </p>

    <div class="buttons">
      <button
        class="button is-primary"
        :class="{ 'is-loading': loading }"
        @click="submit"
      >
        Submit
      </button>
      <button class="button" @click="clear">Clear</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  postId: Number,
});

const emit = defineEmits(['comment-added']);

const form = ref({ name: '', email: '', body: '' });
const submitted = ref(false);
const loading = ref(false);
const error = ref(false);

async function submit() {
  submitted.value = true;
  error.value = false;

  if (!form.value.name || !form.value.email || !form.value.body) return;

  loading.value = true;
  try {
    const r = await fetch(
      'https://mate.academy/students-api/comments',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form.value,
          postId: props.postId,
        }),
      }
    );

    if (!r.ok) throw new Error();

    const newComment = await r.json();
    emit('comment-added', newComment);
    form.value.body = '';
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
}

function clear() {
  form.value.body = '';
  submitted.value = false;
  error.value = false;
}
</script>

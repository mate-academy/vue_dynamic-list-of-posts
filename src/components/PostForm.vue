<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  post: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['submit']);

const title = ref('');
const body = ref('');

const errors = ref({
  title: '',
  body: '',
});

const loading = ref(false);

watch(
  () => props.post,
  post => {
    title.value = post?.title || '';
    body.value = post?.body || '';

    errors.value = {
      title: '',
      body: '',
    };
  },
  { immediate: true },
);

function validate() {
  errors.value = {
    title: '',
    body: '',
  };

  let valid = true;

  if (!title.value.trim()) {
    errors.value.title = 'Title is required';
    valid = false;
  }

  if (!body.value.trim()) {
    errors.value.body = 'Body is required';
    valid = false;
  }

  return valid;
}

async function submit() {
  if (!validate()) {
    return;
  }

  loading.value = true;

  try {
    await emit('submit', {
      title: title.value.trim(),
      body: body.value.trim(),
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <div class="field">
      <label class="label">Title</label>

      <input
        v-model="title"
        class="input"
        type="text"
        @input="errors.title = ''"
      />

      <p
        v-if="errors.title"
        class="help is-danger"
      >
        {{ errors.title }}
      </p>
    </div>

    <div class="field">
      <label class="label">Body</label>

      <textarea
        v-model="body"
        class="textarea"
        @input="errors.body = ''"
      ></textarea>

      <p
        v-if="errors.body"
        class="help is-danger"
      >
        {{ errors.body }}
      </p>
    </div>

    <button
      type="submit"
      class="button is-primary"
      :class="{ 'is-loading': loading }"
      :disabled="loading"
    >
      {{ post ? 'Save' : 'Create' }}
    </button>
  </form>
</template>
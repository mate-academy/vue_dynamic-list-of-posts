<script setup>
import { ref } from 'vue';

const props = defineProps({
  submitting: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['submit']);

const name = ref('');
const email = ref('');
const body = ref('');

const errors = ref({
  name: '',
  email: '',
  body: '',
});

function validate() {
  errors.value = {
    name: '',
    email: '',
    body: '',
  };

  let valid = true;

  if (!name.value.trim()) {
    errors.value.name = 'Name is required';
    valid = false;
  }

  if (!email.value.trim()) {
    errors.value.email = 'Email is required';
    valid = false;
  }

  if (!body.value.trim()) {
    errors.value.body = 'Comment is required';
    valid = false;
  }

  return valid;
}

function submit() {
  if (!validate()) {
    return;
  }

  emit('submit', {
    name: name.value.trim(),
    email: email.value.trim(),
    body: body.value.trim(),
    clearBody: () => {
      body.value = '';
      errors.value.body = '';
    },
  });
}

function clear() {
  name.value = '';
  email.value = '';
  body.value = '';

  errors.value = {
    name: '',
    email: '',
    body: '',
  };
}
</script>

<template>
  <form @submit.prevent="submit">
    <h4 class="title is-6">
      Write a comment
    </h4>

    <div class="field">
      <label class="label">Name</label>

      <input
        v-model="name"
        class="input"
        type="text"
        @input="errors.name = ''"
      />

      <p
        v-if="errors.name"
        class="help is-danger"
      >
        {{ errors.name }}
      </p>
    </div>

    <div class="field">
      <label class="label">Email</label>

      <input
        v-model="email"
        class="input"
        type="email"
        @input="errors.email = ''"
      />

      <p
        v-if="errors.email"
        class="help is-danger"
      >
        {{ errors.email }}
      </p>
    </div>

    <div class="field">
      <label class="label">Comment</label>

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

    <div class="buttons">
      <button
        type="submit"
        class="button is-primary"
        :class="{ 'is-loading': submitting }"
        :disabled="submitting"
      >
        Add
      </button>

      <button
        type="button"
        class="button"
        :disabled="submitting"
        @click="clear"
      >
        Clear
      </button>
    </div>
  </form>
</template>
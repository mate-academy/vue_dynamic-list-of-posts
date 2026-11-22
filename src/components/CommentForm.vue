<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
  successCount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["submit", "cancel", "clear-error"]);

const name = ref("");
const email = ref("");
const body = ref("");

const fieldErrors = ref({
  name: "",
  email: "",
  body: "",
});

function handleSubmit() {
  fieldErrors.value = {
    name: "",
    email: "",
    body: "",
  };

  if (!name.value.trim()) {
    fieldErrors.value.name = "Name is required";
  }

  if (!email.value.trim()) {
    fieldErrors.value.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    fieldErrors.value.email = "Enter a valid email";
  }

  if (!body.value.trim()) {
    fieldErrors.value.body = "Comment is required";
  }

  if (
    fieldErrors.value.name ||
    fieldErrors.value.email ||
    fieldErrors.value.body
  ) {
    return;
  }

  emit("submit", {
    name: name.value.trim(),
    email: email.value.trim(),
    body: body.value.trim(),
  });
}

function clearForm() {
  name.value = "";
  email.value = "";
  body.value = "";

  fieldErrors.value = {
    name: "",
    email: "",
    body: "",
  };

  emit("clear-error");
}

watch(
  () => props.successCount,
  () => {
    body.value = "";
  },
);
</script>

<template>
  <form
    class="box mt-3"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <h4 class="title is-5">Write a comment</h4>

    <div class="field">
      <label class="label">Name</label>
      <input
        v-model="name"
        class="input"
        :class="{ 'is-danger': fieldErrors.name }"
        type="text"
        @input="fieldErrors.name = ''"
      />
      <p v-if="fieldErrors.name" class="help is-danger">
        {{ fieldErrors.name }}
      </p>
    </div>

    <div class="field">
      <label class="label">Email</label>
      <input
        v-model="email"
        class="input"
        :class="{ 'is-danger': fieldErrors.email }"
        type="email"
        @input="fieldErrors.email = ''"
      />
      <p v-if="fieldErrors.email" class="help is-danger">
        {{ fieldErrors.email }}
      </p>
    </div>

    <div class="field">
      <label class="label">Comment</label>
      <textarea
        v-model="body"
        class="textarea"
        :class="{ 'is-danger': fieldErrors.body }"
        @input="fieldErrors.body = ''"
      ></textarea>
      <p v-if="fieldErrors.body" class="help is-danger">
        {{ fieldErrors.body }}
      </p>
    </div>

    <p v-if="error" class="help is-danger mb-3">
      {{ error }}
    </p>

    <div class="field is-grouped is-grouped-multiline">
      <button
        type="submit"
        class="button is-link"
        :class="{ 'is-loading': isLoading }"
        :disabled="isLoading"
      >
        Send
      </button>

      <button
        type="button"
        class="button is-light"
        :disabled="isLoading"
        @click="emit('cancel')"
      >
        Cancel
      </button>

      <button
        type="button"
        class="button is-light"
        :disabled="isLoading"
        @click="clearForm"
      >
        Clear
      </button>
    </div>
  </form>
</template>
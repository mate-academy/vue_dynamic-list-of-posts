<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
  fieldErrors: {
    type: Object,
    default: () => ({
      name: "",
      email: "",
      body: "",
    }),
  },
  clearBodyKey: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["submit", "field-change"]);

const form = reactive({
  name: "",
  email: "",
  body: "",
});

watch(
  () => props.clearBodyKey,
  () => {
    form.body = "";
  },
);

function handleInput(field) {
  emit("field-change", field);
}

function clearForm() {
  form.name = "";
  form.email = "";
  form.body = "";

  emit("field-change", "name");
  emit("field-change", "email");
  emit("field-change", "body");
}

function handleSubmit() {
  emit("submit", { ...form });
}
</script>

<template>
  <div>
    <h4 class="title is-6 mt-4">Write a comment</h4>

    <form @submit.prevent="handleSubmit">
      <div class="field">
        <label class="label" for="comment-name">Name</label>
        <input
          id="comment-name"
          v-model="form.name"
          class="input"
          :class="{ 'is-danger': fieldErrors.name }"
          @input="handleInput('name')"
        />
        <p v-if="fieldErrors.name" class="help is-danger">
          {{ fieldErrors.name }}
        </p>
      </div>

      <div class="field">
        <label class="label" for="comment-email">Email</label>
        <input
          id="comment-email"
          v-model="form.email"
          class="input"
          type="text"
          :class="{ 'is-danger': fieldErrors.email }"
          @input="handleInput('email')"
        />
        <p v-if="fieldErrors.email" class="help is-danger">
          {{ fieldErrors.email }}
        </p>
      </div>

      <div class="field">
        <label class="label" for="comment-body">Comment</label>
        <textarea
          id="comment-body"
          v-model="form.body"
          class="textarea"
          :class="{ 'is-danger': fieldErrors.body }"
          @input="handleInput('body')"
        />
        <p v-if="fieldErrors.body" class="help is-danger">
          {{ fieldErrors.body }}
        </p>
      </div>

      <p v-if="error" class="help is-danger mb-3">
        {{ error }}
      </p>

      <div class="buttons">
        <button
          class="button is-link"
          :class="{ 'is-loading': loading }"
          :disabled="loading"
          type="submit"
        >
          Submit
        </button>

        <button
          class="button"
          type="button"
          :disabled="loading"
          @click="clearForm"
        >
          Clear
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  isSubmitting: { type: Boolean, default: false },
});

const emit = defineEmits(["submitted", "cancel"]);

const name = ref("");
const email = ref("");
const body = ref("");

const errors = ref({ name: false, email: false, body: false });

const handleSubmit = async () => {
  errors.value.name = !name.value.trim();
  errors.value.email = !email.value.trim();
  errors.value.body = !body.value.trim();

  if (errors.value.name || errors.value.email || errors.value.body) return;

  emit("submitted", {
    name: name.value,
    email: email.value,
    body: body.value,
  });

  body.value = "";
};

const handleClear = () => {
  name.value = "";
  email.value = "";
  body.value = "";
  errors.value = { name: false, email: false, body: false };
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="field" data-cy="NameField">
      <label class="label" for="comment-name">Name</label>
      <div class="control has-icons-left has-icons-right">
        <input
          v-model="name"
          type="text"
          id="comment-name"
          placeholder="Your name"
          class="input"
          :class="{ 'is-danger': errors.name }"
          @input="errors.name = false" />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
        <span v-if="errors.name" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>
      <p v-if="errors.name" class="help is-danger" data-cy="ErrorMessage">
        Name is required
      </p>
    </div>

    <div class="field" data-cy="EmailField">
      <label class="label" for="comment-email">Email</label>
      <div class="control has-icons-left has-icons-right">
        <input
          v-model="email"
          type="text"
          id="comment-email"
          placeholder="Your email"
          class="input"
          :class="{ 'is-danger': errors.email }"
          @input="errors.email = false" />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
        <span v-if="errors.email" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>
      <p v-if="errors.email" class="help is-danger" data-cy="ErrorMessage">
        Email is required
      </p>
    </div>

    <div class="field" data-cy="BodyField">
      <label class="label" for="comment-body">Comment</label>
      <div class="control">
        <textarea
          v-model="body"
          id="comment-body"
          placeholder="Your comment"
          class="textarea"
          :class="{ 'is-danger': errors.body }"
          @input="errors.body = false"></textarea>
      </div>
      <p v-if="errors.body" class="help is-danger" data-cy="ErrorMessage">
        Comment is required
      </p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': isSubmitting }">
          Add Comment
        </button>
      </div>
      <div class="control">
    <button
      type="reset"
      class="button is-link is-light"
      @click="handleClear">
      Clear
    </button>
  </div>
      <div class="control">
        <button
          type="button"
          class="button is-link is-light"
          @click="$emit('cancel')">
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>


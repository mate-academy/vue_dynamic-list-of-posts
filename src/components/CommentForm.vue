<template>
  <form @submit.prevent="handleSubmit" class="box">
    <div class="field">
      <label class="label">Author Name</label>
      <div class="control has-icons-left has-icons-right">
        <input
          v-model.trim="form.name"
          type="text"
          class="input"
          :class="{ 'is-danger': errors.name }"
          placeholder="Enter your name"
          @input="errors.name = false"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
        <span v-if="errors.name" class="icon is-small is-right has-text-danger">
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>
      <p v-if="errors.name" class="help is-danger">Name is required</p>
    </div>

    <div class="field">
      <label class="label">Email</label>
      <div class="control has-icons-left has-icons-right">
        <input
          v-model.trim="form.email"
          type="email"
          class="input"
          :class="{ 'is-danger': errors.email }"
          placeholder="Enter your email"
          @input="errors.email = false"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
        <span
          v-if="errors.email"
          class="icon is-small is-right has-text-danger"
        >
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>
      <p v-if="errors.email" class="help is-danger">Valid email is required</p>
    </div>

    <div class="field">
      <label class="label">Comment</label>
      <div class="control">
        <textarea
          v-model.trim="form.body"
          class="textarea"
          :class="{ 'is-danger': errors.body }"
          placeholder="Enter comment text"
          @input="errors.body = false"
        ></textarea>
      </div>
      <p v-if="errors.body" class="help is-danger">Comment cannot be empty</p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': isSubmitting }"
        >
          Add Comment
        </button>
      </div>
      <div class="control">
        <button
          type="button"
          class="button is-link is-light"
          @click="clearForm"
        >
          Clear
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref } from "vue";
import { createComment } from "../api/posts";

const props = defineProps({
  postId: Number,
});

const emit = defineEmits(["comment-added"]);

const isSubmitting = ref(false);

const form = reactive({
  name: "",
  email: "",
  body: "",
});

const errors = reactive({
  name: false,
  email: false,
  body: false,
});

const clearForm = () => {
  form.body = "";

  Object.keys(errors).forEach((key) => (errors[key] = false));
};

const handleSubmit = async () => {
  errors.name = !form.name;
  errors.email = !form.email || !form.email.includes("@");
  errors.body = !form.body;

  if (errors.name || errors.email || errors.body) return;

  isSubmitting.value = true;
  try {
    const newComment = await createComment({
      ...form,
      postId: props.postId,
    });

    emit("comment-added", newComment);

    form.body = "";
  } catch (e) {
    alert("Failed to add comment");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

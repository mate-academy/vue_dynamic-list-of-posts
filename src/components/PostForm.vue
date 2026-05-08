<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  post: Object,
});

const emit = defineEmits(["save", "cancel"]);

const title = ref("");
const body = ref("");
const userId = ref(1);

const errors = ref({});
const loading = ref(false);

watch(
  () => props.post,
  (newPost) => {
    if (newPost) {
      title.value = newPost.title;
      body.value = newPost.body;
      userId.value = newPost.userId || 1;
    } else {
      title.value = "";
      body.value = "";
      userId.value = 1;
    }
  },
  { immediate: true },
);

function validate() {
  errors.value = {};

  if (!title.value.trim()) {
    errors.value.title = "Title is required";
  }

  if (!body.value.trim()) {
    errors.value.body = "Body is required";
  }

  return Object.keys(errors.value).length === 0;
}

async function handleSubmit() {
  if (!validate()) {
    return;
  }

  loading.value = true;

  const newPost = {
    title: title.value,
    body: body.value,
    userId: userId.value,
  };

  try {
    const response = await fetch(
      `https://mate-academy.github.io/fe-students-api/api/posts${
        props.post ? `/${props.post.id}` : ""
      }`,
      {
        method: props.post ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      },
    );

    const data = await response.json();

    emit("save", data);
  } catch (error) {
    console.error(error);

    alert("Error saving post");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <h2 class="title is-4 mb-5">
      {{ post ? "Edit post" : "Create new post" }}
    </h2>

    <div class="field">
      <label class="label"> Title </label>

      <div class="control">
        <input
          v-model="title"
          class="input"
          placeholder="Post title"
          @input="errors.title = ''"
        />
      </div>

      <p v-if="errors.title" class="help is-danger">
        {{ errors.title }}
      </p>
    </div>

    <div class="field">
      <label class="label"> Write Post Body </label>

      <div class="control">
        <textarea
          v-model="body"
          class="textarea"
          placeholder="Post body"
          @input="errors.body = ''"
        />
      </div>

      <p v-if="errors.body" class="help is-danger">
        {{ errors.body }}
      </p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button
          class="button is-link"
          :class="{ 'is-loading': loading }"
          @click="handleSubmit"
        >
          {{ post ? "Save" : "Create" }}
        </button>
      </div>

      <div class="control">
        <button class="button is-light" @click="$emit('cancel')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<template>
  <div class="content">
    <h2>{{ title }}</h2>

    <form @submit.prevent="handleSubmit">
      <div class="field">
        <label class="label">Title</label>
        <div class="control">
          <input
            v-model.trim="formData.title"
            class="input"
            :class="{ 'is-danger': errors.title }"
            type="text"
            placeholder="Post title"
          />
        </div>
        <p v-if="errors.title" class="help is-danger">Title is required</p>
      </div>

      <div class="field">
        <label class="label">Body</label>
        <div class="control">
          <textarea
            v-model.trim="formData.body"
            class="textarea"
            :class="{ 'is-danger': errors.body }"
            placeholder="Post content"
          ></textarea>
        </div>
        <p v-if="errors.body" class="help is-danger">Body is required</p>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Save</button>
        </div>
        <div class="control">
          <button
            type="button"
            class="button is-link is-light"
            @click="$emit('cancel')"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  title: String,
  initialData: {
    type: Object,
    default: () => ({ title: "", body: "" }),
  },
});

const emit = defineEmits(["submit", "cancel"]);

const formData = reactive({
  title: props.initialData?.title || "",
  body: props.initialData?.body || "",
});

const errors = reactive({
  title: false,
  body: false,
});

watch(
  () => formData.title,
  () => {
    errors.title = false;
  },
);
watch(
  () => formData.body,
  () => {
    errors.body = false;
  },
);

const handleSubmit = () => {
  errors.title = !formData.title;
  errors.body = !formData.body;

  if (errors.title || errors.body) return;

  emit("submit", { ...formData });
};
</script>

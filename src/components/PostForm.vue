<script setup>
import { computed, reactive, ref, watch } from "vue";
import FormInput from "./FormInput.vue";
import FormTextarea from "./FormTextarea.vue";
import { createPost, updatePost } from "../api/posts";

const props = defineProps({
  post: { type: Object, default: null }, // если передан, форма в режиме редактирования
});

const emit = defineEmits(["created", "updated", "cancel"]);

const isEditing = computed(() => Boolean(props.post));

const title = ref(props.post?.title ?? "");
const body = ref(props.post?.body ?? "");

const errors = reactive({ title: "", body: "" });
const isSubmitting = ref(false);
const submitError = ref("");

watch(title, () => {
  errors.title = "";
});
watch(body, () => {
  errors.body = "";
});

const validate = () => {
  errors.title = title.value.trim() ? "" : "Title is required";
  errors.body = body.value.trim() ? "" : "Body is required";

  return !errors.title && !errors.body;
};

const handleSubmit = async () => {
  submitError.value = "";

  if (!validate()) {
    return;
  }

  isSubmitting.value = true;

  const payload = {
    title: title.value.trim(),
    body: body.value.trim(),
  };

  let result;

  try {
    result = isEditing.value
      ? await updatePost({ id: props.post.id, ...payload })
      : await createPost(payload);
  } catch (error) {
    console.error(error);
    submitError.value = isEditing.value
      ? "Failed to update the post. Please try again."
      : "Failed to create the post. Please try again.";
    isSubmitting.value = false;
    return;
  }

  isSubmitting.value = false;
  emit(isEditing.value ? "updated" : "created", result);
};

const handleCancel = () => {
  emit("cancel");
};
</script>

<template>
  <div class="content">
    <h2>{{ isEditing ? "Edit post" : "Create new post" }}</h2>

    <form novalidate @submit.prevent="handleSubmit">
      <FormInput
        v-model="title"
        title="Title"
        name="title"
        placeholder="Enter post title"
        :error="errors.title"
      />

      <FormTextarea
        v-model="body"
        title="Body"
        name="body"
        placeholder="Enter post body"
        :error="errors.body"
      />

      <p v-if="submitError" class="help is-danger mb-3">
        {{ submitError }}
      </p>

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': isSubmitting }"
            :disabled="isSubmitting"
          >
            {{ isEditing ? "Save" : "Create" }}
          </button>
        </div>

        <div class="control">
          <button
            type="button"
            class="button is-link is-light"
            :disabled="isSubmitting"
            @click="handleCancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

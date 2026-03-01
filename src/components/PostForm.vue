<script setup lang="ts">
import { reactive, computed, ref, watch } from "vue";
import type { Post } from "../types/Post";
import { createPost, updatePost } from "../api/posts";

type Mode = "create" | "edit";

type Props = {
  mode: Mode;
  userId: number;

  postId?: number;
  initialTitle?: string;
  initialBody?: string;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "created", post: Post): void;
  (e: "updated", post: Post): void;
  (e: "cancel"): void;
}>();

const form = reactive({
  title: props.initialTitle ?? "",
  body: props.initialBody ?? "",
});

const isSubmitting = ref(false);
const submitAttempted = ref(false);
const submitError = ref<string | null>(null);

watch(
  () => [props.mode, props.postId, props.initialTitle, props.initialBody],
  () => {
    form.title = props.initialTitle ?? "";
    form.body = props.initialBody ?? "";
    submitAttempted.value = false;
    submitError.value = null;
  },
);

const errors = computed(() => ({
  title: !form.title.trim() ? "Title is required" : null,
  body: !form.body.trim() ? "Body is required" : null,
}));

const hasErrors = computed(() =>
  Boolean(errors.value.title || errors.value.body),
);

function clearForCreate() {
  form.title = "";
  form.body = "";
  submitAttempted.value = false;
  submitError.value = null;
}

async function submit() {
  submitAttempted.value = true;
  submitError.value = null;

  if (hasErrors.value) return;

  if (props.mode === "edit" && !props.postId) {
    submitError.value = "postId is missing";
    return;
  }

  isSubmitting.value = true;

  try {
    if (props.mode === "create") {
      const created = await createPost({
        title: form.title.trim(),
        body: form.body.trim(),
        userId: props.userId,
      });

      emit("created", created);
      clearForCreate();
    } else {
      const updated = await updatePost(props.postId!, {
        title: form.title.trim(),
        body: form.body.trim(),
      });

      emit("updated", updated);
    }
  } catch (e) {
    submitError.value = e instanceof Error ? e.message : "Request failed";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="content">
    <h2>{{ mode === "create" ? "Create new post" : "Edit post" }}</h2>

    <div
      v-if="submitError"
      class="notification is-danger"
    >
      {{ submitError }}
    </div>

    <form @submit.prevent="submit">
      <div class="field">
        <label class="label">Title</label>
        <div class="control">
          <input
            v-model="form.title"
            class="input"
            type="text"
          >
        </div>
        <p
          v-if="submitAttempted && errors.title"
          class="help is-danger"
        >
          {{ errors.title }}
        </p>
      </div>

      <div class="field">
        <label class="label">Body</label>
        <div class="control">
          <textarea
            v-model="form.body"
            class="textarea"
            rows="4"
          />
        </div>
        <p
          v-if="submitAttempted && errors.body"
          class="help is-danger"
        >
          {{ errors.body }}
        </p>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': isSubmitting }"
          >
            Save
          </button>
        </div>

        <div class="control">
          <button
            type="button"
            class="button is-link is-light"
            @click="emit('cancel')"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['save', 'cancel']);

const title = ref('');
const body = ref('');
const isSubmitting = ref(false);

const handleSubmit = () => {
  if (!title.value.trim() || !body.value.trim()) {
    return;
  }

  isSubmitting.value = true;

  emit('save', {
    userId: props.userId,
    title: title.value,
    body: body.value,
  });
};
</script>

<template>
  <div class="content">
    <h2 class="title is-4">Create new post</h2>

    <form @submit.prevent="handleSubmit">
      <div class="field">
        <label class="label">Title</label>
        <div class="control">
          <input
            v-model="title"
            class="input"
            type="text"
            placeholder="Enter post title"
            required
          />
        </div>
      </div>

      <div class="field">
        <label class="label">Body</label>
        <div class="control">
          <textarea
            v-model="body"
            class="textarea"
            placeholder="Enter post content"
            required
          ></textarea>
        </div>
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

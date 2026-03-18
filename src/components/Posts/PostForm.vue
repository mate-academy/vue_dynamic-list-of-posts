<script setup>
import { ref } from 'vue';

const props = defineProps({
  userId: { type: Number, required: true },
  post: { type: Object, default: null },
});

const emit = defineEmits(['save', 'cancel']);

const title = ref(props.post?.title || '');
const body = ref(props.post?.body || '');
const isSubmitting = ref(false);

const handleSubmit = () => {
  if (!title.value.trim() || !body.value.trim()) return;

  isSubmitting.value = true;

  const postData = {
    userId: props.userId,
    title: title.value,
    body: body.value,
  };

  if (props.post) {
    postData.id = props.post.id;
  }

  emit('save', postData);
};
</script>

<template>
  <div class="content">
    <h2 class="title is-4">{{ post ? 'Edit post' : 'Create new post' }}</h2>

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
            {{ post ? 'Save changes' : 'Save' }}
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

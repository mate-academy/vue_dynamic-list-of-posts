<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  post: {
    type: Object,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['submit', 'cancel']);

const titleVal = ref('');
const bodyVal = ref('');
const titleError = ref('');
const bodyError = ref('');

const isEditMode = computed(() => !!props.post);

const formTitle = computed(() => {
  return isEditMode.value ? 'Edit post' : 'Create post';
});

const syncFormFields = () => {
  if (props.post) {
    titleVal.value = props.post.title || '';
    bodyVal.value = props.post.body || '';
  } else {
    titleVal.value = '';
    bodyVal.value = '';
  }
  titleError.value = '';
  bodyError.value = '';
};

watch(() => props.post, syncFormFields, { immediate: true });

const handleInputTitle = () => {
  titleError.value = '';
};

const handleInputBody = () => {
  bodyError.value = '';
};

const handleSubmit = () => {
  let valid = true;

  if (!titleVal.value.trim()) {
    titleError.value = 'Title is required';
    valid = false;
  }

  if (!bodyVal.value.trim()) {
    bodyError.value = 'Body is required';
    valid = false;
  }

  if (!valid) return;

  emit('submit', {
    title: titleVal.value.trim(),
    body: bodyVal.value.trim(),
  });
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <div class="content">
    <h2>{{ formTitle }}</h2>

    <form @submit.prevent="handleSubmit" @reset.prevent="handleCancel">
      <div class="field">
        <label class="label" for="post-title">Title</label>
        <div class="control">
          <input
            v-model="titleVal"
            @input="handleInputTitle"
            type="text"
            id="post-title"
            class="input"
            :class="{ 'is-danger': titleError }"
            placeholder="Enter title"
            :disabled="isLoading"
          />
        </div>
        <p v-if="titleError" class="help is-danger">{{ titleError }}</p>
      </div>

      <div class="field">
        <label class="label" for="post-body">Body</label>
        <div class="control">
          <textarea
            v-model="bodyVal"
            @input="handleInputBody"
            id="post-body"
            class="textarea"
            :class="{ 'is-danger': bodyError }"
            placeholder="Enter body"
            :disabled="isLoading"
          ></textarea>
        </div>
        <p v-if="bodyError" class="help is-danger">{{ bodyError }}</p>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': isLoading }"
            :disabled="isLoading"
          >
            Save
          </button>
        </div>
        <div class="control">
          <button
            type="reset"
            class="button is-link is-light"
            :disabled="isLoading"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<template>
  <div>
    <h3 class="title is-5">{{ isEdit ? 'Edit Post' : 'Create Post' }}</h3>
    <form @submit.prevent="onSubmit" novalidate>
      <div class="field">
        <label class="label">Title</label>
        <div class="control">
          <input class="input" type="text" v-model.trim="form.title" :class="{ 'is-danger': submitted && !form.title }" placeholder="Post title" />
        </div>
        <p v-if="submitted && !form.title" class="help is-danger">Title is required</p>
      </div>
      <div class="field">
        <label class="label">Body</label>
        <div class="control">
          <textarea class="textarea" v-model.trim="form.body" :class="{ 'is-danger': submitted && !form.body }" placeholder="Write something..."></textarea>
        </div>
        <p v-if="submitted && !form.body" class="help is-danger">Body is required</p>
      </div>

      <div class="buttons">
        <button class="button is-primary" :class="{ 'is-loading': isSubmitting }" type="submit">
          {{ isEdit ? 'Save' : 'Create' }}
        </button>
        <button class="button" type="button" @click="$emit('cancel')">Cancel</button>
        <button v-if="isEdit" class="button is-danger" type="button" @click="$emit('delete')">Delete</button>
      </div>
    </form>

    <Notification v-if="error" :message="error" @close="clearError" />
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import Notification from './Notification.vue';

const props = defineProps({
  modelValue: { type: Object, default: () => ({ title: '', body: '' }) },
  isEdit: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue', 'submit', 'cancel', 'delete', 'clear-error']);

const submitted = ref(false);
const isSubmitting = ref(false);

const form = reactive({ title: '', body: '' });

watch(() => props.modelValue, (val) => {
  form.title = val?.title || '';
  form.body = val?.body || '';
}, { immediate: true });

function clearError() { emit('clear-error'); }

async function onSubmit() {
  submitted.value = true;
  if (!form.title || !form.body) return;
  isSubmitting.value = true;
  await emit('submit', { title: form.title, body: form.body });
  isSubmitting.value = false;
}
</script>

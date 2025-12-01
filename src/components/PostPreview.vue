<script setup>
const name = defineModel('name', {
  type: String,
  default: '',
})

const email = defineModel('email', {
  type: String,
  default: '',
})

const body = defineModel('body', {
  type: String,
  default: '',
})

defineProps({
  submitting: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['submit', 'cancel'])

const handleSubmit = () => {
  emit('submit', name.value, email.value, body.value)
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <!-- 🔴 Error message from submitError in PostPreview.vue -->
    <div
      v-if="error"
      class="notification is-danger is-light"
      style="margin-bottom: 0.75rem"
      role="alert"
    >
      {{ error }}
    </div>

    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <input
          v-model="name"
          class="input"
          type="text"
          placeholder="Your name"
          :disabled="submitting"
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Email</label>
      <div class="control">
        <input
          v-model="email"
          class="input"
          type="email"
          placeholder="Your email"
          :disabled="submitting"
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Comment</label>
      <div class="control">
        <textarea
          v-model="body"
          class="textarea"
          placeholder="Write your comment..."
          :disabled="submitting"
        />
      </div>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': submitting }"
          :disabled="submitting"
        >
          Add comment
        </button>
      </div>

      <div class="control">
        <button
          type="button"
          class="button is-light"
          :disabled="submitting"
          @click="emit('cancel')"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>

<style></style>

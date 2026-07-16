<script setup>
import { ref } from 'vue'

const emit = defineEmits(['create'])

const name = ref('')
const email = ref('')
const body = ref('')

const loading = ref(false)

const errors = ref({
  name: false,
  email: false,
  body: false,
})

function submit() {
  errors.value.name = !name.value.trim()
  errors.value.email = !email.value.trim()
  errors.value.body = !body.value.trim()

  if (
    errors.value.name ||
    errors.value.email ||
    errors.value.body
  ) {
    return
  }

  loading.value = true

  emit('create', {
    name: name.value,
    email: email.value,
    body: body.value,
  })

  body.value = ''

  loading.value = false
}

function clear() {
  body.value = ''

  errors.value = {
    name: false,
    email: false,
    body: false,
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <div class="field">
      <label class="label">
        Name
      </label>

      <input
        v-model="name"
        class="input"
        :class="{ 'is-danger': errors.name }"
        @input="errors.name = false"
      >
    </div>

    <div class="field">
      <label class="label">
        Email
      </label>

      <input
        v-model="email"
        class="input"
        type="email"
        :class="{ 'is-danger': errors.email }"
        @input="errors.email = false"
      >
    </div>

    <div class="field">
      <label class="label">
        Comment
      </label>

      <textarea
        v-model="body"
        class="textarea"
        :class="{ 'is-danger': errors.body }"
        @input="errors.body = false"
      ></textarea>
    </div>

    <div class="buttons">
      <button
        type="submit"
        class="button is-primary"
        :class="{ 'is-loading': loading }"
      >
        Add
      </button>

      <button
        type="button"
        class="button"
        @click="clear"
      >
        Clear
      </button>
    </div>
  </form>
</template>
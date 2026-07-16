<script setup>
import { ref } from 'vue'

const emit = defineEmits(['create'])

const title = ref('')
const body = ref('')

const errors = ref({
  title: false,
  body: false,
})

function submit() {
  errors.value.title = !title.value.trim()
  errors.value.body = !body.value.trim()

  if (errors.value.title || errors.value.body) {
    return
  }

  emit('create', {
    title: title.value,
    body: body.value,
  })

  title.value = ''
  body.value = ''

  errors.value.title = false
  errors.value.body = false
}
</script>

<template>
  <form @submit.prevent="submit">

    <div class="field">
      <label class="label">
        Title
      </label>

      <input
        v-model="title"
        class="input"
        :class="{ 'is-danger': errors.title }"
        type="text"
        @input="errors.title = false"
      />

      <p
        v-if="errors.title"
        class="help is-danger"
      >
        Title is required
      </p>
    </div>


    <div class="field">
      <label class="label">
        Body
      </label>

      <textarea
        v-model="body"
        class="textarea"
        :class="{ 'is-danger': errors.body }"
        @input="errors.body = false"
      ></textarea>

      <p
        v-if="errors.body"
        class="help is-danger"
      >
        Body is required
      </p>
    </div>


    <button class="button is-primary">
      Create
    </button>

  </form>
</template>
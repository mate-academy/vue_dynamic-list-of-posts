<script setup>
import { ref } from 'vue'

const emit = defineEmits(['newMessage', 'cancel'])
const title = ref('')
const body = ref('')

function handleSubmit() {
  emit('newMessage', { title: title.value, body: body.value })
}
</script>

<template>
  <div>
    <h2>Create new post</h2>

    <form class="content" @submit.prevent="handleSubmit">
      <div class="field">
        <label class="label">Title</label>
        <div class="control">
          <input class="input" type="text" placeholder="Text input" v-model.trim="title" required />
        </div>
      </div>

      <div class="field">
        <label class="label">Message</label>
        <div class="control">
          <textarea class="textarea" placeholder="Textarea" v-model.trim="body" required></textarea>
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button class="button is-link">Save</button>
        </div>
        <div class="control">
          <button type="reset" class="button is-link is-light" @click="emit('cancel')">
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

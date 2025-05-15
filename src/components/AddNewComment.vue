<script setup>
import { ref } from 'vue'
const props = defineProps(['prevName', 'prevEmail'])
const emit = defineEmits(['newComment', 'cancel'])
const name = ref(props?.prevName)
const email = ref(props?.prevEmail)
const body = ref('')

function handleSubmit() {
  emit('newComment', { name: name.value, email: email.value, body: body.value })
}

function handleCancel() {
  body.value = ''
  emit('cancel', { name: name.value, email: email.value })
}
</script>

<template>
  <div>
    <form class="content" @submit.prevent="handleSubmit">
      <div class="field">
        <label class="label">Author Name</label>
        <div class="control">
          <input class="input" type="text" placeholder="Text input" v-model.trim="name" required />
        </div>
      </div>

      <div class="field">
        <label class="label">Author Email</label>
        <div class="control">
          <input
            class="input"
            type="email"
            placeholder="Text input"
            v-model.trim="email"
            required
          />
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
          <button class="button is-link">Add comment</button>
        </div>
        <div class="control">
          <button type="button" class="button is-link is-light" @click="handleCancel()">
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

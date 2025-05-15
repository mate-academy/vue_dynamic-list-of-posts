<script setup>
import { ref } from 'vue'
const props = defineProps(['post'])
const emit = defineEmits(['edit'])
const title = ref(props.post.title)
const body = ref(props.post.body)

function handleSubmit() {
  emit('edit', { title: title.value, body: body.value })
}
</script>

<template>
  <div>
    <h2>Post editing</h2>

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
          <button type="reset" class="button is-link is-light">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>

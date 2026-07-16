<script setup>
import { ref } from 'vue'

const props = defineProps({
  post: Object,
})

const emit = defineEmits(['save'])

const title = ref(props.post.title)
const body = ref(props.post.body)

function save() {
  emit('save', {
    title: title.value,
    body: body.value,
  })
}
</script>

<template>
  <form @submit.prevent="save">

    <div class="field">
      <label class="label">
        Title
      </label>

      <input
        v-model="title"
        class="input"
      >
    </div>


    <div class="field">
      <label class="label">
        Body
      </label>

      <textarea
        v-model="body"
        class="textarea"
      ></textarea>
    </div>


    <button class="button is-primary">
      Save
    </button>

  </form>
</template>
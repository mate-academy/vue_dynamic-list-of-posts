<script setup>
import { ref } from 'vue'

const props = defineProps({
  post: Object,
})

const emit = defineEmits(['save'])

const title = ref(props.post.title)
const body = ref(props.post.body)

const loading = ref(false)

async function save() {
  loading.value = true

  emit('save', {
    title: title.value,
    body: body.value,
  })

  loading.value = false
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
        type="text"
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


    <button
      class="button is-primary"
      :class="{ 'is-loading': loading }"
    >
      Save
    </button>

  </form>
</template>
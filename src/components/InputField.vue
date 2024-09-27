<script setup>
import { ref, onMounted } from 'vue'

const { name } = defineProps({
  name: String,
  error: String
})

const model = defineModel()

const inputLabel = ref('')
const inputType = ref('')
const inputPlaceholder = ref('')
const inputIcon = ref('')

onMounted(() => {
  switch (name) {
    case 'name':
      inputLabel.value = 'Author Name'
      inputType.value = 'text'
      inputPlaceholder.value = 'Name Surname'
      inputIcon.value = 'fa-user'
      break
    case 'email':
      inputLabel.value = 'Author Email'
      inputType.value = 'email'
      inputPlaceholder.value = 'Your Email'
      inputIcon.value = 'fa-envelope'
      break

    case 'title':
      inputLabel.value = 'Title'
      inputType.value = 'text'
      inputPlaceholder.value = 'Post Title'
      inputIcon.value = 'fa-user'
      break

    default:
      break
  }
})
</script>

<template>
  <div class="field" data-cy="NameField">
    <label class="label" :htmlFor="name"> {{ inputLabel }} </label>
    <div class="control has-icons-left has-icons-right">
      <input
        :type="inputType"
        :name="name"
        :id="name"
        :placeholder="inputPlaceholder"
        class="input"
        :class="{ 'is-danger': error }"
        v-model.trim="model"
      />
      <span class="icon is-small is-left">
        <i class="fas" :class="inputIcon"></i>
      </span>

      <span v-if="error" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p class="help is-danger" data-cy="ErrorMessage">{{ error }}</p>
  </div>
</template>

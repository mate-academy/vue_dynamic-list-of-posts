<script setup>
import { computed } from 'vue'

const { name } = defineProps({
  name: String,
  error: String
})

const model = defineModel()

const input = computed(() => {
  switch (name) {
    case 'name':
      return {
        label: 'Author Name',
        type: 'text',
        placeholder: 'Name Surname',
        icon: 'fa-user'
      }

    case 'email':
      return {
        label: 'Author Email',
        type: 'email',
        placeholder: 'Your Email',
        icon: 'fa-envelope'
      }

    case 'title':
      return {
        label: 'Title',
        type: 'text',
        placeholder: 'Post Title',
        icon: 'fa-user'
      }

    default:
      return {
        label: '',
        type: 'text',
        placeholder: '',
        icon: ''
      }
  }
})
</script>

<template>
  <div class="field" data-cy="NameField">
    <label class="label" :htmlFor="name"> {{ input.label }} </label>
    <div class="control has-icons-left has-icons-right">
      <input
        :type="input.type"
        :name="name"
        :id="name"
        :placeholder="input.placeholder"
        class="input"
        :class="{ 'is-danger': error }"
        v-model.trim="model"
      />
      <span class="icon is-small is-left">
        <i class="fas" :class="input.icon"></i>
      </span>

      <span v-if="error" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p class="help is-danger" data-cy="ErrorMessage">{{ error }}</p>
  </div>
</template>

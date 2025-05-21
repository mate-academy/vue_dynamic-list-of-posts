<template>
  <div class="post-form">
    <form @submit.prevent="submit">
      <div class="field">
        <label class="label">Заголовок</label>
        <div class="control">
          <input 
            v-model="form.title" 
            class="input" 
            type="text" 
            placeholder="Заголовок поста"
            :class="{ 'is-danger': errors.title }"
          >
          <p v-if="errors.title" class="help is-danger">{{ errors.title }}</p>
        </div>
      </div>

      <div class="field">
        <label class="label">Текст</label>
        <div class="control">
          <textarea 
            v-model="form.body" 
            class="textarea" 
            placeholder="Текст поста"
            :class="{ 'is-danger': errors.body }"
          ></textarea>
          <p v-if="errors.body" class="help is-danger">{{ errors.body }}</p>
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button 
            class="button is-primary" 
            :class="{ 'is-loading': submitting }"
            type="submit"
          >
            {{ isEdit ? 'Зберегти' : 'Створити' }}
          </button>
        </div>
        <div class="control">
          <button class="button is-light" type="button" @click="clearForm">
            Очистити
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import axios from 'axios'

export default {
  name: 'PostForm',
  props: {
    post: {
      type: Object,
      default: null
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const form = ref({
      title: props.post?.title || '',
      body: props.post?.body || ''
    })

    const errors = ref({})
    const submitting = ref(false)

    const isEdit = computed(() => !!props.post)

    const validate = () => {
      errors.value = {}
      
      if (!form.value.title.trim()) {
        errors.value.title = 'Заголовок обов\'язковий'
      }
      
      if (!form.value.body.trim()) {
        errors.value.body = 'Текст поста обов\'язковий'
      }

      return Object.keys(errors.value).length === 0
    }

    const submit = async () => {
      if (!validate()) return

      submitting.value = true
      try {
        const response = isEdit.value
          ? await axios.put(`https://mate-academy.github.io/fe-students-api/posts/${props.post.id}`, form.value)
          : await axios.post('https://mate-academy.github.io/fe-students-api/posts', form.value)
        
        emit('submit', response.data)
        clearForm()
      } catch (e) {
        console.error(e)
      } finally {
        submitting.value = false
      }
    }

    const clearForm = () => {
      form.value = {
        title: '',
        body: ''
      }
      errors.value = {}
    }

    return {
      form,
      errors,
      submitting,
      isEdit,
      submit,
      clearForm
    }
  }
}
</script>

<style scoped>
.post-form {
  padding: 20px;
}
</style> 
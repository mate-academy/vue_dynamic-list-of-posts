<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { createPost, updatePost } from '../../api/posts'
import type { Post } from '../../api/posts'

export default defineComponent({
  name: 'AddPost',

  props: {
    post: {
      type: Object as () => Post | null,
      default: null,
    },
    userId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      default: 'New Post',
    },
  },

  emits: ['post-created', 'post-updated', 'cancel'],

  setup(props, { emit }) {
    const titleField = ref(props.post?.title ?? '')
    const bodyField = ref(props.post?.body ?? '')
    const titleError = ref('')
    const bodyError = ref('')
    const submitError = ref('')
    const isSubmitting = ref(false)

    watch(
      () => props.post,
      (newPost) => {
        titleField.value = newPost?.title ?? ''
        bodyField.value = newPost?.body ?? ''
        titleError.value = ''
        bodyError.value = ''
        submitError.value = ''
      },
    )

    async function handleSubmit() {
      let valid = true

      if (!titleField.value.trim()) {
        titleError.value = 'Title is required'
        valid = false
      }

      if (!bodyField.value.trim()) {
        bodyError.value = 'Body is required'
        valid = false
      }

      if (!valid) return

      isSubmitting.value = true
      submitError.value = ''

      try {
        if (props.post) {
          const updated = await updatePost(props.post.id, {
            title: titleField.value.trim(),
            body: bodyField.value.trim(),
          })
          emit('post-updated', updated)
        } else {
          const created = await createPost(props.userId, {
            title: titleField.value.trim(),
            body: bodyField.value.trim(),
          })
          emit('post-created', created)
        }
      } catch {
        submitError.value = 'Failed to save post. Please try again.'
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      titleField,
      bodyField,
      titleError,
      bodyError,
      submitError,
      isSubmitting,
      handleSubmit,
      emit,
    }
  },
})
</script>

<template>
  <div class="content p-4">
    <h2 class="title is-4">{{ title }}</h2>

    <div v-if="submitError" class="notification is-danger is-light">
      {{ submitError }}
    </div>

    <div class="field">
      <label class="label">Title</label>
      <div class="control">
        <input
          v-model="titleField"
          class="input"
          :class="{ 'is-danger': titleError }"
          type="text"
          placeholder="Post title"
          @input="titleError = ''"
        />
      </div>
      <p v-if="titleError" class="help is-danger">{{ titleError }}</p>
    </div>

    <div class="field">
      <label class="label">Body</label>
      <div class="control">
        <textarea
          v-model="bodyField"
          class="textarea"
          :class="{ 'is-danger': bodyError }"
          placeholder="Post body"
          rows="6"
          @input="bodyError = ''"
        />
      </div>
      <p v-if="bodyError" class="help is-danger">{{ bodyError }}</p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button
          class="button is-link"
          :class="{ 'is-loading': isSubmitting }"
          @click="handleSubmit"
        >
          {{ post ? 'Save' : 'Create' }}
        </button>
      </div>
      <div class="control">
        <button class="button is-light" @click="emit('cancel')">Cancel</button>
      </div>
    </div>
  </div>
</template>

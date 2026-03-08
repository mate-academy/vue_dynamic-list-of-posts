<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { createPost, updatePost } from '../../api/posts'
import type { Post } from '../../api/posts'

export default defineComponent({
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
    const isSubmitting = ref(false)

    // If the post prop changes (switching edit targets), reset fields
    watch(
      () => props.post,
      (newPost) => {
        titleField.value = newPost?.title ?? ''
        bodyField.value = newPost?.body ?? ''
        titleError.value = ''
        bodyError.value = ''
      },
    )

    function clearTitleError() {
      titleError.value = ''
    }

    function clearBodyError() {
      bodyError.value = ''
    }

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

      try {
        if (props.post) {
          // Edit mode
          const updated = await updatePost(props.post.id, {
            title: titleField.value.trim(),
            body: bodyField.value.trim(),
          })
          emit('post-updated', updated)
        } else {
          // Create mode
          const created = await createPost(props.userId, {
            title: titleField.value.trim(),
            body: bodyField.value.trim(),
          })
          emit('post-created', created)
        }
      } catch {
        // Could show a generic error here
      } finally {
        isSubmitting.value = false
      }
    }

    function handleCancel() {
      emit('cancel')
    }

    return {
      titleField,
      bodyField,
      titleError,
      bodyError,
      isSubmitting,
      clearTitleError,
      clearBodyError,
      handleSubmit,
      handleCancel,
    }
  },
})
</script>

<template>
  <div class="content p-4">
    <h2 class="title is-4">Create new post</h2>

    <div class="field">
      <label class="label">Title</label>
      <div class="control">
        <input
          v-model="titleField"
          class="input"
          :class="{ 'is-danger': titleError }"
          type="text"
          placeholder="Post title"
          @input="clearTitleError"
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
          @input="clearBodyError"
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
        <button class="button is-light" @click="handleCancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

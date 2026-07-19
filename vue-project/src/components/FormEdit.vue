<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  emits: ['update:titleVue', 'update:postVue'],

  props: {
    titleVue: {
      type: String,
    },
    isLoading: {
      type: Boolean,
    },
    postVue: { type: String },
    addEditForm: {
      type: Function as PropType<() => void>,
    },
    cancelEditForm: {
      type: Function as PropType<() => void>,
    },
    err: { type: String },
    isError: { type: Boolean },
  },

  methods: {
    onTitleInput(e: Event) {
      this.$emit('update:titleVue', (e.target as HTMLInputElement).value)
    },
    onPostInput(e: Event) {
      this.$emit('update:postVue', (e.target as HTMLTextAreaElement).value)
    },
  },
})
</script>

<template>
  <form class="mt-5">
    <div class="is-flex is-flex-direction-column" style="gap: 10px">
      <label for="editTitle">Post Title</label>
      <input
        type="text"
        class="input"
        id="editTitle"
        :value="titleVue"
        @input="onTitleInput"
        name="titleVue"
        placeholder="Title"
        required
      />

      <label for="editContent">Write Post Body</label>
      <textarea
        class="textarea"
        name="postVue"
        id="editContent"
        placeholder="Content"
        :value="postVue"
        @input="onPostInput"
        required
      ></textarea>
    </div>

    <div v-if="isError">
      <span class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
      <p class="help is-danger" data-cy="ErrorMessage">{{ err }}</p>
    </div>

    <div class="mt-5">
      <button
        class="button is-link"
        @click="addEditForm"
        type="button"
        :class="isLoading ? 'is-loading' : ''"
      >
        Save</button
      >&nbsp;
      <button class="button is-text" @click="cancelEditForm" type="button">Cancel</button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  emits: ['update:titleVue', 'update:postVue'],

  props: {
    storeText: { type: Function as PropType<(payload: Event) => void> },
    asideShow: { type: Function as PropType<(payload: MouseEvent) => void> },
    titleVue: { type: String },
    postVue: { type: String },
    err: { type: String },
    isError: { type: Boolean },
    isLoading: { type: Boolean },
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
  <form @submit.prevent="storeText">
    <div class="is-flex is-flex-direction-column" style="gap: 10px">
      <label for="titleVue">Title</label>

      <input
        type="text"
        id="titleVue"
        class="input"
        placeholder="Post Title"
        :value="titleVue"
        @input="onTitleInput"
        required
      />

      <label for="postVue">Write Post Body</label>

      <textarea
        id="postVue"
        class="textarea"
        placeholder="Post body"
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

    <div class="field is-grouped mt-5">
      <div class="control">
        <button type="submit" class="button is-link" :class="isLoading ? 'is-loading' : ''">
          Create
        </button>
      </div>

      <div class="control">
        <button type="button" class="button is-link is-light" @click="asideShow">Cancel</button>
      </div>
    </div>
  </form>
</template>

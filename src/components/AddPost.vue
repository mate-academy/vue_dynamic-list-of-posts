<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import InputField from './InputField.vue'
import TextAreaField from './TextAreaField.vue'
import { Icon, LoadingStatus, SidebarMode } from '@/enums'

export default defineComponent({
  components: {
    InputField,
    TextAreaField,
  },
  props: {
    modelValue: {
      type: String as PropType<SidebarMode>,
      reqired: true,
    },
    formTitle: {
      type: String,
      required: true,
    },
    confirmButtonLabel: {
      type: String,
      required: true,
    },
    sidebarModeOnCancel: {
      type: String as PropType<SidebarMode>,
      required: true,
    },
    startTitle: String,
    startBody: String,
  },
  data(): {
    title: string,
    body: string,
    titleError: boolean,
    bodyError: boolean,
    loadingStatus: LoadingStatus,
  } {
    return {
      title: this.startTitle || '',
      body: this.startBody || '',
      titleError: false,
      bodyError: false,
      loadingStatus: LoadingStatus.Success,
    }
  },
  emits: ['submit', 'update:modelValue'],
  watch: {
    title() {
      this.titleError = false;
    },
    body() {
      this.bodyError = false
    },
  },
  setup() {
    return { Icon, LoadingStatus };
  },
  methods: {
    setErrors(sendError: boolean = false, titleError: boolean = false, bodyError: boolean = false) {
      this.loadingStatus = sendError ? LoadingStatus.Error : LoadingStatus.Success;
      this.titleError = titleError;
      this.bodyError = bodyError;
    },
    handleSubmit() {
      this.loadingStatus = LoadingStatus.Loading;
      this.$emit('submit', this.title, this.body, this.setErrors);
    },
  },
})
</script>

<template>
  <div class="content">
    <h2>{{formTitle}}</h2>

    <form @submit.prevent="handleSubmit">
      <InputField
        v-model="title"
        :error="titleError"
        name="title"
        label="Title"
        placeholder="Post title"
        error-message="Title is required"
        :icon="Icon.User"
      />

      <TextAreaField
        v-model="body"
        :error="bodyError"
        name="body"
        label="Write Post Body"
        placeholder="Post body"
        error-message="Body is required"
      />

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
            :class="{'is-loading': loadingStatus === LoadingStatus.Loading}"
            :disabled="loadingStatus === LoadingStatus.Loading"
          >
            {{confirmButtonLabel}}
          </button>
        </div>

        <div class="control">
          <button type="reset" class="button is-link is-light" @click="$emit('update:modelValue', sidebarModeOnCancel)">
            Cancel
          </button>
        </div>

        <h3 v-if="loadingStatus === LoadingStatus.Error" class="mt-2 has-text-centered has-text-danger">
          Something went wrong!
        </h3>
      </div>
    </form>
  </div>
</template>

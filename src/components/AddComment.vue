<script lang="ts">
import { defineComponent } from 'vue'
import InputField from './InputField.vue'
import TextAreaField from './TextAreaField.vue'
import { Icon, LoadingStatus } from '@/enums'

export default defineComponent({
  components: {
    InputField,
    TextAreaField,
  },
  props: {
    modelValue: {
      type: Boolean,
      reqired: true,
    },
    startName: String,
    startEmail: String,
  },
  data(): {
    name: string,
    email: string,
    body: string,
    nameError: boolean,
    emailError: boolean,
    bodyError: boolean,
    loadingStatus: LoadingStatus,
  } {
    return {
      name: this.startName || '',
      email: this.startEmail || '',
      body: '',
      nameError: false,
      emailError: false,
      bodyError: false,
      loadingStatus: LoadingStatus.Success,
    }
  },
  emits: ['submit', 'update:modelValue'],
  watch: {
    name() {
      this.nameError = false;
    },
    email() {
      this.emailError = false;
    },
    body() {
      this.bodyError = false;
    },
  },
  setup() {
    return { Icon, LoadingStatus };
  },
  methods: {
    setErrors(
      sendError: boolean = false,
      nameError: boolean = false,
      emailError: boolean = false,
      bodyError: boolean = false
    ) {
      this.loadingStatus = sendError ? LoadingStatus.Error : LoadingStatus.Success;
      this.nameError = nameError;
      this.emailError = emailError;
      this.bodyError = bodyError;
    },
    handleSubmit() {
      this.loadingStatus = LoadingStatus.Loading;
      this.$emit('submit', this.name, this.email, this.body, this.setErrors);
    },
    handleClearInputs() {
      this.name = '';
      this.email = '';
      this.body = '';
      this.setErrors();
    }
  },
})
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <InputField
      v-model="name"
      :error="nameError"
      name="name"
      label="Author Name"
      placeholder="Name Surname"
      error-message="Name is required"
      :icon="Icon.User"
    />

    <InputField
      v-model="email"
      :error="emailError"
      name="email"
      label="Author Email"
      placeholder="Your Email"
      error-message="Email is required"
      :icon="Icon.Envelope"
    />

    <TextAreaField
      v-model="body"
      :error="bodyError"
      name="body"
      label="Write Post Body"
      placeholder="Comment"
      error-message="Comment is required"
    />

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{'is-loading': loadingStatus === LoadingStatus.Loading}"
          :disabled="loadingStatus === LoadingStatus.Loading"
        >
          Add Comment
        </button>
      </div>

      <div class="control">
        <button type="reset" class="button is-link is-light" @click="$emit('update:modelValue', false)">
          Cancel
        </button>
      </div>

      <div class="control">
        <button type="reset" class="button is-link is-light" @click="handleClearInputs">
          Clear
        </button>
      </div>

      <h3 v-if="loadingStatus === LoadingStatus.Error" class="mt-2 has-text-centered has-text-danger">
        Something went wrong!
      </h3>
    </div>
  </form>
</template>

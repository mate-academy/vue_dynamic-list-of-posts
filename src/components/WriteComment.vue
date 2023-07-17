<script>
import InputField from './InputField.vue';
import TextareaField from './TextareaField.vue';

  export default {
    name: 'WriteComment',
    data() {
      return {
        isCommentForm: false,
        email: '',
        name: '',
        body: '',
        emailError: '',
        nameError: '',
        bodyError: '',
      }
    },
    components: {
      InputField,
      TextareaField
    },
    emits: ['addComment'],
    methods: {
      handleSubmit() {
        const { email, name, body, $emit, closeForm } = this;

        if (email.trim() === '') {
          this.emailError = "Can't be empty";
          return;
        };

        this.emailError = '';

        if (name.trim() === '') {
          this.nameError = "Can't be empty";
          return;
        };

        this.nameError = '';

        if (body.trim() === '') {
          this.bodyError = "Can't be empty";
          return;
        };

        this.bodyError = '';

        const newComment = {
          id: Math.ceil(Math.random() * (1000 - 1) + 1),
          email: email,
          name: name,
          body: body,
        };

        $emit('addComment', newComment);
        closeForm();

      },
      closeForm() {
        this.body = '';
        this.isCommentForm = false;
      },
    }
  }
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    v-if="isCommentForm"
  >
    <InputField
      v-model="name"
      type="text"
      name="Name"
      placeholder="Name"
      :textError="nameError"
    />
    <InputField
      v-model="email"
      type="email"
      name="Email"
      placeholder="Email"
      :textError="emailError"
    />
    <TextareaField
      v-model="body"
      name="Write comment"
      placeholder="Comment"
      :textError="bodyError"
    />

    <div className="field is-grouped">
        <div className="control">
          <button type="submit" className="button is-link">
            Create
          </button>
        </div>
        <div className="control">
          <button
            type="reset"
            className="button is-link is-light"
            @click="closeForm"
          >
            Cancel
          </button>
        </div>
      </div>
  </form>

  <button
    v-else
    type="button"
    className="button is-link"
    @click="isCommentForm = true"
  >
    Write a comment
  </button>
</template>
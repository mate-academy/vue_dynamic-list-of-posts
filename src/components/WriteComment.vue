<script>
import InputField from './InputField.vue';
import TextareaField from './TextareaField.vue';
import { emailCheck, textCheck } from '../utils/textCheck';
import { createComment } from '../api/comment';

  export default {
    name: 'WriteComment',
    props: {
      postId: Number,
    },
    data() {
      return {
        isCommentForm: false,
        email: '',
        name: '',
        message: '',
        emailError: '',
        nameError: '',
        messageError: '',
      }
    },
    components: {
      InputField,
      TextareaField
    },
    emits: ['update-comments'],
    methods: {
      async handleSubmit() {
        const { email, name, message, postId, $emit, closeForm } = this;

        this.nameError = textCheck(name, 'Name');
        this.emailError = emailCheck(email);
        this.messageError = textCheck(message, 'Comment');

        if (this.nameError || this.emailError || this.messageError) {
          return;
        }

        await createComment({
          name,
          email,
          message,
          postId,
        });

        $emit('update-comments');
        closeForm();
      },
      closeForm() {
        this.message = '';
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
      v-model="message"
      name="Write comment"
      placeholder="Comment"
      :textError="messageError"
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
<script>
  import InputField from './InputField.vue';
  import TextAreaField from './TextAreaField.vue';
  export default {
    name: 'CommentForm',
    components: {
      InputField,
      TextAreaField,
    },
    data () {
      return {
        comment: {
          email: '', 
          name: '', 
          body: ''
        },
        nameError: false,
        emailError: false,
        bodyError: false,
      };
    },
    methods: {
      isInputValid(value) {
        return !!value.trim();
      },
      handleSubmit() {
        const { comment, isInputValid } = this;
        this.nameError = !isInputValid(comment.name);
        this.emailError = !isInputValid(comment.email);
        this.bodyError = !isInputValid(comment.body);
        if (this.nameError || this.emailError || this.bodyError) {
          return;
        }
      
        const newComment = {
          name: comment.name,
          email: comment.email,
          body: comment.body,
        }
  
        this.$emit('addComment', newComment);
        this.$emit('close');
      }
    },
    emits: ['addComment', 'close'],
  }
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <InputField 
      v-model="comment.name"
      type="text"
      label="Author Name"
      :havingErrors="nameError"
      @update:modelValue="nameError = false"
    />

    <InputField
      v-model="comment.email"
      label="Author Email"
      type="email"
      :havingErrors="emailError"
      @update:modelValue="emailError = false"
    />

    <TextAreaField 
      v-model="comment.body"
      :havingErrors="bodyError"
      @update:modelValue="bodyError = false"
    /> 

    <div className="field is-grouped">
      <div className="control">
        <button type="submit" className="button is-link">
          Add comment
        </button>
      </div>

      <div className="control">
        <button 
          type="reset" 
          className="button is-link is-light"
          @click="$emit('close')"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>
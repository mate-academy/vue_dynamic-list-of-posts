<script setup>
  import { inject, ref, watch } from 'vue';

  import inputField from './InputField.vue';
  import TextAreaField from './TextAreaField.vue';

  import { createComment } from '../api/posts';

  const { toggleNewCommentOpened } = inject('newCommentOpened');

  const authorNameInput = ref('');
  const incorrectName = ref(false);
 
  const emailInput = ref('');
  const incorrectEmail = ref(false);

  const commentBody = ref('');
  const incorrectBody = ref(false);

  const newComLoading = ref(false);

  const emit = defineEmits(['loadComments']);

  const props = defineProps(['postId']);

  const createReloadCom = () => {
    if (authorNameInput.value === '') {
      incorrectName.value = true
    }

    if (emailInput.value === '') {
      incorrectEmail.value = true
    }
    
    if (commentBody.value === '') {
      incorrectBody.value = true
    }
   
    if (authorNameInput.value && emailInput.value && commentBody.value) {
      newComLoading.value = true;

      createComment(props.postId, authorNameInput.value, emailInput.value, commentBody.value)
        .then(() => {
          emit('loadComments');
          commentBody.value = '';
        })
        .catch((e) => console.log(e))
        .finally(() => newComLoading.value = false)
    }
  }

  const deleteErrors = () => {
    incorrectName.value = false;
    incorrectEmail.value = false;
    incorrectBody.value = false;
  }

  watch(authorNameInput, () => {
    if (authorNameInput && incorrectName) {
      deleteErrors();
    }
  })
  
  watch(emailInput, () => {
    if (emailInput && incorrectEmail) {
      deleteErrors();
    }
  })
  
  watch(commentBody, () => {
    if (commentBody && incorrectBody) {
      deleteErrors();
    }
  })

  const cancelNewComment = () => {
    deleteErrors();
    toggleNewCommentOpened(false)
  }
</script>

<template>
  <form @submit.prevent="createReloadCom()">
    <inputField
      inputTitle="Author Name"
      inputName="author-name"
      placeholder="Name Surname"
      icon="fa-user fa-heading"
      inputType="text"
      v-model.trim="authorNameInput"
      :incorrectTitle="incorrectName"
    />
    <inputField
      inputTitle="Author Email"
      inputName="author-email"
      placeholder="Your Email"
      icon="fa-user fa-envelope"
      inputType="email"
      v-model.trim="emailInput"
      :incorrectTitle="incorrectEmail"
    />
    <TextAreaField
      textareaTitle="Write Post Body"
      textareaName="comment-body"
      placeholder="Comment"
      v-model.trim="commentBody"
      :incorrectBody="incorrectBody"
    />
    <div class="field is-grouped">
      <div class="control">
        <button
          :class="{'is-loading': newComLoading}"
          type="submit"
          class="button is-link"
        >
          Add Comment
        </button>
      </div>
      <div class="control">
        <button
        @click.prevent="cancelNewComment"
          type="reset"
          class="button is-link is-light"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>
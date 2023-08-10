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
    if (!authorNameInput.value) {
      incorrectName.value = true
    }

    if (!emailInput.value) {
      incorrectEmail.value = true
    }
    
    if (!commentBody.value) {
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
      input-title="Author Name"
      input-name="author-name"
      placeholder="Name Surname"
      icon="fa-user fa-heading"
      input-type="text"
      error-text="incorrect name"
      v-model.trim="authorNameInput"
      :incorrect-title="incorrectName"
    />
    <inputField
      input-title="Author Email"
      input-name="author-email"
      placeholder="Your Email"
      icon="fa-user fa-envelope"
      input-type="email"
      error-text="incorrect email"
      v-model.trim="emailInput"
      :incorrect-title="incorrectEmail"
    />
    <TextAreaField
      textarea-title="Write Post Body"
      textarea-name="comment-body"
      placeholder="Comment"
      error-text="incorrect comment"
      v-model.trim="commentBody"
      :incorrect-body="incorrectBody"
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
<script setup>
  import { ref, watch, inject } from 'vue';

  import InputField from './InputField.vue';
  import TextAreaField from './TextAreaField.vue';

  import { createPost } from '../api/posts';

  const props = defineProps(['userId']);
  const emits = defineEmits(['updatePosts']);
  
  const { changeSidebar } = inject('sidebar');

  const postTitle = ref('');
  const postBody = ref('');
  const incorrectTitle = ref(false);
  const incorrectBody = ref(false);

  const createdFalse = ref(false)

  watch(postTitle, () => {
    if (postTitle && incorrectTitle) {
      incorrectTitle.value = false;
      incorrectBody.value = false;
    }
  })

  watch(postBody, () => {
    if (postBody && incorrectBody) {
      incorrectTitle.value = false;
      incorrectBody.value = false;
    }
  })

  const onSubmit = () => {
    if (!postTitle.value) {
      incorrectTitle.value = true
    }
    if (!postBody.value) {
      incorrectBody.value = true
    }

    const getWarning = () => {
      createdFalse.value = true;

      setTimeout(() => createdFalse.value = false, 5000);
    }

    if (postTitle.value && postBody.value) {
      createPost(postTitle.value, postBody.value, props.userId)
      .then(({ data }) => {
        emits('updatePosts', props.userId);
        postTitle.value = '';
        postBody.value = '';
        changeSidebar(data.id);
        createdFalse.value = true;
        }).catch(() => getWarning())
    }
  };

</script>
<template>
  <div className="content">
    <h2>Create new post</h2>

    <p class="help is-danger" v-if="createdFalse">Error, please try again</p>

    <form @submit.prevent="onSubmit">
      <InputField
        input-title="Title"
        input-name="new-post-title"
        placeholder="Post title"
        icon="fa-user fa-heading"
        input-type="text"
        error-text="incorrect title"
        v-model.trim="postTitle"
        :incorrect-title="incorrectTitle"
      />
      <TextAreaField
        textarea-title="Write Post Body"
        textarea-name="body"
        placeholder="Post body"
        error-text="incorrect post body"
        v-model.trim="postBody"
        :incorrect-body="incorrectBody"
      />

      <div className="field is-grouped">
        <div className="control">
          <button type="submit" className="button is-link">
            Save
          </button>
        </div>
        <div className="control">
          <button
            type="reset"
            className="button is-link is-light"
            @click="changeSidebar('closed')"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
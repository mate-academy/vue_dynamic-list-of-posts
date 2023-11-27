<script setup>
  import { computed, watch, ref } from 'vue';

  import InputField from './InputField.vue'
  import TextAreaField from './TextAreaField.vue'

  import { updatePost } from '../api/posts'

  const props = defineProps(['post']);
  const emits = defineEmits(['updatePosts', 'changeSidebar']);

  const editableTitle = ref( props.post.title);
  const editableBody = ref(props.post.body);
  
  const incorrectTitle = ref(false);
  const incorrectBody = ref(false);

   watch(editableTitle, () => {
      if (editableTitle && incorrectTitle) {
        incorrectTitle.value = false;
        incorrectBody.value = false;
      }
    })

    watch(editableBody, () => {
      if (editableBody && incorrectBody) {
        incorrectTitle.value = false;
        incorrectBody.value = false;
      }
    })
  
  const onSubmit = () => {
    if (editableTitle.value === '') {
      incorrectTitle.value = true
    }
    if (editableBody.value === '') {
      incorrectBody.value = true
    }

    if (editableTitle.value && editableBody.value) {
      updatePost(props.post.id, editableTitle.value, editableBody.value)
        .then(({ data }) => {
          emits('updatePosts');
          editableTitle.value = '';
          editableBody.value = '';
          emits('changeSidebar', data.id)
        })
    }
  };

</script>
<template>
  <div className="content">
      <h2>Post editing</h2>

      <form @submit.prevent="onSubmit">
        <InputField
          inputTitle="Title"
          inputName="new-post-title"
          placeholder="Post title"
          icon="fa-user fa-heading"
          inputType="text"
          v-model.trim="editableTitle"
          :incorrectTitle="incorrectTitle"
        />
        <TextAreaField
          textareaTitle="Write Post Body"
          textareaName="body"
          placeholder="Post body"
          v-model.trim="editableBody"
          :incorrectBody="incorrectBody"
        />

        <div className="field is-grouped">
          <div className="control">
            <button type="submit" className="button is-link">Save</button>
          </div>
          <div className="control">
            <button
              type="reset"
              className="button is-link is-light"
              @click.prevent="$emit('changeSidebar', post.id)"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
</template>
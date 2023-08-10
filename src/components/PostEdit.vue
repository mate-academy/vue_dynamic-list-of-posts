<script setup>
  import { watch, ref, inject } from 'vue';

  import InputField from './InputField.vue'
  import TextAreaField from './TextAreaField.vue'

  import { updatePost } from '../api/posts'

  const props = defineProps(['post']);
  const emits = defineEmits(['updatePosts']);

  const { changeSidebar } = inject('sidebar');

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
    if (!editableTitle.value) {
      incorrectTitle.value = true
    }
    if (!editableBody.value) {
      incorrectBody.value = true
    }

    if (editableTitle.value && editableBody.value) {
      updatePost(props.post.id, editableTitle.value, editableBody.value)
        .then(({ data }) => {
          emits('updatePosts');
          editableTitle.value = '';
          editableBody.value = '';
          changeSidebar(data.id);
        })
    }
  };

</script>
<template>
  <div className="content">
      <h2>Post editing</h2>

      <form @submit.prevent="onSubmit">
        <InputField
          input-title="Title"
          input-name="new-post-title"
          placeholder="Post title"
          icon="fa-user fa-heading"
          input-type="text"
          error-text="incorrect title"
          v-model.trim="editableTitle"
          :incorrect-title="incorrectTitle"
        />
        <TextAreaField
          textarea-title="Write Post Body"
          textarea-name="body"
          placeholder="Post body"
          error-text="incorrect post body"
          v-model.trim="editableBody"
          :incorrect-body="incorrectBody"
        />

        <div className="field is-grouped">
          <div className="control">
            <button type="submit" className="button is-link">Save</button>
          </div>
          <div className="control">
            <button
              type="reset"
              className="button is-link is-light"
              @click.prevent="changeSidebar(post.id)"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
</template>
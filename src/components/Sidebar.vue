<script setup>
import { ref, reactive, defineProps, defineEmits, watch } from 'vue';
import PostComments from './PostComments.vue';

const emit = defineEmits(['close-sidebar', 'create-post', 'delete', 'update', 'create-comment']);
const props = defineProps({
  isOpen: Boolean,
  selectedPost: Object,
});

const formData = reactive({
  title: '',
  body: '',
});

const errors = reactive({
  title: '',
  body: '',
});

const isEditing = ref(false);

watch(() => props.selectedPost, (newPost) => {
  isEditing.value = false;
  if (newPost) {
    formData.title = newPost.title;
    formData.body = newPost.body;
  } else {
    formData.title = '';
    formData.body = '';
  }
}, { immediate: true });

watch(() => formData.title, (newValue) => {
  if (newValue.trim()) {
    errors.title = false;
  }
});

watch(() => formData.body, (newValue) => {
  if (newValue.trim()) {
    errors.body = false;
  }
});

const handleSubmit = () => {
  errors.title = !formData.title?.trim();
  errors.body = !formData.body?.trim();

  if (errors.title || errors.body) {
    return;
  }

  if (props.selectedPost && isEditing.value) {
    emit('update', props.selectedPost.id, {
      title: formData.title,
      body: formData.body,
    });
  } else {
    emit('create-post', {
    title: formData.title,
    body: formData.body,
   });
  }
};

const handleCommentCreate = (commentData) => {
  emit('create-comment', commentData);
};
</script>

<template>
  <div 
    class="tile is-parent is-8-desktop Sidebar"
    :class="{ 'Sidebar--open': isOpen }">
    
    <div class="tile is-child box is-success ">
      <div class="content">
        <div v-if="selectedPost && !isEditing">
          <div class="block">
            <div class="is-flex is-justify-content-space-between is-align-items-center">
            <h2>#{{ selectedPost.id }}: {{ selectedPost.title }}</h2>
              <div class="is-flex">
                <span class="icon is-small is-right is-clickable" @click="isEditing = true">
                  <i class="fas fa-pen-to-square"></i>
                </span>
                <span
                  class="icon is-small is-right has-text-danger is-clickable ml-3"
                  @click="emit('delete', selectedPost.id)"
                >
                  <i class="fas fa-trash"></i>
                </span>
              </div>
            </div>
            <p data-cy="PostBody">{{ selectedPost.body }}</p>

            <PostComments
              :post-id="selectedPost.id"
              @create-comment="handleCommentCreate"
            />
          </div>


        </div>

        <div v-else>
          <h2>{{ selectedPost ? 'Edit post' : 'Create new post' }}</h2>
          <form @submit.prevent>
            <div class="field" data-cy="NameField">
              <label class="label" for="post-title">Title</label>
              <div class="control has-icons-left has-icons-right">
                <input
                  type="text"
                  v-model="formData.title"
                  id="post-title"
                  placeholder="Post title"
                  class="input"
                  :class="{'is-danger': errors.title}"
                />
                <span class="icon is-small is-left">
                  <i class="fas fa-user"></i>
                </span>
                <span
                  class="icon is-small is-right has-text-danger"
                  data-cy="ErrorIcon"
                  v-if="errors.title"
                >
                  <i class="fas fa-exclamation-triangle"></i>
                </span>
              </div>
              <p class="help is-danger" data-cy="ErrorMessage" v-if="errors.title">Title is required</p>
            </div>

            <div class="field" data-cy="BodyField">
              <label class="label" for="post-body">Write post body</label>
              <div class="control">
                <textarea
                  v-model="formData.body"
                  id="post-body"
                  placeholder="Post body"
                  class="textarea"
                  :class="{ 'is-danger': errors.body}"
                ></textarea>
              </div>
              <p class="help is-danger" data-cy="ErrorMessage" v-if="errors.body">Body is required</p>
            </div>

            <div class="field is-grouped">
              <div class="control">
                <button
                  type="submit" 
                  class="button is-link"
                  @click="handleSubmit"
                >
                  {{ selectedPost ? 'Save' : 'Create' }}
                </button>
              </div>
              <div class="control">
                <button 
                  type="button" 
                  class="button is-link is-light"
                  @click="emit('close-sidebar')"
                > 
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

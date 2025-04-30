<script setup>
  import { SIDEBAR_MODES } from '@/utils/sidebarModes';
  import PostForm from './PostForm.vue';
  import { editPost } from '@/api/posts';

  const { currentPostId } = defineProps({
    currentPostId: {
      type: Number,
      required: true,
    },
  });

  const posts = defineModel('posts', { type: Object });
  const sidebarMode = defineModel('sidebarMode', { type: Object });
  const title = defineModel('title', { type: Object });
  const body = defineModel('body', { type: Object });

  const onSubmit = async () => {
    try {
      const newPost = await editPost(currentPostId, title.value.trim(), body.value.trim());

      const index = posts.value.findIndex(item => item.id === currentPostId);

      if (index !== -1) {
        posts.value[index] = newPost;
      }

      sidebarMode.value = SIDEBAR_MODES.POST;
    } catch (error) {
      console.error(error);
    }
  };

  const onCancel = () => {
    sidebarMode.value = SIDEBAR_MODES.POST;
  };
</script>

<template>
  <div class="content">
    <h2>Edit post</h2>

    <PostForm
      v-model:title="title"
      v-model:body="body"
      :on-submit="onSubmit"
      :on-cancel="onCancel"
    />
  </div>
</template>

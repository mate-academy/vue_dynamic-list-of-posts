<script setup>
  import { deletePost, getPostById } from '@/api/posts';
  import { onMounted, ref, watch } from 'vue';
  import Loader from './Loader.vue';
  import { SIDEBAR_MODES } from '@/utils/sidebarModes';
  import Comment from './Comment.vue';
  import { getPostComments } from '@/api/comments';
  import NewCommentForm from './NewCommentForm.vue';

  const { postId } = defineProps({
    postId: {
      type: Number,
      required: true,
    },
  });

  const posts = defineModel('posts', { type: Array });
  const currentPostId = defineModel('currentPostId', { type: Number });
  const sidebarMode = defineModel('sidebarMode', { type: String });
  const title = defineModel('title', { type: String });
  const body = defineModel('body', { type: String });
  const isLoading = ref(true);
  const post = ref(null);
  const comments = ref([]);
  const isNewCommentFormShown = ref(false);

  const onPostIdChange = async () => {
    isLoading.value = true;

    try {
      const [postResult, commentsResult] = await Promise.all([
        getPostById(postId),
        getPostComments(postId),
      ]);

      post.value = postResult;
      comments.value = commentsResult;
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
      isNewCommentFormShown.value = false;
    }
  };

  onMounted(onPostIdChange);

  watch(() => postId, onPostIdChange);

  const onDelete = async () => {
    try {
      await deletePost(postId);
      posts.value = posts.value.filter(item => item.id !== postId);
      currentPostId.value = null;
      sidebarMode.value = null;
    } catch (error) {
      console.error(error);
    }
  };

  const onEdit = () => {
    sidebarMode.value = SIDEBAR_MODES.EDIT_FORM;
    title.value = post.value.title;
    body.value = post.value.body;
  };
</script>

<template>
  <Loader v-if="isLoading" />

  <div v-else class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>#{{ post.id }}: {{ post.title }}</h2>

      <div class="is-flex">
        <span class="icon is-small is-right is-clickable" @click="onEdit">
          <i class="fas fa-pen-to-square"></i>
        </span>

        <span class="icon is-small is-right has-text-danger is-clickable ml-3" @click="onDelete">
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>

    <p data-cy="PostBody">{{ post.body }}</p>

    <NewCommentForm
      v-if="isNewCommentFormShown"
      v-model:is-new-comment-form-shown="isNewCommentFormShown"
      v-model:comments="comments"
      :post-id="postId"
    />

    <template v-else>
      <template v-if="comments.length > 0">
        <Comment
          v-for="comment of comments"
          :key="comment.id"
          v-model:comments="comments"
          :comment="comment"
        />
      </template>

      <div v-else class="block">
        <p class="title is-4">No comments yet</p>
      </div>

      <button type="button" class="button is-link" @click="isNewCommentFormShown = true">
        Write a comment
      </button>
    </template>
  </div>
</template>

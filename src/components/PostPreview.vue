<script setup>
import { ref, onMounted } from 'vue';
import { useFetch } from '@/composables/useFetch';
import Comment from './Comment.vue';
import { addComment, deleteComment, getComments } from '@/helpers/comments';
import NoCommentsYet from './NoCommentsYet.vue';
import Loader from './loader/index.vue';
import AddComment from './AddComment.vue';
import WriteCommentBtn from './WriteCommentBtn.vue';

const props = defineProps({
  post: {
    type: Object,
    required: true,
  }
});

const fetchComments = () => getComments(props.post.id);
const isSubmitting = ref(false);

const {
  data: comments,
  isLoading: areCommentsLoading,
  errorMessage: commentsError,
  execute: loadComments,
} = useFetch(fetchComments, []);

onMounted(() => {
  loadComments();
});

const handleDeleteComment = async (comment) => {
  const index = comments.value.findIndex(c => c.id === comment.id);
  if (index !== -1) {
    comments.value.splice(index, 1);
  }
  try {
    await deleteComment(comment.id);
  } catch (e) { }
}

const handleAddComment = async (comment) => {
  const newPost = {
    ...comment,
    postId: props.post.id,
  }
  comments.value.push(newPost);

}

const emits = defineEmits(['delete', 'onEdit']);
const openCommentForm = ref(false);
</script>


<template>
  <div class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>#{{ post.id }}: {{ post.title }}</h2>
      <div class="is-flex">
        <span class="icon is-small is-right is-clickable" @click="$emit('onEdit', post)">
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span class="icon is-small is-right has-text-danger is-clickable ml-3" @click="$emit('delete', post)">
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ post.body }}</p>
  </div>
  <Loader v-if="areCommentsLoading" />
  <div class="block" v-else>

    <Comment v-if="comments.length" v-for="comment in comments" :key="comment.id" :comment="comment"
      @delete="handleDeleteComment" />
    <NoCommentsYet v-else />


    <WriteCommentBtn @click="openCommentForm = true" v-if="!openCommentForm && !areCommentsLoading" />
    <AddComment v-else @cancel="openCommentForm = false" @onAdd="handleAddComment" :postId="post.id" />
  </div>
</template>

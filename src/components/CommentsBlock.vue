<script setup>
  import { onMounted, ref, inject, computed } from 'vue';

  import { deleteComment, getPostsComments } from '../api/posts';

  import Loader from '../ui/Loader.vue';
  import AddComment from './AddComment.vue'

  const commentsAreLoading = ref(false);
  const comments = ref([]);
  const errorLoading = ref(false);
  const idDeletingCom = ref(null);

  const props = defineProps(['postId']);
  const { newCommentOpened, toggleNewCommentOpened } = inject('newCommentOpened');

  const loadComments = () => {
    getPostsComments(props.postId)
      .then(({ data }) => {
        comments.value = data;
      })
      .catch((e) => {
        console.log('CommentsBlock', e);
        errorLoading.value = true;
      })
      .finally(() => commentsAreLoading.value = false);
  }
  
  onMounted(() => {
    commentsAreLoading.value = true;
    loadComments();
  })

  const deleteAndReloadCom = (id) => {
    idDeletingCom.value = id;
    deleteComment(id)
      .then(() => loadComments())
  }
  const visibleComments = computed(() => comments.value.filter(com => com.id !== idDeletingCom.value))
</script>

<template>
    <Loader v-if="commentsAreLoading"/>
    <div className="block" v-else-if="errorLoading">
      <p className="title is-4">Error loading</p>
    </div>
    <div className="block" v-else-if="comments.length === 0">
      <p className="title is-4">No comments yet</p>
    </div>
     <article
      v-else
      className="message is-small"
      :key="comment.id"
      v-for="comment in visibleComments"
    >
      <div className="message-header">
        <a :href="`mailto:${comment.email}`"> {{ comment.name }} </a>
        <button
          @click="deleteAndReloadCom(comment.id)"
          type="button"
          className="delete is-small"
          aria-label="delete"
        >
          delete button
        </button>
      </div>
      <div className="message-body">{{ comment.body }}</div>
    </article>
    <AddComment
      v-show="newCommentOpened"
      :postId="postId"
      @loadComments="loadComments"
    />
    <button
      v-if="!newCommentOpened"
      @click="toggleNewCommentOpened(true)"
      type="button"
      className="button is-link"
    >
      Write a comment
    </button>
</template>

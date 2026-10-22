<script setup>
import { computed, onMounted, ref } from 'vue';
import { api } from '../api';
import Loader from './Loader.vue';
import CommentForm from './CommentForm.vue';
const props = defineProps({ post: { type: Object, required: true }, busy: Boolean, error: { type: String, default: '' } });
const emit = defineEmits(['edit', 'delete']);
const comments = ref([]);
const loading = ref(false);
const loadError = ref(false);
const showForm = ref(false);
const pending = ref(new Set());
const deleteErrors = ref(new Set());
// Keep the canonical list while requests are pending: rollback preserves order,
// including when several comments are deleted concurrently.
const visibleComments = computed(() => comments.value.filter(comment => !pending.value.has(comment.id)));
async function load() {
  if (loading.value) return;
  loading.value = true; loadError.value = false;
  try { comments.value = await api.getComments(props.post.id); }
  catch { loadError.value = true; }
  finally { loading.value = false; }
}
async function remove(comment) {
  if (pending.value.has(comment.id)) return;
  pending.value.add(comment.id); deleteErrors.value.delete(comment.id);
  try {
    await api.deleteComment(comment.id);
    comments.value = comments.value.filter(item => item.id !== comment.id);
  } catch { deleteErrors.value.add(comment.id); }
  finally { pending.value.delete(comment.id); }
}
onMounted(load);
</script>
<template>
  <div class="content">
    <div class="block">
      <div class="is-flex is-justify-content-space-between is-align-items-center">
        <h2>#{{ post.id }}: {{ post.title }}</h2>
        <div class="buttons are-small ml-3">
          <button type="button" class="button" :disabled="busy" aria-label="Edit post" @click="emit('edit')"><span class="icon"><i class="fas fa-pen-to-square"></i></span><span>Edit</span></button>
          <button type="button" class="button is-danger is-light" :class="{ 'is-loading': busy }" :disabled="busy" aria-label="Delete post" @click="emit('delete')"><span class="icon"><i class="fas fa-trash"></i></span><span>Delete</span></button>
        </div>
      </div>
      <p class="post-body" data-cy="PostBody">{{ post.body }}</p>
      <p v-if="error" class="notification is-danger mt-3" role="alert">{{ error }}</p>
    </div>
    <Loader v-if="loading" />
    <div v-else-if="loadError" class="notification is-danger" data-cy="CommentsError" role="alert">
      Unable to load comments.
      <button type="button" class="button is-small ml-2" @click="load">Try again</button>
    </div>
    <template v-else>
      <div v-if="!visibleComments.length" class="block" data-cy="NoComments"><p class="title is-4">No comments yet</p></div>
      <article v-for="comment in visibleComments" :key="comment.id" class="message is-small" data-cy="Comment">
        <div class="message-header">
          <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>
          <button type="button" class="delete is-small" aria-label="Delete comment" @click="remove(comment)"></button>
        </div>
        <div class="message-body comment-body">{{ comment.body }}</div>
        <div v-if="deleteErrors.has(comment.id)" class="notification is-danger" role="alert">
          Unable to delete this comment.
          <button type="button" class="button is-small" @click="remove(comment)">Try again</button>
        </div>
      </article>
      <CommentForm v-if="showForm" :post-id="post.id" @added="comments.push($event)" />
      <button v-else type="button" class="button is-link" @click="showForm = true">Write a comment</button>
    </template>
  </div>
</template>

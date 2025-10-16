<template>
  <article>
    <h3 class="title is-5">#{{ post.id }} — {{ post.title }}</h3>
    <p class="mb-4">{{ post.body }}</p>

    <div class="buttons are-small mb-4">
      <button class="button is-info" @click="$emit('edit')">Edit</button>
      <button class="button is-danger" @click="$emit('delete')">Delete</button>
    </div>

    <section>
      <h4 class="title is-6">Comments</h4>
      <div v-if="commentsLoading"><Loader /></div>
      <Notification v-else-if="commentsError" :message="commentsError" @close="$emit('clear-comments-error')" />
      <div v-else>
        <p v-if="!comments.length" class="has-text-grey">No comments yet</p>
        <ul v-else class="box">
          <li v-for="c in comments" :key="c.id" class="mb-3">
            <div class="is-flex is-justify-content-space-between is-align-items-center">
              <div>
                <strong>{{ c.name }}</strong>
                <small class="has-text-grey">&lt;{{ c.email }}&gt;</small>
              </div>
              <button class="delete is-medium" @click="$emit('delete-comment', c)"></button>
            </div>
            <p class="mt-1">{{ c.body }}</p>
          </li>
        </ul>

        <div v-if="!showCommentForm">
          <button class="button is-link is-light" @click="$emit('toggle-comment-form')">Write a comment</button>
        </div>
        <CommentForm v-else :post-id="post.id" @submitted="$emit('add-comment', $event)" />
      </div>
    </section>
  </article>
</template>

<script setup>
import Loader from './Loader.vue';
import Notification from './Notification.vue';
import CommentForm from './CommentForm.vue';

defineProps({
  post: Object,
  comments: { type: Array, default: () => [] },
  commentsLoading: Boolean,
  commentsError: String,
  showCommentForm: Boolean,
});

defineEmits(['edit', 'delete', 'delete-comment', 'toggle-comment-form', 'add-comment', 'clear-comments-error']);
</script>

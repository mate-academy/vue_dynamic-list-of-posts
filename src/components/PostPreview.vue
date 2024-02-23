<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import type { Post } from '@/types/Post'
  import type { IComment } from '@/types/Comment'

  import { CommentApi } from '@/api/comment.api'

  export default defineComponent({
    props: {
      post: {
        type: Object as PropType<Post>,
        required: true,
      },
    },
    data() {
      return {
        comments: [] as IComment[]
      }
    },
    mounted() {
      CommentApi.getAll(this.post.id).then(res => {
        this.comments = res.data;
      })


    },
    emits: ['deletePost', 'editPostOpen'],
    methods: {
      deleteCommentHandler(commentId: number) {
        CommentApi.delete(commentId)
          .then(() => {
            this.comments = this.comments.filter(comment => comment.id !== commentId)
          })
      }
    }
  })
</script>

<template>
  <div class="block">
    <div
      class="is-flex is-justify-content-space-between is-align-items-center"
    >
      <h2>#{{ post.id }}: {{ post.title }}</h2>
      <div class="is-flex">
      <span
        class="icon is-small is-right is-clickable"
        @click="$emit('editPostOpen', post.id)"
      >
        <i class="fas fa-pen-to-square"></i>
      </span>

      <span
        class="icon is-small is-right has-text-danger is-clickable ml-3"
        @click="$emit('deletePost')"
      >
        <i class="fas fa-trash"></i>
      </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ post.body }}</p>

    <template v-if="comments.length === 0">
      <div class="block">
        <p class="title is-4">No comments yet</p>
      </div>
    </template>

    <template v-for="comment of comments" v-bind:key="comment.id">
      <article class="message is-small">
        <div class="message-header">
          <a :href="`mailto:${comment.email}`"> {{ comment.name }} </a>
          <button type="button" class="delete is-small" aria-label="delete" @click="() => deleteCommentHandler(comment.id)">
            delete button
          </button>
        </div>
        <div class="message-body">{{ comment.body }}</div>
      </article>
    </template>

    <button type="button" class="button is-link">Write a comment</button>
  </div>

</template>

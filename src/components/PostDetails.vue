<script>
import { deleteComment, getComments } from "@/api/comments";
import Errors from "./Errors.vue";
import Loader from "./Loader.vue";
import NewCommentForm from "./NewCommentForm.vue";

export default {
  components: {
    Loader,
    Errors,
    NewCommentForm
  },
  props: {
    post: Object,
  },
  data() {
    return {
      comments: [],
      isLoadingComments: false,
      loadCommentsError: false,
      isFormShown: false
    }
  },
  computed: {
    isShowComments() {
      return !this.isLoadingComments && !this.loadCommentsError;
    },
  },
  watch: {
    post() {
      this.isFormShown = false;
      this.isLoadingComments = true;
      this.loadPostError = false;

      getComments(this.post.id)
        .then(({ data }) => {
          this.comments = data;
        })
        .catch(() => {
          this.loadPostError = true;
        })
        .finally(() => {
          this.isLoadingComments = false;
        });
    }
    
  },
  methods: {
    handleDeleteComments(commentId) {
      deleteComment(commentId).then(() => {
        this.comments = this.comments.filter(
          (comment) => comment.id !== commentId
        );
      });
    },
  },
  mounted() {
    this.isFormShown = false;
    this.isLoadingComments = true;
    this.loadPostError = false;

    getComments(this.post.id)
      .then(({ data }) => {
        this.comments = data;
      })
      .catch(() => {
        this.loadPostError = true;
      })
      .finally(() => {
        this.isLoadingComments = false;
      });
  }
};
</script>

<template>
  <div class="content" data-cy="PostDetails">
    <div class="content" data-cy="PostDetails">
      <div class="block">
        <h2>{{ `#${post.id}: ${post.title}` }}</h2>

        <p>{{ post.body }}</p>
      </div>

      <div class="block">
        <Loader v-if="isLoadingComments" />

        <Errors v-if="loadCommentsError" />

        <p class="title is-4" v-if="isShowComments && !comments.length">
          No comments yet
        </p>

        <template v-if="isShowComments && comments.length">
          <p class="title is-4">Comments:</p>

          <article
            v-for="comment of comments"
            :key="comment.id"
            class="message is-small"
          >
            <div class="message-header">
              <a :href="`mailto:${comment.email}`">
                {{ comment.name }}
              </a>
              <button
                type="button"
                class="delete is-small"
                aria-label="delete"
                @click="handleDeleteComments(comment.id)"
              >
                delete button
              </button>
            </div>

            <div className="message-body" data-cy="CommentBody">
              {{ comment.body }}
            </div>
          </article>
        </template>

        <button
          type="button"
          class="button is-link"
          v-if="isShowComments && !isFormShown"
          @click="isFormShown = true"
        >
          Write a comment
        </button>
      </div>

      <NewCommentForm
        :postId="post.id"
        @add-comment="comments = [...comments, $event]"
        v-if="isFormShown"
      />
    </div>
  </div>
</template>

<style></style>

  <template>
    <div
      class="block "
      v-if="post"
    >
      <div class="is-flex is-justify-content-space-between is-align-items-center ">
        <h2 class="title is-4">#{{ post.id }}: {{ post.title }}</h2>
        <div class="is-flex">
          <span
            class="icon is-small is-right is-clickable ml-3"
            @click="$emit('edit', post)"
          >
            <i class="fas fa-pen-to-square"></i>
          </span>
          <span
            class="icon is-small is-right has-text-danger is-clickable ml-3"
            @click="$emit('delete', post.id)"
          >
            <i class="fas fa-trash"></i>
          </span>
        </div>
      </div>
      <p
        data-cy="PostBody"
        class="mb-5"
      >
        {{ post.body }}
      </p>

      <div
        v-if="isLoadingComments"
        class="is-flex is-justify-content-center is-align-items-center mt-2"
      >
        <Loader />
      </div>

      <div
        v-else-if="commentsError"
        class="notification is-danger mt-3"
      >
        {{ commentsError }}
        <button
          class="button is-small ml-2"
          @click="loadComments"
        >
          Retry
        </button>
      </div>

      <div
        v-else-if="comments.length === 0"
        class="block mt-3"
      >
        <p class="title is-4">No comments yet</p>
      </div>

      <div
        v-else
        class="mt-4"
      >
        <article
          v-for="comment in comments"
          :key="comment.id"
          class="message is-small"
        >
          <div class="message-header">
            <a
              :href="`mailto:${comment.email}`"
              class="has-text-white"
              >{{ comment.name }}</a
            >
            <button
              type="button"
              class="delete is-small"
              aria-label="delete"
              @click="handleDeleteComment(comment.id)"
            ></button>
          </div>
          <div class="message-body">{{ comment.body }}</div>
        </article>
      </div>

      <div class="mt-5">
        <button
          v-if="!showCommentForm"
          type="button"
          class="button is-link"
          @click="showCommentForm = true"
        >
          Write a comment
        </button>

        <CommentForm
          v-else
          :post-id="post.id"
          @comment-added="onCommentAdded"
          @cancel="showCommentForm = false"
        />
      </div>
    </div>
  </template>

  <script setup>
  import { ref, watch, onMounted } from "vue";
  import { fetchComments, deleteComment } from "./api.js";
  import Loader from "./Loader.vue";
  import CommentForm from "./CommentForm.vue";

  const props = defineProps(["post"]);
  const emit = defineEmits(["edit", "delete"]);

  const comments = ref([]);
  const isLoadingComments = ref(false);
  const commentsError = ref("");
  const showCommentForm = ref(false);

  const loadComments = async () => {
    if (!props.post) return;

    isLoadingComments.value = true;
    commentsError.value = "";

    try {
      comments.value = await fetchComments(props.post.id);
    } catch (error) {
      commentsError.value = "CommentsError: Failed to load comments.";
    } finally {
      isLoadingComments.value = false;
    }
  };

  onMounted(() => {
    loadComments();
  });

  watch(
    () => props.post?.id,
    (newId, oldId) => {
      if (newId !== oldId) {
        showCommentForm.value = false;
        loadComments();
      }
    },
  );

  const onCommentAdded = (newComment) => {
    comments.value.push(newComment);
  };

  const handleDeleteComment = async (commentId) => {
    const previousComments = [...comments.value];

    comments.value = comments.value.filter((c) => c.id !== commentId);

    try {
      await deleteComment(commentId);
    } catch (error) {
      comments.value = previousComments;
      alert("Failed to delete comment. Please try again.");
    }
  };
  </script>

<script setup>
import { onMounted, ref } from "vue";
import Loader from "../Loader.vue";
import CommentItem from "./CommentItem.vue";
import CommentForm from "./CommentForm.vue";
import NoCommentsMessage from "./NoCommentsMessage.vue";
import WriteCommentButton from "./WriteCommentButton.vue";
import { getComments, deleteComment } from "../../api/posts.js";

const props = defineProps({
  postId: { type: [Number, String], required: true },
});

const comments = ref([]);
const isLoading = ref(true);
const loadError = ref("");
const isFormOpen = ref(false);
const deletingIds = ref([]);
const deleteError = ref("");

onMounted(async () => {
  try {
    comments.value = await getComments(props.postId);
  } catch (error) {
    console.error("[Comments] failed to load:", error);
    loadError.value = "Failed to load comments.";
  } finally {
    isLoading.value = false;
  }
});

const handleCommentCreated = (comment) => {
  comments.value.push(comment);
};

const handleDeleteComment = async (comment) => {
  const index = comments.value.findIndex((item) => item.id === comment.id);

  if (index === -1) {
    return;
  }

  deleteError.value = "";
  comments.value.splice(index, 1); // удаляем сразу

  try {
    await deleteComment(comment.id);
  } catch (error) {
    console.error("[Comments] failed to delete:", error);
    comments.value.splice(index, 0, comment); // откат при ошибке
    deleteError.value = "Unable to delete the comment. Please try again.";
  }
};
</script>

<template>
  <div class="block">
    <Loader v-if="isLoading" />

    <p v-else-if="loadError" class="help is-danger">{{ loadError }}</p>

    <template v-else>
      <NoCommentsMessage v-if="comments.length === 0" />

      <div v-else class="block">
        <p class="title is-4">Comments:</p>

        <CommentItem
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          :is-deleting="deletingIds.includes(comment.id)"
          @delete="handleDeleteComment"
        />
      </div>

      <p v-if="deleteError" class="help is-danger mb-3">{{ deleteError }}</p>

      <CommentForm
        v-if="isFormOpen"
        :post-id="postId"
        @created="handleCommentCreated"
        @cancel="isFormOpen = false"
      />

      <WriteCommentButton v-else @click="isFormOpen = true" />
    </template>
  </div>
</template>

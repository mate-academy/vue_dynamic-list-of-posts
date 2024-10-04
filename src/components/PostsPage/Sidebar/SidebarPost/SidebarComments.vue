<script setup lang="ts">
import { ref, watch } from "vue";
import Block from "./Block.vue";
import { Comment } from "../../../../types/comment";
import CommentInfo from "./CommentInfo.vue";
import CommentAdding from "../CommentAdding/CommentAdding.vue";
import { Post } from "../../../../types/post";

const props = defineProps<{
  deletePostComment: (commentId: number) => Promise<void>;
  chosenPost: Post;
  postComments: Comment[] | null;
  isCommentsEditing: boolean;
  changeCommentAddingState: () => void;
  addNewComment: ({ postId, name, body, email }: Comment) => Promise<void>;
}>();

const localPostComments = ref<Comment[]>(props.postComments!);

watch(
  () => props.postComments,
  (newPostComments) => {
    localPostComments.value = newPostComments!;
  }
);
</script>

<template>
  <Block>
    <template v-if="postComments?.length === 0">
      <p class="title is-4">No comments yet</p>
      <CommentAdding
        :is-comments-editing="isCommentsEditing"
        :change-comment-adding-state="changeCommentAddingState"
        :chosen-post="chosenPost"
        :add-new-comment="addNewComment"
      />
    </template>
    <template v-else>
      <CommentInfo
        v-for="comment of localPostComments"
        :key="comment.id"
        :comment="comment!"
        :deletePostComment="deletePostComment"
      />
      <CommentAdding
        :is-comments-editing="isCommentsEditing"
        :change-comment-adding-state="changeCommentAddingState"
        :chosen-post="chosenPost"
        :add-new-comment="addNewComment"
      />
    </template>
  </Block>
</template>

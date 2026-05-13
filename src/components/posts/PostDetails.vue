<button
  v-if="!isWritingComment"
  type="button"
  class="button is-link"
  @click="isWritingComment = true"
>
  Write a comment
</button>

<CommentForm
  v-else
/>
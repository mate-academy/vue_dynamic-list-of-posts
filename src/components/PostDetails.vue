<script>
import Comments from "./Comments.vue";
import PostForm from "./PostForm.vue";
export default {
  name: "PostDetails",
  components: {
    Comments,
    PostForm,
  },
  props: {
    selectedPost: Object,
  },
  data() {
    return {
      isEditingActive: false,
    };
  },
  emits: ["deletePost", "updatePost"],
};
</script>

<template>
  <template v-if="!isEditingActive">
    <div class="tile is-child box is-success">
      <div
        class="is-flex is-justify-content-space-between is-align-items-center"
      >
        <h2>Post #{{ selectedPost.id }}
          title: {{ selectedPost.title }} </h2>

        <div class="is-flex">
          <span
            class="icon is-small is-right is-clickable"
            @click="isEditingActive = true"
          >
            <i class="fas fa-pen-to-square" />
          </span>

          <span
            class="icon is-small is-right has-text-danger is-clickable ml-3"
            @click="this.$emit('deletePost', selectedPost.id)"
          >
            <i class="fas fa-trash"></i>
          </span>
        </div>
      </div>
      <p data-cy="PostBody">text: {{ selectedPost.body }}</p>
    </div>

    <Comments :selectedPost="selectedPost" class="tile is-child box is-success"/>
  </template>

  <PostForm
    v-else
    :formName="'editPost'"
    :selectedPost="selectedPost"
    @updatePost="this.$emit('updatePost', $event)"
    @closeEditing="isEditingActive = false"
  />
</template>

<style></style>
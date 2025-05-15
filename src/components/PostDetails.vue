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
    <div class="block">
      <div
        class="is-flex is-justify-content-space-between is-align-items-center"
      >
        <h2>#{{ selectedPost.id }}: {{ selectedPost.title }}</h2>

        <div class="is-flex">
          <span
            class="icon is-small is-right is-clickable"
            @click="this.isEditingActive = true"
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
      <p data-cy="PostBody">{{ selectedPost.body }}</p>
    </div>

    <Comments :selectedPost="selectedPost" />
  </template>

  <PostForm
    v-else
    :formName="'editPost'"
    :selectedPost="selectedPost"
    @updatePost="this.$emit('updatePost', $event)"
    @closeEditing="this.isEditingActive = false"
  />
</template>

<style></style>
<script>
import InputField from "./InputField.vue";
import PostDetails from "./PostDetails.vue";
import PostForm from "./PostForm.vue";
import TextAreaField from "./TextAreaField.vue";

export default {
  name: "Sidebar",
  components: {
    InputField,
    TextAreaField,
    PostDetails,
    PostForm,
  },
  props: {
    isActive: Boolean,
    selectedPost: Object,
    userId: Number,
  },
  emits: ["closeSidebar", "addPost", "deletePost", "updatePost"],
};
</script>

<template>
  <div
    class="tile is-parent is-8-desktop Sidebar"
    :class="{ 'Sidebar--open': isActive }"
  >
    <div class="tile is-child box is-success">
      <PostDetails
        v-if="selectedPost.hasOwnProperty('id')"
        :selectedPost="selectedPost"
        @deletePost="this.$emit('deletePost', $event)"
        @updatePost="this.$emit('updatePost', $event)"
      />

      <PostForm
        v-else
        :formName="'createPost'"
        :userId="userId"
        :selectedPost="selectedPost"
        @closeSidebar="this.$emit('closeSidebar')"
        @addPost="this.$emit('addPost', $event)"
      />
    </div>
  </div>
</template>

<style>
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;
  @media (min-width: 769px) {
    max-width: 0;
  }
}
.Sidebar--open {
  opacity: 1;
  @media (min-width: 769px) {
    max-width: 50%;
  }
}
</style>
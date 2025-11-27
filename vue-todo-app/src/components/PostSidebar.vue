<script>
  import AddPostForm from './AddPostForm.vue';
  import PostDetails from './PostDetails.vue';

  export default {
    name: 'PostSidebar',
    components: {
      PostDetails,
      AddPostForm,
    },
    props: {
      isActive: Boolean,
      selectedPost: Object,
      userId: Number,
    },
    emits: ["closeSidebar", "addPost", "deletePost", "updatePost"],
  }
</script>

<template>
  <div
    class="tile is-parent is-8-desktop Sidebar"
    :class="{ 'Sidebar--open' : isActive }"
  >
    <div class="tile is-child box is-success ">
      <div class="content">
        <PostDetails
          v-if="selectedPost.hasOwnProperty('id')"
          :selectedPost="selectedPost"
          @deletePost="this.$emit('deletePost', $event)"
          @updatePost="this.$emit('updatePost', $event)"
        />
        <AddPostForm
          v-else
          :formName="'createPost'"
          :userId="userId"
          :selectedPost="selectedPost"
          @closeSidebar="this.$emit('closeSidebar')"
          @addPost="this.$emit('addPost', $event)"
        />
      </div>
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
  }

  .Sidebar--open {
    opacity: 1;
  }

  @media (min-width: 769px) {
    .Sidebar {
      max-width: 0;
    }

    .Sidebar--open {
      max-width: 50%;
    }
  }
</style>

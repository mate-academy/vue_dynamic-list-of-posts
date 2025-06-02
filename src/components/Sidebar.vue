<template>
  <div :class="['tile is-parent is-8-desktop Sidebar', { 'Sidebar--open': isOpen }]">
    <div class="tile is-child box">
      <div class="content">
        <slot v-if="!isEditingPost"></slot>

        <!-- Show Edit Form When Editing -->
        <div v-if="isEditingPost">
          <h3 class="title is-5">Edit Post</h3>
          <div class="field">
            <label class="label">Post Title</label>
            <input class="input" v-model="editedPost.title" placeholder="Enter post title" />
          </div>
          <div class="field">
            <label class="label">Post Body</label>
            <textarea class="textarea" v-model="editedPost.body" placeholder="Enter post body"></textarea>
          </div>
          <div class="buttons">
            <button class="button is-primary" @click="$emit('savePost', editedPost)">Save</button>
            <button class="button is-light" @click="$emit('cancelEdit')">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: Boolean, // Sidebar visibility control
    isEditingPost: Boolean, // Tracks editing state
    editedPost: Object, // Post being edited
  },
};
</script>


<style scoped>
.Sidebar {
  position: fixed;
  align-items: center;
  right: 200px;
  width: 500px; /* adjust as needed */
  height: auto;
  background: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
  transform: translateX(0);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
}

</style>

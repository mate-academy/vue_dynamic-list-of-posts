<script>
import CommentsSection from './Comments/CommentsSection.vue'
import PostForm from './PostForm.vue'

export default {
  name: 'SidebarComponent',
  components: { PostForm, CommentsSection },
  props: {
    showSidebar: Boolean,
    posts: Object,
    selectedPost: Object,
  },
  emits: ['closeSidebar'],
  data() {
    return {
      editingPost: false,
    }
  },
  methods: {
    emitCloseSidebar() {
      this.$emit('closeSidebar')
      this.editingPost = false
    },
  },
}
</script>

<template>
  <div
    class="tile is-parent is-8-desktop childBlock Sidebar"
    :class="{ 'Sidebar--open': showSidebar }"
  >
    <div class="tile is-child box is-success">
      <div class="tile is-child box is-success">
        <div class="content">
          <PostForm
            v-if="!selectedPost || (editingPost && selectedPost)"
            :selected-post="selectedPost"
            :editing-post="editingPost"
            @close-Sidebar="emitCloseSidebar()"
          />
          <CommentsSection
            v-else
            :selected-post="selectedPost"
            @edit-post="editingPost = true"
            @close-Sidebar="emitCloseSidebar()"
          />
        </div>
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

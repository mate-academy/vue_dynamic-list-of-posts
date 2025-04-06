<script>
import { mapState } from 'vuex'
import NoCommentsYet from './NoCommentsYet.vue'
import CommentItem from './CommentItem.vue'
import CommentForm from './CommentForm.vue'
import LoaderItem from '@/components/LoaderItem.vue'

export default {
  components: {
    CommentItem,
    CommentForm,
    NoCommentsYet,
    LoaderItem,
  },
  props: {
    selectedPost: Object,
  },
  emits: ['editPost', 'closeSidebar'],
  data() {
    return {
      showForm: false,
    }
  },

  computed: {
    ...mapState('comments', ['comments', 'loading', 'errorMessage']),
  },

  watch: {
    selectedPost: {
      deep: true,
      handler() {
        this.$store.dispatch('comments/loadComments', this.selectedPost.id)
      },
    },
  },
  methods: {
    deletePost(postId) {
      this.$store.dispatch('posts/deletePost', postId)
      this.$emit('closeSidebar')
    },
  },
}
</script>
<template>
  <div class="content">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>{{ `#${selectedPost.id}: ${selectedPost.title}` }}</h2>
      <div class="is-flex">
        <span @click="$emit('editPost')" class="icon icon-small is-right is-clickable">
          <i class="fas fa-edit"></i>
        </span>
        <span
          @click="deletePost(selectedPost.id)"
          class="icon icon-small is-right has-text-danger is-clickable ml-3"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <div class="loader1" v-if="loading">
      <LoaderItem />
    </div>
    <div v-if="errorMessage" class="block">
      <p class="is-3 text-center has-text-danger">{{ errorMessage }}</p>
    </div>
    <div class="content" v-if="comments.length > 0 && !errorMessage && !loading">
      <CommentItem v-for="comment of comments" :key="comment.id" :comment="comment" />
    </div>

    <template v-if="comments.length === 0 && !errorMessage && !loading">
      <NoCommentsYet />

      <button @click="showForm = true" v-if="!showForm" type="button" class="button is-link">
        Add New Comment
      </button>
    </template>

    <CommentForm v-if="showForm" :selected-post="selectedPost" @close-form="showForm = false" />
  </div>
</template>

<style>
.loader1 {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

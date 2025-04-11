<template>
  <div class="tile is-parent is-8-desktop Sidebar" :class="{ 'Sidebar--open': slidebarIsOpen }">
    <div class="tile is-child box is-success">
      <div class="tile is-child box is-success">
        <div class="content">
          <PostPreview
            v-if="isCreating && !isEditing"
            :currentPost="currentPostObject"
            :deletePostFunction="deletePostFunction"
            :updateEditPost="updateEditPost"
          />
          <AddPost
            v-if="newPostModel || isEditing"
            :userId="user?.id"
            :currentPost="postModel"
            :updatePosts="updatePosts"
            :cancelEdit="cancelEdit"
            :isEditing="isEditing"
          />
          <AppLoader v-if="loader" />

          <template v-if="!addCommentToogle && !loader && isCreating">
            <template v-if="commentsLength > 0">
              <PostComment
                v-for="comment in comments"
                :key="comment.id"
                :comment="comment"
                :deleteComment="deleteCommentFunction"
              />
            </template>
            <NoCommentsYet v-else />
            <WriteCommentBtn v-model="addCommentToogle" />
          </template>
          <AddComment
            v-if="!loader && addCommentToogle"
            v-model:commentTogleModel="addCommentToogle"
            v-model:commentsModel="comments"
            :postId="postModel?.id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { Post } from '@/types/post'
import PostPreview from '@/components/PostPreview.vue'
import { deletePost } from '@/api/post'
import AddPost from '@/components/AddPost.vue'
import type { User } from '@/types/user'
import WriteCommentBtn from '@/components/WriteCommentBtn.vue'
import { deleteComment, getComment } from '@/api/comment'
import AppLoader from '@/components/AppLoader.vue'
import PostComment from '@/components/PostComment.vue'
import type { Comment } from '@/types/comment'
import NoCommentsYet from '@/components/NoCommentsYet.vue'
import AddComment from '@/components/AddComment.vue'

export default defineComponent({
  name: 'AppSlider',
  data(): {
    comments: Comment[]
    loader: boolean
    addCommentToogle: boolean
  } {
    return {
      comments: [],
      loader: false,
      addCommentToogle: false,
    }
  },
  components: {
    PostPreview,
    AddPost,
    WriteCommentBtn,
    AppLoader,
    PostComment,
    NoCommentsYet,
    AddComment,
  },
  props: {
    postModel: {
      type: Object as PropType<Post | null>,
    },
    postsModel: {
      type: Array as PropType<Post[]>,
    },
    user: {
      type: Object as PropType<User | null>,
    },
    newPostModel: {
      type: Boolean,
    },
    isEditing: {
      type: Object as PropType<Post | null>,
    },
  },
  emits: ['update:postModel', 'update:postsModel', 'update:newPostModel', 'update:isEditing'],
  computed: {
    slidebarIsOpen() {
      return this.isEditing || this.postModel || this.newPostModel
    },
    isCreating() {
      return this.postModel
    },
    currentPostObject(): Post | undefined {
      return typeof this.postModel === 'object' && this.postModel !== null
        ? this.postModel
        : undefined
    },
    commentsLength() {
      return this.comments.length
    },
    shouldShowCommentsBlock() {
      return !this.loader && !this.addCommentToogle && !this.isCreating
    },
  },
  watch: {
    postModel() {
      this.addCommentToogle = false

      if (this.postModel) {
        this.loader = true
        getComment(this.postModel?.id)
          .then((commentsFromServer) => {
            this.comments = commentsFromServer
          })
          .finally(() => {
            this.loader = false
          })
      }
    },
  },
  methods: {
    deletePostFunction() {
      if (typeof this.postModel === 'object' && this.postModel !== null) {
        const post = this.postModel as Post

        deletePost(post.id).then(() => {
          const filteredPosts = this.postsModel?.filter((p) => p.id !== post.id)

          this.$emit('update:postsModel', filteredPosts)
          this.$emit('update:postModel', null)
        })
      }
    },
    updatePosts(createdPost: Post) {
      const postIndex = this.postsModel?.findIndex((post) => post.id === createdPost.id)

      if (postIndex !== undefined && postIndex !== -1 && this.postsModel) {
        const updatedPosts = [...this.postsModel]
        updatedPosts[postIndex] = { ...updatedPosts[postIndex], ...createdPost }

        this.$emit('update:postsModel', updatedPosts)
      } else {
        const newPosts = [...(this.postsModel || []), createdPost]

        this.$emit('update:postsModel', newPosts)
      }

      this.$emit('update:newPostModel', false)
      this.updatePost(createdPost)
    },
    cancelEdit() {
      this.updatePost(null)
      this.$emit('update:newPostModel', false)
    },
    updatePost(valueForUpdate: Post | null) {
      this.$emit('update:postModel', valueForUpdate)
    },
    updateEditPost(valueForUpdate: Post | null) {
      this.$emit('update:isEditing', valueForUpdate)
    },
    deleteCommentFunction(commentId: number) {
      deleteComment(commentId).then(() => {
        this.comments = this.comments.filter((comment) => comment.id !== commentId)
      })
    },
  },
})
</script>

<style scoped>
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

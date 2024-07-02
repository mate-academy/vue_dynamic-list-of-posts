<script lang="ts">
import SidebarModal from '../components/SidebarModal.vue'
import PostList from '../components/PostList.vue'
import ButtonTemplate from '../ui/buttonTemplate.vue'
import CreateNewPost from '../components/CreateNewPost.vue'
// import type { User } from '../types/User'
import type { Post } from '../types/Post'
import { useUserStore } from '@/stores/users'
import { getUserPosts, removePost } from '@/api/posts'
import { usePostsStore } from '@/stores/posts'
import type { CustomPost } from '@/types/CustomPost'

export default {
  components: { ButtonTemplate, CreateNewPost, PostList, SidebarModal },
  data() {
    return {
      addNewPost: false,
      postList: [] as Post[] | CustomPost[],
      selectedPost: null as Post | null,
      fetchPostsError: false,
      loadingPosts: false,
      isLocalStorageUsed: false,
      showMessage: true,
      theMessageWasShown: false,
      postEditing: false,
      postEditingDetails: null as Post | null
    }
  },

  mounted() {
    const userStore = useUserStore()

    const id = userStore.user.id

    if (id) {
      this.loadingPosts = true

      getUserPosts<Post[]>(id)
        .then(({ data }) => {
          this.postList = data
        })
        .catch(() => (this.fetchPostsError = true))
        .finally(() => (this.loadingPosts = false))
    } else {
      this.isLocalStorageUsed = true
      const postsStore = usePostsStore()

      this.postList = postsStore.posts
    }

    setTimeout(() => {
      this.showMessage = false
      this.theMessageWasShown = true
    }, 14500)
  },

  computed: {
    isThereAnyPosts() {
      return this.postList.length > 0 || this.loadingPosts
    },

    iconClass() {
      return {
        'has-text-link': this.showMessage,
        'has-text-warning': !this.showMessage
      }
    }
  },

  methods: {
    handleSelectedPost(post: Post) {
      this.addNewPost = false
      this.selectedPost = post
    },

    handleRemoveSelectedPost() {
      this.selectedPost = null
    },

    handleAddNewPostButton() {
      this.selectedPost = null
      this.postEditingDetails = null
      this.postEditing = false
      this.addNewPost = true
    },

    handleEditPost() {
      this.postEditingDetails = this.selectedPost
      this.selectedPost = null
      this.postEditing = true
      this.addNewPost = true
    },

    handleCloseModal() {
      const id = useUserStore().user.id

      if (id) {
        this.loadingPosts = true

        getUserPosts<Post[]>(id)
          .then(({ data }) => {
            this.postList = data

            if (this.postEditing) {
              this.selectedPost =
                data.find((item) => item.id === this.postEditingDetails?.id) || null
            }
          })
          .catch(() => (this.fetchPostsError = true))
          .finally(() => {
            if (this.postEditing) {
              this.postEditingDetails = null
              this.postEditing = false
            }
            this.loadingPosts = false
            this.addNewPost = false
          })
      } else {
        if (this.postEditing) {
          this.selectedPost = this.postEditingDetails
          this.postEditingDetails = null
          this.postEditing = false
        }
        this.addNewPost = false
      }
    },

    handleRemovePost() {
      const id = useUserStore().user.id

      if (id && this.selectedPost) {
        removePost(this.selectedPost.id).then(() => {
          this.loadingPosts = true

          getUserPosts<Post[]>(id)
            .then(({ data }) => {
              this.postList = data
            })
            .catch(() => (this.fetchPostsError = true))
            .finally(() => {
              this.loadingPosts = false
              this.selectedPost = null
            })
        })
      } else {
        const postsStore = usePostsStore()
        postsStore.posts = postsStore.posts.filter((post) => post.id !== this.selectedPost?.id)

        this.postList = postsStore.posts
        this.selectedPost = null
      }
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="tile is-ancestor" style="display: flex">
      <div class="tile is-parent" style="flex: 1">
        <div class="tile is-child box is-success">
          <div class="columns mb-6" v-if="isLocalStorageUsed">
            <span
              class="column is-1 is-clickable icon is-small is-left"
              :class="iconClass"
              @click="showMessage = !showMessage"
            >
              <i class="fas fa-circle-info" />
            </span>

            <div
              class="column notification is-warning Message px-6 is-relative"
              :class="{ 'Message--open': showMessage }"
            >
              <span
                class="is-clickable icon is-small is-right has-text-black"
                style="position: absolute; top: 15px; right: 15px"
                @click="showMessage = false"
              >
                <i class="fas fa-xmark" />
              </span>

              <p>
                This type of interaction uses your computer's memory storage. If you would like to
                proceed - please make sure you "Logout" before leaving. To try fetch requests you
                need to use "artem.zakharchuk@ukr.net" email for credentials at the Login page
              </p>

              <div class="line" v-if="!theMessageWasShown"></div>
            </div>
          </div>

          <div class="block">
            <div class="block is-flex is-justify-content-space-between">
              <h2 class="title">Posts</h2>

              <ButtonTemplate
                buttonType="button"
                label="Add New Post"
                @handleButton="handleAddNewPostButton"
              />
            </div>
          </div>

          <PostList
            :loadingPosts="loadingPosts"
            :anyPosts="isThereAnyPosts"
            :selectedPost="selectedPost"
            :usersPosts="postList"
            :fetchPostsError="fetchPostsError"
            @onRemoveSelectedPost="handleRemoveSelectedPost"
            @onSelectedPostChange="handleSelectedPost"
          />
        </div>
      </div>
      <CreateNewPost
        :addNewPost="addNewPost"
        @closeModal="handleCloseModal"
        :editing="postEditing"
        :editingDetails="postEditingDetails"
      />
      <SidebarModal
        :selectedPost="selectedPost"
        @handleEditPost="handleEditPost"
        @handleRemovePost="handleRemovePost"
      />
    </div>
  </div>
</template>

<style>
.line {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  height: 4px;
  background-color: white;
  animation: time-left 15s linear;
}

@keyframes time-left {
  0% {
    width: 100%;
  }

  100% {
    width: 0%;
  }
}
</style>

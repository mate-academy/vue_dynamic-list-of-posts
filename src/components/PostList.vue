<script>
import textAreaField from "./textAreaField.vue";
import { getUserPosts } from "../api/usersData";
import PostDetails from "./PostPreview.vue";
import Loader from "./loader/Loader.vue";
export default {
  name: "PostList",
  components: {
    textAreaField,
    PostDetails,
    Loader,
  },
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isTextAreaVisible: false,
      isPostDetailsVisible: false,
      selectedPost: null,
      posts: [],
      isGlobalLoading: false,
      isEditing: false,
    };
  },
  methods: {
    toggleTextAreaField() {
      if (this.isPostDetailsVisible) {
        this.closePostDetails();
      }
      this.isEditing = false;
      this.selectedPost = null;
      this.isPostDetailsVisible = false;
      this.isTextAreaVisible = !this.isTextAreaVisible;
    },
    openPost(postId) {
      this.showGlobalLoader();
      if (this.isTextAreaVisible) {
        this.isTextAreaVisible = false;
        setTimeout(() => {
          this.openPostDetails(postId);
        }, 900);
      } else {
        this.openPostDetails(postId);
      }
    },
    openPostDetails(postId) {
      if (this.isPostDetailsVisible && this.selectedPost?.id === postId) {
        this.closePostDetails();
      } else {
        setTimeout(() => {
          this.selectedPost = this.posts.find((post) => post.id === postId);
          this.isPostDetailsVisible = true;
        }, 800);
      }

      setTimeout(() => {
        this.hideGlobalLoader();
      }, 500);
    },
    closePostDetails() {
      this.isGlobalLoading = false;
      setTimeout(() => {
        this.isPostDetailsVisible = false;
        this.selectedPost = null;
        this.hideGlobalLoader();
      }, 300);
    },

    addPost(newPost) {
      this.showGlobalLoader();

      const index = this.posts.findIndex((p) => p.id === newPost.id);
      if (index === -1) {
        this.posts.push(newPost);
      } else {
        console.warn(
          "Post already exists with this ID. Use updatePost instead."
        );
      }

      this.isTextAreaVisible = false;
      this.isEditing = false;

      setTimeout(() => {
        this.selectedPost = newPost;
        this.isPostDetailsVisible = true;
        this.hideGlobalLoader();
      }, 500);
    },

    editPost(post) {
      this.selectedPost = post;
      this.isEditing = true;
      this.isTextAreaVisible = true;
      this.isPostDetailsVisible = false;
    },
    loadUserPosts() {
      this.isGlobalLoading = false;
      const posts = getUserPosts(this.userId);
      this.posts = this.filterPosts(posts);
    },
    filterPosts(posts) {
      return posts.filter((post) => post.title && post.title.trim());
    },
    showGlobalLoader() {
      this.isGlobalLoading = true;
    },
    hideGlobalLoader() {
      this.isGlobalLoading = false;
    },
    updatePost(updatedPost) {
      this.showGlobalLoader();
      const postIndex = this.posts.findIndex((p) => p.id === updatedPost.id);
      if (postIndex !== -1) {
        this.posts.splice(postIndex, 1, updatedPost);
      } else {
        console.error("Post not found for update.");
      }

      this.isTextAreaVisible = false;
      this.isEditing = false;

      setTimeout(() => {
        this.selectedPost = updatedPost;
        this.isPostDetailsVisible = true;
        this.hideGlobalLoader();
      }, 400);
    },
  },
  mounted() {
    this.loadUserPosts();
  },
};
</script>

<template>
  <main class="section">
    <div class="tile is-parent">
      <div class="tile is-child box is-success">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button
            type="button"
            class="button is-link"
            :class="{ 'is-light': isTextAreaVisible }"
            @click="toggleTextAreaField"
          >
            Add New Post
          </button>
        </div>

        <div v-if="posts.length">
          <table class="table is-fullwidth is-striped is-hoverable is-narrow">
            <thead>
              <tr class="has-background-link-light">
                <th class="has-text-black">ID</th>
                <th class="has-text-black">Title</th>
                <th class="has-text-right has-text-black">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="post in posts" :key="post.id">
                <td class="has-text-black">{{ post.id }}</td>
                <td class="has-text-black">{{ post.title }}</td>
                <td class="has-text-right is-vcentered has-text-black">
                  <button
                    type="button"
                    class="button is-link"
                    :class="{
                      'is-light':
                        isPostDetailsVisible && selectedPost.id === post.id,
                    }"
                    @click="openPost(post.id)"
                  >
                    {{
                      isPostDetailsVisible && selectedPost.id === post.id
                        ? "Close"
                        : "Open"
                    }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="mt-2 has-text-centered">No posts yet.</p>
      </div>

      <transition name="fade-slide">
        <textAreaField
          v-if="isTextAreaVisible"
          @new-post="addPost"
          @cancel="toggleTextAreaField"
          :currentUserId="userId"
          :editing="isEditing"
          :post="isEditing ? selectedPost : null"
          @update-post="updatePost"
        />
      </transition>

      <transition name="fade-slide">
        <div
          v-show="isGlobalLoading"
          style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "
        >
          <Loader />
        </div>
      </transition>

      <transition name="fade-slide">
        <div
          v-show="isPostDetailsVisible && !isGlobalLoading"
          style="position: relative"
        >
          <PostDetails
            :post="selectedPost"
            :currentUserId="userId"
            @close="closePostDetails"
            @load-posts="loadUserPosts"
            @edit-post="editPost"
          />
        </div>
      </transition>
    </div>
  </main>
</template>

<style scoped>
.button.is-link {
  height: 50%;
  line-height: normal;
  padding: 0.5em 1em;
  max-height: 3rem;
  display: inline-flex;
  align-items: center;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>

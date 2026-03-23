<script setup>
import { computed, onMounted } from "vue";
import useUserStore from "@/stores/userStore";
import usePostsStore from "@/stores/postsStore";
import PostLoader from "./postLoader.vue";
import useSidebarStore from "@/stores/sidebarStore";

const userStore = useUserStore();
const postsStore = usePostsStore();
const sidebarStore = useSidebarStore();

onMounted(async () => {
  userStore.init();
  if (userStore.user) {
    await postsStore.fetchPostsByUserId(userStore.user.id);
  }
});

const posts = computed(() => postsStore.posts);

const handleActivePost = (postId) => {
  const isSamePost = postsStore.activePostId === postId;

  if (isSamePost) {
    postsStore.setActivePost(null);
    sidebarStore.close();
    sidebarStore.openNewPost = false;
    sidebarStore.editPost = false;
    sidebarStore.writeACommentBtn = false;
  } else {
    postsStore.setActivePost(postId);
    sidebarStore.open();
    sidebarStore.openNewPost = false;
    sidebarStore.editPost = false;
    sidebarStore.writeACommentBtn = false;
  }
};

const handleAddNewPostClick = () => {
  postsStore.setActivePost(null);
  sidebarStore.openNewPost = true;
  sidebarStore.open();
};

const handleDeleteError = () => {
  postsStore.postsError = "";
};
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button
            @click="handleAddNewPostClick"
            type="button"
            class="button is-link"
            :class="{ 'is-light': sidebarStore.openNewPost }"
          >
            Add New Post
          </button>
        </div>

        <PostLoader v-if="postsStore.isLoading" />

        <template v-else>
          <table
            class="table is-fullwidth is-striped is-hoverable is-narrow"
            v-if="posts.length > 0"
          >
            <thead>
              <tr class="has-background-link-light">
                <th>ID</th>
                <th>Title</th>
                <th class="has-text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <TransitionGroup name="posts">
                <tr v-for="post in posts" :key="post.id">
                  <td>{{ post.id }}</td>
                  <td>{{ post.title }}</td>
                  <td class="has-text-right is-vcentered">
                    <button
                      @click="handleActivePost(post.id)"
                      type="button"
                      class="button is-link"
                      :class="{
                        'is-light': postsStore.activePostId !== post.id,
                      }"
                    >
                      {{
                        postsStore.activePostId === post.id ? "Close" : "Open"
                      }}
                    </button>
                  </td>
                </tr>
              </TransitionGroup>
            </tbody>
          </table>

          <section class="has-text-centered" v-else>
            <p>No posts yet.</p>
          </section>

          <article
            v-if="postsStore.postsError"
            class="message is-danger"
            style="margin-top: 10px"
          >
            <div class="message-header">
              <p>Error Message</p>
              <button
                @click="handleDeleteError"
                class="delete"
                aria-label="delete"
              ></button>
            </div>
            <div class="message-body">
              {{ postsStore.postsError }}
            </div>
          </article>
        </template>
      </div>
    </div>
  </div>
</template>

<style>
.posts-enter-active,
.posts-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.posts-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.posts-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.PostsList {
  transition:
    flex 0.5s ease-in-out,
    max-width 0.5s ease-in-out;
}
</style>

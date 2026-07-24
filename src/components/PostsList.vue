<script setup>
import { computed } from "vue";
import PostLoader from "./PostLoader.vue";

const props = defineProps({
  posts: Array,
  postsError: String,
  selectedPost: Object,
  sidebarOpen: Boolean,
  isLoadingPost: Boolean,
});
const emit = defineEmits(["setSidebar", "setselectedPost", "setNewPost"]);

const hasPosts = computed(() => {
  return (props.posts?.length || 0) > 0;
});

const openPost = (post) => {
  emit("setSidebar", true);
  emit("setNewPost", false);
  emit("setselectedPost", post);
};

const closePost = () => {
  emit("setSidebar", false);
  emit("setselectedPost", { id: -1 });
};

const togglePost = (post) => {
  if (post.id === props.selectedPost.id) {
    closePost();
  } else {
    openPost(post);
  }
};

const newPost = () => {
  emit("setSidebar", true);
  emit("setselectedPost", { id: -1 });
  emit("setNewPost", true);
};
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button type="button" class="button is-link" @click="newPost">
            Add New Post
          </button>
        </div>

        <table class="table is-fullwidth is-striped is-hoverable is-narrow">
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>

          <PostLoader v-if="isLoadingPost" />

          <template v-else>
            <p v-if="postsError" class="has-text-danger">
              {{ postsError }}
            </p>

            <tbody v-else-if="hasPosts">
              <tr v-for="post of posts" :key="post.id">
                <td>{{ post.id }}</td>
                <td>{{ post.title }}</td>
                <td class="has-text-right is-vcentered">
                  <button
                    @click="togglePost(post)"
                    type="button"
                    class="button is-link"
                    :class="{ 'is-light': post.id !== props.selectedPost.id }"
                  >
                    {{ post.id === props.selectedPost.id ? "Close" : "Open" }}
                  </button>
                </td>
              </tr>
            </tbody>

            <p v-else>No posts yet</p>
          </template>
        </table>
      </div>
    </div>
  </div>
</template>

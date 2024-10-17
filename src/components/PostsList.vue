<script>
import { getUserPosts } from "@/api/post";
import PostLoader from "./PostLoader.vue";
import Message from "./Message.vue";
import { nextTick } from "vue";

export default {
  name: "PostsList",
  components: {
    PostLoader,
    Message,
  },
  props: { modalValue: String },
  data() {
    return {
      isLoaded: false,
      errorMassage: "",
    };
  },

  mounted() {
    this.isLoaded = true;

    getUserPosts(this.$store.state.userId)
      .then(({ data }) => {
        this.$store.commit("addPostList", data);
      })
      .catch((err) => {
        console.error(err);
        this.errorMassage = "Failed to load posts";
      })
      .finally(() => {
        this.isLoaded = false;
      });
  },
  computed: {
    postList() {
      return this.$store.state.postList;
    },
  },
  methods: {
    openPost(post) {
      this.$store.commit("setCurrentPost", post);
      this.$store.commit("setInSidebar", "postDetails");
    },

    closePost() {
      this.$store.commit("setCurrentPost", null);
      this.$store.commit("setInSidebar", "");
    },
  },
};
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button
            type="button"
            class="button is-link"
            @click="$store.commit('setInSidebar', 'creatingPost')"
          >
            Add New Post
          </button>
        </div>

        <PostLoader v-if="isLoaded" />

        <template v-else-if="errorMassage === ''">
          <p v-if="postList.length === 0">No posts yet.</p>
          <table
            v-else
            class="table is-fullwidth is-striped is-hoverable is-narrow"
          >
            <thead>
              <tr class="has-background-link-light">
                <th>ID</th>
                <th>Title</th>
                <th class="has-text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="post of postList" :key="post.id">
                <td>{{ post.id }}</td>
                <td>{{ post.title }}</td>
                <td class="has-text-right is-vcentered">
                  <button
                    v-if="$store.state.currentPost?.id !== post.id"
                    @click="openPost(post)"
                    type="button"
                    class="button is-link"
                  >
                    Open
                  </button>
                  <button
                    v-else
                    @click="closePost"
                    type="button"
                    class="button is-link is-light"
                  >
                    Close
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <Message v-if="errorMassage !== ''">
          <template #head>
            <p>Error</p>
          </template>

          <p>{{ errorMassage }}</p>
        </Message>
      </div>
    </div>
  </div>
</template>

<style></style>

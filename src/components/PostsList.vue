<script>
import { getUserPosts } from '@/api/post';
import PostLoader from './PostLoader.vue';
import Message from './Message.vue';
// import { nextTick } from "vue"; // Не використовується, можна видалити

export default {
  name: 'PostsList',
  components: {
    PostLoader,
    Message,
  },
  // props: { // modalValue не використовується, тому видалено
  //   modalValue: String
  // },
  data() {
    return {
      isLoaded: false,
      errorMessage: '',
    };
  },

  computed: {
    postList() {
      return this.$store.state.postList;
    },
    userId() {
      return this.$store.state.userId;
    },
  },
  mounted() {
    // Додаємо watcher для userId, щоб завантажувати пости після логіна
    this.$watch(
      'userId',
      (newUserId) => {
        if (newUserId) {
          this.loadPosts();
        } else {
          this.$store.commit('addPostList', []); // Очищаємо список постів при виході
        }
      },
      { immediate: true },
    ); // Запускаємо одразу, якщо userId вже є
  },
  methods: {
    loadPosts() {
      this.isLoaded = true;
      this.errorMessage = '';

      // Перевіряємо наявність userId перед запитом
      if (!this.userId) {
        this.errorMessage = 'User ID is not set. Please login.';
        this.isLoaded = false;
        return;
      }

      getUserPosts(this.userId)
        .then(({ data }) => {
          this.$store.commit('addPostList', data);
        })
        .catch((error) => {
          console.error('Failed to load posts:', error); // Логування помилки
          this.errorMessage = 'Failed to load posts';
        })
        .finally(() => {
          this.isLoaded = false;
        });
    },
    openPost(post) {
      this.$store.commit('setCurrentPost', post);
      this.$store.commit('setInSidebar', 'postDetails');
    },

    closePost() {
      this.$store.commit('setCurrentPost', null);
      this.$store.commit('setInSidebar', '');
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
            :disabled="isLoaded || !userId"
            @click="$store.commit('setInSidebar', 'creatingPost')"
          >
            Add New Post
          </button>
        </div>

        <PostLoader v-if="isLoaded" />

        <template v-else-if="errorMessage === ''">
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
                    type="button"
                    class="button is-link"
                    @click="openPost(post)"
                  >
                    Open
                  </button>
                  <button
                    v-else
                    type="button"
                    class="button is-link is-light"
                    @click="closePost"
                  >
                    Close
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <Message
          v-if="errorMessage !== ''"
          type="is-danger"
          icon="fas fa-exclamation-triangle"
        >
          <template #head>
            <p>Error</p>
          </template>
          <p>{{ errorMessage }}</p>
        </Message>
      </div>
    </div>
  </div>
</template>

<style></style>

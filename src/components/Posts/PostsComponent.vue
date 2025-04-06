<script>
import 'bulma/css/bulma.min.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { mapState } from 'vuex'
import LoaderItem from '../LoaderItem.vue'

export default {
  components: { LoaderItem },
  props: {
    selectedPost: Object,
    showSidebar: Boolean,
  },

  emits: ['addNewPost', 'showSelectedPost'],

  mounted() {
    this.$store.dispatch('posts/loadPosts')
  },
  computed: {
    ...mapState('posts', ['posts', 'loading', 'errorMessage']),
  },
}
</script>

<template>
  <LoaderItem v-if="loading && !errorMessage" />
  <div v-else class="tile is-parent max-height">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button
            @click="$emit('addNewPost')"
            type="button"
            class="button is-link"
            :class="{ 'is-light': !showSidebar }"
          >
            Add New Post
          </button>
        </div>

        <table
          v-if="posts.length > 0 && !errorMessage"
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
            <tr v-for="post of posts" :key="post.id">
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button
                  type="button"
                  @click="$emit('showSelectedPost', post)"
                  class="button is-link"
                  :class="{ 'is-light': !selectedPost || selectedPost.id !== post.id }"
                >
                  Open
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="posts.length === 0 && !errorMessage" class="block">
          <p class="is-3 text-center">No posts yet.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.text-center {
  text-align: center;
}

.max-height {
  max-height: 100%;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>

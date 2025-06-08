<script>
import AddPost from './AddPost.vue';
import AddHeader from './AddHeader.vue';
import PostDetails from './PostDetails.vue';
import PostsList from './PostsList.vue';
import Sidebar from './Sidebar.vue';

export default {
  name: 'MainContent',

  components: {
    PostsList,
    Sidebar,
    AddPost,
    PostDetails,
    AddHeader,
  },
  emits: ['logout'],
  data() {
    return {};
  },
  computed: {
    inSidebar() {
      return this.$store.state.inSidebar;
    },
  },
  watch: {
    inSidebar() {
      if (this.inSidebar === '' || this.inSidebar === 'creatingPost') {
        this.$store.commit('setCurrentPost', null);
      }
    },
  },
  methods: {
    closeSidebar() {
      this.$store.commit('setInSidebar', '');
    },

    clickCurrentPost(post) {
      this.$store.commit('setCurrentPost', post);
      this.$store.commit('setInSidebar', post ? 'postDetails' : '');
    },
  },
};
</script>

<template>
  <AddHeader @logout="$emit('logout')" />
  <main class="section">
    <div class="container">
      <div class="tile is-ancestor custom-container">
        <PostsList />

        <Sidebar :is-open="inSidebar !== ''">
          <AddPost
            v-if="inSidebar === 'creatingPost' || inSidebar === 'updatingPost'"
            :title="
              inSidebar === 'creatingPost' ? 'Create new post' : 'Post editing'
            "
          />

          <PostDetails v-if="inSidebar === 'postDetails'" />
        </Sidebar>
      </div>
    </div>
  </main>
</template>

<style>
.tile {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
}

@media (min-width: 769px) {
  .tile:not(.is-child) {
    display: flex;
    align-items: stretch;
    flex-grow: 1;
  }
}
</style>

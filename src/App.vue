
<script setup>
  import { onMounted, watch, ref, provide } from 'vue';

  import { getPosts } from './api/posts';
  import Loader from './ui/Loader.vue';
  import Nav from './components/Nav.vue';
  import PostTable from './components/PostsTable.vue';
  import Sidebar from './components/Sidebar.vue';
  import Login from './components/Login.vue';

  const currentUser = ref(JSON.parse(localStorage.getItem("user")) || null);

  const posts = ref([]);

  const sidebar = ref({state: 'closed', post: null});
  const arePostLoading = ref(false);
  const errorLoading = ref(false);
  const newCommentOpened = ref(false);

  const setCurrentUser = (user) => {
    if (!user) {
      currentUser.value = null;
      return;
    }
    localStorage.setItem("user", JSON.stringify(user));
    currentUser.value = user;
  }

  const toggleNewCommentOpened = (newValue) => {
    newCommentOpened.value = newValue;
  };
  
  const changeSidebar = (state, data = null) => {
    if (sidebar.value.state === state) {
      sidebar.value.state = 'closed';
      sidebar.value.post = data;
    } else {
      sidebar.value.post = data
      sidebar.value.state = state;
    }
  }

  const updatePosts = (id = currentUser.value.id) => {
    arePostLoading.value = true;
    getPosts(id)
    .then(({ data }) => {
      posts.value = data;
    })
    .catch((e) => {
      errorLoading.value = true;
      console.log('App getPosts', e)
    })
      .finally(() => arePostLoading.value = false)
  };

  onMounted(() => {
    if (currentUser.value) {
      updatePosts(currentUser.value.id);
    }
  });

  watch(currentUser, () => {
    if (!currentUser.value) { return }
    updatePosts(currentUser.value.id);
    },
    { deep: true }
  );

  provide('newCommentOpened', {
    newCommentOpened,
    toggleNewCommentOpened,
  })
  
  provide('sidebar', {
    sidebar,
    changeSidebar,
  })
</script>

<template>
  <Login
    v-if="!currentUser"
    @set-current-user="setCurrentUser"
  />
  <template v-if="currentUser">
    <Nav
      :user-name="currentUser.name"
      @set-current-user="setCurrentUser"
    />
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <div class="tile is-child box is-success">
          <div class="block">
            <div class="block is-flex is-justify-content-space-between">
              <p class="title">Posts</p>
              <button
                type="button"
                class="button is-link"
                @click="changeSidebar('new')"
                :disabled="sidebar.state === 'new'"
              >
                Add New Post
              </button>
            </div>
            <Loader v-if="arePostLoading" />
            <p v-else-if="errorLoading">Loading error, reload the page, please</p>
            <p v-else-if="posts.length < 1">No posts yet</p>
            <PostTable
              v-else
              :posts="posts"
            />
          </div>
        </div>
      </div>
      <Sidebar
        :user-id="currentUser.id"
        @update-posts="updatePosts"
      />
  
    </div>
  </template>
</template>

<style>
</style>

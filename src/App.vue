
<script setup>
  import { onMounted, ref, provide } from 'vue';

  import { getPosts, getUser } from './api/posts';
  import AddPost from './components/AddPost.vue';
  import Loader from './ui/Loader.vue'
  import PostPreview from './components/PostPreview.vue'
  import PostEdit from './components/PostEdit.vue'

  const posts = ref([]);
  const userName = ref('');
  const sidebar = ref({state: 'closed', post: null});
  const userId = ref(11250);
  const arePostLoading = ref(false);
  const errorLoading = ref(false);
  const newCommentOpened = ref(false);

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

  const updatePosts = () => {
    arePostLoading.value = true;
    getPosts()
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
    getUser(userId.value)
      .then(({data}) => {
        userName.value = data.name;
        updatePosts();
      })
    .catch((e) => console.log(e))
  });

  provide('newCommentOpened', {
  newCommentOpened,
  toggleNewCommentOpened,
  })
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h2 class="is-size-4">Vue List Of Posts</h2>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5 mb-2">
            <p>User: {{ userName }}</p>
          </div>

          <a class="button is-light"> Logout </a>
        </div>
      </div>
    </div>
  </nav>
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
          <table
            class="table is-fullwidth is-striped is-hoverable is-narrow"
             v-else
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
                    class="button is-link"
                    :class="{'is-light': +sidebar.state !== post.id }"
                    @click="changeSidebar(post.id)"
                  >
                    {{ +sidebar.state === post.id ? 'Close' : 'Open'}}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
      </div>
    </div>
    <div
      class="tile is-parent is-8-desktop Sidebar"
      :class="{'Sidebar--open': sidebar.state !== 'closed'}"
    >
      <div class="tile is-child box is-success ">
        <div class="tile is-child box is-success ">
          <div class="content">
            <AddPost
              v-if="sidebar.state === 'new'"
              :userId="userId"
              @updatePosts="updatePosts"
              @changeSidebar="changeSidebar"
            />
            <PostEdit
              v-else-if="sidebar.post"
              :post="sidebar.post"
              @updatePosts="updatePosts"
              @changeSidebar="changeSidebar"
            />
            <PostPreview
              v-else-if="sidebar.state !== 'closed'"
              @updatePosts="updatePosts"
              :postId="+sidebar.state"
              @changeSidebar="changeSidebar"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>

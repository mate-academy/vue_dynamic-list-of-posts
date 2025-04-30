<script setup>
  import { onMounted, ref } from 'vue';
  import NewPostForm from './NewPostForm.vue';
  import PostsList from './PostsList.vue';
  import Sidebar from './Sidebar.vue';
  import { getPosts } from '../api/posts';
  import Post from './Post.vue';
  import Header from './Header.vue';
  import { SIDEBAR_MODES } from '../utils/sidebarModes';
  import EditForm from './EditForm.vue';

  const user = defineModel('user', { type: Object });
  const sidebarMode = ref(SIDEBAR_MODES.NONE);
  const currentPostId = ref(null);
  const title = ref('');
  const body = ref('');
  const posts = ref([]);

  onMounted(async () => {
    try {
      posts.value = await getPosts();
    } catch (error) {
      console.error(error);
    }
  });
</script>

<template>
  <Header v-model:user="user" />

  <main class="section">
    <div class="container">
      <div class="tile ancestor">
        <PostsList
          v-model:title="title"
          v-model:body="body"
          v-model:sidebar-mode="sidebarMode"
          v-model:current-post-id="currentPostId"
          :posts="posts"
        />

        <Sidebar :class="{ 'Sidebar--open': !!sidebarMode }">
          <Post
            v-if="sidebarMode === SIDEBAR_MODES.POST"
            v-model:posts="posts"
            v-model:sidebar-mode="sidebarMode"
            v-model:current-post-id="currentPostId"
            v-model:title="title"
            v-model:body="body"
            :post-id="currentPostId"
          />

          <NewPostForm
            v-else-if="sidebarMode === SIDEBAR_MODES.NEW_POST_FORM"
            v-model:current-post-id="currentPostId"
            v-model:sidebar-mode="sidebarMode"
            v-model:posts="posts"
            v-model:title="title"
            v-model:body="body"
          />

          <EditForm
            v-else-if="sidebarMode === SIDEBAR_MODES.EDIT_FORM"
            v-model:sidebar-mode="sidebarMode"
            v-model:posts="posts"
            v-model:title="title"
            v-model:body="body"
            :current-post-id="currentPostId"
          />
        </Sidebar>
      </div>
    </div>
  </main>
</template>

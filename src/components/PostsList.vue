<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '../stores/userStore';
import { usePostStore } from '../stores/postsStore';
import { useCommentStore } from '../stores/commentsStore';
import Loader from './loader/Loader.vue';
import Header from './modules/Header.vue';
import SideBar from '../components/sidebar/SideBar.vue';

const userStore = useUserStore();
const postStore = usePostStore();
const commentStore = useCommentStore();

onMounted(async () => {
  if (!userStore.user) {
    postStore.errorMessages.fetch = 'No user data found. Please login again.';
    router.push('/login');
    return;
  }
  if (userStore.user && userStore.user.id > 0) {
    const userId = userStore.user.id;
    try {
      await postStore.loadPosts(userId);
    } catch (err) {
      postStore.errorMessages.fetch = 'Error fetching posts: ' + err.message;
    }
  } else {
    postStore.errorMessages.fetch = 'No user data found. Please login again.';
  }
});

</script>

<template>
  <Header />
  <main class="section">
    <div class="container">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <div class="tile is-child box is-success">
            <div class="block">
              <div class="block is-flex is-justify-content-space-between">
                <p class="title">Posts</p>
                <button
                  type="button"
                  class="button is-link"
                  :class="{ 'is-light': postStore.isAddPostBtnActive }"
                  @click="postStore.toggleAddPostBtn()"
                >
                  Add New Post
                </button>
              </div>

              <Loader v-if="postStore.isPostsListLoading" />
              <div class="is-size-4" v-else-if="postStore.postsList.length === 0">No posts yet</div>

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
                  <tr v-for="post of postStore.postsList" :key="post.id">
                    <td>{{ post.id }}</td>
                    <td>{{ post.title }}</td>
                    <td class="has-text-right is-vcentered">
                      <button
                        type="button"
                        class="button is-link"
                        :class="{
                          'is-light':
                            !postStore.isCommentDetailsActive ||
                            post.id !== postStore.isCommentDetailsActive.id,
                        }"
                        @click="postStore.toggleOpenPostBtn(post, commentStore)"
                      >
                        {{ postStore.isCommentDetailsActive && post.id === postStore.isCommentDetailsActive.id ? 'Close' : 'Open' }}
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
          :class="{
            'Sidebar--open':
              postStore.isAddPostBtnActive || postStore.isCommentDetailsActive,
          }"
        >
          <SideBar />
        </div>
      </div>
    </div>
  </main>
</template>

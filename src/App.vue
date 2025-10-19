<template>
  <main class="section">
    <div class="container">
      <div class="tile is-ancestor">

        <!-- Список пользователей и постов -->
        <div class="tile is-parent">
          <div class="tile is-child box is-success">
            <div class="block">
              <UserSelector
                :users="users"
                :selected-user="selectedUser"
                @user-select="handleUserSelect"
              />
            </div>

            <div class="block" data-cy="MainContent">
              <div v-if="isLoadingUsers"><Loader /></div>
              <p v-else-if="!selectedUser" data-cy="NoSelectedUser">No user selected</p>

              <div v-else>
                <div v-if="isLoadingPosts"><Loader /></div>
                <div v-else-if="hasErrorPosts" class="notification is-danger" data-cy="PostsLoadingError">
                  Something went wrong!
                </div>
                <div v-else>
                  <PostsList
                    v-if="posts.length > 0"
                    :posts="posts"
                    :selected-post-id="selectedPostId"
                    @post-select="handlePostSelect"
                    @create-post="startCreatingPost"
                  />
                  <div v-else class="notification is-warning" data-cy="NoPostsYet">
                    No posts yet
                  </div>

                  <!-- Кнопка создания нового поста -->
                  <button
                    class="button is-link mt-3"
                    @click="startCreatingPost"
                    data-cy="CreatePostButton"
                  >
                    Create new post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div
          class="tile is-parent is-8-desktop Sidebar"
          :class="{ 'Sidebar--open': selectedPost || isCreating }"
          data-cy="Sidebar"
        >
          <div v-if="selectedPost || isCreating" class="tile is-child box is-success">
            <PostDetails
              v-if="selectedPost"
              :post="selectedPost"
              @close="closeSidebar"
              @update-post="updatePost"
              @delete-post="deletePost"
            />
            <PostDetails
              v-else-if="isCreating"
              :post="newPost"
              :is-new="true"
              @close="cancelCreatingPost"
              @create-post="createPost"
            />
          </div>
        </div>

      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { fetchClient } from './utils/fetchClient';
import { User } from './types/User';
import { Post } from './types/Post';
import UserSelector from './components/UserSelector.vue';
import PostsList from './components/PostsList.vue';
import PostDetails from './components/PostDetails.vue';
import Loader from './components/Loader/Loader.vue';

export default defineComponent({
  components: { UserSelector, PostsList, PostDetails, Loader },
  setup() {
    const users = ref<User[]>([]);
    const selectedUser = ref<User | null>(null);
    const posts = ref<Post[]>([]);
    const selectedPostId = ref<number | null>(null);
    const isCreating = ref(false);

    const isLoadingUsers = ref(false);
    const hasErrorUsers = ref(false);
    const isLoadingPosts = ref(false);
    const hasErrorPosts = ref(false);

    const newPost = ref<Post>({ id: 0, userId: 3212, title: '', body: '' });

    const selectedPost = computed(() => {
      if (isCreating.value) return null;
      return posts.value.find(p => p.id === selectedPostId.value) || null;
    });

    // --- загрузка пользователей ---
    isLoadingUsers.value = true;
    fetchClient.get<User[]>('/users')
      .then(data => {
        users.value = data;
        if (data.length) {
          selectedUser.value = data[0]; // выбираем первого пользователя по умолчанию
        }
      })
      .catch(() => hasErrorUsers.value = true)
      .finally(() => isLoadingUsers.value = false);

    // --- загрузка постов выбранного пользователя ---
    watch(selectedUser, (user) => {
      selectedPostId.value = null;
      isCreating.value = false;
      posts.value = [];

      if (!user) return;

      isLoadingPosts.value = true;
      hasErrorPosts.value = false;

      fetchClient.get<Post[]>(`/posts?userId=${user.id}`)
        .then(data => posts.value = data)
        .catch(() => hasErrorPosts.value = true)
        .finally(() => isLoadingPosts.value = false);
    }, { immediate: true });

    const handleUserSelect = (user: User) => {
      selectedUser.value = user;
      selectedPostId.value = null;
      isCreating.value = false;
    };

    const handlePostSelect = (id: number | null) => {
      selectedPostId.value = id;
      isCreating.value = false;
    };

    const startCreatingPost = () => {
      if (!selectedUser.value) return;
      isCreating.value = true;
      newPost.value = { id: 0, userId: 3212, title: '', body: '' };
      selectedPostId.value = null;
    };

    const cancelCreatingPost = () => {
      isCreating.value = false;
    };

    // --- create post с ожиданием ответа ---
    const createPost = async (post: Post) => {
      // Оптимистичное добавление с временным id = 0
      const tempPost: Post = { ...post, id: 0 };
      posts.value.push(tempPost);
      selectedPostId.value = tempPost.id;
      try {
        const created = await fetchClient.post<Post>('/posts', post);
        const idx = posts.value.findIndex(p => p.id === 0);
        if (idx !== -1) posts.value[idx] = created;
        selectedPostId.value = created.id;
      } catch {
        // уведомление вместо alert
        console.error('Failed to create post');
      } finally {
        isCreating.value = false;
      }
    };

    const updatePost = (updated: Post) => {
      const idx = posts.value.findIndex(p => p.id === updated.id);
      if (idx !== -1) posts.value[idx] = updated;
    };

    const deletePost = (id: number) => {
      const idx = posts.value.findIndex(p => p.id === id);
      if (idx !== -1) posts.value.splice(idx, 1);
      selectedPostId.value = null;
      isCreating.value = false;
    };

    const closeSidebar = () => {
      selectedPostId.value = null;
      isCreating.value = false;
    };

    return {
      users, selectedUser, posts, selectedPostId, selectedPost,
      isLoadingUsers, hasErrorUsers, isLoadingPosts, hasErrorPosts,
      isCreating, newPost,
      handleUserSelect, handlePostSelect,
      startCreatingPost, cancelCreatingPost,
      createPost, updatePost, deletePost, closeSidebar
    };
  }
});
</script>

<style scoped>
.Sidebar {
  transition: all 0.3s ease;
  transform: translateX(100%);
}
.Sidebar--open {
  transform: translateX(0);
}
</style>

<script setup>
import { onMounted, ref } from "vue";
import Header from "./components/Header.vue";
import PostsTable from "./components/PostsTable.vue";
import PostForm from "./components/PostForm.vue";
import PostDetails from "./components/PostDetails.vue";
import Loader from "./components/Loader.vue";
import PostComments from "./components/Comments/PostComments.vue";
import { getUser, getAllPosts, getPost, deletePost } from "./api/posts";

const user = ref(null);
const posts = ref([]);
const isLoading = ref(true);

const postsError = ref("");

// right column
const isSidebarOpen = ref(false);
const sidebarMode = ref("form"); // 'form' | 'post'
const formKey = ref(0);

// selected post to view
const selectedPostId = ref(null);
const selectedPost = ref(null);
const isPostLoading = ref(false);
const postError = ref("");

const isDeleting = ref(false);
const deleteError = ref("");

onMounted(async () => {
  getUser().then((data) => {
    user.value = data;
  });

  try {
    posts.value = await getAllPosts();
  } catch (error) {
    console.error("[App] failed to load posts:", error);
    postsError.value = "Something went wrong!";
  } finally {
    isLoading.value = false;
  }
});

const closeSidebar = () => {
  isSidebarOpen.value = false;
  selectedPostId.value = null;
};

const handleAddPost = () => {
  formKey.value++;
  selectedPostId.value = null;
  sidebarMode.value = "form";
  isSidebarOpen.value = true;
};

const handlePostCreated = (newPost) => {
  posts.value.push(newPost);
  handleOpenPost(newPost.id);
};

const handleOpenPost = async (id) => {
  if (isSidebarOpen.value && selectedPostId.value === id) {
    closeSidebar();
    return;
  }

  sidebarMode.value = "post";
  isSidebarOpen.value = true;
  selectedPostId.value = id;
  selectedPost.value = null;
  postError.value = "";
  deleteError.value = "";
  isPostLoading.value = true;

  try {
    const data = await getPost(id);

    if (selectedPostId.value !== id) {
      return;
    }

    selectedPost.value = data;
  } catch (error) {
    if (selectedPostId.value !== id) {
      return;
    }

    console.error("[App] failed to load post:", error);
    postError.value = "Failed to load the post.";
  } finally {
    if (selectedPostId.value === id) {
      isPostLoading.value = false;
    }
  }
};

const handleDeletePost = async (post) => {
  if (isDeleting.value) {
    return; // защита от двойного клика
  }

  isDeleting.value = true;
  deleteError.value = "";

  try {
    await deletePost(post.id);

    posts.value = posts.value.filter((item) => item.id !== post.id);

    // закрываем панель, только если в ней всё ещё удалённый пост
    if (selectedPostId.value === post.id) {
      closeSidebar();
    }
  } catch (error) {
    console.error("[App] failed to delete post:", error);
    deleteError.value = "Failed to delete the post.";
  } finally {
    isDeleting.value = false;
  }
};

const handleEditPost = () => {
  formKey.value++; // форма пересоздаётся и берёт свежие значения из поста
  sidebarMode.value = "edit";
};

const handlePostUpdated = (updatedPost) => {
  // обновляем строку в таблице
  posts.value = posts.value.map((item) =>
    item.id === updatedPost.id ? { ...item, ...updatedPost } : item,
  );

  // если пользователь всё ещё смотрит этот пост, возвращаем его на экран
  if (selectedPostId.value === updatedPost.id) {
    selectedPost.value = { ...selectedPost.value, ...updatedPost };
    sidebarMode.value = "post";
  }
};

const handleCancel = () => {
  // при редактировании Cancel возвращает к просмотру поста
  if (sidebarMode.value === "edit") {
    sidebarMode.value = "post";
    return;
  }

  closeSidebar();
};
</script>

<template>
  <Header v-if="user" :user="user" />

  <main class="section">
    <div class="container">
      <div class="tile is-ancestor Layout">
        <PostsTable
          class="Layout__main"
          :posts="posts"
          :error="postsError"
          :is-loading="isLoading"
          :selected-post-id="selectedPostId"
          @add-post="handleAddPost"
          @open-post="handleOpenPost"
        />

        <div
          class="tile is-parent Sidebar"
          :class="{ 'Sidebar--open': isSidebarOpen }"
          :inert="!isSidebarOpen"
        >
          <div class="tile is-child box is-success">
            <div class="Sidebar__inner content">
              <PostForm
                v-if="sidebarMode === 'form' || sidebarMode === 'edit'"
                :key="formKey"
                :post="sidebarMode === 'edit' ? selectedPost : null"
                @created="handlePostCreated"
                @updated="handlePostUpdated"
                @cancel="handleCancel"
              />

              <template v-else>
                <Loader v-if="isPostLoading" />

                <p v-else-if="postError" class="help is-danger">
                  {{ postError }}
                </p>

                <template v-else-if="selectedPost">
                  <PostDetails
                    :post="selectedPost"
                    :is-deleting="isDeleting"
                    @edit="handleEditPost"
                    @delete="handleDeletePost"
                  />

                  <PostComments
                    :key="selectedPost.id"
                    :post-id="selectedPost.id"
                  />
                </template>
                <p
                  v-if="deleteError && sidebarMode === 'post'"
                  class="help is-danger"
                >
                  {{ deleteError }}
                </p>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.Layout {
  --sidebar-width: 50%;
}

@media (min-width: 769px) {
  .Layout {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
  }

  .Layout__main {
    flex: 1 1 0;
    min-width: 0;
  }

  .tile.Sidebar {
    flex: 0 0 0%;
    min-width: 0;
    padding: 0;
    overflow: hidden;
    opacity: 0;
    visibility: hidden;
    transition:
      flex-basis 0.4s ease,
      padding 0.4s ease,
      opacity 0.4s ease,
      visibility 0s linear 0.4s;
  }

  .tile.Sidebar.Sidebar--open {
    flex: 0 0 var(--sidebar-width);
    padding: 0.75rem; /* как у .tile.is-parent в Bulma */
    opacity: 1;
    visibility: visible;
    transition:
      flex-basis 0.4s ease,
      padding 0.4s ease,
      opacity 0.4s ease,
      visibility 0s;
  }

  .Sidebar__inner {
    min-width: 280px;
  }
}

@media (max-width: 768px) {
  .tile.Sidebar {
    display: none;
  }

  .tile.Sidebar.Sidebar--open {
    display: block;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tile.Sidebar,
  .tile.Sidebar.Sidebar--open {
    transition: none;
  }
}
</style>

<script lang="ts">
import AddPost from '@/components/AddPost.vue'
import DetailsSidebar from '@/components/DetailsSidebar.vue'
import PostsList from '@/components/PostsList.vue'
import { LoadingStatus, SidebarMode } from '@/enums'
import { deletePost, getPosts, patchPost, postPost } from '@/httpClient'
import type { Post, User } from '@/types/types'
import type { SetAddPostErrors, SetDeletePostError, SetEditPostErrors } from '@/types/functions'
import { defineComponent } from 'vue'
import PostPreview from '@/components/PostPreview.vue'
import NavHeader from '@/components/NavHeader.vue'

export default defineComponent({
  components: {
    NavHeader,
    PostsList,
    DetailsSidebar,
    AddPost,
    PostPreview,
  },
  data(): {
    user: User;
    posts: Post[];
    loadingStatus: LoadingStatus,
    sidebarMode: SidebarMode,
    openedPostId: number,
    savedName: string,
    savedEmail: string,
  } {
    const storageValue = localStorage.getItem('user');
    const user = storageValue && JSON.parse(storageValue);

    return {
      user,
      posts: [],
      loadingStatus: LoadingStatus.Loading,
      sidebarMode: SidebarMode.Off,
      openedPostId: -1,
      savedName: '',
      savedEmail: '',
    }
  },
  mounted() {
    if (this.user === null) {
      this.$router.push('./login');
    }

    this.handlePostsLoad();
  },
  watch: {
    posts: {
      deep: true,
      handler() {
        this.updateLoadingStatus();
      }
    }
  },
  computed: {
    openedPost() {
      return this.posts.find(post => post.id === this.openedPostId)
    }
  },
  setup() {
    return { SidebarMode };
  },
  methods: {
    updateLoadingStatus() {
      if (this.posts.length) {
        this.loadingStatus = LoadingStatus.Success;
      } else {
        this.loadingStatus = LoadingStatus.NoData;
      }
    },
    async handlePostsLoad() {
      try {
        this.posts = await getPosts(this.user.id);
        this.updateLoadingStatus();
      } catch {
        this.loadingStatus = LoadingStatus.Error;
      }
    },
    async handlePostAdd(title: string, body: string, setErrors: SetAddPostErrors) {
      const trimmedTitle = title.trim();
      const trimmedBody = body.trim();

      if (trimmedTitle && trimmedBody) {
        try {
          const sentPost = await postPost({
            userId: this.user.id,
            title: trimmedTitle,
            body: trimmedBody,
          });

          this.posts.push(sentPost);
          this.openedPostId = sentPost.id;
          this.sidebarMode = SidebarMode.Preview;
          setErrors();
        } catch {
          setErrors(true);
        }
      } else {
        setErrors(false, !trimmedTitle, !trimmedBody);
      }
    },
    async handlePostRemove(postId: number, setError: SetDeletePostError) {
      const index = this.posts.findIndex(post => post.id === postId);

      if (index !== -1) {
        try {
          await deletePost(postId);
          this.posts.splice(index, 1);
          this.sidebarMode = SidebarMode.Off;
          setError()
        } catch {
          setError(true);
        }
      } else {
        setError(true);
      }
    },
    async handlePostEdit(title: string, body: string, setErrors: SetEditPostErrors) {
      const trimmedTitle = title.trim();
      const trimmedBody = body.trim();

      if (trimmedTitle && trimmedBody) {
        if (this.openedPost) {
          try {
            const openedPostId = this.openedPost.id;
            const editedPost = await patchPost(openedPostId, {
              title: trimmedTitle,
              body: trimmedBody,
            });

            this.posts.splice(this.posts.findIndex(post => post.id === openedPostId), 1, editedPost);
            this.sidebarMode = SidebarMode.Preview;
            setErrors();
          } catch {
            setErrors(true);
          }
        } else {
          setErrors(true);
        }
      } else {
        setErrors(false, !trimmedTitle, !trimmedBody);
      }
    }
  },
})
</script>

<template v-if="user">
  <template v-if="user">
    <NavHeader :name="user.name"/>

    <main class="section">
      <div class="container">
        <div class="tile is-ancestor">
          <PostsList
            :posts="posts"
            :loading-status="loadingStatus"
            v-model:sidebar-mode="sidebarMode"
            v-model:opened-post-id="openedPostId"
          />

          <DetailsSidebar :class="{'Sidebar--open': sidebarMode !== SidebarMode.Off}">
            <template #default>
              <AddPost
                v-if="sidebarMode === SidebarMode.Add"
                @submit="handlePostAdd"
                v-model="sidebarMode"
                form-title="Create new post"
                confirm-button-label="Create"
                :sidebar-mode-on-cancel="SidebarMode.Off"
              />

              <PostPreview
                v-else-if="sidebarMode === SidebarMode.Preview && openedPost"
                :key="openedPost.id"
                v-model:sidebar-mode="sidebarMode"
                v-model:saved-name="savedName"
                v-model:saved-email="savedEmail"
                @post-delete="handlePostRemove"
                :post="openedPost"
              />

              <AddPost
                v-else-if="sidebarMode === SidebarMode.Edit && openedPost"
                @submit="handlePostEdit"
                v-model="sidebarMode"
                form-title="Post editing"
                confirm-button-label="Save"
                :sidebar-mode-on-cancel="SidebarMode.Preview"
                :start-title="openedPost.title"
                :start-body="openedPost.body"
              />
            </template>
          </DetailsSidebar>
        </div>
      </div>
    </main>
  </template>
</template>

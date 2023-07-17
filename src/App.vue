<script>
import HeaderPage from './components/HeaderPage.vue';
import PostsList from './components/PostsList.vue';
import PostPreview from './components/PostPreview.vue';
import PostForm from './components/PostForm.vue';

export default {
  name: 'App',
  data() {
    return {
      previewId: 0,
      isPreview: false,
      statusForm: 'off',
      posts: [],
    }
  },

  components: {
    HeaderPage,
    PostsList,
    PostPreview,
    PostForm
  },
}
</script>

<template>
  <header>
    <HeaderPage />
  </header>
  <main class="section">
    <div class="container">
      <div className="tile is-ancestor">
        <PostsList
          :statusForm="statusForm"
          :posts="posts"
          :previewId="previewId"
          :isPreview="isPreview"
          @setPreviewId="previewId = $event; statusForm = 'off'"
          @setStatusForm="statusForm = $event; isPreview = false"
          @setIsPreview="isPreview = $event"
        />

        <div
          class="tile is-parent is-8-desktop Sidebar"
          :class="{
            'Sidebar--open': isPreview || statusForm !== 'off',
          }"
        >
          <div class="tile is-child box is-success">
            <div class="content">
              <PostPreview
                v-if="isPreview"
                :postPreview="posts.find(post => post.id === previewId)"
                @setStatusForm="statusForm = $event; isPreview = false"
                @deletePost="posts = posts.filter(post => post.id !== $event); isPreview = false"
                @setPosts="posts = posts.map(post => (post.id === $event.id) ? $event : post);"
              />
              <PostForm
                v-if="statusForm === 'create'"
                :status="statusForm"
                @setStatusForm="statusForm = $event"
                @setPreviewId="previewId = $event; statusForm = 'off'"
                @setIsPreview="isPreview = $event"
                @setPosts="posts = [...posts, $event]"

              />
              <PostForm
                v-if="statusForm === 'update'"
                :status="statusForm"
                :postPreview="posts.find(post => post.id === previewId)"
                @setStatusForm="statusForm = $event"
                @setPreviewId="previewId = $event; statusForm = 'off'"
                @setIsPreview="isPreview = $event"
                @setPosts="posts = posts.map(post => (post.id === previewId)
                  ? { ...$event, id: previewId }
                  : post)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<template>
  <aside :class="['sidebar', { 'Sidebar--open': open }]">
    <div v-if="mode === 'create'">
      <h2 class="title">Create New Post</h2>
      <PostForm
        mode="create"
        :loading="loading"
        :error="error"
        @submit="onCreatePost"
        @cancel="$emit('cancel')"
      />
    </div>
    <div v-else-if="mode === 'view' && post">
      <PostPreview
        :post="post"
        @edit="$emit('edit', post)"
        @delete="$emit('delete', post)"
      />
      <CommentsList :postId="post.id" />
    </div>
    <div v-else-if="mode === 'edit' && post">
      <h2 class="title">Edit Post</h2>
      <PostForm
        mode="edit"
        :post="post"
        :loading="loading"
        :error="error"
        @submit="onEditPost"
        @cancel="$emit('cancel')"
      />
    </div>
  </aside>
</template>

<script>
import PostPreview from "./PostPreview.vue";
import CommentsList from "./CommentsList.vue";
import PostForm from "./PostForm.vue";
export default {
  name: "Sidebar",
  components: { PostPreview, CommentsList, PostForm },
  props: {
    open: Boolean,
    mode: String, // 'create', 'view', 'edit'
    post: Object,
    loading: Boolean,
    error: String,
  },
  methods: {
    onCreatePost(postData) {
      this.$emit("create-post", postData);
    },
    onEditPost(postData) {
      this.$emit("edit-post", postData);
    },
  },
};
</script>

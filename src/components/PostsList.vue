<script setup>
defineProps({
  posts: {
    type: Array,
    default: () => [],
  },
  currentPost: {
    type: Object,
    default: null,
  },
  isLoading: Boolean,
  errorMessagePosts: String,
  errorMessageGetUser: String,
});

defineEmits(["add-post", "select-post"]);
</script>

<template>
  <div class="tile is-parent PostsBlock">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button
            @click="$emit('add-post')"
            type="button"
            class="button is-link"
          >
            Add New Post
          </button>
        </div>

        <table class="table is-fullwidth is-striped is-hoverable is-narrow">
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post of posts" v-bind:key="post.id">
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button
                  @click="$emit('select-post', post)"
                  type="button"
                  class="button is-link"
                  :class="
                    currentPost?.id === post.id
                      ? 'is-light'
                      : 'button is-link'
                  "
                >
                  {{ currentPost?.id === post.id ? "Close" : "Open" }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p class="help is-danger" v-if="errorMessagePosts">
          {{ errorMessagePosts }}
        </p>

        <p
          v-if="!isLoading && posts.length === 0 && !errorMessagePosts"
          class="notification is-warning"
        >
          No posts yet
        </p>

        <p class="help is-danger" v-if="errorMessageGetUser">
          {{ errorMessageGetUser }}
        </p>
      </div>
    </div>
  </div>
</template>
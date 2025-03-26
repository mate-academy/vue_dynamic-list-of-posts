<script setup>
defineProps({
  posts: Array,
  postSelection: Function,
  selectedPost: Object,
});
</script>
<template>
  <section class="is-flex is-justify-content-center" v-if="!posts.length">
    <p>No posts yet</p>
  </section>
  <table v-else class="table is-fullwidth is-striped is-hoverable is-narrow">
    <thead>
      <tr class="has-background-link-light">
        <th>ID</th>
        <th>Title</th>
        <th class="has-text-right">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="post in posts" :key="post.id">
        <td>{{ post.id }}</td>
        <td>{{ post.title }}</td>
        <td class="has-text-right is-vcentered">
          <button
            @click="postSelection(post)"
            type="button"
            class="button is-link"
            :class="{
              'is-light': selectedPost?.id !== post.id,
            }"
          >
            {{ selectedPost?.id === post.id ? "Close" : "Open" }}
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

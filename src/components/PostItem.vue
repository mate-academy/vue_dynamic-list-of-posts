<script>
export default {
  name: "PostItem",
  props: {
    post: Object,
    selectedPost: Object,
  },
  emits: ["selectPost", "resetPost"],
};
</script>

<template>
  <tr>
    <td>{{ post.id }}</td>
    <td>{{ post.title }}</td>
    <td class="has-text-right is-vcentered">
      <button
        type="button"
        class="button"
        :class="{ 'is-link': selectedPost.id !== post.id }"
        @click="
          selectedPost.id === post.id
            ? $emit('resetPost')
            : $emit('selectPost', post)
        "
      >
        {{ selectedPost.id === post.id ? "Close" : "Open" }}
      </button>
    </td>
  </tr>
</template>

<style></style>
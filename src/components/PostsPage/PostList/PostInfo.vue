<script setup lang="ts">
import { Post } from "../../../types/post";

defineProps<{
  post: Post;
}>();
</script>

<template>
  <tr>
    <td>{{ post.id }}</td>
    <td>{{ post.title }}</td>
    <td className="has-text-right is-vcentered">
      <button type="button" className="button is-link">Open</button>
    </td>
  </tr>
</template>

<style scoped></style>

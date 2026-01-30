<script>
import CommentList from "./CommentList.vue";

export default {
  name: "PostPreview",
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  components: {
    CommentList,
  },
};
</script>

<template>
  <div class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>{{ post.title }}</h2>
      <div class="is-flex">
        <span
          class="icon is-small is-right is-clickable"
          @click="$emit('edit')"
        >
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span
          class="icon is-small is-right has-text-danger is-clickable ml-3"
          @click="$emit('remove', post.id)"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ post.body }}</p>

    <CommentList :postId="post.id" />
  </div>
</template>

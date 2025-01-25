<script setup>
import { usePostStore } from '@/stores/posts';

const postStore = usePostStore();

const handleDeletePost = async (postId) => {
  await postStore.removePost(postId)
}

const handleUpdatePost = () => {
  postStore.updatingPost();
  postStore.notShowDetailsPost();
  postStore.showPostForm();
}

</script>

<template>
  <div class="block">
    <div
      class="is-flex is-justify-content-space-between is-align-items-center"
    >
      <h2>{{`#${postStore.currentPost?.id}: ${postStore.currentPost?.title}`}}</h2>
      <div class="is-flex">
        <span class="icon is-small is-right is-clickable" @click="handleUpdatePost">
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span
          class="icon is-small is-right has-text-danger is-clickable ml-3" @click="handleDeletePost(postStore.currentPost?.id)"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ postStore.currentPost?.body }}</p>
  </div>
</template>

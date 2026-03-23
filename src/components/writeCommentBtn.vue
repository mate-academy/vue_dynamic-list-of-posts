<script setup>
import useSidebarStore from "@/stores/sidebarStore";

const sidebarStore = useSidebarStore();

const handleOpenNewComment = () => {
  sidebarStore.writeACommentBtn = true;
};
</script>

<template>
  <button type="button" class="button is-link" @click="handleOpenNewComment">
    Write a comment
  </button>
</template>

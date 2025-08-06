<script setup>
import { useSidebarStore } from "@/stores/sidebarStore";

const sidebarStore = useSidebarStore();

const handleClick = () => {
  sidebarStore.writeACommentBtn = true;
};
</script>

<template>
  <button type="button" class="button is-link" @click="handleClick">Write a comment</button>
</template>

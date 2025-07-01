<script setup lang="ts">
import PostForm from './PostForm.vue'
import Comments from './Comments.vue'
import { defineProps, defineEmits, ref } from 'vue';
const { selectedPost } = defineProps(['selectedPost'])
const emit = defineEmits(['addPost', 'closeSidebar', 'updatePost', 'deletePost', 'onEdit']);
const editMode = ref(false);
const onEdit = () => {
  editMode.value = !editMode.value;
}
const handleDelete = () => {
  emit('deletePost', selectedPost.id);
}
</script>

<template>
  <div v-if="!editMode" class="block">
  <div
    class="is-flex is-justify-content-space-between is-align-items-center"
  >
    <h2>{{`#${selectedPost.id}: ${selectedPost.title}`}}</h2>
    <div class="is-flex">
      <span class="icon is-small is-right is-clickable" @click="onEdit">
        <i class="fas fa-pen-to-square"></i>
      </span>
      <span
        class="icon is-small is-right has-text-danger is-clickable ml-3"
        @click="handleDelete"
      >
        <i class="fas fa-trash"></i>
      </span>
    </div>
  </div>
  <p data-cy="PostBody">{{selectedPost.body}}</p>
  <Comments :postId="selectedPost.id"/>
</div>
<PostForm v-else :selectedPost="selectedPost" @updatePost="emit('updatePost', $event)" @onEdit="onEdit" />
</template>

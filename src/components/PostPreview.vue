<script setup>
import CommentBlock from './CommentBlock.vue';

const emit = defineEmits(['edit', 'delete']);

const props = defineProps({
  post: Object
});

const editPost = () => {
  emit('edit', props.post);
};

const deletePost = () => {
  emit('delete', props.post.id);
};
</script>

<template>
  <div class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>{{ `#${post.id}: ${post.title}` }}</h2>

      <div class="is-flex">
        <span class="icon is-small is-right is-clickable" @click="editPost">
          <i class="fas fa-pen-to-square"></i>
        </span>

        <span class="icon is-small is-right has-text-danger is-clickable ml-3" @click="deletePost">
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p>{{ post.body }}</p>
  </div>
  <CommentBlock :post-id="post.id" />
</template>

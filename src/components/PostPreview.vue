<script setup>
import { usePostStore } from "@/store/postStore";
import { computed } from "vue";
import NoCommentsYet from "./NoCommentsYet.vue";

const global = usePostStore();


const postList = computed(() => global.state.postsList || []);

const currentPost = computed(() =>
  postList.value.find((post) => global.state.activePostId === post.id),
);

const pageTitle = computed(() => {
  if (global.state.isEditing) {
    return "Post editing";
  }
  if (currentPost.value) {
    return `# ${global.state.activePostId} : ${currentPost.value.title}`;
  }
  return "Post Details"; // Título padrão caso nenhum estado bata
});
</script>

<template>
  <div class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2 >{{pageTitle }}</h2>
     <template v-if="!global.state.isEditing">
       <div class="is-flex">
        <button
          type="button"
          class="button is-white is-clickable"
          @click="global.handleIsEditing(true)"
          title="Edit post"
        >
          <span class="icon is-right is-clickable">
            <i class="fas fa-pen-to-square"></i>
          </span>
        </button>
        <button  type="button"
          class="button is-white is-clickable"
          title="delete post" @click="global.fetchDeletePost(currentPost?.id)">
          
          <span class="icon is-right has-text-danger is-clickable ml-3">
            <i class="fas fa-trash"></i>
          </span>
        </button>
      </div>
     </template>
    </div>
    <p data-cy="PostBody">{{ currentPost.body }}</p>
  </div>
  <NoCommentsYet v-if="!global.state.isEditing"/>
</template>
<style scoped>
span {
  padding: 0;
}
button {
  padding: 5px;

}
</style>
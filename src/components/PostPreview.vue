<script setup>
  import { onMounted, ref, watch } from 'vue';

  import Loader from '../ui/Loader.vue';
  import CommentsBlock from './CommentsBlock.vue';

  import { getPost, deletePost } from '../api/posts';

  const props = defineProps(['postId']);

  const emits = defineEmits(['changeSidebar', 'updatePosts'])
  

  const post = ref(null);
  const postIsLoading = ref(false);
  
  const errorDelete = ref(false);

  const getWarning = () => {
    errorDelete.value = true;

    setTimeout(() => errorDelete.value = false, 5000);
  }

  const reloadPost = () => {
    postIsLoading.value = true;

    getPost(props.postId)
      .then(({ data }) => {
        post.value = data;
      })
      .catch((e) => console.log(e))
      .finally(() => postIsLoading.value = false);
  };

  onMounted(() => {
    reloadPost();
  })

  const removeAndReload = (id) => {
    errorDelete.value = false;

    deletePost(id)
      .then(() => {
        emits('updatePosts');
        emits('changeSidebar', 'closed')
      })
      .catch((e) => getWarning())
  }

  watch(() => props.postId, () => {
    reloadPost();
  })

</script>
<template>
  <Loader v-if="postIsLoading"/>
  <div class="block" v-else>
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>#{{ post?.id }}: {{ post?.title }}</h2>
      <div class="is-flex">
        <span
        @click="$emit('changeSidebar', 'edit', post)"
          class="icon is-small is-right is-clickable"
        >
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span
          @click="removeAndReload(post?.id)"
          class="icon is-small is-right has-text-danger is-clickable ml-3"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p class="help is-danger" v-if="errorDelete">Error, please try again</p>
    <p data-cy="PostBody">{{ post?.body }}</p>
    <CommentsBlock :postId="postId" />
  </div>
</template>
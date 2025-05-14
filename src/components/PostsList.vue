<script setup>
import { defineProps, onMounted, ref, watch } from 'vue';
import Loader from './loader/index.vue';
import ErrorMessage from './ErrorMessage.vue';
import { useFetch } from '@/composables/useFetch';
import { deletePost, getPosts } from '@/helpers/posts';
import Sidebar from './sidebar/index.vue';
import PostForm from './PostForm.vue';
import PostPreview from './PostPreview.vue';


const selectedPost = ref(null);
const formOpen = ref(false);
const isEditing = ref(false);


const props = defineProps({
  user: {
    required: true,
  }
});

const fetchPosts = async () => {
  if (!props.user.id) return [];
  return await getPosts(props.user.id);
};

const {
  data: posts,
  isLoading: arePostsLoading,
  errorMessage: postsError,
  execute: loadPosts,
} = useFetch(fetchPosts, []);

onMounted(() => {
  loadPosts();
});

const handlePostDelete = async (post) => {
  const index = posts.value.indexOf(post);

  if (index !== -1) {

    try {
      if (selectedPost.value === post) {
        selectedPost.value = null;
      }

      await deletePost(post.id);
      posts.value.splice(index, 1);
    }
    catch (e) { }
  }
}

const handleAddPost = (post) => {
  posts.value.push(post);
  selectedPost.value = post;
}

const handleEditPost = (post) => {
  const index = posts.value.indexOf(selectedPost.value);
  if(index !== -1) {
    posts.value[index] = post;
  }
  
  isEditing.value = false;
}

watch(selectedPost, (newVal) => {
  if (newVal !== null) {
    formOpen.value = false;
  }
});

</script>



<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button type="button" class="button" :class="{ 'is-link': !formOpen }" @click="formOpen = true">
            Add New Post
          </button>
        </div>

        <Loader v-if="arePostsLoading" />

        <table class="table is-fullwidth is-striped is-hoverable is-narrow" v-if="!arePostsLoading && posts.length">
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts" :key="post.id">
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td class="has-text-right is-vcentered">

                <button v-if="selectedPost !== post" type="button" class="button" @click="selectedPost = post">
                  Open
                </button>
                <button v-else type="button" class="button is-link" @click="selectedPost = null">
                  Close
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p class="notification is-warning" data-cy="NoPostsYet" v-else-if="!arePostsLoading && !posts.length">
          No posts yet
        </p>

        <ErrorMessage v-if="postsError">{{ postsError }}</ErrorMessage>
      </div>
    </div>
  </div>

  <Sidebar :isOpen="formOpen || selectedPost !== null">
    <PostPreview v-if="selectedPost && !isEditing" :post="selectedPost" @onEdit="isEditing = true" @delete="handlePostDelete" />
    <PostForm v-if="formOpen && !isEditing && !selectedPost" @cancel="formOpen = false" @onAdd="handleAddPost" />
    <PostForm v-if="isEditing && selectedPost" @cancel="isEditing = false" @onEdit="handleEditPost" :post="selectedPost" />
  </Sidebar>
</template>
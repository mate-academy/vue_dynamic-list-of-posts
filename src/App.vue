<script setup>
  import { onMounted, provide, ref, watch } from "vue";
  import { postsApi } from "./api/posts";

  import Header from "./components/Header.vue";
  import NoList from "./components/NoList.vue";
  import SideBar from "./components/SideBar.vue";
  import PostPreview from "./components/PostPreview.vue";
  import AddPost from "./components/AddPost.vue";
  import Loader from "./components/Loader.vue";
  import Table from "./components/Table.vue";

  const posts = ref([]);
  const activePost = ref(null);
  const isCreatedPost = ref(false);
  const isOpenSideBar = ref(false);
  const isLoadingData = ref(false);
  const isEditPost = ref(false);

  provide('activePost', activePost);

  const loadPosts = async () => {
    isLoadingData.value = true
    try {
      const res = await postsApi.getPosts();
      
      posts.value = res.data;
      isLoadingData.value = false;
    } catch (error) {
      console.error(error)
    }
  }

  onMounted(loadPosts)

  watch(() => activePost.value, () =>{
      loadPosts()
    
  }, {deep: true})

  const createPost = async (formData) => {
    try {
      const res = await postsApi.createPost(formData);
      isCreatedPost.value = false;
      activePost.value = res.data;
    } catch (error) {
      console.error(error)
    }
  }

  const openSideBar = () =>{
    isCreatedPost.value = true;
    isOpenSideBar.value = true;
    isEditPost.value = false;
    activePost.value = null;
  }
  
  const startEditPost = () => {
    isEditPost.value = true;
  }

  const reset = () => {
    isOpenSideBar.value = false;
    isCreatedPost.value = false;
    isEditPost.value = false;
    activePost.value = null;
  }

  const updatePost = async (formData) => {
	try {
		const {data} = await postsApi.updatePost(formData, activePost.value.id);

		activePost.value = data;
    isEditPost.value = false;
	} catch (error) {
		console.error(error)
	}
}
</script>

<template>
  <Header></Header>
  <main class="section">
    <div class="container">
      <div class="columns">
        <div :class="['column', isOpenSideBar || activePost ? 'is-half' : 'is-full']">
          <div class="box is-success">
            <div class="block">
              <div class="block is-flex is-justify-content-space-between">
                <p class="title">Posts</p>
                <button 
                  type="button" 
                  class="button is-link"
                  :class="{'is-light': isCreatedPost && !activePost}"
                  @click="openSideBar"
                >Add New Post</button>
              </div>
  
              <Loader v-if="isLoadingData"/>
              
              <template v-else>
                <Table v-if="posts.length > 0" :posts="posts" v-model="activePost"/>
                <NoList v-else text="posts"/>
              </template>
            </div>
          </div>
        </div>

        <SideBar :class="{'Sidebar--open': isOpenSideBar || activePost}" :isEditPost="isEditPost">
          <PostPreview  @edit="startEditPost" v-if="activePost && !isEditPost"/>
          <AddPost @submit="createPost" @update="updatePost" @reset="reset" v-else/>
        </SideBar>
      </div>

    </div>
  </main>

</template>

<style scoped>

</style>

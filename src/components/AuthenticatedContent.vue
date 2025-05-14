<script setup>
import PostsList from './PostsList.vue'
import SideBar from './SideBar.vue'
import PostPreview from './PostPreview.vue'
import { SideBarEnum } from '@/utils/SideBarModes'
import UserNavigation from './UserNavigation.vue'
import { onMounted, ref } from 'vue'
import { getPosts } from '../api/api.posts'
import NewPostForm from './NewPostForm.vue'
import EditForm from './EditForm.vue'
const user = defineModel('user', {
  type: Object,
})
const sideBarMode = ref('')
const currentPostId = ref(0)
const body = ref('')
const title = ref('')
const posts = ref([])
const isLoading = ref(false)
onMounted(async () => {
  isLoading.value = true
  try {
    posts.value = await getPosts().finally(() => {
      isLoading.value = false
    })
  } catch (error) {
    console.log(error)
  }
})
console.log(posts.value)
console.log(sideBarMode.value);
console.log(currentPostId.value)
</script>

<template>
  <UserNavigation v-model:user="user" />
  <main className="section">
    <div className="container">
      <div className="tile is-ancestor">
        <!-- <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    {errorNotification}
                  </div> -->

                  <PostsList
          v-model:isLoading="isLoading"
          v-model:title="title"
          v-model:body="body"
          v-model:sideBarMode="sideBarMode"
          v-model:currentPostId="currentPostId"
          :posts="posts"
        />
        <SideBar :class="{ 'Sidebar--open': !!sideBarMode }">

          <PostPreview
            v-if="sideBarMode === SideBarEnum.Post"
            v-model:posts="posts"
            v-model:sideBarMode="sideBarMode"
            v-model:currentPostId="currentPostId"
            v-model:title="title"
            v-model:body="body"
            :postId="currentPostId"
          />

          <NewPostForm
            v-else-if="sideBarMode === SideBarEnum.New_Post_Form"
            v-model:isLoading="isLoading"
            v-model:sideBarMode="sideBarMode"
            v-model:currentPostId="currentPostId"
            v-model:posts="posts"
            v-model:title="title"
            v-model:body="body"
          />
          <EditForm
          v-else-if="sideBarMode === SideBarEnum.Edit_Post_Form"
            v-model:isLoading="isLoading"
            v-model:sideBarMode="sideBarMode"
            v-model:currentPostId="currentPostId"
            v-model:posts="posts"
            v-model:title="title"
            v-model:body="body"
          />
        </SideBar>
      </div>
    </div>
  </main>
</template>

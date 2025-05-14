<script setup>
import { SideBarEnum } from '@/utils/SideBarModes'
import PostItem from './PostItem.vue'
import Loader from './Loader/Loader.vue'
const { posts } = defineProps({
  posts: {
    type: Array,
  },
})
const currentPostId = defineModel('currentPostId', {
  type: Number,
})
const sideBarMode = defineModel('sideBarMode', {
  type: String,
})
const title = defineModel('title', {
  type: String,
  default: '',
})
const body = defineModel('body', {
  type: String,
  default: '',
})
const isLoading = defineModel('isLoading', {
  type: Boolean,
})
const openNewPostForm = () => {
  currentPostId.value = null;
  sideBarMode.value = SideBarEnum.New_Post_Form;
  title.value = '';
  body.value = '';
  console.log(sideBarMode.value)
}
console.log(title.value);
console.log(sideBarMode.value);
console.log(posts.value)
</script>

<template>
  <div className="tile is-parent">
    <div className="tile is-child box is-success">
      <div className="block">
        <div className="block is-flex is-justify-content-space-between">
          <p className="title">Posts</p>
          <button
            type="button"
            class="button is-link"
            :class="{ 'is-light': sideBarMode === SideBarEnum.New_Post_Form }"
            @click="openNewPostForm"
          >
            Add New Post
          </button>
        </div>
        <p class="notification is-warning" data-cy="NoPostsYet" v-if="posts.length === 0 && !isLoading">
          No posts yet
        </p>
        <Loader v-else-if="isLoading"/>

        <table class="table is-fullwidth is-striped is-hoverable is-narrow" v-else>
          <thead>
            <tr className="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th className="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <PostItem
              v-for="post of posts"
              :key="post.id"
              v-model:currentPostId="currentPostId"
              v-model:sideBarMode="sideBarMode"
              :post="post"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

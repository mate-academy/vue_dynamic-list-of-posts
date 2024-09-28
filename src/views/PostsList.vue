<script setup lang="ts">
import { api } from '@/assets/api'
import AddPost from './AddPost.vue'
import PostPreview from './PostPreview.vue'
import { onMounted, provide, ref } from 'vue'
import EditPost from './EditPost.vue'
import type { Post } from '@/assets/types/Post'
import LoaderPost from './LoaderRing.vue'

const props = defineProps<{
  userId: number
}>()

type Action = 'add' | 'previev' | 'edit' | ''
const isLoading = ref(true)
const posts = ref<Post[] | null>(null)
const action = ref<Action>('')
const selectedPost = ref<Post | null>(null)

const handleActon = (value: Action) => {
  action.value = value
}

const close = () => {
  action.value = ''
  selectedPost.value = null
}

const handleAddPost = (title: string, body: string) => {
  const data = { userId: props.userId, title, body }

  console.log('data', data)

  api.addPost(data).then((res) => {
    posts.value?.push(res)
    selectedPost.value = res
    action.value = 'previev'
  })
}

const handlerSelecedPost = (data: Post) => {
  action.value = 'previev'
  selectedPost.value = data
}

const handleEditPost = (post: Post) => {
  action.value = 'edit'
  selectedPost.value = post
}

const handleDeletePost = (postId: number) => {
  api.deletePost(postId).then(() => {
    if (posts.value) {
      posts.value = posts.value.filter((post) => post.id !== postId)
    }
    close()
  })
}

const HandleUpdatePost = (title: string, body: string) => {
  if (selectedPost.value) {
    const updatedPost = {
      title,
      body,
      userId: props.userId,
      id: selectedPost.value.id
    }

    api.patchPost(selectedPost.value?.id, updatedPost).then((res) => {
      posts.value ? posts.value.map((p) => (p.id === res.id ? res : p)) : null
      handlerSelecedPost(res)
    })
  }
}

provide('posts', posts.value)

onMounted(() => {
  isLoading.value = true

  api
    .getPosts(props.userId)
    .then((res) => {
      posts.value = res
    })
    .catch((err) => {
      throw err
    })
    .finally(() => {
      isLoading.value = false
    })
})
</script>

<template>
  <LoaderPost v-if="isLoading" />

  <div v-else class="tile is-ancestor flex-box">
    <div class="tile is-parent flex-item">
      <div class="tile is-child box is-success flex-grow">
        <div class="block">
          <div class="block is-flex is-justify-content-space-between">
            <p class="title">Posts</p>

            <button type="button" @click="handleActon('add')" class="button is-link"
            :class="{'is-light': action === 'add'}">
              Add New Post
            </button>
          </div>

          <table class="table is-fullwidth is-striped is-hoverable is-narrow">
            <thead>
              <tr class="has-background-link-light">
                <th>ID</th>
                <th>Title</th>
                <th class="has-text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="post of posts" :key="post.id">
                <td>{{ post.id }}</td>
                <td>{{ post.title }}</td>
                <td class="has-text-right is-vcentered">
                  <button
                    v-if="selectedPost?.id !== post.id"
                    @click="handlerSelecedPost(post)"
                    type="button"
                    class="button is-light is-link"
                  >
                    Open
                  </button>

                  <button
                    v-if="selectedPost?.id === post.id"
                    type="button"
                    @click="close"
                    class="button is-link"
                  >
                    Close
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      class="tile is-parent box is-8-desktop flex-item Sidebar"
      :class="{ 'Sidebar--open': action }"
    >
      <div class="tile is-child is-success flex-grow">
        <div v-if="action === 'add'" class="content">
          <AddPost :close="close" :handleAddPost="handleAddPost" />
        </div>

        <div v-else-if="action === 'previev'" class="content">
          <template v-if="selectedPost">
            <PostPreview
              :handleDeletePost="handleDeletePost"
              :handleEditPost="handleEditPost"
              :post="selectedPost"
            />
          </template>
        </div>

        <template v-if="selectedPost">
          <EditPost
            v-if="action === 'edit'"
            :handleUpdatePost="HandleUpdatePost"
            :post="selectedPost"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;

  @media (min-width: 769px) {
    max-width: 0;
  }
}

.Sidebar--open {
  opacity: 1;

  @media (min-width: 769px) {
    max-width: 50%;
  }
}

.flex-box {
  display: flex;
  gap: 1.5rem;

  @media (max-width: 769px) {
    flex-direction: column;
  }
}

.flex-item {
  flex: 1;
  display: flex;
}

.flex-grow {
  flex: 1;
}
</style>

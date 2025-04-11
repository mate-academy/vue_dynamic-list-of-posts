<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button
            type="button"
            @click="handleAddNewPost"
            class="button"
            :class="{ 'is-link': !newPostModel }"
          >
            Add New Post
          </button>
        </div>
        <table
          v-if="!loader && postsArrayLength !== 0"
          class="table is-fullwidth is-striped is-hoverable is-narrow"
        >
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in postsModel" :key="post.id">
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button
                  type="button"
                  @click="openButtonPost(post)"
                  class="button is-link"
                  :class="{ 'is-light': postModel?.id !== post.id }"
                >
                  {{ postModel && postModel.id === post.id ? 'Close' : 'Open' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <PostLoader v-if="loader" />
        <h3 v-if="!loader && postsArrayLength === 0" class="mt-2 has-text-centered">
          No posts yet.
        </h3>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getPosts } from '@/api/post'
import type { Post } from '@/types/post'
import type { User } from '@/types/user'
import type { PropType } from 'vue'
import PostLoader from './PostLoader.vue'

export default {
  name: 'PostList',
  data(): {
    loader: boolean
  } {
    return {
      loader: false,
    }
  },
  props: {
    user: {
      type: Object as PropType<User | null>,
      required: true,
    },
    postModel: {
      type: Object as PropType<Post | null>,
    },
    postsModel: {
      type: Object as PropType<Post[]>,
    },
    newPostModel: {
      type: Boolean,
    },
  },
  emits: ['update:postModel', 'update:postsModel', 'update:newPostModel'],
  components: {
    PostLoader,
  },
  computed: {
    postsArrayLength: function () {
      return this.postsModel?.length
    },
  },
  mounted() {
    if (this.user) {
      this.loader = true
      getPosts(this.user.id)
        .then((postsFromServer) => {
          this.$emit('update:postsModel', postsFromServer)
        })
        .finally(() => {
          this.loader = false
        })
    }
  },
  methods: {
    openButtonPost(post: Post) {
      if (post.id === this.postModel?.id) {
        this.$emit('update:postModel', null)
      } else {
        this.$emit('update:postModel', post)
      }
    },
    handleAddNewPost() {
      if (!this.newPostModel) {
        this.$emit('update:postModel', null)
      }
      this.$emit('update:newPostModel', !this.newPostModel)
    },
  },
}
</script>

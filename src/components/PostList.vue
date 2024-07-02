<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import ButtonTemplate from '../ui/buttonTemplate.vue'
import LoaderSpinner from './LoaderSpinner.vue'
import type { Post } from '@/types/Post'
import type { CustomPost } from '@/types/CustomPost'

export default defineComponent({
  components: { ButtonTemplate, LoaderSpinner },
  props: {
    selectedPost: Object as PropType<Post | null>,
    usersPosts: {
      type: Array as PropType<Post[] | CustomPost[]>,
      required: true
    },
    fetchPostsError: Boolean,
    anyPosts: {
      type: Boolean,
      required: true
    },
    loadingPosts: Boolean
  },

  emits: ['onRemoveSelectedPost', 'onSelectedPostChange'],

  methods: {
    handleRemoveSelectedPost() {
      this.$emit('onRemoveSelectedPost')
    },

    handleSelectedPost(post: Post | CustomPost) {
      this.$emit('onSelectedPostChange', post)
    }
  }
})
</script>

<template>
  <div class="block" data-cy="MainContent">
    <LoaderSpinner v-if="loadingPosts" />

    <div class="notification is-danger" data-cy="PostsLoadingError" v-if="fetchPostsError">
      Something went wrong!
    </div>

    <div class="notification is-warning" data-cy="NoPostsYet" v-if="!anyPosts">No posts yet</div>

    <div data-cy="PostsList" v-if="usersPosts.length > 0">
      <p class="title">Posts:</p>

      <table class="table is-fullwidth is-striped is-hoverable is-narrow">
        <thead>
          <tr class="has-background-link-light">
            <th>#</th>
            <th>Title</th>
            <th>&nbsp;</th>
          </tr>
        </thead>

        <tbody>
          <tr data-cy="Post" v-for="post in usersPosts" :key="post.id">
            <td data-cy="PostId">{{ post.id }}</td>

            <td data-cy="PostTitle">{{ post.title }}</td>

            <td class="has-text-right is-vcentered">
              <ButtonTemplate
                v-if="selectedPost?.id === post.id"
                data-cy="PostButton"
                buttonType="button"
                label="Close"
                @handleButton="handleRemoveSelectedPost"
              />

              <ButtonTemplate
                v-else
                data-cy="PostButton"
                buttonType="button"
                label="Open"
                class="is-light"
                @handleButton="handleSelectedPost(post)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

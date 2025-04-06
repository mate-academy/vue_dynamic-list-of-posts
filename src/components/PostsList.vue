<script lang="ts">
import { LoadingStatus, SidebarMode } from '@/enums'
import type { Post } from '@/types/types'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import PostLoader from './PostLoader.vue'

export default defineComponent({
  components: {
    PostLoader,
  },
  props: {
    sidebarMode: {
      type: String as PropType<SidebarMode>,
      reqired: true,
    },
    openedPostId: {
      type: Number,
      required: true,
    },
    posts: {
      type: Array as PropType<Post[]>,
      required: true,
    },
    loadingStatus: {
      type: String as PropType<LoadingStatus>,
      required: true,
    },
  },
  emits: ['update:sidebarMode', 'update:openedPostId'],
  setup() {
    return { LoadingStatus, SidebarMode };
  },
})
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>

          <button
            type="button"
            class="button is-link"
            :class="{'is-light': sidebarMode === SidebarMode.Add}"
            @click="$emit('update:sidebarMode', SidebarMode.Add)"
          >
            Add New Post
          </button>
        </div>

        <PostLoader v-if="loadingStatus === LoadingStatus.Loading" />

        <h3 v-else-if="loadingStatus === LoadingStatus.NoData" class="mt-2 has-text-centered">
          No posts yet.
        </h3>

        <h3
          v-else-if="loadingStatus === LoadingStatus.Error"
          class="mt-2 has-text-centered has-text-danger"
        >
          Something went wrong
        </h3>

        <table v-else class="table is-fullwidth is-striped is-hoverable is-narrow">
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
                  type="button"
                  class="button is-link"
                  :class="{'is-light' : !(post.id === openedPostId && sidebarMode === SidebarMode.Preview)}"
                  @click="
                    if (post.id === openedPostId && sidebarMode === SidebarMode.Preview) {
                      $emit('update:sidebarMode', SidebarMode.Off)
                    } else {
                      $emit('update:openedPostId', post.id);
                      $emit('update:sidebarMode', SidebarMode.Preview)
                    }
                  "
                >
                  {{post.id === openedPostId && sidebarMode === SidebarMode.Preview ? 'Close' : 'Open'}}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

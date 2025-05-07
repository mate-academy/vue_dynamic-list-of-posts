<script setup lang="ts">
import type { Post } from '../types/Post'

const props = defineProps<{
  posts: Post[],
  showAddPostForm: boolean,
  selectedPost: Post | null,
  isPostEditing: boolean,
}>()

const emit = defineEmits(['togglePost', 'openAddPostForm'])

const togglePost = (post: { id: number; title: string; body: string }) => {
  emit('togglePost', post)
}
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="is-flex is-justify-content-space-between mb-5">
          <p class="title m-0">Posts</p>
          <button
            type="button"
            class="button is-link p-2"
            @click="$emit('openAddPostForm')"
            :disabled="showAddPostForm"
          >
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
            <tr v-for="{ id, title, body } in posts" :key="id">
              <td>{{ id }}</td>
              <td>{{ title }}</td>
              <td class="has-text-right is-vcentered">
                <button
                  type="button"
                  :class="id === selectedPost?.id && !isPostEditing ? 'button is-link' : 'button is-light'"
                  @click="
                    togglePost({
                      id,
                      title,
                      body
                    });
                    console.log(isPostEditing)
                  "
                >
                 {{ id === selectedPost?.id && !isPostEditing ? 'Close' : 'Open' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

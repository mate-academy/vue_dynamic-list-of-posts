<script setup>
import { SideBarEnum } from '@/utils/SideBarModes'
import { computed } from 'vue'
const { post } = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

const currentPostId = defineModel('currentPostId', {
  type: Number,
})

const sideBarMode = defineModel('sideBarMode', {
  type: String,
})
const isCurrentPost = computed(() => currentPostId.value === post.id)

const switchPost = () => {
  if (isCurrentPost.value) {
    currentPostId.value = null
    sideBarMode.value = ''

    return
  }
  currentPostId.value = post.id
  sideBarMode.value = SideBarEnum.Post
}

</script>
<template>
  <tr>
    <td>{{ post.id }}</td>
    <td>{{ post.title }}</td>
    <td class="has-text-right is-vcentered">
      <button
        type="button"
        class="button is-link"
        :class="{ 'is-light': isCurrentPost }"
        @click="switchPost"
      >
        {{ isCurrentPost ? 'Close' : 'Open' }}
      </button>
    </td>
  </tr>
</template>

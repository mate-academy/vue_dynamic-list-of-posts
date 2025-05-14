<<<<<<< HEAD
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
console.log(post)
</script>
=======
<script>
export default {
  name: "PostItem",
  props: {
    post: Object,
    selectedPost: Object,
  },
  emits: ["selectPost", "resetPost"],
};
</script>

>>>>>>> ab7d773b45522c29aeda20e2620c8a9a6e91ab22
<template>
  <tr>
    <td>{{ post.id }}</td>
    <td>{{ post.title }}</td>
    <td class="has-text-right is-vcentered">
      <button
        type="button"
<<<<<<< HEAD
        class="button is-link"
        :class="{ 'is-light': isCurrentPost }"
        @click="switchPost"
      >
        {{ isCurrentPost ? 'Close' : 'Open' }}
=======
        class="button"
        :class="{ 'is-link': selectedPost.id !== post.id }"
        @click="
          selectedPost.id === post.id
            ? $emit('resetPost')
            : $emit('selectPost', post)
        "
      >
        {{ selectedPost.id === post.id ? "Close" : "Open" }}
>>>>>>> ab7d773b45522c29aeda20e2620c8a9a6e91ab22
      </button>
    </td>
  </tr>
</template>
<<<<<<< HEAD
=======

<style></style>
>>>>>>> ab7d773b45522c29aeda20e2620c8a9a6e91ab22

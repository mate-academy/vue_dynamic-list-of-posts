<script>
export default {
  name: 'Post',
  props: {
    post: Object,
    currentPostId: Number,
  },
  emits: ['openSidebar']
}
</script>

<template>
  <tr>
    <td>{{ post.id }}</td>
    <td>{{ post.title }}</td>
    <td class="has-text-right is-vcentered">
      <button 
        type="button" 
        :class="{'is-light': post.id !== currentPostId}"
        class="button is-link" 
        @click="this.$emit('openSidebar', post.id)"
      >{{ post.id !== currentPostId ? 'Open' : 'Close' }}</button>
    </td>
  </tr>
</template>
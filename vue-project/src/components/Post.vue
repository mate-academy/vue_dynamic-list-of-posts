<script>
  export default {
    props: {
      post: Object,
      selectedPost: Object,
    },
    emits: ['openPost', 'closePost'],
    methods: {
      openPost() {
        if (this.selectedPost && this.selectedPost.id === this.post.id) {
          this.$emit('closePost');
        } else {
          this.$emit('openPost', this.post);
        }
      }
    }
  }
</script>

<template>
  <tr>
    <td>{{ post.id }}</td>
    <td>{{ post.title }}</td>
    <td class="has-text-right is-vcentered">
      <button type="button" class="button" :class="{'is-link': selectedPost && post.id === selectedPost.id}" @click="openPost">
        {{ selectedPost && post.id === selectedPost.id ? 'Close' : 'Open' }}
      </button>
    </td>
  </tr>
</template>

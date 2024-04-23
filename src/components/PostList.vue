<script>
  export default {
    name: 'HeaderComponent',
    emits: ['set-opened-post-id'],
    props: {
      posts: Array,
      openedPostId: Number,
    },
    methods: {
      toggleOpenSidebar(postId) {
        this.$emit('set-opened-post-id', postId);
      },
    },
  }
</script>

<template>
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
            type="button" 
            class="button is-link"
            :class="{'is-light' : openedPostId !== post.id}"
            @click="toggleOpenSidebar(post.id)"
          >
            {{ openedPostId === post.id ? 'Close' : 'Open' }}
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style>
</style>
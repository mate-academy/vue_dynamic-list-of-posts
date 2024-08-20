<script>
export default {
  props: {
    posts: Object,
    selectedPost: Object,
  },
  emits: ['changeSelectedPost'],
  methods: {
    isThisPostSelected(post) {
      return this.selectedPost?.id !== post.id;
    },
    changedSelectedPost(post) {
      if(!this.isThisPostSelected(post)) {
        this.$emit('changeSelectedPost', null);
        
        return;
      }
      this.$emit('changeSelectedPost', post);
    } 
  }
}
</script>

<template>
      <div >
      <p class="title">Posts:</p>

      <table class="table is-fullwidth is-striped is-hoverable is-narrow">
        <thead>
          <tr class="has-background-link-light">
            <th>#</th>
            <th>Title</th>
            <th> </th>
          </tr>
        </thead>

        <tbody>
          <tr 
          v-for="post of posts"
          :key="post.id"
          >
            <td>{{post.id}}</td>

            <td>{{post.title}}</td>

            <td class="has-text-right is-vcentered">
              <button
                type="button"
                class="button is-link"
                :class="{
                  'is-light': isThisPostSelected(post),
                }"
                @click="changedSelectedPost(post)"
              >
                {{isThisPostSelected(post) ? 'Open' : 'Close'}}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</template>
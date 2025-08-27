<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
        </div>

        <table
          v-if="posts.length > 0"
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
            <tr v-for="post in posts" :key="post.id">
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button
                  type="button"
                  class="button is-link is-small"
                  @click="$emit('select-post', post)"
                >
                  Open
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-else class="notification is-warning">No posts to display</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostsList",
  props: {
    posts: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["select-post"],
};
</script>

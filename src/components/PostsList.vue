<template>
  <div class="tile is-parent">
    <div class="tile is-child box">
      <div
        class="is-flex is-justify-content-space-between is-align-items-center mb-5"
      >
        <h1 class="title mb-0">
          Posts
        </h1>

        <button
          type="button"
          class="button is-link"
          @click="$emit('add')"
        >
          Add New Post
        </button>
      </div>

      <div
        v-if="posts.length === 0"
        class="notification is-warning"
      >
        No posts yet
      </div>

      <table
        v-else
        class="table is-fullwidth is-striped is-hoverable is-narrow"
      >
        <thead>
          <tr class="has-background-link-light">
            <th>ID</th>
            <th>Title</th>
            <th class="has-text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="post in posts"
            :key="post.id"
          >
            <td>
              {{ post.id }}
            </td>

            <td>
              {{ post.title }}
            </td>

            <td class="has-text-right is-vcentered">
              <button
                type="button"
                class="button is-link"
                @click="$emit('open', post)"
              >
                Open
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostsList',

  props: {
    posts: {
      type: Array,
      required: true,
    },
  },

  emits: ['add', 'open'],
};
</script>

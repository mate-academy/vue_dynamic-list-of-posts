<template>
  <section>
    <div v-if="loading" class="has-text-centered">
      <Loader />
    </div>
    <div v-else-if="error" class="notification is-danger">
      {{ error }}
    </div>
    <div v-else-if="posts.length === 0" class="notification is-info">
      No posts yet
    </div>
    <div v-else>
      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id">
            <td>{{ post.title }}</td>
            <td>
              <button
                class="button is-small is-link"
                @click="$emit('select', post)"
              >
                Open
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button class="button is-primary mt-4" @click="$emit('create')">
      Create new post
    </button>
  </section>
</template>

<script>
import Loader from "./Loader.vue";
export default {
  name: "PostsTable",
  components: { Loader },
  props: {
    posts: Array,
    loading: Boolean,
    error: String,
  },
};
</script>

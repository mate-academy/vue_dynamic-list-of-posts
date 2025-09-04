<template>
  <table class="table is-fullwidth">
    <thead>
      <tr>
        <th>Title</th>
        <th>Body</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="post in posts" :key="post.id" @click="$emit('select', post)">
        <td>{{ post.title }}</td>
        <td>{{ post.body }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    posts: Array,
  },
};
</script>

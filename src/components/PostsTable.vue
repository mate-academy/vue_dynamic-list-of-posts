<template>
  <table class="table is-fullwidth is-striped">
    <thead>
      <tr>
        <th>Title</th>
        <th>Body</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="post in posts" :key="post.id">
        <td>{{ post.title }}</td>
        <td>{{ post.body }}</td>
        <td class="has-text-right">
          <button class="button is-small is-info" @click="$emit('open', post)">
            Open
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({
  posts: {
    type: Array,
    required: true,
  },
});
</script>

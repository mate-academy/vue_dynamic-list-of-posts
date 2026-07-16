<script setup>
const props = defineProps({
  posts: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['select'])
</script>

<template>
  <div
    v-if="props.posts.length === 0"
    class="notification"
  >
    No posts yet
  </div>

  <table
    v-else
    class="table is-fullwidth is-striped"
  >
    <thead>
      <tr>
        <th>ID</th>
        <th>Title</th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="post in props.posts"
        :key="post.id"
        @click="emit('select', post)"
        style="cursor: pointer"
      >
        <td>{{ post.id }}</td>
        <td>{{ post.title }}</td>
      </tr>
    </tbody>
  </table>
</template>
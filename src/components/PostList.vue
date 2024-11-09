<script setup>
import Message from './Message.vue';
const emit = defineEmits(['togglePost']);

defineProps({
  posts: Array,
  openPostId: Number,
});


const togglePost = (post) => {
  emit('togglePost', post);
}

</script>

<template>
  <Message v-if="posts.length === 0">
    <p>No posts yet</p>
  </Message>
  <template v-else>
    <table class="table is-fullwidth is-striped is-hoverable is-narrow">
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
            <button type="button" class="button is-link" :class="{'is-light': openPostId !== post.id}" @click="togglePost(post)">{{ openPostId === post.id ? "Close" :
              "Open" }}</button>
          </td>
        </tr>
      </tbody>
    </table>
  </template>
</template>

<style></style>

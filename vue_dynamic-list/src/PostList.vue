<template>
  <div class="box">
    <div class="block">
      
      <div class="block is-flex is-justify-content-space-between">
        <p class="title">Posts</p>
        <button 
          type="button" 
          class="button is-link" 
          :class="{ 'is-light': isCreating }"
          @click="$emit('create')"
        >
          Create new post
        </button>
      </div>

      <div v-if="posts.length === 0" class="notification is-info">
        No posts yet.
      </div>

      <table v-else class="table is-fullwidth is-striped is-hoverable is-narrow">
        <thead>
          <tr>
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
                class="button is-link" 
                :class="{ 'is-light': selectedPostId !== post.id }"
                @click="selectedPostId === post.id ? $emit('close') : $emit('open', post)"
              >
                {{ selectedPostId === post.id ? 'Close' : 'Open' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
    </div>
  </div>
</template>

<script setup>
defineProps({
  posts: { type: Array, required: true },
  selectedPostId: { type: Number, default: null },
  isCreating: { type: Boolean, default: false }
});
defineEmits(['open', 'create', 'close']);
</script>
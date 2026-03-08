<script lang="ts">
import { defineComponent } from 'vue'
import type { User } from '../../api/posts'

export default defineComponent({
  props: {
    user: {
      type: Object as () => User | null,
      default: null,
    },
  },

  emits: ['logout'],
})
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h2 class="is-size-4">Vue List Of Posts</h2>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons" v-if="user">
          <div class="mr-5 mb-2">
            <p>User: {{ user.name }}</p>
          </div>
          <button class="button is-light" @click="$emit('logout')">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

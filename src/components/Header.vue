<script lang="ts">
import { defineComponent, type PropType } from 'vue'
  import type { User } from '@/types/User'

  export default defineComponent({
    props: {
      user: {
        type: Object as PropType<User>,
        required: true,
      }
    },
    emits: ['logout']
  });
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h1 class="title is-size-4">Vue List Of Posts</h1>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5 mb-2">
            <p>User: {{ user.name }}</p>
          </div>

          <a class="button is-light" @click="$emit('logout')">
            Logout
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

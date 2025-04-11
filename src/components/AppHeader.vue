<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h2 class="is-size-4">Vue List Of Posts</h2>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5 mb-2">
            <p>User: {{ userModel?.name }}</p>
          </div>

          <a class="button is-light" @click="handleLogout"> Logout </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import type { User } from '@/types/user'
import type { PropType } from 'vue'

export default {
  props: {
    userModel: {
      type: Object as PropType<User | null>,
      required: true,
    },
  },
  emits: ['update:userModel'],
  methods: {
    handleLogout() {
      this.$emit('update:userModel', null)
      localStorage.removeItem('user')
    },
  },
}
</script>

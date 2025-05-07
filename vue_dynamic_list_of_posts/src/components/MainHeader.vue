<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits(['authStatus'])

const userName = ref('')

onMounted(() => {
  userName.value = localStorage.getItem('name') || ''
})

const onLogout = () => {
  emit('authStatus', false)
}
</script>

<template>
  <nav className="navbar" role="navigation" aria-label="main navigation">
    <div className="navbar-item">
      <h2 className="is-size-4">Vue List Of Posts</h2>
    </div>
    <div className="navbar-end">
      <div className="navbar-item">
        <div className="buttons">
          <p>User: {{ userName }}</p>

          <a className="button is-light" @click="onLogout"> Logout </a>
        </div>
      </div>
    </div>
  </nav>
</template>

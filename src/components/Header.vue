<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()

const modelo = defineModel()



const handleLogout = () => {
  localStorage.clear()
  router.push({name: 'login'})
}

</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-item">
    <h2 class="is-size-4">Vue List Of Posts</h2>
  </div>
  <div class="navbar-end">
    <div class="navbar-item">
      <div class="buttons">
        <div class="mr-5 mb-2">
          <p>{{`User: ${modelo?.name}`}}</p>
        </div>

        <a @click="handleLogout" class="button is-light"> Logout </a>
      </div>
    </div>
  </div>
</nav>
</template>

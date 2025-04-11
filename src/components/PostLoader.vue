<script lang="ts">
import AppLoader from './AppLoader.vue'

export default {
  name: 'PostLoader',
  components: {
    AppLoader,
  }
}
</script>

<template>
  <div className="is-flex is-justify-content-center is-align-items-center mt-2">
    <AppLoader />
  </div>
</template>

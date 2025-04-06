<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  mounted() {
    const storageValue = localStorage.getItem('user');
    const user = storageValue && JSON.parse(storageValue);

    if (!user) {
      this.$router.push('./login');
    } else {
      this.$router.push('./');
    }
  }
});
</script>

<template>
  <RouterView />
</template>

<script setup>
defineProps({
  msg: String,
})
</script>

<template>
  <div class="hello">
    <h2>
      {{ msg }}
    </h2>
  </div>
</template>

<style scoped>
.hello {
  text-align: center;
}
</style>
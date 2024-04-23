<script>
  import LoaderSpiner from '@/components/LoaderSpiner.vue';

  export default {
    name: 'PostLoader',
    components: {
      LoaderSpiner,
    },
  }
</script>

<template>
  <div class="is-flex is-justify-content-center is-align-items-center mt-2">
    <LoaderSpiner />
  </div>
</template>

<style>
</style>
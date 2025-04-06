<script lang="ts">
import { defineComponent } from 'vue';
import CircleLoader from './CircleLoader.vue';

export default defineComponent({
  components: {
    CircleLoader
  }
});
</script>

<template>
  <div class="is-flex is-justify-content-center is-align-items-center mt-2">
    <CircleLoader />
  </div>
</template>

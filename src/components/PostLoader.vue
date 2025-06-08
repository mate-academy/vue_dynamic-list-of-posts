<script>
import Loader from './Loader.vue';

export default {
  name: 'PostLoader',
  components: {
    Loader,
  },
  props: {
    size: {
      type: String,
      default: 'medium', // можна також "small" або "large"
    },
    centered: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<template>
  <div
    :class="[
      'mt-2',
      { 'is-flex is-justify-content-center is-align-items-center': !centered },
    ]"
  >
    <Loader :size="size" :centered="centered" class="mt-2" />
  </div>
</template>

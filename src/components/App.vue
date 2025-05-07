<script>
import { RouterView } from "vue-router";
import Loader from "./loader/Loader.vue";


export default {
  components: {
    Loader,
  },
  data() {
    return {
      isGlobalLoading: false,
    };
  },
  methods: {
    showGlobalLoader() {
      this.isGlobalLoading = true;
    },
    hideGlobalLoader() {
      this.isGlobalLoading = false;
    },
  },
};
</script>

<template>
  <div v-if="isGlobalLoading" class="global-loader">
    <Loader />
  </div>
  <RouterView />
</template>

<style>
.global-loader {
  position: fixed;
  top: -10%;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>

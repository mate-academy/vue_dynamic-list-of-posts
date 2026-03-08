<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<template>
  <div class="column Sidebar">
    <div class="box Sidebar__inner">
      <slot></slot>
    </div>
  </div>
</template>

<style src="./Sidebar.css" />

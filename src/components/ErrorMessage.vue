<template>
  <p className="help is-danger">
    <slot></slot>
  </p>
</template>
<script lang="ts">
export default {
  name: 'ErrorMessage',
}
</script>

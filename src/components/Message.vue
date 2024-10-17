<script>
export default {
  name: "Message",
};
</script>

<template>
  <article class="message is-danger">
    <div class="message-header">
      <slot name="head"></slot>
    </div>

    <div class="message-body">
      <slot></slot>
    </div>
  </article>
</template>
<style></style>

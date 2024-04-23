<script>
  export default {
    name: 'NoCommentsYet',
    props: {
      text: String,
    },
  }
</script>

<template>
  <div class="block">
    <p class="title is-4">{{ `No ${text} yet` }}</p>
  </div>
</template>
<script>
import PostDetails from './PostPreview.vue';

export default {
  name: "Sidebar",
  components: {
    PostDetails,
  },
}
</script>

<template>
<div class="tile is-parent is-8-desktop Sidebar Sidebar--open">
  <div class="tile is-child box is-success ">
    <div class="tile is-child box is-success ">
      <div class="content">
       <PostDetails />
      </div>
    </div>
  </div>
</div>
</template>
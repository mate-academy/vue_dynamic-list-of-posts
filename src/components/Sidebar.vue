<script setup>

import AddPost from './AddPost.vue';
const emit = defineEmits(['update', 'closeSidebar']);

const update = (postData) => {
  console.log('postData middleware', postData);
  emit('update', postData);
}

const closeSidebar = () => {
  emit('closeSidebar');
}
</script>

<template>

    <div class="tile is-parent is-8-desktop Sidebar Sidebar--open">
      <div class="tile is-child box is-success ">

        <div class="content">
          <AddPost @update="update($event)" @close-sidebar="closeSidebar" />
        </div>

      </div>
    </div>

 
</template>

<style scoped>

</style>
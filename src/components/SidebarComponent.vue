<script>
  export default {
    name: 'SidebarComponent',
    props: {
      active: Boolean,
    },
  }
</script>

<template>
  <div 
    class="tile is-parent is-8-desktop Sidebar" 
    :class="active ? 'Sidebar--open' : ''"
  >
    <div class="tile is-child box is-success ">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>

<template>
  <div class="tile is-parent is-8-desktop Sidebar">
    <div class="tile is-child box is-success">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .Sidebar {
    overflow: hidden;
    opacity: 0;
    transition-property: max-width, opacity;
    transition-duration: 0.5s;
    transition-timing-function: ease-in-out;
  }

  .Sidebar--open {
    opacity: 1;
  }

  @media (min-width: 769px) {
    .Sidebar {
      max-width: 0;
    }
  }

  @media (min-width: 769px) {
    .Sidebar--open {
      max-width: 50%;
    }
  }
</style>

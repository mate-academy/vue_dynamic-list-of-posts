<script>
export default {
  name: "Sidebar",
  props: {
    isSidebarOpen: Boolean,
  },
};
</script>

<template>
  <div
    :className="
      ('tile',
      'is-parent',
      'is-8-desktop',
      'Sidebar',
      { 'Sidebar--open': isSidebarOpen })
    "
  >
    <div className="tile is-child box is-success ">
      <div className="tile is-child box is-success ">
        <div className="content">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;

  @media (min-width: 769px) {
    max-width: 0;
  }
}

.Sidebar--open {
  opacity: 1;

  @media (min-width: 769px) {
    max-width: 50%;
  }
}
</style>

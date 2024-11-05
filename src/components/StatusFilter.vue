<script>
export default {
  props: { modelValue: String },
  emits: ['update:modelValue'],
}
</script>

<template>
  <nav class="filter" data-cy="Filter">
    <a
      href="#/"
      class="filter__link"
      :class="{ selected: modelValue === 'all' }"
      data-cy="FilterLinkAll"
      @click="$emit('update:modelValue', 'all')"
    >
      All
    </a>

    <a
      href="#/active"
      class="filter__link"
      :class="{ selected: modelValue === 'active' }"
      data-cy="FilterLinkActive"
      @click="$emit('update:modelValue', 'active')"
    >
      Active
    </a>

    <a
      href="#/completed"
      class="filter__link"
      :class="{ selected: modelValue === 'completed' }"
      data-cy="FilterLinkCompleted"
      @click="$emit('update:modelValue', 'completed')"
    >
      Completed
    </a>
  </nav>
</template>

<style></style>

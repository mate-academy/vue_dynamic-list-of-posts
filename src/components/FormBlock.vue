<script setup>
const emit = defineEmits(['closeSidebar', 'submit']);
defineProps({
  title: { type: String, default: '' },
});

const fillForm = (event) => {
  const eventFormData = new FormData(event.target);
  emit('submit', eventFormData);
};
</script>

<template>
  <div class="content">
    <h2>{{ title }}</h2>

    <form @submit.prevent="fillForm">
      <slot></slot>
      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Save</button>
        </div>

        <div class="control">
          <button type="reset" class="button is-link is-light" @click="emit('closeSidebar')">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>

<style></style>

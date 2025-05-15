<script setup>
const props = defineProps({ message: String })
// const emit = defineEmits('close')
</script>

<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head has-background-danger">
        <p class="modal-card-title">Error</p>
        <!-- <button class="delete" aria-label="close" @click="emit('close')"></button> -->
      </header>
      <section class="modal-card-body">
        {{ props.message }}
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <!-- <button class="button" @click="emit('close')">Close</button> -->
        </div>
      </footer>
    </div>
  </div>
</template>

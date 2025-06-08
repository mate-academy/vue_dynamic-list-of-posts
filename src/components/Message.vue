<script>
export default {
  name: 'Message',
  props: {
    type: {
      type: String,
      default: 'is-info', // інші варіанти: is-success, is-danger, is-warning
    },
    icon: {
      type: String,
      default: '', // Наприклад: "fas fa-check", "fas fa-exclamation-triangle"
    },
    autoClose: {
      type: Number,
      default: 0, // У мілісекундах. Якщо 0 — не закривається автоматично
    },
  },
  data() {
    return {
      isVisible: true,
    };
  },
  mounted() {
    if (this.autoClose > 0) {
      setTimeout(() => {
        this.isVisible = false;
      }, this.autoClose);
    }
  },
  methods: {
    close() {
      this.isVisible = false;
    },
  },
};
</script>

<template>
  <article v-if="isVisible" class="message" :class="type">
    <div class="message-header">
      <span v-if="icon">
        <i :class="icon" style="margin-right: 8px"></i>
      </span>

      <slot name="head">Message</slot>

      <button class="delete" aria-label="delete" @click="close"></button>
    </div>

    <div class="message-body">
      <slot></slot>
    </div>
  </article>
</template>

<style scoped></style>

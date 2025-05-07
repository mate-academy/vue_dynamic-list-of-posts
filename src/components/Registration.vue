<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    emits: ['changeNameHandler'],
  })
</script>

<template>
  <div class="field">
    <label class="label" for="user-name"> Your Name </label>

    <div class="control has-icons-left">
      <input
        type="text"
        id="user-name"
        name="name"
        class="input"
        placeholder="Enter your name"
        required
        @input="$emit('changeNameHandler', $event)"
      />

      <span class="icon is-small is-left">
      <i class="fas fa-user" />
    </span>
    </div>
  </div>
</template>

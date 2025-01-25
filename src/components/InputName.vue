<script setup>
import { ref } from "vue";

const { errorMessage } = defineProps({
  errorMessage: String,
});
const emit = defineEmits(["name"]);
const name = ref("");

const handleInput = () => {
  emit("name", name.value);
};
</script>

<template>
  <div class="field">
    <label class="label" htmlFor="user-name"> Your Name </label>

    <div class="control has-icons-left">
      <input
        v-model="name"
        @input="handleInput"
        type="text"
        id="user-name"
        name="name"
        class="input"
        :class="{'is-danger': errorMessage}"
        placeholder="Enter your name"
      />

      <span class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>
    </div>

    <p v-if="errorMessage" class="help is-danger">{{ errorMessage }}</p>
  </div>
</template>

<style></style>

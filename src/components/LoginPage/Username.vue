<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{ username: string }>();
const emit = defineEmits(["onChange"]);

const localUsername = ref(props.username);

watch(
  () => props.username,
  (newUsername) => {
    localUsername.value = newUsername;
  }
);

const onUsernameChange = () => {
  emit("onChange", localUsername.value);
};
</script>

<template>
  <div class="field">
    <label class="label" for="user-name">Your Name</label>
    <div class="control has-icons-left">
      <input
        type="text"
        id="user-name"
        name="name"
        class="input"
        placeholder="Enter your name"
        required
        v-model="localUsername"
        @change="onUsernameChange"
        minlength="4"
      /><span class="icon is-small is-left"><i class="fas fa-user"></i></span>
    </div>
  </div>
</template>

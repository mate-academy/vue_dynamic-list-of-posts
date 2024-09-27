<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{ email: string; disable: boolean }>();
const emit = defineEmits(["onChange"]);

const localEmail = ref(props.email);

watch(
  () => props.email,
  (newEmail) => {
    localEmail.value = newEmail;
  }
);

const onEmailChange = () => {
  emit("onChange", localEmail.value);
};
</script>

<template>
  <div class="field">
    <label class="label" for="user-email">Email</label>
    <div class="control has-icons-left">
      <input
        type="email"
        id="user-email"
        name="email"
        class="input"
        placeholder="Enter your email"
        v-model="localEmail"
        @change="onEmailChange"
        :disabled="!disable"
        required
      />
    </div>
  </div>
</template>

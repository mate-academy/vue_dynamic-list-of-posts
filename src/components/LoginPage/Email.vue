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
      <span class="icon is-small is-left">
        <i class="fas fa-envelope" />
      </span>
    </div>
  </div>
</template>

<style>
.fa-envelope::before {
  content: "📩";
}
*,
::before,
::after {
  box-sizing: inherit;
}
.fas,
.fa-solid {
  font-weight: 900;
}
.fas,
.fa-classic,
.fa-solid,
.far,
.fa-regular {
  font-family: "Font Awesome 6 Free";
}
.fa,
.fa-classic,
.fa-sharp,
.fas,
.fa-solid,
.far,
.fa-regular,
.fab,
.fa-brands {
  font-style: normal;
  font-variant: normal;
  line-height: 1;
  text-rendering: auto;
}
</style>

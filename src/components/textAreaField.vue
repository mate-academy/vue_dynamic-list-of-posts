<script setup>
import { ref } from "vue";

const props = defineProps({
  label: String,
  placeholder: String,
  modelValue: String,
  errorMessage: String,
});

const emit = defineEmits(["update:modelValue"]);

const updateValue = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>

<template>
  <div class="field" data-cy="BodyField">
    <label class="label" htmlFor="{`comment-${name}`}"> {{ label }} </label>
    <div class="control">
      <textarea
        id="{`comment-${name}`}"
        name="name"
        :placeholder="placeholder"
        :value="modelValue"
        @input="updateValue"
        class="textarea"
      ></textarea>
    </div>

    <p v-if="errorMessage" class="help is-danger" data-cy="ErrorMessage">
      {{ errorMessage }}
    </p>
  </div>
</template>

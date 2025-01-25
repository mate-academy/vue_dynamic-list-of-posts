<script setup>
const props = defineProps({
  name: String,
  placeholder: String,
  modelValue: String,
  error: String,
});
const emit = defineEmits(["update:modelValue", "clearErrors"]);

const handleInput = (e) => {
  emit("update:modelValue", e.target.value);
  emit('clearErrors');
};
const nameForLabel = props.name.split(" ").slice(-1).join("").toLowerCase();
</script>

<template>
  <div class="field" data-cy="NameField">
    <label class="label" :for="'comment-author-name-' + nameForLabel">
      {{ name }}
    </label>
    <div class="control has-icons-left has-icons-right">
      <input
        type="text"
        :name="nameForLabel"
        :id="'comment-author-name-' + nameForLabel"
        :value="modelValue"
        :placeholder="placeholder"
        class="input"
        :class="{ 'is-danger': error }"
        @input="handleInput"
      />
      <span class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>

      <span
        v-if="error"
        class="icon is-small is-right has-text-danger"
        data-cy="ErrorIcon"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p v-if="error" class="help is-danger" data-cy="ErrorMessage">
      {{ error }}
    </p>
  </div>
</template>

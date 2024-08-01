<script>
export default {
  name: "InputField",
  emits: ["update:modelValue"],
  props: {
    modelValue: String,
    error: String,
    name: String,
    clearErrorByField: Function,
  },
  methods: {
    handleInputChange(event) {
      this.$emit("update:modelValue", event.target.value);
      this.clearErrorByField(this.name);
    },
  },
};
</script>

<template>
  <div class="field" data-cy="NameField">
    <label class="label" :for="`comment-author-name-${name}`">
      {{ name.charAt(0).toUpperCase() + name.slice(1) }}
    </label>
    <div class="control has-icons-left has-icons-right">
      <input
        type="text"
        :name="name"
        :id="`comment-author-name-${name}`"
        placeholder="Post title"
        class="input"
        :class="error.length ? 'is-danger' : ''"
        @change="handleInputChange"
      />
      <span class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>

      <span
        v-if="error.length"
        class="icon is-small is-right has-text-danger"
        data-cy="ErrorIcon"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p v-if="error.length" class="help is-danger" data-cy="ErrorMessage">
      {{ error }}
    </p>
  </div>
</template>

<script>
export default {
  name: "TextAreaField",
  emits: ["update:modelValue"],
  props: {
    modelValue: String,
    error: String,
    name: String,
    clearErrorByField: Function,
  },
  methods: {
    handleChange(event) {
      this.$emit("update:modelValue", event.target.value);
      this.clearErrorByField(this.name);
    },
  },
};
</script>

<template>
  <div class="field" data-cy="BodyField">
    <label class="label" :for="`comment-${name}`"> Write Post Body </label>
    <div class="control">
      <textarea
        :id="`comment-${name}`"
        name="name"
        placeholder="Post body"
        class="textarea"
        :class="error.length ? 'is-danger' : ''"
        @change="handleChange"
      ></textarea>
    </div>

    <p v-if="error.length" class="help is-danger" data-cy="ErrorMessage">
      {{ error }}
    </p>
  </div>
</template>

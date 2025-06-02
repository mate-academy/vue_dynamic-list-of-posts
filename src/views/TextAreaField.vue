<template>
  <div class="field" :data-cy="dataCy">
    <label class="label" :for="'comment-' + name">
      {{ title }}
    </label>
    <div class="control">
      <textarea
        :id="'comment-' + name"
        :name="name"
        :placeholder="placeholder"
        class="textarea"
        :class="{ 'is-danger': hasError }"
        v-model="inputValue"
      />
    </div>
    <p v-if="hasError" class="help is-danger" :data-cy="errorMessageCy">
      {{ errorText }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    name: String,
    placeholder: String,
    hasError: Boolean,
    errorText: String,
    dataCy: String,
    errorMessageCy: String,
    modelValue: String,
  },
  emits: ['update:modelValue'],
  computed: {
    inputValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
};
</script>

<style scoped>
.field {
  margin-bottom: 15px;
}
</style>

<template>
  <div class="field" :data-cy="dataCy">
    <label class="label" :for="'comment-author-name-' + name">
      {{ title }}
    </label>
    <div class="control has-icons-left has-icons-right">
      <input
        type="text"
        :name="name"
        :id="'comment-author-name-' + name"
        :placeholder="placeholder"
        class="input"
        :class="{ 'is-danger': hasError }"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <span class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>
      <span
        v-if="hasError"
        class="icon is-small is-right has-text-danger"
        :data-cy="errorIconCy"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>
    <p v-if="hasError" class="help is-danger" :data-cy="errorMessageCy">
      {{ errorText }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: String,
    title: String,
    name: String,
    placeholder: String,
    hasError: Boolean,
    errorText: String,
    dataCy: String,
    errorIconCy: String,
    errorMessageCy: String,
  },
};
</script>

<style scoped>
.field {
  margin-bottom: 15px;
}
</style>

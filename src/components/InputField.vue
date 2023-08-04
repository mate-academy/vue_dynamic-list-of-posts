<script>
  export default {
    name: 'InputField',
    props: {
      modelValue: String,
      type: String,
      name: String,
      placeholder: String,
      textError: String,
    },
    emits: ['update:modelValue'],
  }
</script>

<template>
  <div class="field" data-cy="NameField">
    <label class="label" htmlFor="{`comment-author-name-${name}`}">
      {{ name }}
    </label>

    <div class="control has-icons-left has-icons-right">
      <input
        :type="type"
        :name="name"
        id="{`comment-author-name-${name}`}"
        :placeholder="placeholder"
        class="input"
        :class="{ 'is-danger': false }"
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
      />

      <span class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>

      <span
        v-if="textError"
        class="icon is-small is-right has-text-danger"
        data-cy="ErrorIcon"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p
      v-if="textError"
      class="help is-danger"
      data-cy="ErrorMessage"
    >
      {{ textError }}
    </p>
  </div>
</template>
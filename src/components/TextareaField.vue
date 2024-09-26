<script>
  export default {
    name: 'TextareaField',
    props: {
      modelValue: String,
      name: String,
      placeholder: String,
      textError: String,
    },
    emits: ['update:modelValue'],
  }
</script>

<template>
  <div class="field" data-cy="BodyField">
    <label class="label" htmlFor="{`comment-${name}`}"> {{ name }} </label>

    <div class="control">
      <textarea
        id="{`comment-${name}`}"
        :name="name"
        :placeholder="placeholder"
        class="textarea"
        :class="{ 'is-danger': false }"
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
      ></textarea>
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
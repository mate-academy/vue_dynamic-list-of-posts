<script>
export default {
  name: 'TextAreaField',
  props: {
    modelValue: String,
    havingErrors: Boolean,
  },
  emits: ['update:modelValue'],
}
</script>

<template>
  <div class="field" data-cy="BodyField">
    <label class="label" htmlFor="{`comment-${name}`}"> Write Post Body </label>
    <div class="control">
      <textarea
        id="{`comment-${name}`}"
        name="name"
        placeholder="Post body"
        class="textarea"
        :class="{ 'is-danger': havingErrors }"
        @input="$emit('update:modelValue', $event.target.value)"
        :value="modelValue"
      ></textarea>
    </div>

    <p 
      v-if="havingErrors"
      class="help is-danger" 
      data-cy="ErrorMessage"
    >
      Body is required
    </p>
  </div>
</template>

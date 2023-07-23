<script>
export default {
  name: 'InputField',
  props: {
    type: 'text',
    label: String,
    modelValue: String,
    havingErrors: Boolean,
  },
  emits: ['update:modelValue'],
}
</script>


<template>
  <div class="field" data-cy="NameField">

    <label class="label" htmlFor="{`comment-author-name-${name}`}">
      {{ label }}
    </label>

    <div class="control has-icons-left has-icons-right">
      <input
        :type="type"
        name="{name}"
        id="{`comment-author-name-${name}`}"
        placeholder="Post title"
        class="input"
        :class="{ 'is-danger': havingErrors }"
        @input="$emit('update:modelValue', $event.target.value)"
        :value="modelValue"
      />
      
      <span class="icon is-small is-left">
        <i 
          class="fas fa-user" 
          :class="{ 'fa-envelope': type !== 'text', 'fa-heading': type === 'text' }"
        ></i>
      </span>

      <span v-if="havingErrors"
        class="icon is-small is-right has-text-danger"
        data-cy="ErrorIcon"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p 
      v-if="havingErrors"
      class="help is-danger" 
      data-cy="ErrorMessage"
    >
      Title is required
    </p>
  </div>
</template>
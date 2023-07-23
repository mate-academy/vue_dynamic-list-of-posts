<script>
export default {
  name: 'InputField',
  props: {
    modelValue: String,
    havingErrors: Boolean,
  },
  emits: ['update:modelValue'],

  mounted() {
    console.log(this.modelValue);
  },
}
</script>


<template>
  <div class="field" data-cy="NameField">

    <label class="label" htmlFor="{`comment-author-name-${name}`}">
      Title
    </label>

    <div class="control has-icons-left has-icons-right">
      <input
        type="text"
        name="{name}"
        id="{`comment-author-name-${name}`}"
        placeholder="Post title"
        class="input"
        :class="{ 'is-danger': havingErrors }"
        @input="$emit('update:modelValue', $event.target.value)"
        :value="modelValue"
      />
      
      <span class="icon is-small is-left">
        <i class="fas fa-user fa-heading"></i>
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
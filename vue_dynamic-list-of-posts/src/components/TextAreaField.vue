<script setup>
defineProps({
  title: String,
  placeholder: String,
  modelValue: String,
  error: String,
  label: String
});

const emit = defineEmits(['update:modelValue']);

const updateValue = event => {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="field" data-cy="BodyField">
  <label class="label" for="name"> {{ label }} </label>
  <div class="control">
    <textarea
      id="{`comment-${name}`}"
      name="name"
      :value="modelValue"
      @input="updateValue"
      :placeholder="placeholder"
      class="textarea"
      :class="{'is-danger': error}"
    ></textarea>
  </div>

  <p class="help" :class="{'is-danger': error}" data-cy="ErrorMessage">{{ error }}</p>
</div>
</template>
<script lang="ts">
import type { Icon } from '@/enums';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    error: Boolean,
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
    errorMessage: {
      type: String,
      required: true,
    },
    icon: {
      type: String as PropType<Icon>,
      required: true,
    }
  },
  emits: ['update:modelValue'],
});
</script>

<template>
  <div class="field" data-cy="NameField">
    <label class="label" :htmlFor="`comment-author-name-${name}`">
      {{label}}
    </label>

    <div class="control has-icons-left has-icons-right">
      <input
        type="text"
        :name="name"
        :id="`comment-author-name-${name}`"
        :placeholder="placeholder"
        class="input"
        :class="{'is-danger': error}"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />

      <span class="icon is-small is-left">
        <i class="fas" :class="icon"></i>
      </span>

      <span
        v-if="error"
        class="icon is-small is-right has-text-danger"
        data-cy="ErrorIcon"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p v-if="error" class="help is-danger" data-cy="ErrorMessage">{{errorMessage}}</p>
  </div>
</template>

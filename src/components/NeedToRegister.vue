<script lang="ts">
import { LoadingStatus } from '@/enums';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    loadingStatus: {
      type: String as PropType<LoadingStatus>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup() {
    return { LoadingStatus };
  },
});
</script>

<template>
  <div class="field">
    <label class="label" htmlFor="user-name"> Your Name </label>

    <div class="control has-icons-left" :class="{'is-loading': loadingStatus === LoadingStatus.Loading}">
      <input
        type="text"
        id="user-name"
        name="name"
        class="input"
        placeholder="Enter your name"
        required
        :minlength=4
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />

      <span class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>
    </div>

    <p v-if="loadingStatus === LoadingStatus.Error" class="help is-danger">Something went wrong!</p>
  </div>
</template>

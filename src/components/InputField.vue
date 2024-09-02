<script>
export default {
    name: 'InputField',
    props: ['modelValue', 'title', 'name', 'errorText', 'placeholder', 'icon'],
    emits: ['update:modelValue']
}
</script>

<template>
    <div class="field" data-cy="NameField">
        <label class="label" :for="`comment-author-name-${name}`">
          {{ title }}
        </label>
        <div class="control has-icons-left has-icons-right">
          <input
            type="text"
            :name="name"
            :id="`comment-author-name-${name}`"
            :placeholder="placeholder"
            class="input"
            :class="{'is-danger': errorText}"
            :value="modelValue"
            @input="this.$emit('update:modelValue', $event.target.value)"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user" :class="icon ? icon : 'fa-heading'"></i>
          </span>

          <span
            v-if="errorText"
            class="icon is-small is-right"
            :class="{'has-text-danger': errorText}"
            data-cy="ErrorIcon"
          >
            <i class="fas fa-exclamation-triangle"></i>
          </span>
        </div>

        <p class="help is-danger" data-cy="ErrorMessage">{{ errorText }}</p>
    </div>
</template>

<style>
    .fa-user {
        display: block;
        width: 16px;
        height: 16px;
    }
</style>
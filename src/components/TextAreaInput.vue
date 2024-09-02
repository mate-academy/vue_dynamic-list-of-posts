<script>
export default {
    name: 'TextAreaInput',
    props: ['modelValue', 'title', 'name', 'errorText', 'placeholder'],
    emits: ['update:modelValue']
}
</script>

<template>
    <div class="field" data-cy="BodyField">
        <label class="label" :for="`comment-${name}`"> {{ title }} </label>
        <div class="control">
          <textarea
            :id="`comment-${name}`"
            :name="name"
            :placeholder="placeholder"
            class="textarea"
            :class="{'is-danger' : errorText}"
            :value="modelValue"
            @input="this.$emit('update:modelValue', $event.target.value)"
          ></textarea>
        </div>
    
        <p v-if="errorText" class="help" :class="{'is-danger': errorText}" data-cy="ErrorMessage">{{ errorText }}</p>
    </div>
</template>

<style>

</style>
<script setup>
const props = defineProps({
  name: String,
  placeholder: String,
  modelValue: String,
  error: String,
});

const emit = defineEmits(["update:modelValue", "clearErrors"]);

const handleInput = (e) => {
  emit("update:modelValue", e.target.value);
  emit('clearErrors');
};

const nameForLabel = props.name.split(" ").slice(-1).join("").toLowerCase();
</script>

<template>
  <div class="field" data-cy="BodyField">
    <label class="label" :for="'comment-author-name-' + nameForLabel">{{
      name
    }}</label>
    <div class="control">
      <textarea
        :name="nameForLabel"
        :id="'comment-author-name-' + nameForLabel"
        :value="modelValue"
        :placeholder="placeholder"
        class="textarea"
        :class="{'is-danger': error}"
        @input="handleInput"
      ></textarea>
    </div>

    <p v-if="error" class="help is-danger" data-cy="ErrorMessage">{{error}}</p>
  </div>
</template>

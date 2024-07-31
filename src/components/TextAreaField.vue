<script>
export default {
  name: "TextAreaField",
  emits: ["update:modelValue"],
  props: {
    modelValue: String,
  },
};
</script>

<template>
  <div class="field" data-cy="BodyField">
    <label class="label" htmlFor="{`comment-${name}`}"> Write Post Body </label>
    <div class="control">
      <textarea
        id="{`comment-${name}`}"
        name="name"
        placeholder="Post body"
        class="textarea is-danger"
        @change="(event) => $emit('update:modelValue', event.target.value)"
      ></textarea>
    </div>

    <p class="help is-danger" data-cy="ErrorMessage">error text</p>
  </div>
</template>

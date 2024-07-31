<script>
export default {
  name: "TextAreaField",
};
</script>

<template>
  <div class="field" data-cy="BodyField">
    <label class="label" htmlFor="{`comment-${name}`}"> title </label>
    <div class="control">
      <textarea
        id="{`comment-${name}`}"
        name="name"
        placeholder="{placeholder}"
        class="textarea is-danger"
      ></textarea>
    </div>

    <p class="help is-danger" data-cy="ErrorMessage">error text</p>
  </div>
</template>

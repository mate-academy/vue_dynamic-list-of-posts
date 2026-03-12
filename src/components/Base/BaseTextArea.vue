<script></script>

<template>
  <div class="field" data-cy="BodyField">
    <label class="label" :for="`comment-${name}`"> {{ title }} </label>
    <div class="control">
      <textarea
        :id="`comment-${name}`"
        :name="name"
        :placeholder="placeholder"
        class="textarea is-danger"
      ></textarea>
    </div>

    <p class="help is-danger" data-cy="ErrorMessage">{{ errorText }}</p>
  </div>
</template>

<style></style>

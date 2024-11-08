<script setup>
defineProps({
  label: String,
  error: String,
  name: String,
})
</script>
<template>
  <div class="field">
  <label class="label" :for="name">{{label}}</label>
  <div class="control">
    <textarea
      :id="name"
      :name="name"
      placeholder=""
      class="textarea"
      :class="{'is-danger': error}"
    ></textarea>
  </div>

  <p v-if="error" class="help is-danger">{{error}}</p>
</div>

</template>
<style scope></style>
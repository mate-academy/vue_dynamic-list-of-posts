<template>
  <div class="field">
    <label class="label" :htmlFor="inputId"> {{ inputLabel }} </label>
    <div class="control">
      <textarea
        :id="inputId"
        :name="inputName"
        :placeholder="inputPlaceholder"
        class="textarea"
        :class="{ 'is-danger': errorMessage }"
        :value="body"
        @input="handleUpdateInput($event.target.value)"
      ></textarea>
    </div>

    <p v-if="errorMessage" class="help is-danger">{{ errorMessage }}</p>
  </div>
</template>
<script>
export default {
  name: 'BodyField',
  props: {
    errorMessage: String,
    body: String,
    inputLabel: String,
    inputId: String,
    inputType: String,
    inputName: String,
    inputPlaceholder: String
  },
  methods: {
    handleUpdateInput(value) {
      this.$emit('update:body', value);
      if (value.trim()) {
        this.$emit('update:errorMessage', '');
      }
    }
  }
};
</script>

<script setup>
const props = defineProps({
  errorMessages: {
    type: String,
    required: false
  }
})


const modelo = defineModel()

</script>

<template>
  <div class="field">
  <label class="label" :for="`user-name`"> Your Name </label>

  <div class="control has-icons-left">
    <input
      type="text"
      id="user-name"
      name="name"
      class="input"
      placeholder="Enter your name"
      required
      :minlength="4"
      v-model="modelo"
    />

    <span class="icon is-small is-left">
      <i class="fas fa-user" />
    </span>
  </div>

  <p class="help is-danger" v-if="erroMessages">{{ erroMessages }}</p>
</div>

</template>
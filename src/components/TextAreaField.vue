<script>
export default {
  name: "TextAreaField",
  props: {
    bodyError: String,
    bodyName: String,
    modelValue: String,
    userName: String,
  },
  data() {
    return {
      bodyLabel: "",
      bodyPlaceholder: "",
      internalValue: this.modelValue,
    };
  },
  emits: ["update:modelValue"],
  watch: {
    modelValue(newVal) {
      this.internalValue = newVal;
    },
    internalValue(newVal) {
      this.$emit("update:modelValue", newVal);
    },
  },
  mounted() {
    switch (this.bodyName) {
      case "postBody":
        this.bodyLabel = "Write Post Body";
        this.bodyPlaceholder = "Post Body";
        break;
      case "commentBody":
        this.bodyLabel = "Write Comment";
        this.bodyPlaceholder = "Comment";
        break;
      default:
        break;
    }
  },
};
</script>

<template>
  <div class="field" data-cy="BodyField">
    <label class="label" :for="`comment-${userName}`">
      {{ bodyLabel }}
    </label>

    <div class="control">
      <textarea
        v-model="internalValue"
        :id="`comment-${userName}`"
        :name="userName"
        :placeholder="bodyPlaceholder"
        class="textarea"
        :class="{ 'is-danger': bodyError.length }"
      />
    </div>

    <p v-if="bodyError.length" class="help is-danger" data-cy="ErrorMessage">
      {{ bodyError }}
    </p>
  </div>
</template>

<style></style>
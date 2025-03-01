<script>
export default {
  name: "InputTitleField",
  props: {
    inputError: String,
    inputName: String,
    modelValue: String,
    userName: String,
  },
  data() {
    return {
      inputLabel: "",
      inputType: "",
      inputPlaceholder: "",
      inputIcon: "",
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
    switch (this.inputName) {
      case "postTitle":
        this.inputLabel = "Title";
        this.inputType = "text";
        this.inputPlaceholder = "Post Title";
        this.inputIcon = "fa-user";
        break;
      case "commentAuthor":
        this.inputLabel = "Author Name";
        this.inputType = "text";
        this.inputPlaceholder = "Name Surname";
        this.inputIcon = "fa-user";
        break;
      case "commentEmail":
        this.inputLabel = "Author Email";
        this.inputType = "email";
        this.inputPlaceholder = "Your Email";
        this.inputIcon = "fa-envelope";
        break;
      default:
        break;
    }
  },
};
</script>

<template>
  <div class="field" data-cy="NameField">
    <label class="label" :for="`comment-author-name-${userName}`">
      {{ inputLabel }}
    </label>

    <div class="control has-icons-left has-icons-right">
      <input
        v-model="internalValue"
        :type="inputType"
        :name="userName"
        :id="`comment-author-name-${userName}`"
        :placeholder="inputPlaceholder"
        class="input"
        :class="{ 'is-danger': inputError.length }"
      />
      <span class="icon is-small is-left">
        <i class="fas" :class="inputIcon"></i>
      </span>

      <span
        v-if="inputError.length"
        class="icon is-small is-right has-text-danger"
        data-cy="ErrorIcon"
      >
        <i class="fas fa-exclamation-triangle" />
      </span>
    </div>

    <p v-if="inputError.length" class="help is-danger" data-cy="ErrorMessage">
      {{ inputError }}
    </p>
  </div>
</template>

<style></style>
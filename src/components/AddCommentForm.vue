<script>
import { addComment } from "@/api/comments";
import InputField from "./InputField.vue";
import TextAreaField from "./TextAreaField.vue";
export default {
  name: "AddCommentForm",
  components: {
    InputField,
    TextAreaField,
  },
  props: {
    postId: Number,
  },
  data() {
    return {
      inputName: "",
      inputNameError: "",
      inputEmail: "",
      inputEmailError: "",
      body: "",
      bodyError: "",
      isLoadingSubmit: false,
      userName: "",
    };
  },
  emits: ["closeCommentForm", "addComment"],
  watch: {
    inputName() {
      this.inputNameError = "";
    },
    inputEmail() {
      this.inputEmailError = "";
    },
    body() {
      this.bodyError = "";
    },
  },
  mounted() {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser) {
      this.userName = currentUser.name;
    }
  },
  methods: {
    handleSubmit() {
      const postId = this.postId;
      const name = this.inputName.trim();
      const email = this.inputEmail.trim();
      const body = this.body.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!name.length) {
        this.inputNameError = "Name can't be empty";
      }
      if (name.length > 33) {
        this.inputEmailError = "Max length of name is 33 symbols";
      }
      if (!emailRegex.test(email)) {
        this.inputEmailError = "You must use correct email";
      }
      if (!body.length) {
        this.bodyError = "Body can't be empty";
      }
      if (
        this.inputNameError.length ||
        this.inputEmailError.length ||
        this.bodyError.length
      ) {
        return;
      }
      this.isLoadingSubmit = true;
      addComment({ postId, name, email, body })
        .then(({ data }) => {
          this.$emit("addComment", data);
          this.body = "";
        })
        .catch((error) => {
          throw new Error(error);
        })
        .finally(() => {
          this.isLoadingSubmit = false;
        });
    },
  },
};
</script>

<template>
  <form @submit.prevent="handleSubmit" novalidate>
    <InputField
      v-model="inputName"
      :inputError="inputNameError"
      :inputName="'commentAuthor'"
      :userName="userName"
    />

    <InputField
      v-model="inputEmail"
      :inputError="inputEmailError"
      :inputName="'commentEmail'"
      :userName="userName"
    />

    <TextAreaField
      v-model="body"
      :bodyError="bodyError"
      :bodyName="'commentBody'"
      :userName="userName"
    />

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': isLoadingSubmit }"
        >
          Add comment
        </button>
      </div>
      <div class="control" @click="$emit('closeCommentForm')">
        <button type="reset" class="button is-link is-light">Cancel</button>
      </div>
    </div>
  </form>
</template>

<style></style>
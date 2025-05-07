<script>
export default {
  name: "addComment",
  data() {
    return {
      form: {
        name: "",
        email: "",
        body: "",
      },
    };
  },
  methods: {
    submitComment() {
      if (this.form.name && this.form.email && this.form.body) {
        this.$emit("submit-comment", { ...this.form });
        this.form = { name: "", email: "", body: "" };
      } else {
        alert("Заполните все поля перед отправкой!");
      }
    },
    resetForm() {
      this.form = { name: "", email: "", body: "" };
      this.$emit("cancel-comment");
    },
  },
};
</script>

<template>
  <form @submit.prevent="submitComment">
    <div class="field">
      <label class="label">Author Name</label>
      <input
        type="text"
        v-model="form.name"
        class="input"
        placeholder="Name Surname"
      />
    </div>
    <div class="field">
      <label class="label">Author Email</label>
      <input
        type="email"
        v-model="form.email"
        class="input"
        placeholder="Your Email"
      />
    </div>
    <div class="field">
      <label class="label">Comment Body</label>
      <textarea
        v-model="form.body"
        class="textarea"
        placeholder="Your comment"
      ></textarea>
    </div>
    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link">Add Comment</button>
      </div>
      <div class="control">
        <button
          type="button"
          class="button is-link is-light"
          @click="resetForm"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>

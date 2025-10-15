<script>
export default {
  data() {
    return {
      newName: "",
      newEmail: "",
      newBody: "",
      errors: {},
      emailPattern: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
      submitted: false,
      submitError: "",
      isLoading: false,
    }
  },
  emits: ['add', 'close'],
  methods: {
    clearError(field) {
      if(this.errors[field]) {
        delete this.errors[field];
      }
    },
    validateForm() {
      const newErrors = {};

      if(!this.newName.trim()) {
        newErrors.name = "Name is required!"
      }

      if (!this.newEmail.trim()) {
        newErrors.email = "Email is required!";
      } else if (!this.emailPattern.test(this.newEmail.trim())) {
        newErrors.email = "Email is not valid!";
      }

      if (!this.newBody.trim()) {
        newErrors.body = "Comment is required!";
      }

      this.errors = newErrors;
      this.submitError = Object.keys(newErrors).length > 0
        ? "Form contains errors. Please fix them."
        : "";

      return Object.keys(newErrors).length === 0;
    },
    async add() {
      this.submitted = true;
      if (!this.validateForm()) {
        return;
      }

      try {
        this.isLoading = true;

        await new Promise(resolve => setTimeout(resolve, 1000));

        this.$emit("add", {
          name: this.newName.trim(),
          email: this.newEmail.trim(),
          body: this.newBody.trim(),
        });

        this.newBody = "";
        this.errors = {};
        this.submitError = "";
        this.submitted = false;
      } catch (e) {
        this.submitError = "Error submitting comment. Please try again.";
      } finally {
        this.isLoading = false;
      }
    },
    close() {
      this.newName = "";
      this.newEmail = "";
      this.newBody = "";
      this.errors = {};
      this.submitError = "";
      this.submitted = false;
      this.isLoading = false;
      this.$emit('close');
    },
    clearAll() {
      this.errors = {};
      this.submitError = "";
      this.submitted = false;
    }
  }
}
</script>

<template>
  <form @submit.prevent="add">
    <div v-if="submitError" class="notification is-danger">
      {{ submitError }}
      <button type="button" class="delete" @click="submitError = ''"></button>
    </div>

    <div class="field" data-cy="NameField">
      <label class="label" for="comment-author-name-name">Author Name</label>
      <div class="control has-icons-left has-icons-right">
        <input
          type="text"
          name="name"
          id="comment-author-name-name"
          placeholder="Name Surname"
          class="input"
          :class="{ 'is-danger': submitted && errors.name }"
          v-model="newName"
          @input="clearError('name')"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
      </div>
      <p class="help is-danger" v-if="submitted && errors.name">{{ errors.name }}</p>
    </div>

    <div class="field" data-cy="EmailField">
      <label class="label" for="comment-author-name-email">Author Email</label>
      <div class="control has-icons-left has-icons-right">
        <input
          type="text"
          name="email"
          id="comment-author-name-email"
          placeholder="Your Email"
          class="input"
          :class="{ 'is-danger': submitted && errors.email }"
          v-model="newEmail"
          @input="clearError('email')"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
      </div>
      <p class="help is-danger" v-if="submitted && errors.email">{{ errors.email }}</p>
    </div>

    <div class="field" data-cy="BodyField">
      <label class="label" for="comment-body">Write Post Body</label>
      <div class="control">
        <textarea
          id="comment-body"
          name="body"
          placeholder="Comment"
          class="textarea"
          :class="{ 'is-danger': submitted && errors.body }"
          v-model="newBody"
          @input="clearError('body')"
        ></textarea>
      </div>
      <p class="help is-danger" v-if="submitted && errors.body">{{ errors.body }}</p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link" :class="{ 'is-loading': isLoading }">
          Add Comment
        </button>
      </div>
      <div class="control">
        <button type="reset" class="button is-link is-light" @click="close">
          Cancel
        </button>
      </div>
      <div class="control">
        <button v-if="submitError" type="button" class="button is-danger is-light" @click="clearAll">
          Clear Errors
        </button>
      </div>
    </div>
  </form>
</template>

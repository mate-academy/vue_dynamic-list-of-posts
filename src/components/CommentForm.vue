<script>
const emailRegExp = new RegExp(/^\S+@\S+\.\S+$/);

export default {
  name: 'CommentForm',
  data() {
    return {
      isShowNameError: false,
      isShowEmailError: false,
      isShowBodyError: false,
      title: '',
      email: '',
      body: '',
    }
  },
  emits: ['closeForm', 'createComment'],
  methods: {
    setTitle(newTitle) {
      this.isShowNameError = false;
      this.title = newTitle.currentTarget.value;
    },
    setEmail(newEmail) {
      this.isShowEmailError = false;
      this.email = newEmail.currentTarget.value;
    },
    setBody(newBody) {
      this.isShowBodyError = false;
      this.body = newBody.currentTarget.value;
    },
    handleSubmit() {
      const normalizedName = this.title.trim();
      const normalizedEmail = this.email.trim();
      const normalizedBody = this.body.trim();

      if (!normalizedName) {
        this.isShowNameError = true;
      }

      if (!emailRegExp.test(normalizedEmail)) {
        this.isShowEmailError = true;
      }

      if (!normalizedBody) {
        this.isShowBodyError = true;
      }

      if (this.isShowNameError
        || this.isShowEmailError
        || this.isShowBodyError) {
        return;
      }

      this.$emit('createComment', {
        name: normalizedName,
        email: normalizedEmail,
        body: normalizedBody,
      });
    }
  }
}
</script>

<template>
  <div className="block">
    <div className="field" data-cy="NameField">
      <label className="label" htmlFor="{`comment-author-name-${name}`}">
        Author Name
      </label>
      
      <div className="control has-icons-left has-icons-right">
        <input
          type="text"
          name="{name}"
          id="{`comment-author-name-${name}`}"
          placeholder="Name Surname"
          class="input"
          :class="{ 'is-danger': isShowNameError }"
          :value="title"
          @input="setTitle"
        />
        <span className="icon is-small is-left">
          <i className="fas fa-user"></i>
        </span>

        <span
          className="icon is-small is-right has-text-danger"
          data-cy="ErrorIcon"
          v-if="isShowNameError"
        >
          <i className="fas fa-exclamation-triangle"></i>
        </span>
      </div>

      <p 
        className="help is-danger" 
        data-cy="ErrorMessage"
        v-if="isShowNameError"
      >
        Author name should be not empty
      </p>
    </div>

    <div className="field" data-cy="NameField">
      <label className="label" htmlFor="{`comment-author-name-${name}`}">
        Author Email
      </label>
      
      <div className="control has-icons-left has-icons-right">
        <input
          type="email"
          name="{name}"
          id="{`comment-author-name-${name}`}"
          placeholder="Your Email"
          class="input"
          :class="{ 'is-danger': isShowEmailError }"
          :value="email"
          @input="setEmail"
        />
        <span className="icon is-small is-left">
          <i className="fas fa-envelope"></i>
        </span>

        <span
          className="icon is-small is-right has-text-danger"
          data-cy="ErrorIcon"
          v-if="isShowEmailError"
        >
          <i className="fas fa-exclamation-triangle"></i>
        </span>
      </div>

      <p 
        className="help is-danger" 
        data-cy="ErrorMessage"
        v-if="isShowEmailError"
      >
        Author email is not valid (ex. example@mail.com)
      </p>
    </div>


    <div className="field" data-cy="BodyField">
      <label className="label" htmlFor="{`comment-${name}`}">
        Write Post Body
      </label>
      <div className="control">
        <textarea
          id="{`comment-${name}`}"
          name="name"
          placeholder="Post body"
          class="textarea"
          :class="{ 'is-danger': isShowBodyError }"
          :value="body"
          @input="setBody"
        ></textarea>
      </div>

      <p 
        className="help is-danger" 
        data-cy="ErrorMessage"
        v-if="isShowBodyError"
      >
        Body of the post should not be empty
      </p>
    </div>

    <div class="buttons">
      <button 
        type="button" 
        class="button is-link"
        @click="handleSubmit"
      >
        Add Comment
      </button>

      <button 
        type="button" 
        class="button is-link is-light"
        @click="this.$emit('closeForm')"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
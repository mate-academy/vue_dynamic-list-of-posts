<script>
export default {
  name: 'CommentForm',
  data() {
    return {
      name: '',
      email: '',
      body: '',
      nameError: false,
      emailError: false,
      bodyError: false,
    }
  },
  props: {
    loading: Boolean,
  },
  emits: ['close', 'addComment'],
  methods: {
    handleAddButton() {
      if (!this.name) {
        this.nameError = true;
      }
      const name = this.name;   
      if (!this.email || !this.email.includes('@')) {
        this.emailError = true;
      }
      const email = this.email;
      if (!this.body) {
        this.bodyError = true;
      }
      const body = this.body;

      if (this.nameError || this.emailError || this.bodyError) {
        return;
      }
      this.$emit('addComment', { name, email, body })
      this.body = '';
    }
  },
  watch: {
    name(newName, oldName) {
      if(newName !== oldName) {
        this.nameError = false;
      }
    },
    email(newEmail, oldEmail) {
      if(newEmail !== oldEmail) {
        this.emailError = false;
      }
    },
    body(newBody, oldBody) {
      if(newBody !== oldBody) {
        this.bodyError = false;
      }
    }
  }
}
</script>

<template>
  <div className="field" data-cy="NameField">
    <label className="label" htmlFor="{`comment-author-name-${name}`}">
      Author Name
    </label>
    <div className="control has-icons-left has-icons-right">
      <input type="text" :name="name" id="'{`comment-author-name-${name}`}" placeholder="Name Surname" class="input"
        :class="{ 'is-danger': nameError }" v-model.trim="name" />
      <span className="icon is-small is-left">
        <i className="fas fa-user"></i>
      </span>

      <span className="icon is-small is-right has-text-danger" data-cy="ErrorIcon" v-if="nameError">
        <i className="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p className="help is-danger" data-cy="ErrorMessage" v-if="nameError">Name is required</p>
  </div>

  <div className="field" data-cy="NameField">
    <label className="label" htmlFor="{`comment-author-email-${email}`}">
      Author Email
    </label>
    <div className="control has-icons-left has-icons-right">
      <input type="email" name="{email}" id="{`comment-author-email-${email`}" placeholder="Your email" class="input"
        :class="{ 'is-danger': emailError }" v-model.trim="email" />
      <span className="icon is-small is-left">
        <i className="fas fa-user fa-envelope"></i>
      </span>

      <span className="icon is-small is-right has-text-danger" data-cy="ErrorIcon" v-if="emailError">
        <i className="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p className="help is-danger" data-cy="ErrorMessage" v-if="emailError">Email is required</p>
  </div>

  <div class="field" data-cy="BodyField">
    <label class="label" for="comment-body">Write Comment Body</label>
    <div class="control">
      <textarea id="comment-body" name="body" placeholder="Post body" class="textarea"
        :class="{ 'is-danger': bodyError }" v-model.trim="body"></textarea>
    </div>
    <p className="help is-danger" data-cy="ErrorMessage" v-if="bodyError">Body is required</p>
  </div>

  <div class="field is-grouped">
    <div class="control">
      <button type="submit" class="button is-link" :class="{ 'is-loading': loading }" @click="handleAddButton">
        Add Comment
      </button>
    </div>
    <div class="control" @click="$emit('close')">
      <button type="reset" class="button is-link is-light">Cancel</button>
    </div>
  </div>
</template>
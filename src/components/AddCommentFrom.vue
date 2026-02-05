<script lang="ts">
export default {
  data() {
    return {
      errorName: '',
      errorEmail: '',
      errorBody: '',

      name: '',
      email: '',
      body: '',
    }
  },

  methods: {
    handleSubmit() {
      this.errorName = '';
      this.errorEmail = '';
      this.errorBody = '';

      if (!this.name.trim()) {
        this.errorName = 'Name is required';
      }

      if (!this.email.trim()) {
        this.errorEmail = 'Email is required';
      }

      if (!this.body.trim()) {
        this.errorBody = 'Body is required';
      }

      if (this.errorName || this.errorEmail || this.errorBody) {
        return;
      }

      this.$emit('comment-created', {
        name: this.name,
        email: this.email,
        body: this.body,
      });
    }
  }
}
</script>

<template>
  <form action="submit" @submit.prevent="handleSubmit">
    <div class="field">
      <label class="label" for="author_name">Author Name</label>
      <div class="control has-icons-left has-icons-right custom-input" :class="{ 'is-danger': errorName }">

        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>

        <span v-if="errorName" class="icon is-small is-right">
          <i class="fas fa-exclamation-triangle"></i>
        </span>

        <input class="input" type="text" id="author_name" placeholder="Your Name" v-on:input="errorName = ''"
          v-model="name" />
      </div>
      <span class="help is-danger">
        {{ errorName }}
      </span>
    </div>

    <div class="field">
      <label class="label" for="author_email">Author Email</label>
      <div class="control has-icons-left has-icons-right custom-input" :class="{ 'is-danger': errorEmail }">

        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>

        <span v-if="errorEmail" class="icon is-small is-right">
          <i class="fas fa-exclamation-triangle"></i>
        </span>

        <input class="input" type="text" id="author_email" placeholder="Your Email" v-on:input="errorEmail = ''"
          v-model="email" />
      </div>

      <span class="help is-danger">
        {{ errorEmail }}
      </span>
    </div>

    <div class="field">
      <label class="label" for="commnet_body">Write Post Body</label>
      <div class="control has-icons-left has-icons-right custom-input" :class="{ 'is-danger': errorBody }">
        <textarea class="textarea" type="text" id="commnet_body" placeholder="Comment" v-on:input="errorBody = ''"
          v-model="body"> </textarea>
      </div>

      <span class="help is-danger">
        {{ errorBody }}
      </span>
    </div>

    <div class="button_wrapper">
      <button class="btn btn-primary" type="submit">
        Add comment
      </button>

      <button class="btn btn-secondary" type="button" @click="$emit('close')">
        Cancel
      </button>
    </div>
  </form>
</template>

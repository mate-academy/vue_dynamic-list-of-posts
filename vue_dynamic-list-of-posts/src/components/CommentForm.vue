<script>
export default {
  name: 'CommentForm',
  props: {
    postId: Number,
  },
  emits: ['toggleForm', 'createComment'],
  data() {
    return {
      name: '',
      email: '',
      body: '',
      nameError: '',
      emailError: '',
      bodyError: '',
    }
  },
  methods: {
    validateForm() {
      let isError = false;
      this.titleError = '';
      this.bodyError = '';
  
      if (!this.name) {
        this.nameError = 'Title is required';
        isError = true;
      }

      if (!this.email) {
        this.emailError = 'Email is required';
        isError = true;
      } else if (!/\S+@\S+\.\S+/.test(this.email)) {
        this.emailError = 'Invalid email format';
        isError = true;
      }
      if (!this.body) {
        this.bodyError = 'Body is required';
        isError = true;
      }

      return isError;
    },
    addComment() {
      if(!this.validateForm()) {
        this.$emit('createComment', { name: this.name, email: this.email, body: this.body });
        this.clear();
      }
    },
    clear() {
      this.body = '';
      this.nameError = '';
      this.emailError = '';
      this.bodyError = '';
      this.$emit('toggleForm');
    }
  },
}
</script>

<template>
  <form @submit.prevent="addComment">
    <div class="field" data-cy="NameField">
      <label class="label" for="{`comment-author-name-${name}`}">
        Author Name
      </label>
      <div class="control has-icons-left has-icons-right">
        <input 
          type="text" 
          name="{name}" 
          id="{`comment-author-name-${name}`}" 
          placeholder="Your Name"
          :class="{'is-danger': nameError}"
          class="input" 
          v-model="this.name" 
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>

        <span v-if="nameError" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>

      <p v-if="nameError" class="help is-danger" data-cy="ErrorMessage">{{ nameError }}</p>
    </div>
    <div class="field" data-cy="NameField">
      <label class="label" for="{`comment-author-name-${name}`}">
        Author Email
      </label>
      <div class="control has-icons-left has-icons-right">
        <input 
          type="text" 
          name="{name}" 
          id="{`comment-author-name-${name}`}" 
          placeholder="Your email"
          :class="{'is-danger': emailError}"
          class="input" 
          v-model="this.email" 
        />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>

        <span v-if="emailError" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>

      <p v-if="emailError" class="help is-danger" data-cy="ErrorMessage">{{ emailError }}</p>
    </div>

    <div className="field" data-cy="BodyField">
      <label className="label" for="{`comment-${name}`}"> Write comment </label>
      <div className="control">
        <textarea 
          id="{`comment-${name}`}" 
          name="name" 
          placeholder="Comment" 
          :class="{'is-danger': bodyError}"
          class="textarea"
          v-model="this.body"
        ></textarea>
      </div>

      <p v-if="bodyError" class="help is-danger" data-cy="ErrorMessage">{{ bodyError }}</p>
    </div>
    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link">Save</button>
      </div>
      <div class="control">
        <button type="button" class="button is-link is-light" @click="clear">Cancel</button>
      </div>
    </div>
  </form>


</template>
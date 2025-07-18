<script>
export default {
  name: 'AddComment',
  data() {
    return {
      name: '',
      email: '',
      body: '',
      errorName: false,
      errorEmail: false,
      errorBody: false,
    }
  },
  props: {
    isWrited: Boolean,
    post: Object,
    close: Function,
    handleAdd: Function,
  },
  methods: {
    handleSubmit() {
      if (!this.name) {
        this.errorName = true
      }
      if (!this.email) {
        this.errorEmail = true
      }

      if (!this.body) {
        this.errorBody = true
      }

      if (this.errorBody || this.errorName || this.errorEmail) {
        return
      }

      this.handleAdd({
        postId: this.post.id,
        name: this.name,
        email: this.email,
        body: this.body,
      })

      this.name = ''
      this.email = ''
      this.body = ''
      this.errorName = false
      this.errorEmail = false
      this.errorBody = false
    },
  },
}
</script>
<template>
  <div class="block">
    <form @submit.prevent="handleSubmit">
      <div class="field" data-cy="NameField">
        <label class="label" for="{`comment-author-name-${name}`}"> Author name </label>
        <div class="control has-icons-left has-icons-right">
          <input
            type="text"
            name="{name}"
            id="{`comment-author-name-${name}`}"
            placeholder="Post title"
            class="input"
            :class="{ 'is-danger': errorName }"
            v-model="name"
            @input="errorName = false"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>

          <span class="icon is-small is-right has-text-danger" v-if="errorName" data-cy="ErrorIcon">
            <i class="fas fa-exclamation-triangle"></i>
          </span>
        </div>

        <p class="help is-danger" v-if="errorName" data-cy="ErrorMessage">Author is required</p>
      </div>
      <div class="field" data-cy="NameField">
        <label class="label" for="{`comment-author-name-${name}`}"> Author email </label>
        <div class="control has-icons-left has-icons-right">
          <input
            type="email"
            name="{name}"
            id="{`comment-author-name-${name}`}"
            placeholder="Post title"
            class="input"
            :class="{ 'is-danger': errorEmail }"
            v-model="email"
            @input="errorEmail = false"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>

          <span
            class="icon is-small is-right has-text-danger"
            v-if="errorEmail"
            data-cy="ErrorIcon"
          >
            <i class="fas fa-exclamation-triangle"></i>
          </span>
        </div>

        <p class="help is-danger" v-if="errorEmail" data-cy="ErrorMessage">Email is required</p>
      </div>
      <div class="field" data-cy="BodyField">
        <label class="label" for="{`comment-${name}`}"> Write post body </label>
        <div class="control">
          <textarea
            id="{`comment-${name}`}"
            name="name"
            placeholder="Post body"
            class="textarea"
            :class="{ 'is-danger': errorBody }"
            v-model="body"
            @input="errorBody = false"
          ></textarea>
        </div>

        <p class="help is-danger" v-if="errorBody" data-cy="ErrorMessage">Body is required</p>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Add Comment</button>
        </div>
        <div class="control">
          <button type="reset" class="button is-link is-light" @click="close">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>

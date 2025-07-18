<script>
export default {
  name: 'EditPost',
  data() {
    return {
      title: this.post.title,
      body: this.post.body,
      errorTitle: false,
      errorBody: false,
    }
  },
  props: {
    post: Object,
    close: Function,
    editPost: Function,
  },
  methods: {
    handleSubmit() {
      if (!this.title) {
        this.errorTitle = true
      }

      if (!this.body) {
        this.errorBody = true
      }

      if (this.errorTitle || this.errorBody) {
        return
      }

      this.editPost({
        id: this.post.id,
        userId: 2049,
        title: this.title,
        body: this.body,
      })

      this.title = ''
      this.body = ''
      this.errorTitle = false
      this.errorBody = false
    },
  },
}
</script>
<template>
  <div class="tile is-parent is-8-desktop Sidebar" :class="{ 'Sidebar--open': post }">
    <div class="tile is-child box is-success">
      <div class="content">
        <div class="content">
          <h2>Editing post</h2>

          <form @submit.prevent="handleSubmit">
            <div class="field" data-cy="NameField">
              <label class="label" for="{`comment-author-name-${name}`}"> Title </label>
              <div class="control has-icons-left has-icons-right">
                <input
                  type="text"
                  name="{name}"
                  id="{`comment-author-name-${name}`}"
                  placeholder="Post title"
                  class="input"
                  :class="{ 'is-danger': errorTitle }"
                  v-model="title"
                  @input="errorTitle = false"
                />
                <span class="icon is-small is-left">
                  <i class="fas fa-user"></i>
                </span>

                <span
                  class="icon is-small is-right has-text-danger"
                  v-if="errorTitle"
                  data-cy="ErrorIcon"
                >
                  <i class="fas fa-exclamation-triangle"></i>
                </span>
              </div>

              <p class="help is-danger" v-if="errorTitle" data-cy="ErrorMessage">
                Title is required
              </p>
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
                <button type="submit" class="button is-link">Save</button>
              </div>
              <div class="control">
                <button type="reset" class="button is-link is-light" @click="close">Cancel</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

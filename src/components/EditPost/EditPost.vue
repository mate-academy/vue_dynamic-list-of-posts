<script>
export default {
  data() {
    return {
      title: this.post.title,
      body: this.post.body,
      errorMessage: "",
    };
  },

  methods: {
    handleUpdatePost() {
      this.$emit('updatePost', {
        title: this.title,
        body: this.body,
        postId: this.post.id
      })
    }
  },
  
  props: {
    post: Object,
  }
};
</script>

<template>
  <div className="tile is-child box is-success ">
    <div className="content">
      <!-- Content here -->
      <div className="content">
        <h2>Post editing</h2>

        <form>
          <!-- inputs... -->
          <div className="field" data-cy="NameField">
            <label className="label" htmlFor="{`comment-author-name-${name}`}">
              Title
            </label>
            <div className="control has-icons-left has-icons-right">
              <input
                v-model="title"
                type="text"
                name="{name}"
                id="{`comment-author-name-${name}`}"
                placeholder="Post title"
                class="input"
                :class="{ 'is-danger': errorMessage }"
                required
              />
              <span class="icon is-small is-left">
                <i className="fas fa-user"></i>
              </span>

              <span
                class="icon is-small is-right has-text-danger"
                data-cy="ErrorIcon"
                v-if="errorMessage"
              >
                <i className="fas fa-exclamation-triangle"></i>
              </span>
            </div>

            <p className="help is-danger" data-cy="ErrorMessage">
              {{ this.errorMessage }}
            </p>
          </div>

          <div>
            <div className="field" data-cy="BodyField">
              <label className="label" htmlFor="{`comment-${name}`}">
                Write Post Body
              </label>
              <div className="control">
                <textarea
                  v-model="body"
                  id="{`comment-${name}`}"
                  name="name"
                  placeholder="Post body"
                  class="textarea"
                  :class="{ 'is-danger': errorMessage }"
                ></textarea>
              </div>

              <p
                className="help is-danger"
                data-cy="ErrorMessage"
                v-if="errorMessage"
              >
                {{ errorMessage }}
              </p>
            </div>
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button
                type="submit"
                className="button is-link"
                @click.prevent="handleUpdatePost"
              >
                Save
              </button>
            </div>
            <div className="control">
              <button
                type="reset"
                className="button is-link is-light"
                @click="toggleChangeAddStatus"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
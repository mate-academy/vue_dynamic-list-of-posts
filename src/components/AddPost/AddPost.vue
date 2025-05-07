<script>
export default {
  data() {
    return {
      title: "",
      body: "",
      errorMessage: "",
    };
  },

  methods: {
    async addPost() {
      let newPost = {
        title: this.title,
        body: this.body,
      };

      if (newPost.body.length === 0 || newPost.title.length === 0) {
        this.errorMessage = "please fill out the form";
        return;
      }

      this.$emit("handleSubmit", newPost);

      newPost = {
        title: "",
        body: "",
      };
    },

    toggleChangeAddStatus() {
      this.$emit("handleChangeAddStatus");
    },
  },
};
</script>

<template>
  <div className="tile is-child box is-succes">
    <div className="content">
      <div className="content">
        <h2>Create new post</h2>

        <form>
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
                @click.prevent="addPost"
              >
                Create
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

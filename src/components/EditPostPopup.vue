<script>
export default {
    props: {
        post: Object,
    },
  emits: ["edit", "close"],
  data() {
    return {
      newTitle: this.post.title,
      newBody: this.post.body,
      triedSubmit: false,
    };
  },
  computed: {
    titleError() {
      return !this.newTitle.trim();
    },
    bodyError() {
      return !this.newBody.trim();
    },
    isInvalid() {
      return this.titleError || this.bodyError;
    },
  },
  methods: {
    edit() {
      this.triedSubmit = true;

      if (this.isInvalid) {
        return;
      }

      this.$emit("edit", {
        id: this.post.id, 
        title: this.newTitle.trim(),
        body: this.newBody.trim(),
      });

      this.triedSubmit = false;
    },
    close() {
      this.newTitle = "";
      this.newBody = "";
      this.triedSubmit = false;
      this.$emit("close");
    },
  },
};
</script>

<template>
  <div class="tile is-parent is-8-desktop Sidebar Sidebar--open">
    <div class="tile is-child box is-success">
      <div class="content">
        <h2>Post editing</h2>

        <form novalidate @submit.prevent="edit">
          <div class="field" data-cy="NameField">
            <label class="label" for="comment-author-name-title">Title</label>
            <div class="control has-icons-left has-icons-right">
              <input
                id="comment-author-name-title"
                type="text"
                placeholder="Post title"
                class="input"
                :class="{ 'is-danger': triedSubmit && titleError }"
                v-model="newTitle"
                aria-invalid="true"
                :aria-invalid="triedSubmit && titleError ? 'true' : 'false'"
                :aria-describedby="
                  triedSubmit && titleError ? 'title-help' : null
                "
              />
              <span class="icon is-small is-left">
                <i class="fas fa-user fa-heading"></i>
              </span>
              <span
                v-if="triedSubmit && titleError"
                class="icon is-small is-right has-text-danger"
              >
                <i class="fas fa-exclamation-triangle"></i>
              </span>
            </div>
            <p
              v-if="triedSubmit && titleError"
              id="title-help"
              class="help is-danger"
            >
              Title is required
            </p>
          </div>

          <div class="field" data-cy="BodyField">
            <label class="label" for="comment-body">Write Post Body</label>
            <div class="control">
              <textarea
                id="comment-body"
                placeholder="Post body"
                class="textarea"
                :class="{ 'is-danger': triedSubmit && bodyError }"
                v-model="newBody"
                :aria-invalid="triedSubmit && bodyError ? 'true' : 'false'"
                :aria-describedby="
                  triedSubmit && bodyError ? 'body-help' : null
                "
              ></textarea>
            </div>
            <p
              v-if="triedSubmit && bodyError"
              id="body-help"
              class="help is-danger"
            >
              Body is required
            </p>
          </div>

          <div class="field is-grouped">
            <div class="control">
              <button type="submit" class="button is-link">Save</button>
            </div>
            <div class="control">
              <button
                type="button"
                class="button is-link is-light"
                @click="close"
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

<style></style>

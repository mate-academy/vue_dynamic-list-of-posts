<script>
export default {
  name: 'PostForm',
  data() {
    return {
      newTitle: this.editingPost ? this.editingPost.title : '',
      newBody: this.editingPost ? this.editingPost.body : '',
      isTitleErrorShown: false,
      isBodyErrorShown: false,
    }
  },
  props: {
    editingPost: Object,
  },
  emits: ['closeForm', 'updatePost', 'createPost'],
  methods: {
    handeOnSubmit() {
      const normalizedTitle = this.newTitle.trim();
      const normalizedBody = this.newBody.trim();

      if (!normalizedTitle) {
        this.isTitleErrorShown = true;
      }

      if (!normalizedBody) {
        this.isBodyErrorShown = true;
      }

      if (!normalizedTitle || !normalizedBody) {
        return;
      }

      if (this.editingPost) {
        this.$emit('updatePost', {
          title: this.newTitle,
          body: this.newBody,
        })
      } else {
        this.$emit('createPost', {
          title: this.newTitle,
          body: this.newBody,
        })
      }
    },
    handleTitleInput(event) {
      this.newTitle = event.target.value;
      this.isTitleErrorShown = false;
    },
    handleBodyInput(event) {
      this.newBody = event.target.value;
      this.isBodyErrorShown = false;
    },
  }
}
</script>

<template>
  <div className="block">
    <div
      className="is-flex is-justify-content-space-between is-align-items-center"
    >
      <h3 class="title is-3">
        {{ editingPost ? 'Post editing' : 'Create new post' }}
      </h3>
    </div>

    <div className="field" data-cy="NameField">
      <label className="label" htmlFor="{`comment-author-name-${name}`}">
        Title
      </label>
      <div className="control has-icons-left has-icons-right">
        <input
          type="text"
          name="{name}"
          id="{`comment-author-name-${name}`}"
          placeholder="Post title"
          class="input"
          :class="{ 'is-danger': isTitleErrorShown }"
          :value="newTitle"
          @input="handleTitleInput"
        />
        <span className="icon is-small is-left">
          <i className="fas fa-user"></i>
        </span>

        <span
          className="icon is-small is-right has-text-danger"
          data-cy="ErrorIcon"
          v-if="isTitleErrorShown"
        >
          <i className="fas fa-exclamation-triangle"></i>
        </span>
      </div>

      <p 
        className="help is-danger" 
        data-cy="ErrorMessage"
        v-if="isTitleErrorShown"
      >
        Title should be not empty
      </p>
    </div>

    <div className="field" data-cy="BodyField">
      <label className="label" htmlFor="{`comment-${name}`}"> title </label>
      <div className="control">
        <textarea
          id="{`comment-${name}`}"
          name="name"
          placeholder="Post body"
          class="textarea"
          :class="{ 'is-danger': isBodyErrorShown }"
          :value="newBody"
          @input="handleBodyInput"
        ></textarea>
      </div>

      <p 
        className="help is-danger" 
        data-cy="ErrorMessage"
        v-if="isBodyErrorShown"
      >
        Body of the post should not be empty
      </p>
    </div>

    <div class="buttons">
      <button 
        type="button" 
        class="button is-link"
        @click="handeOnSubmit"
      >
        {{ this.editingPost ? 'Save' : 'Create' }}
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
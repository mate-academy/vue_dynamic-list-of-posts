<script>
import { addCommentsByPostId, deleteComment, getCommentsByPostId } from '@/http/commentApi';
import InputField from './InputField.vue';
import TextAreaInput from './TextAreaInput.vue';
import ErrorMessage from './ErrorMessage.vue';

export default {
  components: {
    InputField,
    TextAreaInput,
    ErrorMessage,
  },
  props: ['isOpen', 'post'],
  emits: ['close', 'addPost', 'onEdit', 'onDelete'],
  data() {
    return {
      title: '',
      body: '',
      errors: {
        title: '',
        body: '',
      },
      edit: false,
      isLoad: false,
      comments: [],
      commentErrorMessage: '',
      isAddComment: false,
      isAddingComment: false,
      commentData: {
        name: '',
        email: '',
        body: '',
      },
      commentError: {
        nameError: '',
        emailError: '',
        bodyError: '',
      }
    };
  },
  watch: {
    post() {
      if (this.post) { 
      this.isLoad = true;

      getCommentsByPostId(this.post.id)
        .then(({ data }) => {
          this.comments = [...data];
        })
        .catch(() => {
          this.commentError = 'Unable to get comments from a server!';
        })
        .finally(() => {
          this.isLoad = false;
        });
      }
    },
    commentData: {
      deep: true,
      handler() {
        if (
          this.commentError.nameError
          || this.commentError.emailError
          || this.commentError.bodyError
        ) {
          this.commentError = {
            nameError: '',
            emailError: '',
            bodyError: '',
          };
        }
      }
    },
    title() {
      if (this.errors.title
        || this.errors.body
      ) {
        this.errors = {
          title: '',
          body: '',
        };
      }
    },
    body() {
      if (this.errors.title
        || this.errors.body
      ) {
        this.errors = {
          title: '',
          body: '',
        };
      }
    }
  },
  methods: {
    cancelAdd() {
      if (this.edit) {
        this.edit = false;

        return;
      }

      this.title = '';
      this.body = '',

      this.$emit('close');
    },
    addPost() {
      if (!this.validateFields()) {
        return;
      }

      if (this.edit) {
        this.editPost();

        this.edit = false;

        return;
      }

      this.$emit('addPost', {
        title: this.title,
        body: this.body,
      });

      this.title = '';
      this.body = '';
    },
    editPost() {
      if (this.post) {
        const newPost = {
          ...this.post,
          title: this.title,
          body: this.body,
        };

        this.title = '';
        this.body = '',

        this.$emit('onEdit', newPost);
      }
    },
    startEditing() {
      if (this.post) {
        this.title = this.post.title,
        this.body = this.post.body;

        this.edit = true;
      }
    },
    validateFields() {
      let isValid = true;

      this.errors.title = '';
      this.errors.body = '';

      if (this.title.length < 5) {
        this.errors.title = 'Поле "title" не може мати менше 5 символів!';

        isValid = false;
      }

      if (this.body.length < 5) {
        this.errors.body = 'Поле "body" не може мати менше 5 символів!';

        isValid = false;
      }

      if (!this.title) {
        this.errors.title = 'Поле "title" не може бути пустим!';

        isValid = false;
      }

      if (!this.body) {
        this.errors.body = 'Поле "body" не може бути пустим!';

        isValid = false;
      }

      return isValid;
    },
    removePostOnServer() {
      if (this.post) {
        this.$emit('onDelete', this.post.id);
      }
    },
    openCommentForm() {
      this.isAddComment = true;
    },
    addComment() {
      if (!this.validateComment()) {
        return;
      }

      if (this.post) {
        this.isAddingComment = true;

        addCommentsByPostId(this.post.id, this.commentData)
          .then(({ data }) => {
            this.comments = [...this.comments, data];
          })
          .finally(() => {
            this.commentData = {
              name: this.commentData.name,
              email: this.commentData.email,
              body: '',
              errors: {
                nameError: '',
                emailError: '',
                bodyError: '',
              }
            };

            this.isAddingComment = false;
            this.isAddComment = false;
          });
      }
    },
    validateComment() {
      let isValid = true;

      if (!this.commentData.name) {
        this.commentError.nameError = 'Name field can\'t be empty!';

        isValid = false;
      }

      if (!this.commentData.email) {
        this.commentError.emailError = 'Email field can\'t be empty!';

        isValid = false;
      }

      if (!this.commentData.body) {
        this.commentError.bodyError = 'Body field can\'t be empty!';

        isValid = false;
      }

      return isValid;
    },
    cancelComment() {
      this.commentData = {
        name: '',
        email: '',
        body: '',
        errors: {
          nameError: '',
          emailError: '',
          bodyError: '',
        }
      };

      this.isAddComment = false;
    },
    deleteComment($event) {
      deleteComment($event)
        .then(() => {
          this.comments = [...this.comments.filter(x => x.id !== $event)]
        })
    },
    clearErrors() {
      this.commentData = {
        ...this.commentData,
        errors: {
          nameError: '',
          emailError: '',
          bodyError: '',
        }
      };
    }
  }
}
</script>

<template>
    <div class="tile is-parent is-8-desktop Sidebar" :class="{ 'Sidebar--open' : isOpen }">
        <div class="tile is-child box is-success ">
          <div class="content">
            <template v-if="(!post && isOpen) || edit">
              <h2>{{edit ? 'Post editing' : 'Create a new post'}}</h2>

              <form @submit.prevent="">
                <InputField
                  name="title" 
                  title="Title" 
                  v-model.trim="title"
                  placeholder="Post title" 
                  :errorText="errors.title"
                />

                <TextAreaInput
                  name="body" 
                  title="Write post body" 
                  v-model.trim="body"
                  placeholder="Body text" 
                  :errorText="errors.body"
                />

                <div class="field is-grouped">
                  <div class="control">
                    <button type="submit" class="button is-link" @click="addPost">{{edit ? 'Save' : 'Create'}}</button>
                  </div>
                  <div class="control">
                    <button type="reset" class="button is-link is-light" @click="cancelAdd">Cancel</button>
                  </div>
                </div>
              </form>
            </template>

            <template v-else-if="isOpen">
              <div class="block">
                <div
                  class="is-flex is-justify-content-space-between is-align-items-center"
                >
                  <h2>#{{ post.id }}: {{ post.title }}</h2>
                  <div class="is-flex">
                    <span class="icon is-small is-right is-clickable" @click="startEditing">
                      <i class="fas fa-pen-to-square"></i>
                    </span>
                    <span
                      class="icon is-small is-right has-text-danger is-clickable ml-3"
                      @click="removePostOnServer"
                    >
                      <i class="fas fa-trash"></i>
                    </span>
                  </div>
                </div>
                <p data-cy="PostBody">{{ post.body }}</p>
              </div>

              <ErrorMessage v-if="commentErrorMessage" @hide="commentErrorMessage = ''">
                <template #header>
                    <p>Server error</p>
                </template>

                <template #default>
                    {{ commentErrorMessage }}
                </template>
              </ErrorMessage>

              <div class="block" v-else>
                <form @submit.prevent="addComment" v-if="isAddComment">
                  <InputField
                    name="name" 
                    title="Author Name" 
                    v-model.trim="commentData.name"
                    placeholder="Name Surname" 
                    :errorText="commentError.nameError"
                  />

                  <InputField
                    name="email" 
                    title="Author Email"
                    icon='fa-envelope'
                    v-model.trim="commentData.email"
                    placeholder="Your Email" 
                    :errorText="commentError.emailError"
                  />

                  <TextAreaInput
                    name="commentbody" 
                    title="Write comment body" 
                    v-model.trim="commentData.body"
                    placeholder="Comment text" 
                    :errorText="commentError.bodyError"
                  />

                  <div class="field is-grouped">
                    <div class="control">
                      <button
                        type="submit"
                        class="button is-link"
                        :class="{ 'is-loading' : isAddingComment }"
                      >
                        Add Comment
                      </button>
                    </div>
                    <div class="control">
                      <button type="reset" class="button is-link is-light" @click="cancelComment">Cancel</button>
                    </div>
                  </div>
                </form>

                <template v-else>
                  <p class="title is-4" v-if="comments.length === 0">No comments yet</p>

                  <template v-else>
                    <article class="message is-small" v-for="comment of comments" :key="comment.id">
                      <div class="message-header">
                        <a :href="`mailto:${comment.email}`"> {{ comment.name }} </a>
                        <button 
                          type="button"
                          class="delete is-small" 
                          aria-label="delete"
                          @click="deleteComment(comment.id)"
                        ></button>
                      </div>
                      <div class="message-body">{{ comment.body }}</div>
                    </article>
                  </template>

                  <button type="button" class="button is-link" @click="openCommentForm">Write a comment</button>
                </template>
              </div>
            </template>
          </div>
        </div>
    </div>
</template>

<style>
    .Sidebar {
      overflow: hidden;
      opacity: 0;
      transition-property: max-width, opacity;
      transition-duration: 0.5s;
      transition-timing-function: ease-in-out;

      @media (min-width: 769px) {
        max-width: 0;
      }
    }

    .Sidebar--open {
      opacity: 1;

      @media (min-width: 769px) {
        max-width: 50%;
      }
    }
</style>
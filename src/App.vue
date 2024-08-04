<script>
import LoaderSpinner from './components/LoaderSpinner.vue'
import PostsTable from './components/PostsTable.vue'
import AddCommentForm from './components/AddCommentForm.vue'
import {
  getUser,
  createUser,
  getUserPosts,
  createUserPost,
  getComments,
  deleteUserPost,
  updateUserPost,
  creareUserComment,
  deleteUserComment
} from './stores/userPosts'

import { Stage, Sidebar } from './types/types'

export default {
  components: {
    LoaderSpinner,
    PostsTable,
    AddCommentForm
  },
  data() {
    let user = {}
    const jsonData = localStorage.getItem('user') || '{}'

    try {
      user = JSON.parse(jsonData)
    } catch (e) {
      console.log(e)
    }

    return {
      Stage,
      Sidebar,
      stage: Stage.isLogin,
      user,
      errorMessage: '',
      posts: [],
      sidebar: Sidebar.isClosed,
      isLoading: false,
      postTitle: '',
      postBody: '',
      currentPost: {},
      commentsIsLoading: false,
      comments: [],
      newComment: {
        name: '',
        email: '',
        body: ''
      }
    }
  },
  methods: {
    loadPosts() {
      this.isLoading = true
      getUserPosts(this.user.id)
        .then(({ data }) => {
          this.posts = data
        })
        .catch(() => (this.errorMessage = 'Can`t load user posts'))
        .finally(() => (this.isLoading = false))
    },
    handleSubmit() {
      if (this.stage === Stage.isLogin) {
        this.isLoading = true
        getUser(this.user.email)
          .then(({ data }) => {
            if (data[0]) {
              this.user = data[0]
              localStorage.setItem('user', JSON.stringify(data[0]))
              this.stage = Stage.isLoggedin
              this.loadPosts()
            } else {
              this.stage = Stage.isRegister
            }
          })
          .catch(() => {
            this.errorMessage = 'Can`t load user'
          })
          .finally(() => (this.isLoading = false))
      }

      if (this.stage === Stage.isRegister) {
        this.isLoading = true
        createUser(this.user)
          .then(({ data }) => {
            this.user = data
            localStorage.setItem('user', JSON.stringify(data))
            this.stage = Stage.isLoggedin
            this.loadPosts()
          })
          .catch(() => {
            this.errorMessage = 'Can`t create user'
          })
          .finally(() => (this.isLoading = false))
      }
    },
    logOut() {
      this.user = {}
      this.stage = Stage.isLogin
      localStorage.clear()
    },
    closeSidebar() {
      this.sidebar = Sidebar.isClosed
      this.currentPost = {}
    },
    submitAddPost() {
      const newPost = {
        userId: this.user.id,
        title: this.postTitle,
        body: this.postBody
      }

      if (this.sidebar === Sidebar.editPost) {
        if (
          this.currentPost.title === this.postTitle &&
          this.currentPost.body === this.postBody
        ) {
          this.sidebar = Sidebar.isClosed
          this.currentPost = {}
          return
        }
        this.isLoading = true
        updateUserPost(this.currentPost.id, newPost)
          .then(({ data }) => {
            this.posts = this.posts.filter((p) => p.id !== this.currentPost.id)
            this.posts.push(data)
            this.currentPost = data
            this.posts.sort((a, b) => a.id - b.id)
          })
          .catch(() => (this.errorMessage = 'Can`t create post'))
          .finally(() => (this.isLoading = false))
      } else {
        this.isLoading = true
        createUserPost(newPost)
          .then(({ data }) => {
            this.posts.push(data)
            this.currentPost = data
          })
          .catch(() => (this.errorMessage = 'Can`t create post'))
          .finally(() => (this.isLoading = false))
      }
      this.sidebar = Sidebar.showPost
      this.postTitle = ''
      this.postBody = ''
    },
    openPost(post) {
      if (this.currentPost === post) {
        this.currentPost = {}
        this.sidebar = Sidebar.isClosed
      } else {
        this.sidebar = Sidebar.showPost
        this.commentsIsLoading = true
        this.currentPost = post
        getComments(post.id)
          .then(({ data }) => {
            this.comments = data
          })
          .catch(() => (this.errorMessage = 'Can`t load comments'))
          .finally(() => (this.commentsIsLoading = false))
      }
    },
    editPost() {
      this.postTitle = this.currentPost.title
      this.postBody = this.currentPost.body
      this.sidebar = Sidebar.editPost
    },
    deletePost() {
      deleteUserPost(this.currentPost.id)
      this.sidebar = Sidebar.isClosed
      this.posts = this.posts.filter((p) => p !== this.currentPost)
    },
    deleteComment(commentId) {
      this.commentsIsLoading = true
      deleteUserComment(commentId)
        .then(() => {
          this.comments = this.comments.filter((c) => c.id !== commentId)
        })
        .catch(() => (this.errorMessage = 'Can`t delete comment'))
        .finally(() => (this.commentsIsLoading = false))
    },
    createComment() {
      this.sidebar = Sidebar.addComment
    },
    submitAddComment() {
      this.newComment.postId = this.currentPost.id
      this.commentsIsLoading = true
      creareUserComment(this.newComment)
        .then(({ data }) => {
          this.comments.push(data)
          this.sidebar = Sidebar.showPost
        })
        .catch(() => (this.errorMessage = 'Can`t create comment'))
        .finally(() => (this.commentsIsLoading = false))
    }
  },
  mounted() {
    if ('id' in this.user) {
      this.loadPosts()
      this.stage = Stage.isLoggedin
    }
  }
}
</script>

<template>
  <template v-if="this.stage !== Stage.isLoggedin">
    <section class="container is-flex is-justify-content-center">
      <form @submit.prevent="handleSubmit" class="box mt-5">
        <h1 class="title is-3">
          {{
            this.stage === Stage.isLogin
              ? 'Get your userId'
              : 'You need to register'
          }}
        </h1>

        <div class="field">
          <label class="label" htmlFor="user-email"> Email </label>

          <div
            class="control has-icons-left"
            :class="{ 'is-loading': this.isLoading }"
          >
            <input
              type="email"
              id="user-email"
              name="email"
              class="input"
              :placeholder="
                this.stage === Stage.isLogin
                  ? 'Enter your email'
                  : 'You need to register'
              "
              v-model="user.email"
              :disabled="this.stage === Stage.isRegister || this.isLoading"
              required
            />

            <span class="icon is-small is-left">
              <i class="fas fa-envelope" />
            </span>
          </div>

          <p v-if="this.errorMessage !== ''" class="help is-danger">
            {{ this.errorMessage }}
          </p>
        </div>

        <div v-if="this.stage === Stage.isRegister" class="field">
          <label class="label" htmlFor="user-name"> Your Name </label>

          <div class="control has-icons-left">
            <input
              type="text"
              id="user-name"
              name="name"
              class="input"
              placeholder="Enter your name"
              v-model="user.name"
              :disabled="isLoading"
              required
            />

            <span class="icon is-small is-left">
              <i class="fas fa-user" ></i>
            </span>
          </div>

          <p v-if="this.errorMessage !== ''" class="help is-danger">
            {{ this.errorMessage }}
          </p>
        </div>

        <div class="field">
          <button
            type="submit"
            class="button is-primary"
            :class="{ 'is-loading': this.isLoading }"
          >
            {{ this.stage === Stage.isLogin ? 'Login' : 'Register' }}
          </button>
        </div>
      </form>
    </section>
  </template>

  <template v-else>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-item">
        <h2 class="is-size-4">Vue List Of Posts</h2>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <div class="mr-5 mb-2">
              <p>User: {{ this.user.name }}</p>
            </div>

            <a class="button is-light" @click="logOut"> Logout </a>
          </div>
        </div>
      </div>
    </nav>

    <main class="section">
      <div class="container">
        <div class="tile is-ancesor">
          <div class="tile is-parent">
            <div class="tile is-child box is-success">
              <PostsTable
                :sidebar="this.sidebar"
                :isLoading="this.isLoading"
                :currentPost="this.currentPost"
                :posts="this.posts"
                @sidebarSetAddPost="this.sidebar = Sidebar.addPost"
                @openPost="openPost($event)"
              />
            </div>
          </div>

          <div
            v-if="sidebar !== Sidebar.isClosed"
            class="tile is-parent is-8-desktop Sidebar"
            :class="{ 'Sidebar--open': sidebar !== Sidebar.isClosed }"
          >
            <div class="tile is-child box is-success">
              <div class="content">
                <div
                  v-if="
                    sidebar === Sidebar.addPost ||
                    this.sidebar === Sidebar.editPost
                  "
                  class="content"
                >
                  <h2>
                    {{
                      this.sidebar === Sidebar.editPost
                        ? 'Post editing'
                        : sidebar === Sidebar.addPost
                          ? 'Create new post'
                          : null
                    }}
                  </h2>

                  <form @submit.prevent="submitAddPost">
                    <div class="field" data-cy="NameField">
                      <label class="label" for="comment-author-name-title"
                        >Title</label
                      >
                      <div class="control has-icons-left has-icons-right">
                        <input
                          type="text"
                          name="title"
                          id="comment-author-name-title"
                          placeholder="Post title"
                          class="input"
                          v-model="this.postTitle"
                          required
                        />

                        <span class="icon is-small is-left">
                          <i class="fas fa-user fa-heading"></i>
                        </span>
                      </div>
                    </div>

                    <div class="field" data-cy="BodyField">
                      <label class="label" for="comment-body"
                        >Write Post Body</label
                      >
                      <div class="control">
                        <textarea
                          id="comment-body"
                          name="body"
                          placeholder="Post body"
                          class="textarea"
                          v-model="this.postBody"
                          required
                        ></textarea>
                      </div>
                    </div>

                    <div class="field is-grouped">
                      <div class="control">
                        <button type="submit" class="button is-link">
                          {{
                            this.sidebar === Sidebar.editPost
                              ? 'Save'
                              : 'Create'
                          }}
                        </button>
                      </div>

                      <div class="control">
                        <button
                          type="reset"
                          class="button is-link is-light"
                          @click="closeSidebar"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <div
                  v-if="
                    sidebar === Sidebar.showPost ||
                    sidebar === Sidebar.addComment
                  "
                  class="content"
                >
                  <div class="block">
                    <div
                      class="is-flex is-justify-content-space-between is-align-items-center"
                    >
                      <h2>
                        {{
                          `${this.currentPost.id}: ${this.currentPost.title}`
                        }}
                      </h2>

                      <div class="is-flex">
                        <span
                          class="icon is-small is-right is-clickable"
                          @click="editPost"
                          ><i class="fas fa-pen-to-square"></i>
                        </span>

                        <span
                          class="icon is-small is-right has-text-danger is-clickable ml-3"
                          @click="deletePost"
                          ><i class="fas fa-trash"></i
                        ></span>
                      </div>
                    </div>

                    <p data-cy="PostBody">{{ this.currentPost.body }}</p>
                  </div>

                  <LoaderSpinner v-if="commentsIsLoading" />

                  <div
                    v-else-if="this.sidebar !== Sidebar.addComment"
                    class="block"
                  >
                    <template v-if="this.comments.length > 0">
                      <article
                        v-for="{ id, name, email, body } of this.comments"
                        :key="id"
                        class="message is-small"
                        data-cy="Comment"
                      >
                        <div class="message-header">
                          <a
                            :href="`mailto:${email}`"
                            data-cy="CommentAuthor"
                            >{{ name }}
                          </a>

                          <button
                            data-cy="CommentDelete"
                            type="button"
                            class="delete is-small"
                            aria-label="delete"
                            @click="deleteComment(id)"
                          ></button>
                        </div>

                        <div class="message-body" data-cy="CommentBody">
                          {{ body }}
                        </div>
                      </article>
                    </template>
                    <div v-else class="block">
                      <p class="title is-4">No comments yet</p>
                    </div>

                    <button
                      data-cy="WriteCommentButton"
                      type="button"
                      class="button is-link"
                      @click="createComment"
                    >
                      Write a comment
                    </button>
                  </div>

                  <AddCommentForm
                    v-if="this.sidebar === Sidebar.addComment"
                    v-model:email="this.newComment.email"
                    v-model:name="this.newComment.name"
                    v-model:body="this.newComment.body"
                    :errorMessage="this.errorMessage"
                    :sidebar="this.sidebar"
                    @sidebarSetShowPost="this.sidebar = Sidebar.showPost"
                    @submitAddComment="submitAddComment()"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </template>
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

.tile:not(.is-child) {
  display: flex;
}

.tile {
  align-items: stretch;
  display: block;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;
  min-height: -webkit-min-content;
  min-height: -moz-min-content;
  min-height: min-content;
}

.tile.is-child {
  margin: 0;
}

.tile.is-parent {
  padding: 0.75rem;
}
</style>

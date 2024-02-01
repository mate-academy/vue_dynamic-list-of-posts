<script>
export default {
  data() {
    return {
      email: "",
      name: "",
      registrationError: null,
      isRegister: true,
      isLoggedIn: false,
      currentUser: null,
      registerUsers: JSON.parse(localStorage.getItem('registerUsers')) || [],
      userPosts: [],
      isSidebarOpen: false,
      createPostError: false,
      isAddPostButtonActive: false,
      isOpenActive: false,
      postOpenStates: {},
      isCommentForm: false,
      commentName: '',
      commentEmail: '',
      commentBody: '',
      hasCommentName: false,
      hasCommentEmail: false,
      hasCommentBody: false,
      hasNewTitleError: false,
      hasNewBodyError: false,
      editedPost: {
        id: null,
        title: "",
        body: "",
      },
    };
  },
  created() {
    const storedUsers = localStorage.getItem('registerUsers');
    const storedPosts = localStorage.getItem('userPosts');

    if (storedUsers) {
      this.registerUsers = JSON.parse(storedUsers);
    }

    if (storedPosts) {
      this.userPosts = JSON.parse(storedPosts);
    }
  },
  watch: {
    registerUsers: {
      handler() {
        localStorage.setItem('registerUsers', JSON.stringify(this.registerUsers));
      },
      deep: true,
    },
    userPosts: {
      handler() {
        localStorage.setItem('userPosts', JSON.stringify(this.userPosts));
      },
      deep: true,
    },
  },
  methods: {
    async handleSubmit() {
      try {
        const emailExist = this.registerUsers.some(user => user.email === this.email);
        
        if (emailExist) {
          this.currentUser = this.registerUsers.find(user => user.email === this.email);
          this.isLoggedIn = true;
          this.isRegister = true;
        } else {
          this.isRegister = false;
          this.isLoggedIn = false;
        }
      } catch (error) {
        console.error("Login error:", error);
        this.registrationError = "Failed to login. Please try again.";
      }
    },
    async handleRegistration() {
      try {
        this.registerUsers.push({ email: this.email, name: this.name });

        const emailExist = this.registerUsers.some(user => user.email === this.email);

        console.log(this.registerUsers);

        if (emailExist) {
          this.isLoggedIn = true;
          this.isRegister = true;
          this.currentUser = this.registerUsers.find(user => user.email === this.email);
        } else {
          this.isRegister = false;
          this.isLoggedIn = false;
        }

        this.email = '';
      } catch (error) {
        console.error("Registration error:", error);
        this.registrationError = "Failed to register. Please try again.";
      }
    },
    async handleAddComment(postId) {
      try {
        const postIndex = this.userPosts[this.currentUser.email].findIndex(post => post.id === postId);
        
        if (postIndex !== -1) {
          if (!this.userPosts[this.currentUser.email][postIndex].comments) {
            this.userPosts[this.currentUser.email][postIndex].comments = [];
          }

          const newComment = {
            id: this.userPosts[this.currentUser.email][postIndex].comments.length + 1,
            name: this.commentName,
            email: this.commentEmail,
            body: this.commentBody,
          };

          this.userPosts[this.currentUser.email][postIndex].comments.push(newComment);

          localStorage.setItem('userPosts', JSON.stringify(this.userPosts));

          this.commentName = "";
          this.commentEmail = "";
          this.commentBody = "";

          this.isCommentForm = false;
        }
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    },
    handleEditPost(postId) {
      const postIndex = this.userPosts[this.currentUser.email].findIndex(post => post.id === postId);

      if (postIndex !== -1) {
        const postToEdit = this.userPosts[this.currentUser.email][postIndex];

        this.editedPost = {
          id: postToEdit.id,
          title: postToEdit.title,
          body: postToEdit.body,
        };

        this.isSidebarOpen = true;
        this.isAddPostButtonActive = true;
        this.isOpenActive = false;
      }
    },
    handleDeletePost(postId) {
      try {
        const postIndex = this.userPosts[this.currentUser.email].findIndex(post => post.id === postId);

        if (postIndex !== -1) {
          this.userPosts[this.currentUser.email].splice(postIndex, 1);

          if (this.userPosts[this.currentUser.email].length === 0) {
            delete this.userPosts[this.currentUser.email];
          }

          localStorage.setItem('userPosts', JSON.stringify(this.userPosts));
          this.isSidebarOpen = false;
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    },
    handleSaveComment(postId) {
      if (this.commentName.trim().length === 0) {
        this.hasCommentName = true;
      }
      if (this.commentEmail.trim().length === 0) {
        this.hasCommentEmail = true;
      }
      if (this.commentBody.trim().length === 0) {
        this.hasCommentBody = true;
      }

      if (this.commentName.trim().length === 0 || this.commentEmail.trim().length === 0 || this.commentBody.trim().length === 0) {
        return;
      }

      this.handleAddComment(postId);
      this.hasCommentName = false;
      this.hasCommentEmail = false;
      this.hasCommentBody = false;
    },
    handleToogleSidebar() {
      this.isSidebarOpen = true;
      this.isAddPostButtonActive = true;
    },
    addPost(title, body) {
      if (!this.userPosts[this.currentUser.email]) {
        this.userPosts[this.currentUser.email] = [];
      }

      const postId = this.userPosts[this.currentUser.email].length + 1;

      const newPost = { id: postId, title: title, body: body };

      this.userPosts[this.currentUser.email].push(newPost);

      this.postOpenStates = { ...this.postOpenStates, [postId]: false };

      localStorage.setItem('userPosts', JSON.stringify(this.userPosts));
    },

    handleSavePost(event) {
      event.preventDefault();

      const title = event.target.title.value;
      const body = event.target.body.value;

      this.hasNewTitleError = false;
      this.hasNewBodyError = false;

      if (title.trim().length === 0) {
        this.hasNewTitleError = true;
      }

      if (body.trim().length === 0) {
        this.hasNewBodyError = true;
      }

      if (this.hasNewTitleError || this.hasNewBodyError) {
        return;
      }

      if (this.editedPost.id !== null) {
        const postIndex = this.userPosts[this.currentUser.email].findIndex(post => post.id === this.editedPost.id);

        if (postIndex !== -1) {
          this.userPosts[this.currentUser.email][postIndex].title = title;
          this.userPosts[this.currentUser.email][postIndex].body = body;
          localStorage.setItem('userPosts', JSON.stringify(this.userPosts));
          this.isSidebarOpen = false;
        }
      } else {
        this.addPost(title, body);
        this.postOpenStates = { ...this.postOpenStates, [this.userPosts[this.currentUser.email].length]: true };
      }

      event.target.reset();
      this.createPostError = false;
      this.isSidebarOpen = true;
      this.isAddPostButtonActive = false;
      this.editedPost = { id: null, title: "", body: "" };
    },
    handleCancelPost(event) {
      event.preventDefault();
      this.isSidebarOpen = false;
      event.target.reset();
      this.createPostError = false;
    },
    handleOpenButton(postId) {
      const isPostOpen = this.postOpenStates[postId];

      if (Object.values(this.postOpenStates).some(state => state) && !isPostOpen) {
        this.isSidebarOpen = false;
      }

      this.postOpenStates = { ...this.postOpenStates, [postId]: !isPostOpen };
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    handleCommentForm() {
      this.isCommentForm = true;
    },
    handleDeleteComment(postId, commentId) {
      const postIndex = this.userPosts[this.currentUser.email].findIndex(post => post.id === postId);
      const commentIndex = this.userPosts[this.currentUser.email][postIndex].comments.findIndex(comment => comment.id === commentId);

      if (postIndex !== -1 && commentIndex !== -1) {
        this.userPosts[this.currentUser.email][postIndex].comments.splice(commentIndex, 1);
        localStorage.setItem('userPosts', JSON.stringify(this.userPosts));
      }
    },
    logout() {
      this.isLoggedIn = false;
      this.currentUser = null;
    }
  },
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form v-if="!isLoggedIn && isRegister" @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">Get your userId</h1>

      <div class="field">
        <label class="label" htmlFor="user-email"> Email </label>

        <div class="control has-icons-left">
          <input
            type="email"
            id="user-email"
            v-model="email"
            name="email"
            class="input"
            placeholder="Enter your email"
            required
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
        <p class="help is-danger" v-if="registrationError">{{ registrationError }}</p>
      </div>

      <div class="field">
        <button type="submit" class="button is-primary">Login</button>
      </div>
    </form>

    <form v-if="!isLoggedIn && !isRegister" @submit.prevent="handleRegistration" class="box mt-5">
      <h1 class="title is-3">You need to Register</h1>

      <div class="field">
        <label class="label" htmlFor="user-email"> Email </label>

        <div class="control has-icons-left">
          <input
            type="email"
            id="user-email"
            v-model="email"
            name="email"
            class="input"
            placeholder="Enter your email"
            required
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>

        <label class="label" htmlFor="user-name"> Name </label>

        <div class="control has-icons-left">
          <input
            type="text"
            id="user-name"
            v-model="name"
            name="name"
            class="input"
            placeholder="Enter your name"
            required
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
        <p class="help is-danger" v-if="registrationError">{{ registrationError }}</p>
      </div>

      <div class="field">
        <button type="submit" class="button is-primary">Register</button>
      </div>
    </form>
  </section>

  <div v-if="isLoggedIn && isRegister" class="wrap">
    <nav class="navbar mb-6" role="navigation" aria-label="main navigation">
      <div class="navbar-item">
        <h2 class="is-size-4">Vue List Of Posts</h2>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <div v-if="currentUser !== null" class="mr-5 mb-2">
              <p>User: {{ currentUser.name }}</p>
            </div>
    
            <a @click="logout" class="button is-light"> Logout </a>
          </div>
        </div>
      </div>
    </nav>

    <div class="tile is-parent">
      <div class="tile is-child box is-success">
        <div class="block">
          <div class="block is-flex is-justify-content-space-between">
            <p class="title">Posts</p>
            <button
              @click="handleToogleSidebar"
              type="button"
              class="button is-link"
            >
              Add New Post
            </button>
          </div>
          <table class="table is-fullwidth is-striped is-hoverable is-narrow">
            <thead>
              <tr class="has-background-link-light">
                <th>ID</th>
                <th>Title</th>
                <th class="has-text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!userPosts.hasOwnProperty(currentUser.email)">
                <td colspan="3" class="has-text-centered">No posts yet.</td>
              </tr>
              <template v-else>
                <tr v-for="post in userPosts[currentUser.email]" :key="post.id">
                  <td>
                    {{ post.id }}
                  </td>
                  <td>{{ post.title }}</td>
                  <td class="has-text-right is-vcentered">
                    <button
                      type="button"
                      class="button is-link"
                      @click="handleOpenButton(post.id)"
                    >
                      {{ postOpenStates[post.id] ? 'Close' : 'Open' }}
                    </button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="isSidebarOpen" class="tile is-parent is-8-desktop Sidebar Sidebar--open">
        <div v-if="isAddPostButtonActive && !isOpenActive" class="tile is-child box is-success ">
          <div class="tile is-child box is-success ">
            <div class="content">
              <h2>Create new post</h2>

              <form @submit.prevent="handleSavePost" @reset="handleCancelPost">
                <div class="field" data-cy="TitleField">
                  <label class="label" htmlFor="title">
                    Title
                  </label>
                  <div class="control has-icons-left has-icons-right">
                    <input
                      type="text"
                      name="{name}"
                      id="title"
                      placeholder="Post title"
                      class="input"
                      :class="{'is-danger': hasNewTitleError}"
                    />
                    <span class="icon is-small is-left">
                      <i class="fas fa-user"></i>
                    </span>

                    <span
                      v-if="hasNewTitleError"
                      class="icon is-small is-right"
                      :class="{'has-text-danger': hasNewTitleError}"
                      data-cy="ErrorIcon"
                    >
                      <i class="fas fa-exclamation-triangle"></i>
                    </span>
                  </div>

                  <p v-if="hasNewTitleError" class="help is-danger" data-cy="ErrorMessage">error text</p>
                </div>
                <div class="field" data-cy="BodyField">
                  <label class="label" htmlFor="body">
                    Write post body
                  </label>
                  <div class="control">
                    <textarea
                      type="text"
                      name="{name}"
                      id="body"
                      placeholder="Post body"
                      class="input"
                      :class="{'is-danger': hasNewBodyError}"
                    ></textarea>

                    <span
                      v-if="hasNewBodyError"
                      class="icon is-small is-right"
                      :class="{'has-text-danger': hasNewBodyError}"
                      data-cy="ErrorIcon"
                    >
                      <i class="fas fa-exclamation-triangle"></i>
                    </span>
                  </div>

                  <p v-if="hasNewBodyError" class="help is-danger" data-cy="ErrorMessage">error text</p>
                </div>

                <div class="field is-grouped">
                  <div class="control">
                    <button type="submit" class="button is-link">Save</button>
                  </div>
                  <div class="control">
                    <button @click="handleCancelPost" type="reset" class="button is-link is-light">Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div v-if="isOpenActive || !isAddPostButtonActive" class="tile is-child box is-success">
          <div v-for="post in userPosts[currentUser.email]" :key="post.id">
            <template v-if="post && postOpenStates[post.id]">
              <div class="block">
                <div class="is-flex is-justify-content-space-between is-align-items-center">
                  <h2 class="title">#{{ post.id }}: {{ post.title }}</h2>
                  <div class="is-flex">
                    <span @click="handleEditPost(post.id)" class="icon is-small is-right is-clickable">
                      <i class="fas fa-pen-to-square"></i>
                    </span>
                    <span @click="handleDeletePost(post.id)" class="icon is-small is-right has-text-danger is-clickable ml-3">
                      <i class="fas fa-trash"></i>
                    </span>
                  </div>
                </div>
                <p data-cy="PostBody">{{ post.body }}</p>
              </div>
              <div class="block">
                <p class="title is-4" v-if="!post.comments || post.comments.length === 0">No comments yet</p>
                <article v-for="comment in post.comments" :key="comment.id" class="message is-small">
                  <div class="message-header">
                    <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>
                    <span @click="handleDeleteComment(post.id, comment.id)" class="icon is-small is-right is-clickable ml-3">
                      <i class="fa-solid fa-circle-xmark"></i>
                    </span>
                  </div>
                  <div class="message-body">{{ comment.body }}</div>
                </article>
              </div>
              <button v-if="!isCommentForm" @click="handleCommentForm" type="button" class="button is-link">Write a comment</button>
              <form v-if="isCommentForm" @submit.prevent="handleSaveComment(post.id)">
                <div class="field" data-cy="CommentNameField">
                  <label class="label" htmlFor="comment-name">
                    Author Name
                  </label>
                  <div class="control has-icons-left has-icons-right">
                    <input
                      type="text"
                      name="{name}"
                      id="comment-name"
                      v-model="commentName"
                      placeholder="Name Surname"
                      class="input"
                      :class="{'is-danger': hasCommentName}"
                      required
                    />
                    <span class="icon is-small is-left">
                      <i class="fas fa-user"></i>
                    </span>

                    <span
                      v-if="hasCommentName"
                      class="icon is-small is-right"
                      :class="{'has-text-danger': hasCommentName}"
                      data-cy="ErrorIcon"
                    >
                      <i class="fas fa-exclamation-triangle"></i>
                    </span>
                  </div>

                  <p v-if="hasCommentName" class="help is-danger" data-cy="ErrorMessage">error text</p>
                </div>
                <div class="field" data-cy="CommentEmailField">
                  <label class="label" htmlFor="comment-email">
                    Author's Email
                  </label>
                  <div class="control has-icons-left has-icons-right">
                    <input
                      type="email"
                      name="{comment-email}"
                      id="comment-email"
                      v-model="commentEmail"
                      placeholder="Your Email"
                      class="input"
                      :class="{'is-danger': hasCommentEmail}"
                    />

                    <span class="icon is-small is-left">
                      <i class="fas fa-envelope"></i>
                    </span>

                    <span
                      v-if="hasCommentEmail"
                      class="icon is-small is-right"
                      :class="{'has-text-danger': hasCommentEmail}"
                      data-cy="ErrorIcon"
                    >
                      <i class="fas fa-exclamation-triangle"></i>
                    </span>
                  </div>

                  <p v-if="hasCommentEmail" class="help is-danger" data-cy="ErrorMessage">error text</p>
                </div>
                <div class="field" data-cy="BodyField">
                  <label class="label" htmlFor="comment-body">
                    Write post body
                  </label>
                  <div class="control has-icons-right">
                    <textarea
                      type="text"
                      name="{name}"
                      id="comment-body"
                      v-model="commentBody"
                      required
                      placeholder="Post body"
                      class="input"
                      :class="{'is-danger': hasCommentBody}"
                    ></textarea>
                      <span
                        v-if="hasCommentBody"
                        class="icon is-small is-right"
                        :class="{'has-text-danger': hasCommentBody}"
                        data-cy="ErrorIcon"
                      >
                        <i class="fas fa-exclamation-triangle"></i>
                      </span>
                  </div>

                  <p v-if="hasCommentBody" class="help is-danger" data-cy="ErrorMessage">error text</p>
                </div>

                <div class="field is-grouped">
                  <div class="control">
                    <button type="submit" class="button is-link">Add Comment</button>
                  </div>
                  <div class="control">
                    <button type="reset" @click="isCommentForm = false" class="button is-link is-light">Cancel</button>
                  </div>
                </div>
              </form>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style>
</style>
<!-- <script>
import { deleteUserPost } from "../api/usersData";
import addComment from "./addComment.vue";
import Comment from "./comment.vue";

export default {
  name: "PostDetails",
  components: {
    addComment,
    Comment,
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
    currentUserId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isAddCommentVisible: false,
    };
  },
  methods: {
    async removePost() {
      try {
        await deleteUserPost(this.currentUserId, this.post.id);
        this.$emit("load-posts");
        this.$emit("close");
      } catch (err) {
        console.error("Error deleting post:", err);
      }
    },
    editPost() {
      this.$emit("edit-post", this.post);
    },
    toggleAddComment() {
      this.isAddCommentVisible = !this.isAddCommentVisible;
    },
    addCommentToPost(newComment) {
      if (newComment) {
        if (!this.post.comments) {
          this.post.comments = [];
        }
        this.post.comments.push(newComment);
        this.isAddCommentVisible = false;
      } else {
        console.error("The comment was not forwarded.");
      }
    },
    deleteCommentFromPost(index) {
      if (this.post.comments && this.post.comments.length > index) {
        this.post.comments.splice(index, 1);
      }
    },
  },
};
</script>

<template>
  <div class="tile is-parent is-8-desktop Sidebar Sidebar--open">
    <div v-if="post" class="tile is-child box is-success">
      <div class="content">
        <div
          class="is-flex is-justify-content-space-between is-align-items-center"
        >
          <h2>#{{ post.id }}: {{ post.title }}</h2>
          <div class="is-flex">
            <span class="icon is-small is-right is-clickable" @click="editPost">
              <i class="fas fa-pen-to-square"></i>
            </span>
            <span
              class="icon is-small is-right has-text-danger is-clickable ml-3"
              @click="removePost"
            >
              <i class="fas fa-trash"></i>
            </span>
          </div>
        </div>
        <p data-cy="PostBody">{{ post.body }}</p>
      </div>
      <div class="block" v-if="!isAddCommentVisible">
        <div v-if="post.comments && post.comments.length > 0">
          <div
            v-for="(comment, index) in post.comments"
            :key="index"
            class="block"
          >
            <Comment
              :name="comment.name"
              :email="comment.email"
              :body="comment.body"
              :index="index"
              @delete-comment="deleteCommentFromPost"
            />
          </div>
        </div>
        <div class="block" v-else>
          <p class="title is-4" data-cy="NoCommentsMessage">No comments yet</p>
        </div>
      </div>
      <div class="block" v-if="!isAddCommentVisible">
        <button
          data-cy="WriteCommentButton"
          type="button"
          class="button is-link"
          @click="toggleAddComment"
        >
          Write a comment
        </button>
      </div>

      <addComment
        v-if="isAddCommentVisible"
        @submit-comment="addCommentToPost"
        @cancel-comment="toggleAddComment"
      />
    </div>
  </div>
</template>

<style scoped>
.button.is-link {
  height: 50%;
  line-height: normal;
  padding: 0.5em 1em;
  max-height: 3rem;
  display: inline-flex;
  align-items: center;
}
</style> -->
<script>
import { deleteUserPost } from "../api/usersData";
import addComment from "./addComment.vue";
import Comment from "./comment.vue";

export default {
  name: "PostDetails",
  components: {
    addComment,
    Comment,
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
    currentUserId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isAddCommentVisible: false,
    };
  },
  methods: {
    async removePost() {
      try {
        await deleteUserPost(this.currentUserId, this.post.id);
        this.$emit("load-posts");
        this.$emit("close");
      } catch (err) {
        console.error("Error deleting post:", err);
      }
    },
    editPost() {
      this.$emit("edit-post", this.post);
    },
    toggleAddComment() {
      this.isAddCommentVisible = !this.isAddCommentVisible;
    },
    addCommentToPost(newComment) {
      if (newComment) {
        if (!this.post.comments) {
          this.post.comments = [];
        }
        this.post.comments.push(newComment);
        this.isAddCommentVisible = false;
      } else {
        console.error("The comment was not forwarded.");
      }
    },
    deleteCommentFromPost(index) {
      if (this.post.comments && this.post.comments.length > index) {
        this.post.comments.splice(index, 1);
      }
    },
  },
};
</script>

<template>
  <div class="tile is-parent is-8-desktop Sidebar Sidebar--open">
    <div v-if="post" class="tile is-child box is-success">
      <div class="content">
        <div
          class="is-flex is-justify-content-space-between is-align-items-center"
        >
          <h2>#{{ post.id }}: {{ post.title }}</h2>
          <div class="is-flex">
            <span class="icon is-small is-right is-clickable" @click="editPost">
              <i class="fas fa-pen-to-square"></i>
            </span>
            <span
              class="icon is-small is-right has-text-danger is-clickable ml-3"
              @click="removePost"
            >
              <i class="fas fa-trash"></i>
            </span>
          </div>
        </div>
        <p data-cy="PostBody">{{ post.body }}</p>
      </div>
      <div class="block" v-if="!isAddCommentVisible">
        <div v-if="post.comments && post.comments.length > 0">
          <div
            v-for="(comment, index) in post.comments"
            :key="index"
            class="block"
          >
            <Comment
              :name="comment.name"
              :email="comment.email"
              :body="comment.body"
              :index="index"
              @delete-comment="deleteCommentFromPost"
            />
          </div>
        </div>
        <div class="block" v-else>
          <p class="title is-4" data-cy="NoCommentsMessage">No comments yet</p>
        </div>
      </div>
      <div class="block" v-if="!isAddCommentVisible">
        <button
          data-cy="WriteCommentButton"
          type="button"
          class="button is-link"
          @click="toggleAddComment"
        >
          Write a comment
        </button>
      </div>

      <addComment
        v-if="isAddCommentVisible"
        @submit-comment="addCommentToPost"
        @cancel-comment="toggleAddComment"
      />
    </div>
  </div>
</template>

<style scoped>
.button.is-link {
  height: 50%;
  line-height: normal;
  padding: 0.5em 1em;
  max-height: 3rem;
  display: inline-flex;
  align-items: center;
}
</style>

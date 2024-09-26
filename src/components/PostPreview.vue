<script>
import NoCommentsYet from './NoCommentsYet.vue';
import Comment from './Comment.vue';
import WriteComment from './WriteComment.vue';
import { removePost } from '../api/post';
import { getPostComments } from '../api/comment';
import Loader from './Loader.vue';
import PostLoader from './PostLoader.vue';

  export default {
    name: "PostPreview",
    props: {
        post: Object,
    },
    components: {
    NoCommentsYet,
    WriteComment,
    Comment,
    Loader,
    PostLoader
},
    data() {
      return {
        comments: [],
        isLoading: false,
        prevPostId: null,
      }
    },
    mounted() {
      this.getComments(this.post.id);
      this.prevPostId = this.post.id;
    },
    beforeUpdate() {
      if (this.post.id !== this.prevPostId) {
        this.getComments(this.post.id);
        this.prevPostId = this.post.id;
      }
    },
    methods: {
      async getComments(id) {
        try {
          this.isLoading = true;

          const { data } = await getPostComments(id);

          this.comments = data;
        } catch {
          throw new Error('Fail get comments');
        } finally {
          this.isLoading = false;
        }
      },
      async deletePost(id) {
        await removePost(id);
        this.$emit('update-posts');
      }
    },
    emits: ['on-updating-post', 'update-posts'],
  }
</script>

<template>
  <div class="block">
    <div
      class="is-flex is-justify-content-space-between is-align-items-center"
    >
      <h2>#{{ post.id }}: {{ post.title }}</h2>

      <div class="is-flex">
        <span
          class="icon is-small is-right is-clickable"
          @click="$emit('on-updating-post', post)"
        >
          <i class="fas fa-pen-to-square"></i>
        </span>

        <span
          class="icon is-small is-right has-text-danger is-clickable ml-3"
          @click="deletePost(post.id)"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>

    <p data-cy="PostBody">{{ post.body }}</p>
  </div>

  <Comment
    v-if="comments.length > 0 && !isLoading"
    v-for="comment of comments"
    :comment="comment"
    @update-comments="getComments(post.id)"
  />

  <NoCommentsYet
    v-if="comments.length <= 0 && !isLoading"
  />

  <PostLoader v-if="isLoading">
    <Loader />
  </PostLoader>

  <WriteComment
    :postId="post.id"
    @update-comments="getComments(post.id)"
  />
</template>

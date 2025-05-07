<script lang="ts">
  import { defineComponent } from 'vue';
  import Sidebar from '@/UI/Sidebar.vue'

  import { PostsApi } from '@/api/post.api'

  import Post from '@/components/Post.vue'
  import AddPostForm from '@/components/AddPostForm.vue'
  import PostPreview from '@/components/PostPreview.vue'

  export default defineComponent({
    components: { PostPreview, Sidebar, PostForm: AddPostForm, Post },
    props: {
      userId: Number,
    },
    data() {
      return {
        posts: [] as typeof Post[],
        addPostFormOpened: false,
        editPostFormOpened: false,
        currentPostId: 0,
        newPost: {
          title: '',
          body: '',
          userId: this.userId,
        },
        postToUpdate: {
          title: this.currentPostId ? this.posts().find(post => post.id === this.currentPostId) : '',
          body: this.currentPostId ? this.posts().find(post => post.id === this.currentPostId) : '',
          id: 0,
        }
      }
    },
    mounted() {
      PostsApi.getAll(this.userId).then(response => {
        this.posts = response.data;
      })
    },
    methods: {
      changeTitleNewPostHandler($event: InputEvent) {
        const input = $event.target as HTMLInputElement;

        this.newPost.title = input.value;
      },
      changeBodyNewPostHandler($event: InputEvent) {
        const input = $event.target as HTMLInputElement;

        this.newPost.body = input.value;
      },

      changeTitlePostUpdateHandler($event: InputEvent) {
        const input = $event.target as HTMLInputElement;

        this.postToUpdate.title = input.value;
      },
      changeBodyPostUpdateHandler($event: InputEvent) {
        const input = $event.target as HTMLInputElement;

        this.postToUpdate.body = input.value;
      },

      createPostHandler($event: SubmitEvent) {
        $event.preventDefault()

        PostsApi.create(this.newPost).then(response => {
          this.posts.push(response.data)
        })

        this.addPostFormOpened = false;
      },
      addPostFormOpenHandler() {
        this.addPostFormOpened = true;
        this.editPostFormOpened = false;
      },
      setCurrentPostHandler(postId: number) {
        if (this.currentPostId === postId && !this.editPostFormOpened) {
          this.currentPostId = 0;

          return;
        }

        this.addPostFormOpened = false;
        this.editPostFormOpened = false;
        this.currentPostId = postId;
      },
      deletePostHandler() {
        if (this.currentPostId === 0) {
          return;
        }

        PostsApi.delete(this.currentPostId)
          .then(() => {
            this.posts = this.posts.filter(post => post.id !== this.currentPostId);

            this.currentPostId = 0;
          })
      },
      editPostFormOpenHandler(postId: number) {
        this.postToUpdate.title = this.currentPostId ? this.posts.find(post => post.id === this.currentPostId)?.title : '';
        this.postToUpdate.body = this.currentPostId ? this.posts.find(post => post.id === this.currentPostId)?.body : '';
        this.postToUpdate.id = postId;

        this.editPostFormOpened = true;
      },
      updatePostHandler($event: SubmitEvent) {
        $event.preventDefault()

        PostsApi.update(this.postToUpdate)
          .then(() => {
            this.editPostFormOpened = false;

            PostsApi.getAll(this.userId).then(res => {
              this.posts = res.data;
            })
          })
      }
    }
  })
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button
            type="button"
            class="button is-link"
            @click="addPostFormOpenHandler"
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
            <Post
              v-for="post of posts"
              :post="post"
              :postId="currentPostId"
              @choosePost="setCurrentPostHandler"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <Sidebar :class="{'Sidebar--open': addPostFormOpened || !!currentPostId}">
    <PostForm
      v-if="addPostFormOpened"
      title="Create new post"
      @close-form="addPostFormOpened = false"
      @title-change="changeTitleNewPostHandler"
      @body-change="changeBodyNewPostHandler"
      @postEvent="createPostHandler"
    />

    <PostForm
      v-if="editPostFormOpened"
      title="Edit the post"
      :postTitle="postToUpdate.title"
      :postBody="postToUpdate.body"
      @close-form="editPostFormOpened = false"
      @title-change="changeTitlePostUpdateHandler"
      @body-change="changeBodyPostUpdateHandler"
      @postEvent="updatePostHandler"
    />

    <PostPreview
      v-if="!!currentPostId && !editPostFormOpened && !addPostFormOpened"
      :post="posts.find(post => post.id === currentPostId)"
      @deletePost="deletePostHandler"
      @edit-post-open="editPostFormOpenHandler"
    />
  </Sidebar>
</template>

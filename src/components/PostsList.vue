<script lang="ts">
  import { defineComponent } from 'vue';
  import Post from '@/components/Post.vue'
  import { PostsApi } from '@/api/post.api'
  import AddPostForm from '@/components/AddPostForm.vue'
  import Sidebar from '@/UI/Sidebar.vue'

  export default defineComponent({
    components: { Sidebar, AddPostForm, Post },
    props: {
      userId: Number,
    },
    data() {
      return {
        posts: [] as typeof Post[],
        addPostFormOpened: false,
        newPost: {
          title: '',
          body: '',
          userId: this.userId,
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

      createPostHandler($event: SubmitEvent) {
        $event.preventDefault()

        PostsApi.create(this.newPost).then(response => {
          this.posts.push(response.data)
        })

        this.addPostFormOpened = false;
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
            @click="addPostFormOpened = !addPostFormOpened"
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
            <Post v-for="post of posts" :post="post" />
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <Sidebar :class="{'Sidebar--open': addPostFormOpened}">
    <AddPostForm
      v-if="addPostFormOpened"
      @close-form="addPostFormOpened = !addPostFormOpened"
      @title-change="changeTitleNewPostHandler"
      @body-change="changeBodyNewPostHandler"
      @create-post="createPostHandler"
    />
  </Sidebar>
</template>

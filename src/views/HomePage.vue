<script>
  import { deletePost, getPosts } from '@/api/posts';
  import { getLocalUser } from '@/helpers/getLocalUser';
  import PostLoader from '@/components/PostLoader.vue';
  import HeaderComponent from '@/components/HeaderComponent.vue';
  import PostList from '@/components/PostList.vue';
  import MessageComponent from '@/components/MessageComponent.vue';
  import SidebarComponent from '@/components/SidebarComponent.vue';
  import AddPost from '@/components/AddPost.vue';
  import PostPreview from '@/components/PostPreview.vue';
  import NoCommentsYet from '@/components/NoCommentsYet.vue';

  export default {
    name: 'HomePage',
    components: {
      HeaderComponent,
      PostLoader,
      PostList,
      MessageComponent,
      SidebarComponent,
      AddPost,
      PostPreview,
      NoCommentsYet,
    },
    data() {
      return {
        loading: false,
        errorMessage: '',
        posts: [],
        user: getLocalUser(),
        sidebarIsOpen: false,
        openedPostId: null,
        editingPost: null,
        addingPost: false,
      };
    },
    mounted() {
      this.errorMessage = '';
      this.loading = true;
      getPosts(this.user.id)
        .then(({ data }) => {
          this.posts = data;
        })
        .catch(() => {
          this.errorMessage = 'Unable to load posts';
        })
        .finally(() => {
          this.loading = false;
        });
    },
    methods: {
      handlerAddNewPost() {
        this.addingPost = true;
        this.openedPostId = null;
        if (!this.sidebarIsOpen) {
          this.sidebarIsOpen = true;
        }
      },
      handlerCloseSidebar() {
        if (this.editingPost) {
          this.openedPostId = this.editingPost.id;
        } else {
          this.sidebarIsOpen = false;
          this.openedPostId = null;
        }
        
        this.addingPost = false;
        this.editingPost = null;
      },
      setOpenedPostId(postId) {
        this.addingPost = false;
        if (postId === this.openedPostId) {
          this.sidebarIsOpen = false;
          this.openedPostId = null;
        } else if (this.openedPostId === null) {
          this.sidebarIsOpen = true;
          this.openedPostId = postId;
        } else if (postId !== this.openedPostId && this.openedPostId !== null) {
          this.openedPostId = postId;
        }
      },
      handlerAddPost(newPost) {
        this.posts = [...this.posts, newPost];
        this.openedPostId = newPost.id;
        this.addingPost = false;
      },
      handlerDeletePost() {
        this.sidebarIsOpen = false;
        this.loading = true;
        deletePost(this.openedPostId)
        .then(() => {
          this.posts = this.posts.filter(post => post.id !== this.openedPostId);
        })
        .catch(() => {
          this.errorMessage = 'Unable to delete post';
        })
        .finally(() => {
          this.loading = false;
          this.openedPostId = null;
        });
      },
      handlerEditPost() {
        this.editingPost = this.posts.find(post => post.id === this.openedPostId);
        this.openedPostId = null;
        this.addingPost = true;
      },
      postUpdated(updatedPost) {
        this.openedPostId = updatedPost.id;
        this.addingPost = false;
        this.posts = this.posts.map(post => post.id === updatedPost.id ? updatedPost : post);
        this.editingPost = null;
      }
    },
  }
</script>

<template>
  <header>
    <HeaderComponent :userName="user.name"/>
  </header>
  <main class="section">
    <div class="container">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <div class="tile is-child box is-success">
            <div class="block">
              <div class="block is-flex is-justify-content-space-between">
                <h2 class="is-size-3">Posts</h2>
                <button 
                  type="button" 
                  class="button is-link"
                  :class="{ 'is-light' : addingPost }"
                  @click="handlerAddNewPost"
                >
                  Add New Post
                </button>
              </div>

              <MessageComponent 
                :active="errorMessage !== ''"
                @hide="errorMessage = ''"
              >
                <p>{{ errorMessage }}</p>
              </MessageComponent>

              <PostLoader v-if="loading" />

              <template v-else>
                <template v-if="!errorMessage">
                  <PostList 
                    :posts="posts"
                    :openedPostId="openedPostId"
                    @set-opened-post-id="setOpenedPostId($event)"
                    v-if="posts.length > 0"
                  />

                  <NoCommentsYet :text="'posts'" v-else/>
                </template>
              </template>
            </div>
          </div>
        </div>

        <SidebarComponent :active="sidebarIsOpen">
          <AddPost
            :title="editingPost ? 'Post editing' : 'Create new post'"
            :postToEdit="editingPost"
            :userId="user.id"
            @close="handlerCloseSidebar"
            @add-post="handlerAddPost"
            @post-updated="postUpdated"
            v-if="addingPost"
          />

          <PostPreview
            :post="posts.find(post => post.id === openedPostId)"
            @delete="handlerDeletePost"
            @edit-post="handlerEditPost"
            :key="openedPostId"
            v-if="openedPostId"
          />
        </SidebarComponent>
      </div>
    </div>
  </main>
</template>
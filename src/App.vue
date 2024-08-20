<script>
import { getPosts } from './api/posts';
import { getUsers } from './api/users';
import Errors from './components/Errors.vue';
import Loader from './components/Loader.vue';
import PostDetails from './components/PostDetails.vue';
import PostsList from './components/PostsList.vue';
import UserSelector from './components/UserSelector.vue';

export default {
  components: {
    UserSelector,
    Loader,
    Errors,
    PostsList,
    PostDetails
  },
  data () {
    return {
      users: [],
      selectedUser: null,
      isLoadingPosts: false,
      loadPostError: false,
      userPosts: [],
      selectedPost: null,
    }
  },
  computed: {
    isPostsShown() {
      return !this.isLoadingPosts && this.selectedUser && !this.loadPostError;
    }
  },
  watch: {
    selectedUser() {
      this.isLoadingPosts = true;
      this.loadPostError = false;
      this.selectedPost = null;

      getPosts(this.selectedUser.id)
      .then(({ data }) => {
        this.userPosts = data;
      })
      .catch(() =>{
        this.loadPostError = true;
      })
      .finally(() => {
        this.isLoadingPosts = false;
      })
    }
  },
  mounted() {
    getUsers()
    .then(({ data }) => {
      this.users = data;
    })
  }
}


</script>

<template>
  <main class="section">
    <div class="container">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <div class="tile is-child box is-success">
            <div class="block">
              <UserSelector 
                :users="users" 
                :selectedUser="selectedUser"
                @changeSelectedUser="selectedUser = $event"
              />
            </div>

            <div class="block" >
              <p v-if="!selectedUser">No user selected</p>
              
              
              <Loader v-if="isLoadingPosts"/>

              
              <Errors v-if="loadPostError" />

              <div class="notification is-warning" v-if="isPostsShown && !userPosts.length">
                No posts yet
              </div>
              


              <PostsList
                :posts="userPosts"
                :selectedPost="selectedPost"
                @changeSelectedPost="selectedPost = $event"
                v-if="isPostsShown && userPosts.length"
              />

            </div>
          </div>
        </div>

        <div 
          class="tile is-parent is-8-desktop Sidebar"
          :class="{ 'Sidebar--open': selectedPost }"
        >
          <div class="tile is-child box is-success ">
            <PostDetails :post="selectedPost" v-if="selectedPost"/>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;

  @media (min-width: 769px) {
    max-width: 0;
  }

  &--open {
    opacity: 1;

    @media (min-width: 769px) {
      max-width: 50%;
    }
  }
}

.message-body {
  white-space: pre-line;
}
</style>
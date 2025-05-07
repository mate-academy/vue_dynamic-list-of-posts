<script>
import PostList from "./PostList.vue";

export default {
  components: {
    PostList,
  },
  name: "Header",
  data() {
    return {
      name: this.$route.query.name,
    };
  },
  methods: {
    handleLogout(event) {
      event.preventDefault();
      this.$router.push({ path: "/" });
    },
  },
};
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h2 class="is-size-4">Vue List Of Posts</h2>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5 mb-2">
            <p>User: {{ name }}</p>
          </div>

          <a @click="handleLogout" class="button is-light"> Logout </a>
        </div>
      </div>
    </div>
  </nav>

  <PostList :userId="name" />
</template>

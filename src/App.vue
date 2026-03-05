<script lang="ts">
import 'bulma/bulma.scss'
import Sidebar from './components/Sidebar/Sidebar.vue'
import AddPost from './components/AddPost/AddPost.vue'
import Comment from './components/Comment/Comment.vue'
import Header from './components/Header/Header.vue'
import InputField from './components/InputField/InputField.vue'
import Loader from './components/Loader/Loader.vue'
import Login from './components/Login/Login.vue'
import NeedToRegister from './components/NeedToRegister/NeedToRegister.vue'
import PostList from './components/PostList/PostList.vue'
import PostPreview from './components/PostPreview/PostPreview.vue'
import TextAreaField from './components/TextAreaField/TextAreaField.vue'

export default {
  data() {
    return {
      posts: [],
    }
  },
  components: {
    Sidebar,
    AddPost,
    Comment,
    Header,
    InputField,
    Loader,
    Login,
    NeedToRegister,
    PostList,
    PostPreview,
    TextAreaField,
  },
}
</script>

<template>
  <Header />
  <!-- <Sidebar /> -->
  <!-- <AddPost /> -->
  <!-- <Comment /> -->
  <!-- <InputField /> -->
  <!-- <Login /> -->
  <!-- <Loader /> -->
  <!-- <NeedToRegister /> -->
  <PostList />
  <!-- <PostPreview /> -->
  <!-- <TextAreaField /> -->
</template>

<style scoped></style>

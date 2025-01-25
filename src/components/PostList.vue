<script setup>
import SidebarField from "./SidebarField.vue";
import { usePostStore } from "@/stores/posts";

const postStore = usePostStore();

const handleDetailsPost = (post) => {
  if (postStore.isShowDetailsPost && postStore.currentPost?.id === post.id) {
    postStore.notShowDetailsPost();
    postStore.setCurrentPost(post);
  } else {
    postStore.showDetailsPost();
    postStore.notShowPostForm();
    postStore.setCurrentPost(post);
  }
};

const handlePostForm = () => {
  postStore.showPostForm();
  postStore.notShowDetailsPost();
}
</script>

<template>
  <div class="container">
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <div class="tile is-child box is-success">
          <div class="block">
            <div class="block is-flex is-justify-content-space-between">
              <p class="title">Posts</p>
              <button type="button" class="button is-link" :class="{'is-light': postStore.isShowPostForm}" @click="handlePostForm">Add New Post</button>
            </div>

            <h3 v-if="!postStore.posts.length" class="has-text-centered mt-2">
              No posts yet.
            </h3>

            <table
              v-else
              class="table is-fullwidth is-striped is-hoverable is-narrow"
            >
              <thead>
                <tr class="has-background-link-light">
                  <th>ID</th>
                  <th>Title</th>
                  <th class="has-text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="post of postStore.posts" :key="post.id">
                  <td>{{ post.id }}</td>
                  <td>{{ post.title }}</td>
                  <td class="has-text-right is-vcentered">
                    <button
                      type="button"
                      class="button is-link"
                      :class="{'is-light': !(postStore.isShowDetailsPost && postStore.currentPost?.id === post.id)}"
                      @click="handleDetailsPost(post)"
                    >
                      {{
                        postStore.isShowDetailsPost && postStore.currentPost?.id === post.id
                          ? "Close"
                          : "Open"
                      }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <SidebarField />
    </div>
  </div>
</template>

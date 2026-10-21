<script setup>
import PostLoader from "./PostLoader.vue";
import Sidebar from "./Sidebar.vue";
import { usePostStore } from "@/store/postStore.js";

const globalState = usePostStore();

</script>

<template>
  <div class="container">
    <div class="tile is-ancestor custom-layout-container">
      <div class="tile is-parent main-table-tile">
        <div class="tile is-child box is-success">
          <div class="block">
            <div class="block is-flex is-justify-content-space-between">
              <p class="title">Posts</p>
              <button
                @click="globalState.handleShowPost(true)"
                type="button"
                class="button is-link"
                :class="{ 'is-light': globalState.state.showCreatePost }"
              >
                Add New Post
              </button>
            </div>
            <PostLoader v-if="globalState.state.isLoading"/>
            <h3 v-if="(!globalState.state.isLoading && globalState.state.postsList.length === 0) || globalState.state.getPostError" class="mt-2 has-text-centered" :class="{'has-text-danger': !!globalState.state.getPostError}">
              {{!globalState.state.getPostError ? 'No posts yet' : globalState.state.getPostError}}
            </h3>
            <table
              v-if="globalState.state.postsList.length !== 0"
              class="table is-fullwidth is-striped is-hoverable is-narrow"
            >
              <thead>
                <tr class="has-background-link-light is-light">
                  <th>ID</th>
                  <th>Title</th>
                  <th class="has-text-right">Actions</th>
                </tr>
              </thead>
              <tbody v-for="post in globalState.state.postsList" :key="post.id">
                <tr>
                  <td>{{ post.id }}</td>
                  <td>{{ post.title }}</td>
                  <td class="has-text-right is-vcentered">
                    <button
                      type="button"
                      class="button is-link"
                      :class="{
                        'is-light': !(
                          globalState.state.showComments &&
                          globalState.state.activePostId === post.id
                        ),
                      }"
                      @click="globalState.handleToggleComments(post.id)"
                    >
                      {{ (globalState.state.showComments && globalState.state.activePostId === post.id) ? "Close" : "Open" }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Sidebar v-model="globalState.state.showCreatePost" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, watch, type Ref } from "vue";
import type { Post } from "../types/Post";
import type { User } from "../types/User";
import { PostsAPI } from "../api/client";
import PostLoader from "./PostLoader.vue";

const user = inject<Ref<User | null>>("user");
const props = defineProps<{ post?: Post | null }>();
const title = ref(props.post?.title || "");
const body = ref(props.post?.body || "");
const isSubmitting = ref(false);
const error = ref<string | null>(null);

const emit = defineEmits<{
  close: [];
  postAdded: [post: Post];
  postUpdated: [post: Post];
}>();

watch(title, () => {
  if (error.value === "Title is required") {
    error.value = null;
  }
});

watch(body, () => {
  if (error.value === "Body is required") {
    error.value = null;
  }
});

const handleCancel = () => {
  emit("close");
};

const addPost = async () => {
  if (!user?.value) {
    error.value = "User not found";
    return;
  }

  if (!title.value.trim()) {
    error.value = "Title is required";
    return;
  }

  if (!body.value.trim()) {
    error.value = "Body is required";
    return;
  }

  try {
    isSubmitting.value = true;
    error.value = null;

    const postData: Omit<Post, "id"> = {
      userId: user.value.id,
      title: title.value.trim(),
      body: body.value.trim(),
    };

    if (props.post) {
      // Editing existing post
      const updatedPost = await PostsAPI.editPost(
        { ...props.post, ...postData },
        props.post.id
      );
      emit("postUpdated", updatedPost);
    } else {
      // Adding new post
      const createdPost = await PostsAPI.addPost(postData as Post);
      emit("postAdded", createdPost);
    }
  } catch (err) {
    error.value = "Failed to create post";
  } finally {
    isSubmitting.value = false;
  }
};

const handleSubmit = (e: Event) => {
  e.preventDefault();
  addPost();
};
</script>

<template>
  <div class="content">
    <h2>{{ props.post ? "Edit Post" : "Create New Post" }}</h2>

    <PostLoader v-if="isSubmitting"></PostLoader>

    <form v-else @submit="handleSubmit">
      <div class="field">
        <label class="label" htmlFor="postTitle"> Title </label>
        <div class="control has-icons-left has-icons-right">
          <input
            v-model="title"
            type="text"
            id="postTitle"
            placeholder="Post title"
            class="input"
            :class="{ 'is-danger': error && !title.trim() }"
            :disabled="isSubmitting"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>

          <span v-if="error==='Title is required'"
            class="icon is-small is-right has-text-danger"
          >
            <i class="fas fa-exclamation-triangle"></i>
          </span>
        </div>

        <p v-if="error==='Title is required'" class="help is-danger">Title is required</p>
      </div>

      <div className="field">
        <label className="label" htmlFor="postBody"> Text </label>
        <div class="control">
          <textarea
            v-model="body"
            id="postBody"
            name="postBody"
            placeholder="Post content"
            class="textarea"
            :class="{ 'is-danger': error && !body.trim() }"
            :disabled="isSubmitting"
            rows="5"
          ></textarea>
        </div>

        <p v-if="error==='Body is required'" className="help is-danger">Body is required</p>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button 
            type="submit" 
            class="button is-primary"
            :disabled="isSubmitting"
            :class="{ 'is-loading': isSubmitting }"
          >
            Save
          </button>
        </div>
        <div class="control">
          <button
            type="reset"
            class="button is-primary is-light"
            @click="handleCancel"
            :disabled="isSubmitting"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

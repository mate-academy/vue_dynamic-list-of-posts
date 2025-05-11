<script setup>
import { usePostsStore } from "@/store/storePosts";
import { useUserStore } from "@/store/storeUser";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const { setIsEditing, editPost, setSelectedPost, selectedPost } =
  usePostsStore();
const { user } = useUserStore();

const title = ref(selectedPost.title);
const body = ref(selectedPost.body);
const isLoading = ref(false);
const errors = ref({ title: false, body: false });

watch([() => title.value, () => body.value], ([newTitle, newBody]) => {
  errors.value = { title: false, body: false };
});

const handleSubmit = async () => {
  if (!title.value) {
    errors.value = { ...errors.value, title: true };
  }

  if (!body.value) {
    errors.value = { ...errors.value, body: true };
  }

  if (title.value && body.value) {
    try {
      isLoading.value = true;
      const newPost = await editPost(selectedPost.id, {
        userId: user.id,
        title: title.value,
        body: body.value,
      });
      setSelectedPost(newPost);
    } catch {
    } finally {
      isLoading.value = false;
      
    }
  }
};
</script>
<template>
  <div class="content">
    <h2>Post editing</h2>

    <form @submit.prevent="handleSubmit">
      <div class="field" data-cy="NameField">
        <label class="label" for="comment-author-name-title"> Title </label>
        <div class="control has-icons-left has-icons-right">
          <input
            type="text"
            name="title"
            :id="`comment-author-name-title`"
            placeholder="Post title"
            class="input"
            :class="{ 'is-danger': errors.title }"
            v-model.trim="title"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>

          <span
            v-if="errors.title"
            class="icon is-small is-right has-text-danger"
            data-cy="ErrorIcon"
          >
            <i class="fas fa-exclamation-triangle"></i>
          </span>
        </div>

        <p v-if="errors.title" class="help is-danger" data-cy="ErrorMessage">
          Title is required
        </p>
      </div>

      <div class="field" data-cy="BodyField">
        <label class="label" for="comment-body"> Write Post Body </label>
        <div class="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Post body"
            class="textarea"
            :class="{ 'is-danger': errors.body }"
            v-model.trim="body"
          ></textarea>
        </div>

        <p v-if="errors.body" class="help is-danger" data-cy="ErrorMessage">
          Body is required
        </p>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            :class="{ 'is-loading': isLoading }"
            class="button is-link"
          >
            Save
          </button>
        </div>
        <div class="control">
          <button
            type="reset"
            class="button is-link is-light"
            @click="setIsEditing(false)"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

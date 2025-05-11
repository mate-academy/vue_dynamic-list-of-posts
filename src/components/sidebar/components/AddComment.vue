<script setup>
import { createComment } from "@/api/comments";
import { usePostsStore } from "@/store/storePosts";
import { useUserStore } from "@/store/storeUser";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const emit = defineEmits(["close", "add"]);

const isLoadingComment = ref(false);

const postStore = usePostsStore();

const { selectedPost } = storeToRefs(postStore);

const { fetchPostById } = usePostsStore();

watch(selectedPost, () => {
  emit("close");
});

const { user } = useUserStore();

const name = ref("");
const email = ref("");
const body = ref("");
const errors = ref({ name: false, body: false, email: false });

watch(
  [() => name.value, () => body.value, () => email.value],
  ([newName, newBody, newEmail]) => {
    errors.value = { name: false, body: false, email: false };
  }
);

const handleSubmit = async () => {
  if (!name.value) {
    errors.value = { ...errors.value, name: true };
  }

  if (!email.value || email.value.indexOf('@') === -1) {
    errors.value = { ...errors.value, email: true };
  }

  if (!body.value) {
    errors.value = { ...errors.value, body: true };
  }

  if (name.value && body.value && email.value && email.value.indexOf('@') !== -1) {
    try {
      isLoadingComment.value = true;

      const updated = {
        postId: selectedPost.value.id,
        name: name.value,
        email: email.value,
        body: body.value,
      };

      const newComment = await createComment(updated);
      emit('add', newComment);
    } catch {
    } finally {
      isLoadingComment.value = false;
      emit("close");
    }
  }
};
</script>
<template>
  <div class="content">
    <form @submit.prevent="handleSubmit">
      <div class="field" data-cy="NameField">
        <label class="label" for="comment-author-name-name">
          Author Name
        </label>
        <div class="control has-icons-left has-icons-right">
          <input
            type="text"
            name="name"
            id="comment-author-name-name"
            placeholder="Name Surname"
            class="input"
            v-model.trim="name"
            :class="[{ 'is-danger': errors.name }, {'is-loading': isLoadingComment}]"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>

          <span
            v-if="errors.name"
            class="icon is-small is-right has-text-danger"
            data-cy="ErrorIcon"
          >
            <i class="fas fa-exclamation-triangle"></i>
          </span>
        </div>

        <p v-if="errors.name" class="help is-danger" data-cy="ErrorMessage">
          Name is required
        </p>
      </div>

      <div class="field" data-cy="NameField">
        <label class="label" for="comment-author-name-email">
          Author Email
        </label>
        <div class="control has-icons-left has-icons-right">
          <input
            type="text"
            name="email"
            id="comment-author-name-email"
            placeholder="Your Email"
            class="input"
            v-model.trim="email"
            :class="[{ 'is-danger': errors.email }, {'is-loading': isLoadingComment}]"
          />
          <span class="icon is-small is-left">
            <i class="fa-envelope"></i>
          </span>

          <span
            v-if="errors.email"
            class="icon is-small is-right has-text-danger"
            data-cy="ErrorIcon"
          >
            <i class="fas fa-exclamation-triangle"></i>
          </span>
        </div>

        <p v-if="errors.email" class="help is-danger" data-cy="ErrorMessage">
          Email is required
        </p>
      </div>

      <div class="field" data-cy="BodyField">
        <label class="label" for="comment-body"> Write Post Body </label>
        <div class="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Comment"
            class="textarea"
            v-model.trim="body"
            :class="[{ 'is-danger': errors.body }, {'is-loading': isLoadingComment}]"
          ></textarea>
        </div>

        <p v-if="errors.body" class="help is-danger" data-cy="ErrorMessage">Comment is required</p>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': isLoadingComment }"
          >
            Add Comment
          </button>
        </div>
        <div class="control">
          <button
            type="reset"
            class="button is-link is-light"
            @click="emit('close')"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

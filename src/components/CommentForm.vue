<template>
  <div class="comment-form">
    <h4 class="title is-6">Add Comment</h4>

    <form @submit.prevent="submitComment">
      <!-- Name Field -->
      <div class="field">
        <label class="label">Name</label>
        <div class="control">
          <input
            v-model="form.name"
            class="input"
            :class="{ 'is-danger': errors.name && submitted }"
            type="text"
            placeholder="Your name"
            @input="clearError('name')"
          />
        </div>
        <p v-if="errors.name && submitted" class="help is-danger">
          {{ errors.name }}
        </p>
      </div>

      <!-- Email Field -->
      <div class="field">
        <label class="label">Email</label>
        <div class="control">
          <input
            v-model="form.email"
            class="input"
            :class="{ 'is-danger': errors.email && submitted }"
            type="email"
            placeholder="Your email"
            @input="clearError('email')"
          />
        </div>
        <p v-if="errors.email && submitted" class="help is-danger">
          {{ errors.email }}
        </p>
      </div>

      <!-- Comment Field -->
      <div class="field">
        <label class="label">Comment</label>
        <div class="control">
          <textarea
            v-model="form.body"
            class="textarea"
            :class="{ 'is-danger': errors.body && submitted }"
            placeholder="Write your comment here..."
            @input="clearError('body')"
          ></textarea>
        </div>
        <p v-if="errors.body && submitted" class="help is-danger">
          {{ errors.body }}
        </p>
      </div>

      <!-- Buttons -->
      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-primary"
            :class="{ 'is-loading': loading }"
          >
            Submit
          </button>
        </div>
        <div class="control">
          <button type="button" class="button is-light" @click="clearAll">
            Clear
          </button>
        </div>
        <div class="control">
          <button
            type="button"
            class="button is-light"
            @click="$emit('cancel')"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  name: "CommentForm",
  props: {
    postId: {
      type: Number,
      required: true,
    },
    addSucceededKey: {
      type: [Number, String],
      default: 0,
    },
  },
  emits: ["add-comment", "cancel"],
  setup(props, { emit }) {
    const form = ref({
      name: "",
      email: "",
      body: "",
    });

    const errors = ref({
      name: "",
      email: "",
      body: "",
    });

    const loading = ref(false);
    const submitted = ref(false);

    // Watch for success signal from parent
    watch(
      () => props.addSucceededKey,
      (newKey, oldKey) => {
        if (newKey !== oldKey && newKey > 0) {
          // Success confirmed by parent - reset form state
          form.value.body = "";
          errors.value.body = "";
          loading.value = false;
          submitted.value = false;
        }
      }
    );

    const validateForm = () => {
      errors.value = { name: "", email: "", body: "" };
      let isValid = true;

      if (!form.value.name.trim()) {
        errors.value.name = "Name is required";
        isValid = false;
      }

      if (!form.value.email.trim()) {
        errors.value.email = "Email is required";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
        errors.value.email = "Email is invalid";
        isValid = false;
      }

      if (!form.value.body.trim()) {
        errors.value.body = "Comment is required";
        isValid = false;
      }

      return isValid;
    };

    const clearError = (field) => {
      if (errors.value[field]) {
        errors.value[field] = "";
      }
    };

    const clearAll = () => {
      form.value = { name: "", email: "", body: "" };
      errors.value = { name: "", email: "", body: "" };
      submitted.value = false;
    };

    const submitComment = async () => {
      submitted.value = true;

      if (!validateForm()) {
        return;
      }

      loading.value = true;

      const commentData = {
        ...form.value,
        postId: props.postId,
      };

      try {
        emit("add-comment", commentData);
        // Loading will be reset by parent through addSucceededKey
        // when the API call is truly successful
      } catch (error) {
        console.error("Error submitting comment:", error);
        loading.value = false;
      }
    };

    return {
      form,
      errors,
      loading,
      submitted,
      submitComment,
      clearError,
      clearAll,
    };
  },
};
</script>

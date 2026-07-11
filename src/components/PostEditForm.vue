<script setup>
defineProps({
  editTitle: String,
  editBody: String,
  loadingPostEditing: Boolean,
  errorMessageResetEdit: String,
});

defineEmits(["submit", "cancel", "title-input", "body-input"]);
</script>

<template>
  <div class="tile is-child">
    <div class="content">
      <div class="content">
        <h2>Post editing</h2>
        <form
          @submit.prevent="$emit('submit')"
          @reset.prevent="$emit('cancel')"
        >
          <div class="field" data-cy="NameField">
            <label class="label" for="comment-author-name-title">Title</label>
            <div class="control has-icons-left has-icons-right">
              <input
                type="text"
                name="title"
                placeholder="Post title"
                class="input"
                :value="editTitle"
                @input="$emit('title-input', $event)"
              /><span class="icon is-small is-left"
                ><i class="fas fa-user fa-heading"></i
              ></span>
            </div>
          </div>
          <div class="field" data-cy="BodyField">
            <label class="label" for="comment-body">Write Post Body</label>
            <div class="control">
              <textarea
                name="body"
                placeholder="Post body"
                class="textarea"
                :value="editBody"
                @input="$emit('body-input', $event)"
              ></textarea>
            </div>
          </div>
          <p v-if="errorMessageResetEdit" class="help is-danger">
            {{ errorMessageResetEdit }}
          </p>
          <div class="field is-grouped">
            <div class="control">
              <button
                type="submit"
                class="button is-link"
                :class="{ 'is-loading': loadingPostEditing }"
                :disabled="loadingPostEditing"
              >
                {{ loadingPostEditing ? "" : "Save" }}
              </button>
            </div>

            <div class="control">
              <button type="reset" class="button is-link is-light">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
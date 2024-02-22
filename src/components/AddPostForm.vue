<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    emits: ['titleChange', 'bodyChange', 'createPost', 'closeForm']
  })
</script>

<template>
  <h2>Create new post</h2>

  <form @submit="$emit('createPost', $event)">
    <div class="field" data-cy="NameField">
      <label class="label" for="comment-author-name-title">
        Title
      </label>

      <div class="control has-icons-left has-icons-right">
        <input
          type="text"
          name="title"
          id="comment-author-name-title"
          placeholder="Post title"
          class="input"
          @input="$emit('titleChange', $event)"
          required
        >
        <span class="icon is-small is-left">
          <i class="fas fa-user fa-heading"></i>
        </span>
      </div>
    </div>

    <div class="field" data-cy="BodyField">
      <label class="label" for="comment-body">Write Post Body</label>

      <div class="control">
        <textarea
          id="comment-body"
          name="body"
          placeholder="Post body"
          class="textarea"
          @input="$emit('bodyChange', $event)"
          required
        />
      </div>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link">Save</button>
      </div>
      <div class="control">
        <button
          type="reset"
          class="button is-link is-light"
          @click="$emit('closeForm')"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>

</template>

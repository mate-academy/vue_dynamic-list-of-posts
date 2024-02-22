<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    emits: ['titleChange', 'bodyChange', 'postEvent', 'closeForm'],
    props: {
      title: String,
      postTitle: String,
      postBody: String,
    }
  })
</script>

<template>
  <h2>{{ title }}</h2>

  <form @submit="$emit('postEvent', $event)">
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
          :value="postTitle"
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
          :value="postBody"
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

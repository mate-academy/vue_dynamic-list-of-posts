<script>
export default {
  name: "PostForm",
  data() {
    return {
      title: '',
      body: '',
    }
  },
  emits: ['cancel', 'sumbit'],
  methods: {
    handleSumbit() {
      const newPost = {
        "userId": 2,
        "title": this.title,
        "body": this.body,
      };

      this.$emit('sumbit', newPost);
      this.title = '';
      this.body = '';
    }
  },
}
</script>

<template>
  <div>
    <h2>Create new post</h2>
    <form @submit.prevent="handleSumbit">
      <div class="field" data-cy="NameField">
        <label class="label" for="comment-author-name-title">Title</label>
        <div class="control has-icons-left has-icons-right">
          <input type="text" name="title" id="comment-author-name-title" placeholder="Post title" class="input"
            v-model="title" required>
          <span class="icon is-small is-left"><i class="fas fa-user fa-heading"></i></span>
        </div>
      </div>

      <div class="field" data-cy="BodyField">
        <label class="label" for="comment-body">Write Post Body</label>
        <div class="control">
          <textarea id="comment-body" name="body" placeholder="Post body" class="textarea" v-model="body" required></textarea>
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Create</button>
        </div>
        <div class="control">
          <button type="reset" class="button is-link is-light" @click="$emit('cancel')">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: this.editingPost.title,
      body: this.editingPost.body,
    }
  },
  props: {
    editingPost: Object,
  },
  emits: ['cancel', 'submit'],
  methods: {
    saveEdit() {
      const editPost = {
        "userId": 2,
        "title": this.title,
        "body": this.body,
        "id": this.editingPost.id,
      }
      this.$emit('submit', editPost);
    }
  },
}
</script>
<template>
  <div class="tile is-child box is-success ">
    <div class="content">
      <div class="content">
        <h2>Post editing</h2>
        <form>
          <div class="field" data-cy="NameField"><label class="label" for="comment-author-name-title">Title</label>
            <div class="control has-icons-left has-icons-right"><input type="text" name="title"
                id="comment-author-name-title" placeholder="Post title" class="input" v-model="title">
              <span class="icon is-small is-left"><i class="fas fa-user fa-heading"></i></span>
            </div>
          </div>
          <div class="field" data-cy="BodyField"><label class="label" for="comment-body">Write Post Body</label>
            <div class="control"><textarea id="comment-body" name="body" placeholder="Post body" class="textarea"
                v-model="body"></textarea></div>
          </div>
          <div class="field is-grouped">
            <div class="control"><button type="submit" class="button is-link" @click.prevent="saveEdit">Save</button></div>
            <div class="control"><button type="reset" class="button is-link is-light"
              @click="$emit('cancel')">Cancel</button></div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

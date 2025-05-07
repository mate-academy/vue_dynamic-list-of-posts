<script>
  export default {
    data() {
      return {
        name: '',
        email: '',
        body: '',
        error: false,
      }
    },
    emits: ['closeMenu', 'add-comment'],
    methods: {
      addComment() {
        if (this.name.trim().length > 0 && this.body.trim().length > 0) {
          this.error = false;

          const newComment = {
          'name': this.name,
          'email': this.email,
          'body': this.body,
        }

        this.$emit('add-comment', newComment);
        } else {
          this.error = true;
        }
      }
    }
  }
</script>
<template>
  <div class="block">
    <form @submit.prevent="addComment">
      <div class="field" data-cy="NameField">
        <label class="label" for="comment-author-name-name">Author Name</label>
        <div class="control has-icons-left has-icons-right">
          <input 
            type="text" 
            name="name" 
            id="comment-author-name-name"
            placeholder="Name Surname" 
            class="input" 
            v-model="name" 
            minlength="3" 
            required
          >
          <span class="icon is-small is-left">  
            <i class="fas fa-user fa-user"></i>
          </span>
        </div>
      </div>
      <div class="field" data-cy="NameField">
        <label class="label" for="comment-author-name-email">Author Email</label>
        <div class="control has-icons-left has-icons-right">
          <input 
            type="email" 
            name="email"
            id="comment-author-name-email" 
            placeholder="Your Email" 
            class="input" 
            v-model="email" 
            minlength="3" 
            required
          >
          <span class="icon is-small is-left">
            <i class="fas fa-user fa-envelope"></i>
          </span>
        </div>
      </div>
      <div class="field" data-cy="BodyField">
        <label class="label" for="comment-body">Write Post Body</label>
        <div class="control">
          <textarea 
            id="comment-body"
            minlength="3" 
            name="body" 
            placeholder="Comment" 
            class="textarea" 
            v-model="body" 
            required
          ></textarea>
        </div>
      </div>
      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Add Comment</button>
        </div>
        <div class="control">
          <button type="reset" class="button is-link is-light" @click="$emit('closeMenu')">
            Cancel
          </button>
        </div>
      </div>
    </form>

    <p class="help is-danger" v-if="error">Please enter real data</p>
  </div>
</template>

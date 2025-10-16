<template>
  <form @submit.prevent="handleSubmit" class="box">
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model.trim="name"
          :class="{ 'is-danger': submitted && !name }"
          placeholder="Your name"
        />
      </div>
      <p v-if="submitted && !name" class="help is-danger">Name is required</p>
    </div>

    <div class="field">
      <label class="label">Email</label>
      <div class="control">
        <input
          class="input"
          type="email"
          v-model.trim="email"
          :class="{ 'is-danger': submitted && !email }"
          placeholder="Your email"
        />
      </div>
      <p v-if="submitted && !email" class="help is-danger">Email is required</p>
    </div>

    <div class="field">
      <label class="label">Comment</label>
      <div class="control">
        <!-- ❗ Corrigido: textarea precisa de tag de fechamento -->
        <textarea
          class="textarea"
          v-model.trim="body"
          :class="{ 'is-danger': submitted && !body }"
          placeholder="Write your comment..."
        ></textarea>
      </div>
      <p v-if="submitted && !body" class="help is-danger">Comment text is required</p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': loading }"
        >
          Submit
        </button>
      </div>
      <div class="control">
        <button
          type="button"
          class="button is-light"
          @click="clearForm"
          :disabled="loading"
        >
          Clear
        </button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'CommentForm',
  props: {
    postId: {
      type: Number,
      required: true,
    },
    onSubmit: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      name: '',
      email: '',
      body: '',
      loading: false,
      submitted: false,
    };
  },
  methods: {
    clearForm() {
      this.name = '';
      this.email = '';
      this.body = '';
      this.submitted = false;
    },

    async handleSubmit() {
      this.submitted = true;

      if (!this.name || !this.email || !this.body) {
        return;
      }

      this.loading = true;

      try {
        const newComment = await this.onSubmit({
          name: this.name,
          email: this.email,
          body: this.body,
        });

        // mantém nome e e-mail, limpa apenas o texto
        this.body = '';
        this.submitted = false;

        // opcional: foco no campo de comentário novamente
        this.$nextTick(() => {
          const textarea = this.$el.querySelector('textarea');
          if (textarea) textarea.focus();
        });

        // append é feito no App.vue ou componente pai
      } catch (error) {
        console.error('Failed to submit comment', error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.help.is-danger {
  margin-top: 0.25rem;
}
</style>

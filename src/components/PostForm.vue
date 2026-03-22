<template>
  <div class="content">
    <h2>{{ isEditing ? 'Edit Post' : 'Create New Post' }}</h2>

    <form @submit.prevent="handleSubmit">
      <!-- Title field -->
      <div class="field">
        <label class="label" for="post-title">Title</label>
        <div class="control">
          <input
            type="text"
            id="post-title"
            name="title"
            class="input"
            :class="{ 'is-danger': errors.title }"
            placeholder="Enter post title"
            v-model="title"
            @input="errors.title = ''"
          />
        </div>
        <p v-if="errors.title" class="help is-danger">{{ errors.title }}</p>
      </div>

      <!-- Body field -->
      <div class="field">
        <label class="label" for="post-body">Body</label>
        <div class="control">
          <textarea
            id="post-body"
            name="body"
            class="textarea"
            :class="{ 'is-danger': errors.body }"
            placeholder="Enter post body"
            v-model="body"
            @input="errors.body = ''"
          ></textarea>
        </div>
        <p v-if="errors.body" class="help is-danger">{{ errors.body }}</p>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': isSubmitting }"
          >
            {{ isEditing ? 'Save' : 'Create' }}
          </button>
        </div>
        <div class="control">
          <button
            type="button"
            class="button is-link is-light"
            @click="$emit('cancel')"
          >
            Cancel
          </button>
        </div>
      </div>

      <p v-if="serverError" class="help is-danger">{{ serverError }}</p>
    </form>
  </div>
</template>

<script>
import { createPost, updatePost } from '../api/posts';

export default {
  name: 'PostForm',
  props: {
    userId: {
      type: Number,
      required: true,
    },
    post: {
      type: Object,
      default: null,
    },
  },
  emits: ['created', 'updated', 'cancel'],
  data() {
    return {
      title: this.post ? this.post.title : '', // Preenche se tiver editando, vazio se criando
      body: this.post ? this.post.body : '',
      errors: {
        title: '', // Guarda erros específicos do título
        body: '', // Guarda erros específicos do corpo
      },
      serverError: '', // Mensagem de erro da API
      isSubmitting: false, // Controle do botão de save
    };
  },
  computed: {
    isEditing() { // Saber se é modo de edição com base na existência da prop "post"
      return !!this.post;
    },
  },
  watch: {
    post(newPost) {
      if (newPost) {
        this.title = newPost.title;
        this.body = newPost.body;
      } else {
        this.title = '';
        this.body = '';
      }
    },
  },
  methods: {
    validate() {
      let isValid = true; // Função responsável pela validação

      if (!this.title.trim()) {
        this.errors.title = 'Title is required';
        isValid = false;
      }

      if (!this.body.trim()) {
        this.errors.body = 'Body is required';
        isValid = false;
      }

      return isValid;
    },
    async handleSubmit() {
      this.serverError = ''; // Limpa o estado da API
      
      // Valida, se falhar, para por aqui
      if (!this.validate()) {
        return;
      }

      this.isSubmitting = true;

      try {
        if (this.isEditing) { // Update (PATCH)
          const updated = await updatePost(this.post.id, {
            title: this.title.trim(),
            body: this.body.trim(),
          });

          this.$emit('updated', updated); // Notifica o pai 
        } else { // Create (POST)
          const created = await createPost({
            userId: this.userId,
            title: this.title.trim(),
            body: this.body.trim(),
          });

          this.$emit('created', created); // Notifica o pai
          // Limpa o form após sucesso ao criar
          this.title = '';
          this.body = '';
        }
      } catch (error) {
        this.serverError = 'Something went wrong. Please try again.';
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

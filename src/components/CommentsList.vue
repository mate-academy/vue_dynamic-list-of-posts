<template>
  <div>
    <Loader v-if="loading" />
    <Notification v-if="error" :message="error" type="is-danger" />

    <p v-if="!comments.length && !loading">No comments yet</p>

    <div v-for="comment in comments" :key="comment.id" class="box">
      <p><strong>{{ comment.name }}</strong> ({{ comment.email }})</p>
      <p>{{ comment.body }}</p>
      <button class="button is-small is-danger" @click="deleteComment(comment)">Delete</button>
    </div>

    <!-- ✅ BOTÃO TOGGLE PARA MOSTRAR FORM -->
    <button 
      v-if="!showForm" 
      class="button is-primary mt-4" 
      @click="showForm = true"
    >
      Write a comment
    </button>

    <!-- ✅ FORM SÓ APARECE QUANDO showForm = true -->
    <CommentForm 
      v-if="showForm" 
      :postId="postId" 
      @added="addComment"
      @cancel="showForm = false"
    />
  </div>
</template>

<script>
import Loader from './Loader.vue';
import Notification from './Notification.vue';
import CommentForm from './CommentForm.vue';

export default {
  components: { Loader, Notification, CommentForm },
  props: { postId: Number },
  data() {
    return {
      comments: [],
      loading: false,
      error: null,
      showForm: false // ✅ ESTADO PARA CONTROLAR FORM
    };
  },
  methods: {
    async fetchComments() {
      this.loading = true;
      this.error = null; // ✅ LIMPAR ERRO ANTERIOR
      try {
        const res = await fetch(`https://mate-academy.github.io/fe-students-api/comments?postId=${this.postId}`);
        if (!res.ok) throw new Error('Failed to load comments');
        this.comments = await res.json();
      } catch {
        this.error = 'Failed to load comments';
      } finally {
        this.loading = false;
      }
    },
    async deleteComment(comment) {
      const original = [...this.comments];
      this.comments = this.comments.filter(c => c.id !== comment.id);

      try {
        const res = await fetch(`https://mate-academy.github.io/fe-students-api/comments/${comment.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
      } catch (err) {
        this.comments = original;
        this.error = 'Failed to delete comment. Please retry.';
      }
    },
    addComment(comment) {
      this.comments.push(comment);
      this.showForm = false; // ✅ FECHAR FORM APÓS ADICIONAR COMENTÁRIO
    }
  },
  watch: {
    // ✅ WATCHER PARA postId - RECARREGAR COMENTÁRIOS E RESETAR ESTADO
    postId: {
      immediate: true,
      handler(newPostId) {
        if (newPostId) {
          this.fetchComments();
          this.showForm = false; // ✅ RESETAR FORM QUANDO POST MUDAR
          this.error = null; // ✅ LIMPAR ERROS
        }
      }
    }
  }
};
</script>
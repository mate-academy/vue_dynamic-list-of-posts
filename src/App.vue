<script setup>
import { ref, onMounted } from 'vue'
import PostForm from '@/components/PostForm.vue'
import PostPreview from '@/components/PostPreview.vue'
import {
  fetchPosts,
  fetchPost,
  fetchComments,
  createPost,
} from '@/services/api'

// ----- Estado: coluna esquerda (lista + criação) -----
const left = ref({
  isCreating: false,   // controla loading do <PostForm>
  loading: false,      // loading da tabela de posts
  posts: [],           // lista de posts
  error: null,         // erro ao carregar posts
})

// ----- Estado: coluna direita (detalhe do post) -----
const right = ref({
  loading: false,          // loader da área direita (header/placeholder)
  post: null,              // post selecionado
  comments: [],            // comentários do post
  commentsLoading: false,  // loader da lista de comentários
  error: null,             // erro do painel direito
})

// ----- Carregamento inicial da lista de posts -----
async function loadPosts() {
  left.value.loading = true
  left.value.error = null
  try {
    const data = await fetchPosts()
    left.value.posts = Array.isArray(data) ? data : []
  } catch (e) {
    left.value.error = e
    console.error('Falha ao carregar posts:', e)
  } finally {
    left.value.loading = false
  }
}

// ----- Seleção de um post na lista -----
async function selectPost(postId) {
  await loadRightPane(postId)
}

// ----- Carregar painel direito (post + comments) -----
async function loadRightPane(postId) {
  right.value.loading = true
  right.value.error = null
  try {
    right.value.post = await fetchPost(postId)

    right.value.commentsLoading = true
    right.value.comments = await fetchComments(postId)
  } catch (e) {
    right.value.error = e
    console.error('Falha ao carregar painel direito:', e)
  } finally {
    right.value.commentsLoading = false
    right.value.loading = false
  }
}

// ----- Criação de post (usado pelo <PostForm :on-submit>) -----
// JSONPlaceholder não persiste novos posts (ids > 100 dão 404 no GET),
// então aqui nós atualizamos apenas o estado local e NÃO refetchamos.
async function onCreatePost(payload) {
  left.value.isCreating = true
  try {
    const created = await createPost(payload)
    // Prepend na lista
    left.value.posts = [created, ...left.value.posts]
    // Seleciona localmente no painel direito (sem GET /posts/:id)
    right.value.post = created
    right.value.comments = []
    right.value.commentsLoading = false
    right.value.loading = false
    return created
  } catch (e) {
    console.error('Erro ao criar post:', e)
    throw e
  } finally {
    left.value.isCreating = false
  }
}

// ----- Recebe evento de add-comment do PostPreview -----
async function onAddComment(createdFromChild) {
  if (!right.value.post) {
    console.warn('Ignorando add-comment: post ausente')
    return
  }
  right.value.comments = [...right.value.comments, createdFromChild]
}

// ----- Montagem -----
onMounted(async () => {
  await loadPosts()
  if (left.value.posts.length > 0) {
    await selectPost(left.value.posts[0].id)
  }
})
</script>

<template>
  <main class="layout">
    <!-- COLUNA ESQUERDA -->
    <aside class="left">
      <section class="card">
        <h2 class="card-title">Novo Post</h2>
        <PostForm
          :on-submit="onCreatePost"
          :loading="left.isCreating"
          @error="e => console.error('Erro ao criar post:', e)"
          @submitted="p => console.log('Post criado', p)"
        />
      </section>

      <section class="card">
        <div class="card-header">
          <h2 class="card-title">Posts</h2>
          <span v-if="left.loading" class="badge">Carregando…</span>
        </div>

        <div v-if="left.error" class="error">
          Falha ao carregar posts. <code>{{ String(left.error?.message || left.error) }}</code>
        </div>

        <div v-else>
          <table class="posts-table">
            <thead>
              <tr>
                <th style="width: 72px;">ID</th>
                <th>Título</th>
                <th style="width: 140px;">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="p in left.posts"
                :key="p.id"
                :class="{ selected: right.post?.id === p.id }"
              >
                <td>#{{ p.id }}</td>
                <td>{{ p.title }}</td>
                <td class="actions">
                  <button @click="selectPost(p.id)" :disabled="right.loading">
                    Ver
                  </button>
                </td>
              </tr>
              <tr v-if="!left.loading && left.posts.length === 0">
                <td colspan="3" class="muted">Nenhum post encontrado.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </aside>

    <!-- COLUNA DIREITA -->
    <section class="right">
      <div v-if="right.loading" class="sidebar-loader">Carregando…</div>

      <div v-if="right.error" class="error">
        Falha ao carregar o painel direito.
        <code>{{ String(right.error?.message || right.error) }}</code>
      </div>

      <PostPreview
        v-if="right.post"
        :post="right.post"
        :comments="right.comments"
        :comments-loading="right.commentsLoading"
        @add-comment="onAddComment"
      />

      <div v-else-if="!right.loading" class="placeholder">
        Selecione um post à esquerda para visualizar detalhes.
      </div>
    </section>
  </main>
</template>

<style>
/* Layout base */
.layout {
  display: grid;
  grid-template-columns: minmax(320px, 1fr) 2fr;
  gap: 1rem;
  padding: 1rem;
  align-items: start;
}

/* Cards */
.card {
  background: #fff;
  border: 1px solid #e6e6e6;
  border-radius: .75rem;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 2px rgba(0,0,0,.03);
}
.card-header {
  display: flex;
  align-items: center;
  gap: .5rem;
  justify-content: space-between;
  margin-bottom: .75rem;
}
.card-title {
  margin: 0;
  font-size: 1.1rem;
}

/* Badges & estados */
.badge {
  font-size: .85rem;
  padding: .2rem .5rem;
  border-radius: .5rem;
  background: #f2f2f2;
}
.error {
  margin-top: .5rem;
  padding: .75rem;
  border: 1px solid #ffd6d6;
  background: #fff5f5;
  color: #8a1f1f;
  border-radius: .5rem;
}
.placeholder {
  padding: 1rem;
  color: #777;
}

/* Tabela de posts */
.posts-table {
  width: 100%;
  border-collapse: collapse;
  font-size: .95rem;
}
.posts-table th,
.posts-table td {
  border-bottom: 1px solid #eee;
  padding: .5rem .4rem;
  text-align: left;
}
.posts-table tr.selected {
  background: #f7fbff;
}
.posts-table .actions {
  display: flex;
  gap: .5rem;
}

/* Sidebar direita */
.sidebar-loader {
  padding: .6rem .8rem;
  margin-bottom: .75rem;
  border: 1px dashed #d9d9d9;
  border-radius: .5rem;
  color: #666;
}

/* Botões básicos */
button {
  appearance: none;
  border: 1px solid #dcdcdc;
  background: #fafafa;
  padding: .4rem .7rem;
  border-radius: .5rem;
  cursor: pointer;
}
button:hover {
  background: #f3f3f3;
}
button:disabled {
  opacity: .6;
  cursor: not-allowed;
}

/* Responsivo */
@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>

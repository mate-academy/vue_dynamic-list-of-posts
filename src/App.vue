<template>
  <section class="section">
    <div class="container">
      <div class="is-flex is-justify-content-space-between is-align-items-center mb-4">
        <h1 class="title">Vue Dynamic Posts</h1>
        <div class="tags has-addons">
          <span class="tag is-dark">User</span>
          <span class="tag is-info">{{ store.currentUser ? store.currentUser.name : 'User #' + store.currentUserId }}</span>
        </div>
      </div>

      <div class="Layout">
        <div>
          <PostTable
            :posts="store.posts"
            :loading="store.postsLoading"
            :error="store.postsError"
            @create="openCreate()"
            @select="openPreview($event)"
            @edit="openEdit($event)"
            @delete="onDeletePost($event)"
            @clear-error="store.postsError = ''"
          />
        </div>

        <Sidebar :isOpen="sidebarOpen">
          <Loader v-if="right.loading" />
          <template v-else>
            <PostForm
              v-if="right.mode === 'create' || right.mode === 'edit'"
              :isEdit="right.mode === 'edit'"
              :modelValue="right.post"
              :error="right.error"
              @submit="right.mode === 'create' ? submitCreate : submitEdit"
              @cancel="closeSidebar"
              @delete="confirmDeleteInEdit"
              @clear-error="right.error = ''"
            />

            <PostPreview
              v-else-if="right.mode === 'preview' && right.post"
              :post="right.post"
              :comments="right.comments"
              :comments-loading="right.commentsLoading"
              :comments-error="right.commentsError"
              :show-comment-form="right.showCommentForm"
              @edit="openEdit(right.post.id)"
              @delete="onDeletePost(right.post.id)"
              @delete-comment="onDeleteComment"
              @toggle-comment-form="right.showCommentForm = true"
              @add-comment="onAddComment"
              @clear-comments-error="right.commentsError = ''"
            />

            <p v-else class="has-text-grey">Choose a post or create a new one.</p>
          </template>
        </Sidebar>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, computed } from 'vue';
import { store } from './store';
import PostTable from './components/PostTable.vue';
import Sidebar from './components/Sidebar.vue';
import PostForm from './components/PostForm.vue';
import PostPreview from './components/PostPreview.vue';
import Loader from './components/Loader.vue';
import {
  fetchUsers,
  fetchUserPosts,
  fetchPost,
  createPost,
  updatePost,
  deletePost,
  fetchComments,
  createComment,
  deleteComment,
} from './api';

const right = reactive({
  mode: '', // '', 'create', 'edit', 'preview'
  loading: false,
  post: null,
  error: '',
  comments: [],
  commentsLoading: false,
  commentsError: '',
  showCommentForm: false,
});

const sidebarOpen = computed(
  () => right.mode === 'create' || right.mode === 'edit' || right.mode === 'preview'
);

onMounted(async () => {
  await init();
});

async function init() {
  try {
    const [users] = await Promise.all([fetchUsers()]);
    store.users = users;
    await loadPosts();
  } catch (e) {
    store.postsError = 'Failed to initialize.';
  }
}

async function loadPosts() {
  store.postsLoading = true;
  store.postsError = '';
  try {
    store.posts = await fetchUserPosts(store.currentUserId);
  } catch (e) {
    store.postsError = 'Failed to load posts.';
  } finally {
    store.postsLoading = false;
  }
}

function openCreate() {
  right.mode = 'create';
  right.post = { title: '', body: '' };
  right.error = '';
  right.showCommentForm = false;
}

/**
 * PREVIEW IMEDIATO DO POST + COMENTÁRIOS EM BACKGROUND
 */
async function openPreview(postId) {
  // UI imediata com dados em cache (da tabela)
  const cached = store.posts.find(p => p.id === postId) || null;
  right.mode = 'preview';
  right.error = '';
  right.showCommentForm = false;
  right.post = cached; // aparece instantaneamente
  store.selectedPostId = postId;

  // Comentários: loader apenas na seção de comentários
  right.comments = [];
  right.commentsLoading = true;
  right.commentsError = '';

  // Em background, tenta refrescar os detalhes do post (não trava UI)
  (async () => {
    try {
      const fresh = await fetchPost(postId);
      if (right.mode === 'preview' && right.post && right.post.id === postId) {
        right.post = fresh;
      }
    } catch {
      /* silencioso */
    }
  })();

  try {
    const comments = await fetchComments(postId);
    if (right.mode === 'preview' && right.post && right.post.id === postId) {
      right.comments = comments;
    }
  } catch {
    right.commentsError = 'CommentsError: failed to load comments.';
  } finally {
    right.commentsLoading = false;
  }
}

/**
 * EDIÇÃO IMEDIATA + REFRESH EM BACKGROUND
 */
async function openEdit(postId) {
  // UI imediata com cache
  right.mode = 'edit';
  right.error = '';
  const cached = store.posts.find(p => p.id === postId) || null;
  right.post = cached ? { ...cached } : null; // clone para edição
  store.selectedPostId = postId;

  // Em background, busca versão mais nova (sem travar o formulário)
  (async () => {
    try {
      const fresh = await fetchPost(postId);
      if (right.mode === 'edit' && right.post && right.post.id === postId) {
        right.post = { ...fresh };
      }
    } catch {
      /* silencioso */
    }
  })();
}

/**
 * CRIAÇÃO OTIMISTA:
 * - mostra preview imediatamente com ID temporário
 * - cria no servidor em background
 * - sincroniza ID/dados quando a API responde
 * - carrega comentários (normalmente vazio) em background
 */
async function submitCreate(values) {
  right.error = '';

  // Post temporário para UI imediata
  const tempId = Date.now();
  const optimisticPost = {
    id: tempId,
    userId: store.currentUserId,
    title: values.title,
    body: values.body,
  };

  // Atualiza UI imediatamente
  store.posts = [optimisticPost, ...store.posts];
  right.post = optimisticPost;
  right.mode = 'preview';
  store.selectedPostId = tempId;
  right.comments = [];
  right.commentsLoading = false;
  right.commentsError = '';
  right.showCommentForm = false;

  try {
    // Cria no servidor (background)
    const created = await createPost({
      userId: store.currentUserId,
      title: values.title,
      body: values.body,
    });

    // Sincroniza ID e dados retornados
    store.posts = store.posts.map(p => (p.id === tempId ? { ...p, ...created } : p));
    if (right.post && right.post.id === tempId) {
      right.post = { ...optimisticPost, ...created };
      store.selectedPostId = created.id;
    }

    // Carrega comentários do novo post (geralmente vazio)
    right.commentsLoading = true;
    try {
      right.comments = await fetchComments(created.id);
    } catch {
      right.commentsError = 'CommentsError: failed to load comments.';
    } finally {
      right.commentsLoading = false;
    }
  } catch {
    // Erro: reverte UI e informa
    store.posts = store.posts.filter(p => p.id !== tempId);
    if (right.post && right.post.id === tempId) {
      right.mode = '';
      right.post = null;
    }
    right.error = 'Failed to create post.';
  }
}

async function submitEdit(values) {
  right.error = '';
  try {
    const updated = await updatePost(right.post.id, values);
    // Atualiza na tabela
    store.posts = store.posts.map(p => (p.id === updated.id ? { ...p, ...updated } : p));
    // Mostra preview
    right.post = { ...right.post, ...updated };
    right.mode = 'preview';
  } catch (e) {
    right.error = 'Failed to save post.';
  }
}

async function onDeletePost(postId) {
  // Otimista: remove da lista e fecha sidebar se for o post aberto
  const prevPosts = [...store.posts];
  store.posts = store.posts.filter(p => p.id !== postId);
  if (right.post?.id === postId) closeSidebar();

  try {
    await deletePost(postId);
  } catch (e) {
    // Rollback em caso de erro
    store.posts = prevPosts;
    alert('Failed to delete the post. Please retry.');
  }
}

function confirmDeleteInEdit() {
  if (right.post) onDeletePost(right.post.id);
}

function closeSidebar() {
  right.mode = '';
  right.post = null;
  right.error = '';
  right.comments = [];
  right.commentsError = '';
  right.showCommentForm = false;
}

async function onAddComment(payload) {
  try {
    const created = await createComment({ postId: right.post.id, ...payload });
    right.comments.push(created);
  } catch (e) {
    right.commentsError = 'Failed to add comment. Click "Write a comment" again to retry.';
    throw e;
  }
}

async function onDeleteComment(comment) {
  // Otimista
  const prev = [...right.comments];
  right.comments = right.comments.filter(c => c.id !== comment.id);
  try {
    await deleteComment(comment.id);
  } catch (e) {
    right.comments = prev;
    right.commentsError = 'Failed to delete comment. Please retry.';
  }
}
</script>
``

<script setup>
import { ref, onMounted, computed } from 'vue';
import CommentForm from './components/CommentForm.vue';

const USER_ID = 1;

const posts = ref([]);
const postsLoading = ref(false);
const postsError = ref(false);

const selectedPost = ref(null);
const comments = ref([]);
const commentsLoading = ref(false);
const commentsError = ref(false);

const isCreating = ref(false);
const isEditing = ref(false);

const postForm = ref({ title: '', body: '' });
const postFormSubmitted = ref(false);

const showCommentForm = ref(false);

const sidebarOpen = computed(
  () => selectedPost.value || isCreating.value || isEditing.value
);

onMounted(loadPosts);

/* POSTS */
async function loadPosts() {
  postsLoading.value = true;
  try {
    const r = await fetch(
      `https://mate.academy/students-api/posts?userId=${USER_ID}`
    );
    posts.value = await r.json();
  } catch {
    postsError.value = true;
  } finally {
    postsLoading.value = false;
  }
}

function selectPost(p) {
  selectedPost.value = p;
  isCreating.value = false;
  isEditing.value = false;
  showCommentForm.value = false;
  loadComments(p.id);
}

async function loadComments(id) {
  commentsLoading.value = true;
  commentsError.value = false;
  comments.value = [];
  try {
    const r = await fetch(
      `https://mate.academy/students-api/comments?postId=${id}`
    );
    comments.value = await r.json();
  } catch {
    commentsError.value = true;
  } finally {
    commentsLoading.value = false;
  }
}

function openCreatePost() {
  isCreating.value = true;
  selectedPost.value = null;
  postForm.value = { title: '', body: '' };
}

async function savePost() {
  postFormSubmitted.value = true;
  if (!postForm.value.title || !postForm.value.body) return;

  try {
    if (isEditing.value) {
      const r = await fetch(
        `https://mate.academy/students-api/posts/${selectedPost.value.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postForm.value),
        }
      );

      if (!r.ok) throw new Error();

      Object.assign(selectedPost.value, postForm.value);
      isEditing.value = false;
    } else {
      const r = await fetch(
        `https://mate.academy/students-api/posts`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...postForm.value,
            userId: USER_ID,
          }),
        }
      );

      if (!r.ok) throw new Error();

      const newPost = await r.json();
      posts.value.unshift(newPost);
      selectedPost.value = newPost;
      isCreating.value = false;
    }
  } catch (e) {
    // Required by task: handle API error
    // Minimal handling to keep UI consistent
    alert('Failed to save post. Please try again.');
  }
}


async function deletePost() {
  try {
    const r = await fetch(
      `https://mate.academy/students-api/posts/${selectedPost.value.id}`,
      { method: 'DELETE' }
    );

    if (!r.ok) throw new Error();

    posts.value = posts.value.filter(p => p !== selectedPost.value);
    selectedPost.value = null;
  } catch (e) {
    // Required by task: handle delete error
    alert('Failed to delete post. Please try again.');
  }
}


function startEdit() {
  postForm.value = {
    title: selectedPost.value.title,
    body: selectedPost.value.body,
  };
  isEditing.value = true;
}

/* COMMENTS */
function addComment(c) {
  comments.value.push(c);
}

async function deleteComment(c) {
  const backup = [...comments.value];
  comments.value = comments.value.filter(x => x !== c);

  try {
    await fetch(
      `https://mate.academy/students-api/comments/${c.id}`,
      { method: 'DELETE' }
    );
  } catch {
    comments.value = backup;
  }
}
</script>

<template>
  <!-- layout identico a prima, con CommentForm -->
  <!-- usa <CommentForm :post-id="selectedPost.id" @comment-added="addComment" /> -->
</template>

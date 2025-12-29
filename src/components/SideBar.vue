<script setup>
import { ref, watch } from 'vue';
import AddPost from './AddPost.vue';
import EditPost from './EditPost.vue';
import PostPreview from './PostPreview.vue';
import Comment from './comments/Comment.vue';
import AddComment from './comments/AddComment.vue';
import PostLoader from './PostLoader.vue';

const props = defineProps({
  isSideBarOpen: Boolean,
  selectedPost: Object,
  currentUser: Object,
})

const emit = defineEmits(['created', 'delete', 'save']);
const isEditMode = ref(false);
const comments = ref([]);
const showCommentForm = ref(false);
const isCommentsLoading = ref(false);
const commentsError = ref('');
const commentsFormError = ref('');

const BASE_URL = 'https://mate.academy/students-api';


watch(
  () => props.selectedPost, 
  async (newPost) => {
    if (newPost) {
      await fetchComments(newPost.id);
      showCommentForm.value = false;
    } else {
      comments.value = [];
      commentsError.value = '';
      showCommentForm.value = false;
    }
})

async function fetchComments(postId) {
  comments.value = [];
  isCommentsLoading.value = true;
  commentsError.value = '';
  try {
    const res = await fetch(
      `${BASE_URL}/comments?postId=${postId}`,
    );
    if (!res.ok) {
      throw new Error('Failed to fetch comments');
    }
    comments.value = await res.json();
  } catch (err) {
    console.error(err);
    commentsError.value = 'Failed to load comments. Please try again.';
  } finally {
    isCommentsLoading.value = false;
  }
}

function handlePostCreated(post) {
  emit('created', post);
}

function handleSave(post) {
  emit('save', post);
  isEditMode.value = false;
}

function handleDelete() {
  if (!props.selectedPost) return;
  emit('delete', props.selectedPost.id);
}

function openCommentForm() {
  showCommentForm.value = true;
  commentsFormError.value = '';
}

function cancelCommentForm() {
  showCommentForm.value = false;
  commentsFormError.value = '';
}

async function addComment(newComment) {
  commentsFormError.value = '';
  try {
    const res = await fetch(`${BASE_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newComment),
    });
    if (!res.ok) {
      throw new Error('Failed to submit comment');
    }
    const createdComment = await res.json();
    comments.value.push(createdComment);
  } catch (err) {
    console.error(err);
    commentsFormError.value = 'Failed to submit comment. Please try again.';  
  }
}

async function deleteComment(commentId) {
  try {
    const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Failed to delete comment');
    }
    comments.value = comments.value.filter(c => c.id !== commentId);
  } catch (err) {
    console.error(err);
    commentsError.value = 'Failed to delete comment. Please try again.';
  }
}
</script>

<template>
  <div 
    class="tile is-parent is-8-desktop Sidebar" 
    :class="{ 'Sidebar--open': isSideBarOpen }" 
    v-show="isSideBarOpen"
    >
    <div class="tile is-child box is-success ">
      <div class="tile is-child box is-success ">
        <div class="content">
          <!-- Content here -->
          <h2 v-if="isEditMode">Post editing</h2>

          <AddPost 
          v-if="!selectedPost && currentUser" 
          :currentUser="currentUser" 
          @created="handlePostCreated" 
          />

          <EditPost v-else-if="isEditMode" :post="selectedPost" @save="handleSave" @cancel="isEditMode = false" />

          <PostPreview v-else :post="selectedPost" @edit="isEditMode = true" @delete="handleDelete" />
          
          <div v-if="isCommentsLoading" class="block">
            <PostLoader />
          </div>

          <div v-else-if="commentsError" class="notification is-danger">
            {{ commentsError }}
          </div>

          <div v-else-if="comments.length === 0" class="block">
            <p class="title is-4">No comments yet.</p>
          </div>
          <div v-else>
            <Comment 
            v-for="comment in comments" 
            :key="comment.id" 
            :comment="comment" 
            @deleteComment="deleteComment" 
            />
          </div>

          <button
            v-if="!showCommentForm"
            type="button"
            class="button is-link mt-3"
            @click="openCommentForm"
          >
            Write a comment
          </button>

          <AddComment
            v-if="showCommentForm"
            :postId="selectedPost.id"
            @cancel="cancelCommentForm"
            @created="addComment"
            />

          <p v-if="commentsFormError"
            class="help is-danger mt-2"
          > 
            {{ commentsFormError }}
        </p>
        </div>
      </div>
    </div>
  </div>
</template>
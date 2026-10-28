<script setup>
import { ref } from 'vue';
import LoginForm from './components/LoginForm.vue';
import WriteCommentBtn from './components/writeCommentBtn.vue';
import NeedToRegister from './components/NeedToRegister.vue';
import AppHeader from './components/AppHeader.vue';
import { getUserByEmail, createUser } from './api/users.js';
import PostsList from './components/PostsList.vue';
import { getPosts, createPost, updatePost, deletePost } from './api/posts.js';
import Sidebar from './components/Sidebar.vue';
import PostForm from './components/PostForm.vue';
import PostPreview from './components/PostPreview.vue';
import { getComments, createComment, deleteComment } from './api/comments.js';
import CommentItem from './components/CommentItem.vue';
import NoComments from './components/NoComments.vue';
import Loader from './components/Loader.vue';
import CommentForm from './components/CommentForm.vue';  

const user = ref(null);
const loginEmail = ref('');
const needsRegistration = ref(false);
const posts = ref([]);
const comments = ref([]);

const isPostsLoading = ref(false);
const isSidebarOpen = ref(false);
const selectedPost = ref(null);
const isCreatingPost = ref(false);
const isEditingPost = ref(false);
const isCommentsLoading = ref(false);
const isCommentFormVisible = ref(false);
const isCommentSubmitting = ref(false);
const commentSubmitSuccessCount = ref(0);

const errorMessage = ref('');
const postsError = ref('');
const commentsError = ref('');
const commentActionError = ref('');

const loadPosts = async () => {
  isPostsLoading.value = true;
  postsError.value = '';

  try {
    posts.value = await getPosts(user.value.id);
  } catch {
    postsError.value = 'Unable to load posts';
  } finally {
    isPostsLoading.value = false;
  }
};

const handleSubmit = async (email) => {
  errorMessage.value = '';

  try {
    const foundUser = await getUserByEmail(email);

    if (foundUser) {
      user.value = foundUser;
      await loadPosts();
      return;
    }

    loginEmail.value = email;
    needsRegistration.value = true;
  } catch {
    errorMessage.value = 'Unable to load user';
  }
};

const handleRegister = async (name) => {
  errorMessage.value = '';

  try {
    const newUser = await createUser({
      name,
      email: loginEmail.value,
    });

    user.value = newUser;
    needsRegistration.value = false;
    await loadPosts();
  } catch {
    errorMessage.value = 'Unable to register user';
  }
};

const handleWriteComment = () => {
  console.log('Кнопку натиснуто! Тут можна відкрити форму коментаря.');

  isCommentFormVisible.value = true;
};

const handleLogout = () => {
  user.value = null;
  loginEmail.value = '';
  needsRegistration.value = false;
  errorMessage.value = '';
};

const handleAddPost = () => {
  console.log('Додати новий пост');
  selectedPost.value = null;
  isCreatingPost.value = true;
  isSidebarOpen.value = true;

  isCommentFormVisible.value = false;
};

const handleOpenPost = async (post) => {
  console.log('Відкрити пост:', post);
  selectedPost.value = post;
  isCreatingPost.value = false;
  isEditingPost.value = false;
  isSidebarOpen.value = true;
  isCommentFormVisible.value = false;

  await loadComments();
};

const handleClosePost = (post) => {
  console.log('Закрити пост:', post);
  selectedPost.value = null;
  isCreatingPost.value = false;
  isEditingPost.value = false;
  isCommentFormVisible.value = false;
  isSidebarOpen.value = false;
};

const handleCreatePost = async ({ title, body }) => {
  try {
    const newPost = await createPost({
      userId: user.value.id,
      title,
      body,
    });

    posts.value = [...posts.value, newPost];

    selectedPost.value = newPost;
    comments.value = [];
    isCommentFormVisible.value = false;

    isCreatingPost.value = false;
    isSidebarOpen.value = true;
  } catch (error) {
    console.error(error);
  }
};

const handleEditPost = (post) => {
  console.log('Редагувати пост:', post);
  isEditingPost.value = true;
};

const handleSavePost = async ({ title, body }) => {
  try {
    const updatedPost = await updatePost({
      id: selectedPost.value.id,
      title,
      body,
    });

    posts.value = posts.value.map(post =>
      post.id === updatedPost.id ? updatedPost : post
    );

    selectedPost.value = updatedPost;
    isEditingPost.value = false;
  } catch (error) {
    console.error(error);
  }
};

const handleDeletePost = async (post) => {
  console.log('Видалити пост:', post);
  try {
    await deletePost(post.id);

    posts.value = posts.value.filter(p => p.id !== post.id);

    selectedPost.value = null;
    isCreatingPost.value = false;
    isSidebarOpen.value = false;
  } catch (error) {
    console.error(error);
  }
};

const loadComments = async () => {
  isCommentsLoading.value = true;
  commentsError.value = '';

  try {
    comments.value = await getComments(selectedPost.value.id);
  } catch {
    commentsError.value = 'Unable to load comments';
  } finally {
    isCommentsLoading.value = false;
  }
};

const handleCreateComment = async ({
  name,
  email,
  body,
}) => {
    isCommentSubmitting.value = true;
    commentActionError.value = '';

  try {
    const newComment = await createComment({
      postId: selectedPost.value.id,
      name,
      email,
      body,
    });

    comments.value = [...comments.value, newComment];

    commentSubmitSuccessCount.value++;
  } catch (error) {
    console.error(error);
    commentActionError.value = 'Unable to add comment';
  } finally {
    isCommentSubmitting.value = false;
  }
};

const handleDeleteComment = async (commentId) => {
    const oldComments = comments.value;

    commentActionError.value = '';

    comments.value = comments.value.filter(
        comment => comment.id !== commentId
    );

  try {
    await deleteComment(commentId);
  } catch (error) {
    comments.value = oldComments;
    commentActionError.value = 'Unable to delete comment';

    console.error(error);
  }
};
</script>

<template>
<LoginForm 
    v-if="!user && !needsRegistration" 
    @submit-form="handleSubmit"
    :error-message="errorMessage"
    :has-error="Boolean(errorMessage)"
/>

<NeedToRegister
  v-else-if="!user && needsRegistration"
  :error-message="errorMessage"
  :has-error="Boolean(errorMessage)"
  :email="loginEmail"
  @register="handleRegister"
/>

<template v-else>
  <AppHeader :user="user" @logout="handleLogout" />

   <main class="container mt-6">
    <div class="posts-layout is-flex is-justify-content-space-between">
      <Loader v-if="isPostsLoading" />

      <div
        v-else-if="postsError"
        class="notification is-danger"
        >
        {{ postsError }}
        </div>

      <PostsList :posts="posts"
      v-else
      :is-sidebar-open="isSidebarOpen"
      :selected-post="selectedPost"
      @add-post="handleAddPost" 
      @open-post="handleOpenPost" 
      @close-post="handleClosePost"
      />

    <Sidebar :is-open="isSidebarOpen">
        <PostForm
            v-if="isCreatingPost"
            @create-post="handleCreatePost"
            @cancel="handleClosePost"
        />

        <PostForm
            v-else-if="isEditingPost"
            :post="selectedPost"
            @save-post="handleSavePost"
            @cancel="isEditingPost = false"
        />

        <template v-else-if="selectedPost">
            <PostPreview
                :post="selectedPost"
                @edit-post="handleEditPost"
                @delete-post="handleDeletePost"
            />

            <Loader v-if="isCommentsLoading" />

            <div
                v-else-if="commentsError"
                class="notification is-danger"
                >
                {{ commentsError }}
                </div>

            <template v-else>
                <NoComments v-if="!comments.length"/>

                <CommentItem
                    v-for="comment in comments"
                    :key="comment.id"
                    :id="comment.id"
                    :name="comment.name"
                    :email="comment.email"
                    :body="comment.body"
                    @delete-comment="handleDeleteComment"
                />
                
                <div
                v-if="commentActionError"
                class="notification is-danger"
                >
                {{ commentActionError }}
                </div>

                <WriteCommentBtn
                v-if="!isCommentFormVisible"
                @write-comment="handleWriteComment"
                />

                <CommentForm
                v-else
                :is-loading="isCommentSubmitting"
                :success-count="commentSubmitSuccessCount"
                @submit-comment="handleCreateComment"
                />
        </template>
        </template>
    </Sidebar>
    </div>
   </main>
</template>

</template>

<style scoped>
.posts-layout {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin: auto;
}
</style>
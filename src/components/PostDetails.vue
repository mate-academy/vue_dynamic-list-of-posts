<template>
  <div>
    <div class="block">
      <h2 class="title is-4">{{ isNew ? 'Create Post' : 'Post Details' }}</h2>

      <!-- Edit Form -->
      <div v-if="isEditing || isNew">
        <input
          class="input mb-2"
          placeholder="Title"
          v-model="form.title"
        />
        <textarea
          class="textarea mb-2"
          placeholder="Body"
          v-model="form.body"
        ></textarea>

        <div class="buttons">
          <button class="button is-success" @click="submitPost">
            {{ isNew ? 'Create' : 'Save' }}
          </button>
          <button class="button" @click="cancelEdit">Cancel</button>
        </div>
      </div>

      <!-- Preview -->
      <div v-else>
        <h3 class="title is-5">{{ post.title }}</h3>
        <p>{{ post.body }}</p>

        <div class="buttons mt-3">
          <button class="button is-info" @click="startEdit">Edit</button>
          <button class="button is-danger" @click="deletePost">Delete</button>
          <button class="button" @click="$emit('close')">Close</button>
        </div>
      </div>
    </div>

    <!-- Comments -->
    <div v-if="!isNew" class="block">
      <h4 class="title is-6">Comments</h4>
      <Loader v-if="isLoadingComments" />
      <div v-else-if="hasErrorComments" class="notification is-danger">
        Failed to load comments
      </div>
      <div v-else>
        <ul>
          <li v-for="c in comments" :key="c.id">
            <b>{{ c.name }}</b> ({{ c.email }}): {{ c.body }}
          </li>
        </ul>
        <NewCommentForm :post-id="post.id" @comment-added="comments.push" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import Loader from './Loader/Loader.vue';
import NewCommentForm from './NewCommentForm.vue';
import { fetchClient } from '../utils/fetchClient';
import { Post, Comment } from '../types/Post';

export default defineComponent({
  components: { Loader, NewCommentForm },
  props: {
    post: { type: Object as () => Post, required: true },
    isNew: { type: Boolean, default: false },
  },
  emits: ['update-post', 'delete-post', 'create-post', 'close'],
  setup(props, { emit }) {
    const isEditing = ref(props.isNew);
    const form = ref({ title: props.post.title, body: props.post.body });
    const comments = ref<Comment[]>([]);
    const isLoadingComments = ref(false);
    const hasErrorComments = ref(false);

    const loadComments = async () => {
      isLoadingComments.value = true;
      hasErrorComments.value = false;
      try {
        const data = await fetchClient.get<Comment[]>(`/comments?postId=${props.post.id}`);
        comments.value = data;
      } catch {
        hasErrorComments.value = true;
      } finally {
        isLoadingComments.value = false;
      }
    };

    watch(() => props.post, (newPost) => {
      form.value = { title: newPost.title, body: newPost.body };
      isEditing.value = props.isNew;
      if (!props.isNew) loadComments();
    }, { immediate: true });

    const startEdit = () => isEditing.value = true;
    const cancelEdit = () => {
      isEditing.value = false;
      form.value = { title: props.post.title, body: props.post.body };
    };

    const submitPost = () => {
      const updatedPost = { ...props.post, ...form.value };
      if (props.isNew) {
        emit('create-post', updatedPost);
      } else {
        emit('update-post', updatedPost);
        isEditing.value = false;
      }
    };

    const deletePost = () => emit('delete-post', props.post.id);

    return { form, isEditing, startEdit, cancelEdit, submitPost, deletePost, comments, isLoadingComments, hasErrorComments };
  }
});
</script>

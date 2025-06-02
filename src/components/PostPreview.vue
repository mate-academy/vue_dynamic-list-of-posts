<template>
  <div class="block post-preview">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2 class="post-title">#{{ post.id }}: {{ post.title }}</h2>
      <div class="buttons">
        <button
          class="button is-small is-link edit-btn"
          @click="$emit('editPost', post)"
        >
          <i class="fas fa-pen-to-square"></i> Edit
        </button>
        <button
          class="button is-small is-danger delete-btn ml-3"
          @click="$emit('deletePost', post.id)"
        >
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
    </div>
    <p class="post-body" data-cy="PostBody">{{ post.body }}</p>
  </div>
</template>

<script>
export default {
  props: {
    post: Object,
  },
};
</script>

<style scoped>
.post-preview {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  transition: box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out;
}

.post-title {
  font-size: 1.2rem;
  font-weight: bold;
}

.post-body {
  margin-top: 10px;
  font-size: 1rem;
}

.post-preview:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

.buttons {
  display: flex;
  gap: 8px;
}

.edit-btn,
.delete-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
}

.edit-btn:hover {
  background-color: #3498db;
  color: white;
  transform: scale(1.05);
}

.delete-btn:hover {
  background-color: #e74c3c;
  color: white;
  transform: scale(1.05);
}
</style>

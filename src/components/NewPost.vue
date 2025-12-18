<template>
    <div class="post">
        <h2 class="post__title">Create new post</h2>

        <h3 class="post__label">Title</h3>
        <input 
            type="text" 
            placeholder="Post title"
            class="post__input"
            v-model="postTitle"
        >

        <h3 class="post__label">Write Post Body</h3>
        <input 
            type="text" 
            placeholder="Post body"
            class="post__input"
            v-model="postBody"
        >

        <div class="post__actions">
            <button 
                class="post__button post__button--create"
                @click="addOfServer"
            >
                Create
            </button>

            <button 
                class="post__button post__button--cancel"
                @click="cancel"
            >
                Cancel
            </button>
        </div>
    </div>
</template>

<script setup>
import StorageService from '@/utils/storage';
import { ref, computed } from 'vue';

const emit = defineEmits(['created', 'cancel']);

const postTitle = ref('');
const postBody = ref('');

const data = StorageService.get("userData") ?? { posts: [] };

const nextId = computed(() => {
    return data.posts.length
        ? Math.max(...data.posts.map(p => p.id)) + 1
        : 1;
});

function addOfServer() {
    const title = postTitle.value;
    const bodyOfPost = postBody.value;

    if (title.trim() === '' || bodyOfPost.trim() === '') {
        alert('Title or Post not have text. Please write.')
        return;
    }

    if (!data.posts) {
        alert("Erro, não há dados desse usuário.");
        return;
    }

    const newPost = {
        id: nextId.value,
        title: postTitle.value,
        body: postBody.value
    };

    data.posts.push(newPost);
    StorageService.set("userData", data);

    emit('created', newPost);

    postTitle.value = '';
    postBody.value = '';
}

function cancel() {
  emit('cancel');
}
</script>

<style scoped>
.post {
    width: 95%;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.253);
    margin-left: calc(50% - 47.5%);
    padding-left: 15px;
}

.post__title {
    color: #363636;
    font-size: 25px;
}

.post__label {
    color: #363636;
    font-size: 15px;
    margin-bottom: 5px;
}

.post h3:first-of-type {
    margin-top: -2px;
}

.post__input:last-of-type {
    height: 80px;
    margin-bottom: 10px;
}

.post__input {
    width: 94%;
    height: 30px;
    border: 0.5px solid rgb(221, 221, 221);
    border-radius: 5px;
}

.post__input:first-of-type {
    background-image: url('../icons/iconUser.png');
    background-repeat: no-repeat;
    background-position: 12px center;
    background-size: 20px;
    padding-left: 40px;
    width: 85%;
}

.post__actions {
    display: flex;
    flex-direction: row;
    gap: 10px;
}

.post__button {
    width: 80px;
    height: 30px;
    color: rgb(255, 255, 255);
    border: none;
    margin-bottom: 10px;
    border-radius: 5px;
    cursor: pointer;
}

.post__button:first-of-type {
    background-color: #485fc7;
}

.post__button:last-of-type {
    background-color: #eff1fa;
    color: #485fc7;
}
</style>

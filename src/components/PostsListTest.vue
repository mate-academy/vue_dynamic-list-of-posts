<template>
    <div class="posts" :class="{'posts--shrink': isActiveOpen || isNewPost}">
        <div class="posts__container" :class="{'posts__container--shrink' : isActiveOpen}">
            <div class="posts__header" :class="{'posts__header--shrink' : isActiveOpen}">
                <h1 class="posts__title"><strong>Posts</strong></h1>

                <button 
                    class="posts__button"
                    @click="openNewPost"
                >
                    Add New Post
                </button>
            </div>

            <div v-if="listOsPosts.length > 0">
                <div class="block" :class="{'block--shrink' : isActiveOpen || isNewPost}">
                    <table class="table">
                        <thead>
                            <tr class="has-background-link-light">
                                <th>ID</th>
                                <th>Title</th>
                                <th class="has-text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in listOsPosts" :key="item.id">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.title }}</td>
                                <td class="has-text-right is-vcentered">
                                    <button @click="openPost(item.id, index + 1)" type="button" class="button" :class="{'button--active' : selectedId === item.id}">
                                        {{ selectedId === item.id ? 'Close' : 'Open' }}
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <p v-else class="posts__empty-message">No posts yet.</p>
        </div>

        <Transition name="fade" mode="out-in">
        <PostInfo
        v-if="isActiveOpen && !isEditing"
        :key="idForDetails?.id"
        :post="idForDetails"
        :index="indexOfPostOpen"
        @edit="startEdit"
        @delete="deletePost"
        @add-comment="updatePost"
        @delete-comment="deleteComment"
        />

        <PostEditing
            v-else-if="isEditing"
            :post="postBeingEdited"
            @cancel="cancelEdit"
            @saved="finishEdit"
        />
        </Transition>

        <Transition name="fade" mode="out-in">
        <NewPost
        v-if="isNewPost"
        @created="handlePostCreated"
        @cancel="isNewPost = false"
        />
        </Transition>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import PostInfo from './PostInfo.vue';
import NewPost from './NewPost.vue';
import PostEditing from './PostEditing.vue';
import StorageService from '@/utils/storage';

const isActiveOpen = ref(false);
const indexOfPostOpen = ref(null);
const isNewPost = ref(false);
const idForDetails = ref(null);
const selectedId = ref(null);
const listOsPosts = ref([])
const isEditing = ref(false)
const postBeingEdited = ref(null)

function openPost(id, index) {
    const item = listOsPosts.value.find(post => post.id === id);

    isNewPost.value = false;

    if (!isActiveOpen.value) {
        isActiveOpen.value = true;
        selectedId.value = id;
    } else {
        isActiveOpen.value = false;
        selectedId.value = null;
    }

    indexOfPostOpen.value = index;
    idForDetails.value = item;
}

const data = StorageService.get("userData") ?? { posts: [] }
listOsPosts.value = data.posts

watch(
    () => listOsPosts.value.length,
    (newLength, oldLength) => {
        if (newLength > oldLength) {
            isNewPost.value = false;
        }
    }
)

function openNewPost() {
    isActiveOpen.value = false;
    selectedId.value = null;

    isNewPost.value = !isNewPost.value;
}

function handlePostCreated(newPost) {
    listOsPosts.value.push(newPost);
}

function startEdit(post) {
  isActiveOpen.value = false
  isEditing.value = true
  postBeingEdited.value = post
}

function cancelEdit() {
  isEditing.value = false
  postBeingEdited.value = null
}

function finishEdit(updatedPost) {
  const index = listOsPosts.value.findIndex(p => p.id === updatedPost.id)

  if (index !== -1) {
    listOsPosts.value[index] = updatedPost
  }

    StorageService.set('userData', {
    posts: listOsPosts.value
    })

  idForDetails.value = updatedPost
  selectedId.value = updatedPost.id
  isEditing.value = false
  isActiveOpen.value = true
  postBeingEdited.value = null
}

function deletePost(id) {
  listOsPosts.value = listOsPosts.value.filter(post => post.id !== id)

  StorageService.set('userData', {
    ...data,
    posts: listOsPosts.value
  })

  isActiveOpen.value = false
  selectedId.value = null
  idForDetails.value = null
}

function updatePost(updatedPost) {
  const index = listOsPosts.value.findIndex(
    post => post.id === updatedPost.id
  )

  if (index !== -1) {
    listOsPosts.value[index] = updatedPost
  }

  idForDetails.value = updatedPost

  StorageService.set('userData', {
    ...data,
    posts: listOsPosts.value
  })
}

function deleteComment({ postId, commentId }) {
  listOsPosts.value = listOsPosts.value.map(post => {
    if (post.id !== postId) return post

    return {
      ...post,
      comments: post.comments.filter(
        comment => comment.id !== commentId
      )
    }
  })

  idForDetails.value = listOsPosts.value.find(p => p.id === postId)

  StorageService.set('userData', {
    ...data,
    posts: listOsPosts.value
  })
}
</script>

<style scoped>
@font-face {
  font-family: 'Roboto';
  src: url('../assets/fonts/Roboto/Roboto-VariableFont_wdth\,wght.ttf') format('woff2');
}

* {
    font-family: 'Roboto';
}

.block {
    width: 700px;
    margin-bottom: 40px;
}

.table {
    width: 100%;
    table-layout: fixed;
}

.has-background-link-light {
    background-color: rgb(239, 241, 250);
    width: 100%;
    color: rgb(54, 55, 57);
    text-align: left;
}

th:nth-child(1),
td:nth-child(1) {
  width: 8%;
}


th:nth-child(3),
td:nth-child(3) {
  width: 80px;
  text-align: center;
}

td:nth-child(3) button {
    width: 70px;
    height: 30px;
    background-color: rgb(239, 241, 250);
    border: none;
    border-radius: 5px;
    color: rgb(64, 106, 201);
    font-size: 15px;
    cursor: pointer;
}

.posts {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.posts__container {
    width: 95%;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.253);
    margin-left: calc(50% - 47.5%);
    transition: width 2s ease;
}

.posts__header {
    width: 95%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    margin-bottom: 30px;
}

.posts__title {
    color: rgb(54, 54, 54);
    font-size: 25px;
    font-weight: 800px;
}

.posts__button {
    width: 110px;
    height: 35px;
    border-radius: 5px;
    border: none;
    background-color: rgb(72, 95, 199);
    color: aliceblue;
    font-size: 14.5px;
    cursor: pointer;
}

.posts__empty-message {
    font-size: 15px;
    margin-bottom: 15px;
}

.posts__container--shrink {
    transition-duration: 2s;
    width: 50%;
}

.posts__header--shrink {
    transition-duration: 2s;
    width: 90%;
}

.block--shrink {
    transition-duration: 2s;
    width: 350px;
}

.button--active {
    transition-duration: 1s;
    background-color: rgb(72, 95, 199) !important;
    color: rgb(255, 255, 255) !important;
}

.posts--shrink {
    display: flex;
    flex-direction: row;
    gap: 10px;
}

@media (min-width: 319px) {
    .posts__container {
        width: 95%;
    }

    .block {
        width: 95%;
        margin-left: calc(50% - 47.5%);
    }

    .posts--shrink {
        flex-direction: column;
    }
}

@media (min-width: 619px) {
    .posts--shrink {
        flex-direction: row;
    }
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: translateX(15px);
}

.fade-enter-active, .fade-leave-active {
    transition: all 2s ease;
}

.fade-enter-to, .fade-leave-from {
    opacity: 1;
    transform: translateX(0);
}

</style>
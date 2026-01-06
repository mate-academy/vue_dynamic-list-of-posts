<template>
    <div class="post">
        <div class="post__header">
            <h1 class="post__title">{{ `#${index}: ${post.title}` }}</h1>

            <div class="post__actions">
                <img 
                    src="../icons/iconEdit.png" 
                    alt="Edit icon"
                    @click="emit('edit', post)"
                >
                <img 
                src="../icons/iconTrash.png" 
                alt="Trash icon"
                @click="emit('delete', post.id)"
                >
            </div>
        </div>

        <h2 class="post__subtitle">{{ post.body }}</h2>

        <h2
            v-if="!post.comments || post.comments.length === 0"
            class="post__no-comments"
        >
            No comments yet
        </h2>

        <div v-else>
        <div
            v-for="comment in post.comments"
            :key="comment.id"
            class="post__comment"
        >
            <div class="post__comment--divName">
            <h3 class="post__comment--divName-Name">{{ comment.name }}</h3>
            <div class="post__comment--divImg">
                <img 
                    src="../icons/iconClose.png" 
                    alt="icon close comment"
                    @click="delComment(comment.id)"
                >
            </div>
            </div>

            <div class="post__comment--divComment">
            <p class="post__comment--divName-Comment">{{ comment.comment }}</p>
            </div>
        </div>
        </div>


        <div v-if="!writeCommentIs">
            <button class="post__button" @click="writeComments">Write a comment</button>
        </div>

        <div v-else>
            <h2 class="post__label">Author Name</h2>
            <input 
                type="text" 
                class="post__input" 
                placeholder="Name Surname"
                v-model="nameForComment"
            >

            <h2 class="post__label">Author Email</h2>
            <input 
                type="email"
                class="post__input"
                placeholder="Your Email"
                v-model="emailForComment"
            >

            <h2 class="post__label">Write Comment</h2>
            <input 
                type="text"
                class="post__input"
                placeholder="Comment"
                v-model="comment"
            >

            <div class="post__actions2">
                <button 
                    class="post__button post__button--create"
                    @click="addComments"
                >
                    Add Comment
                </button>

                <button 
                    class="post__button post__button--cancel"
                    @click="writeCommentIs = false"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import StorageService from '@/utils/storage';
import { ref } from 'vue';

const writeCommentIs = ref(false);
const nameForComment = ref('');
const emailForComment = ref('');
const comment = ref('');

const props = defineProps({
  post: Object,
  index: Number
})

console.log('POST RECEBIDO:', props.post)

const emit = defineEmits(['edit', 'delete', 'add-comment', 'delete-comment']);

function writeComments() {
    writeCommentIs.value = !writeCommentIs.value;
}

function addComments() {
    const bodyComment = comment.value;
    const emailComment = emailForComment.value;
    const nameComment = nameForComment.value;

    if (bodyComment.trim() === '' || emailComment.trim() === '' || nameComment.trim() === '') {
        if (bodyComment.trim() === '') alert('The comment not was write.'); return;
        if (emailComment.trim() === '') alert('The email not was write.'); return;
        if (nameComment.trim() === '') alert('The name not was write.'); return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailComment)) {
        alert('Invalid email.')
        return
    }

    const updatedPost = {
    ...props.post,
    comments: props.post.comments
        ? [...props.post.comments]
        : []
    }

    updatedPost.comments.push({
    id: Date.now(),
    name: nameForComment.value,
    email: emailForComment.value,
    comment: comment.value
    })

    emit('add-comment', updatedPost)

    nameForComment.value = ''
    emailForComment.value = ''
    comment.value = ''
    writeCommentIs.value = false
}

function delComment(commentId) {
  emit('delete-comment', {
    postId: props.post.id,
    commentId
  })
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
    gap: 10px;
}

.post__header {
    width: 90%;
    display: flex;
    flex-direction: row;
    color: rgb(54, 54, 54);
    font-size: 12px;
    align-items: center;
    margin-top: 0;
    justify-content: space-between;
}

.post__actions {
    display: flex;
    flex-direction: row;
    width: 70px;
    height: auto;
    justify-content: space-between;
}

.post__actions img {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.post__subtitle {
    color: rgb(83, 85, 85);
    font-size: 15px;
}

.post__no-comments {
    color: rgb(54, 54, 54);
    margin-top: 10px;
}

.post__button {
    width: 140px;
    height: 35px;
    border-radius: 5px;
    border: none;
    background-color: rgb(72, 95, 199);
    color: aliceblue;
    font-size: 14.5px;
    cursor: pointer;
    margin-bottom: 20px;
}

@media (min-width: 1019px) {
    .post__header {
        margin-left: calc(50% - 47.5%);
    }
    .post__actions {
        margin-left: calc(100% - 90%);
    }
}

.post__label {
    font-size: 13px;
    color: #363636;
}

.post__input {
    width: 162%;
    height: 30px;
    border: solid 0.5px rgb(196, 196, 196);
    border-radius: 5px;
}

.post__input:first-of-type {
    background-image: url('../icons/iconUser.png');
    background-repeat: no-repeat;
    background-position: 12px center;
    background-size: 20px;
    padding-left: 40px;
}

.post__input:nth-of-type(2) {
    background-image: url('../icons/iconEmail.png');
    background-repeat: no-repeat;
    background-position: 12px center;
    background-size: 20px;
    padding-left: 40px;
}

.post__input:last-of-type {
    width: 180%;
    height: 90px;
    margin-bottom: 20px;
}

.post__button--create {
    width: 120px;
}

.post__button--cancel {
    width: 80px;
    background-color: #eff1fa;
    color: #485fc7;
    margin-left: 10px;
}

.post__actions2 {
    width: 100%;
}

@media (min-width: 319px) {
    .post__comment {
        width: 350px;
        height: auto;
        display: flex;
        flex-direction: column;
        margin-left: 8%;
    }

    .post__comment--divName {
        width: 100%;
        height: auto;
        min-height: 40px;
        text-align: center;
        border: none;
        border-radius: 5px 5px 0 0;
        background-color: #4a4a4a;
        color: #f5f5f5;
        display: flex;
        justify-content: space-between;
    }

    .post__comment--divName-Name {
        margin-left: 10px;
        text-decoration: underline;
        font-size: 12px;
    }

    .post__comment--divImg {
        width: 25px;
        height: 25px;
        background-color: #8b8b8b;
        border-radius: 100%;
        border: none;
        margin-right: 10px;
        margin-top: 5px;
        cursor: pointer;
    }

    .post__comment--divName img {
        width: 15px;
        height: 15px;
        margin-top: 5px;
    }

    .post__comment--divComment {
        width: 100%;
        height: auto;
        min-height: 40px;
        text-align: center;
        border: none;
        border-radius: 0 0 5px 5px;
        background-color: #f5f5f5;
        color: #4a4a4a;
    }

    .post__comment--divName-Comment {
        font-size: 12px;
    }
}

@media (min-width: 619px) {
    .post__input {
        width: 122%;
    }

    .post__input:last-of-type {
        width: 140%;
    }

    .post__comment {
        margin-left: -2%;
    }
}

@media (min-width: 1019px) {
    .post__input {
        width: 230%;
    }

    .post__input:last-of-type {
        width: 248%;
    }

    .post__comment {
        margin-left: 40%;
    }

    .post__comment--divComment {
        width: 150%;
    }

    .post__comment--divName {
        width: 150%;
    }
}

</style>
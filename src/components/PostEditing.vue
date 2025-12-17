<template>
    <div class="post">
        <h2 class="post__title">Post editing</h2>

        <h3 class="post__label">Title</h3>
        <input
        type="text"
        class="post__input"
        v-model="postTitle"
        />

        <h3 class="post__label">Write Post Body</h3>
        <input
        type="text"
        class="post__input"
        v-model="postBody"
        />

        <div class="post__actions">
            <button 
                class="post__button post__button--create"
                @click="save"
            >
                Save
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
import { ref, watch } from 'vue'

const props = defineProps({
  post: Object
})

const emit = defineEmits(['cancel', 'saved'])

const postTitle = ref('')
const postBody = ref('')

watch(
  () => props.post,
  (post) => {
    if (post) {
      postTitle.value = post.title
      postBody.value = post.body
    }
  },
  { immediate: true }
)

function save() {
    const titleEdited = postTitle.value
    const bodyEdited = postBody.value

    if (
        titleEdited === props.post.title &&
        bodyEdited === props.post.body
    ) {
        alert('Without alterations in post.')
        emit('cancel')
        return
    }

    emit('saved', {
    ...props.post,
    title: postTitle.value,
    body: postBody.value
    })
}

function cancel() {
  emit('cancel')
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

<template>
    <div class="posts">
        <div class="posts__container">
            <div class="posts__header">
                <h1 class="posts__title"><strong>Posts</strong></h1>

                <button class="posts__button">Add New Post</button>
            </div>

            <PostsList :list="listOsPosts" v-if="listOsPosts.length > 0" />
            <p v-else class="posts__empty-message">No posts yet.</p>
        </div>
    </div>
</template>

<script setup>
import PostsList from './PostsList.vue';

const listOsPosts = [
    {
        id: 1,
        title: 'New title',
        post: 'text of post',
    },
    {
        id: 2,
        title: 'New title',
        post: 'text of post',
    }
]
</script>

<style scoped>
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
</style>
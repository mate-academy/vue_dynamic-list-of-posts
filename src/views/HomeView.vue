<script>
import PostsList from '@/components/PostsList.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import { addPost, editPostOnServer, getPosts, removePost } from '@/http/postsApi';
import Sidebar from '@/components/Sidebar.vue';

    export default {
        name: 'HomeView',
        components: {
            PostsList,
            ErrorMessage,
            Sidebar,
        },
        data() {
            return {
                posts: [],
                errorMessage: '',
                isOpen: false,
                currentPost: null,
                isCreate: true,
                isLoad: false,
            }
        },
        mounted() {
            this.isLoad = true;

            getPosts()
                .then(({ data }) => {
                    this.posts = data;
                })
                .catch(() => {
                    this.errorMessage = "Unable to get data from the server!";
                })
                .finally(() => {
                    this.isLoad = false;
                });
        },
        methods: {
            open(post) {
                this.isOpen = true;

                if (post) {
                    this.currentPost = post;
                } else if (this.currentPost !== null && !post) {
                    this.currentPost = null;
                }
            },
            close() {
                this.isOpen = false;

                if (this.currentPost) {
                    this.currentPost = null;
                }
            },
            addPostOnServer($event) {
                addPost($event)
                    .then(({ data }) => {
                        this.posts = [...this.posts, data];

                        this.currentPost = data;
                    })
                    .catch(() => {
                        this.errorMessage = 'Unable to add a new post';
                    });
            },
            editPostOnServer($event) {
                editPostOnServer($event)
                    .then(({ data }) => {
                        const index = this.posts.findIndex(x => x.id === $event.id);

                        this.posts = [
                            ...this.posts.slice(0, index),
                            data,
                            ...this.posts.slice(index + 1)
                        ];

                        this.currentPost = data;
                    });
            },
            removePostFromServer($event) {
                removePost($event)
                    .then(() => {
                        this.close();

                        this.posts = [...this.posts.filter(x => x.id !== $event)];
                    });
            }
        }
    };
</script>

<template>
    <main class="main">
        <div class="container">
            <div class="tile is-ancestor">
                <PostsList
                    :posts="posts" 
                    @open="open" 
                    @close="close"
                    :opened="isOpen"
                    :isLoad="isLoad"
                />

                <Sidebar
                    :isOpen="isOpen"
                    :post="currentPost"
                    @close="close"
                    @addPost="addPostOnServer"
                    @onEdit="editPostOnServer"
                    @onDelete="removePostFromServer"
                />
            </div>
        </div>

        <ErrorMessage v-if="errorMessage" @hide="errorMessage = ''">
            <template #header>
                <p>Server error</p>
            </template>

            <template #default>
                {{ errorMessage }}
            </template>
        </ErrorMessage>
    </main>
</template>

<style>
    .main {
        padding: 3rem 1.5rem;
    }

    .tile {
        display: flex;
        align-items: stretch;
        flex-basis: 0;
        flex-grow: 1;
        flex-shrink: 1;
        padding: .75rem;
    }
</style>

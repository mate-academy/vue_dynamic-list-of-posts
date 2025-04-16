<script>
import Header from './components/header.vue';
import login from './components/login.vue';
import postsList from './components/postsList.vue';

export default {
    components: {
        Header,
        login,
        postsList,
    },
    data() {
        return {
            user: {},
            loading: false,
            loginPage: true,
        }

    },
    methods: {
        addUser($event) {
            this.user = { ...$event[0] }
            this.loginPage = false;
            localStorage.setItem('user', JSON.stringify(this.user))
        },
        Logout() {
            this.user = {};
            this.loginPage = true;
            localStorage.removeItem('user')
        }
    },
    mounted() {
        this.user = JSON.parse(localStorage.getItem('user')) || {};
        if (this.user.id) {
            this.loginPage = false;
        }
    },
    watch: {
        user() {
            console.log(this.user);
        },
    }
}
</script>

<template>
    <login :user="user" @addUser="addUser" v-if="loginPage" />
    <template v-else>
        <Header :user="user" v-if="user" @logout="Logout"></Header>
        <main class="section">
            <div class="container">
                <div class="tile is-ancestor">
                    <postsList :user="user" v-if="user" />
                </div>
            </div>
        </main>
    </template>
</template>
<style></style>
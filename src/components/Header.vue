<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-item">
            <h2 class="is-size-4">Vue List Of Posts</h2>
        </div>

        <div class="navbar-end">
            <div class="navbar-item">
                <div class="buttons">
                    <div class="mr-5 mb-2">
                        <p>User: {{ user.user }}</p>
                    </div>

                    <a class="button is-light" @click="logoutOfCont">Logout</a>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import StorageService from '@/utils/storage';
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const user = ref({});
const router = useRouter()

user.value = StorageService.get("userData") || {};

function logoutOfCont() {
    localStorage.removeItem('authUser')
    router.push('/login')
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

.buttons {
    display: flex;
    flex-direction: row;
    gap: 30px;
    margin-top: 15px;
    margin-bottom: 60px;
    align-items: center;
}

.navbar {
    margin-top: 0;
    margin-left: 0;
}

.is-size-4 {
    color: rgb(55, 57, 62);
    font-weight: 600px;
    font-size: 20px;
}

.button {
    width: 75px;
    height: 35px;
    border: none;
    background-color: rgb(245, 245, 245);
    text-align: center;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

@media (min-width: 1019px) {
    .navbar {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .is-size-4 {
        margin-top: 15px;
    }
}

</style>
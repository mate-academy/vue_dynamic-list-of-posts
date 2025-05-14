<script setup>
import { ref, watch, onMounted } from 'vue';
import Header from './components/Header.vue';
import Login from './components/Login.vue';
import PostsList from './components/PostsList.vue';
import Loader from './components/loader/index.vue';
import { getUserByEmail } from './helpers/users';

const user = ref(null);
const isLoading = ref(false);

const userLogin = (newUser) => {
  user.value = newUser;
};

const handleLogout = () => {
  user.value = null;
  localStorage.removeItem('user');
};

const fetchUserFromLocalStorage = async () => {
  const stored = localStorage.getItem('user');
  if (!stored) {
    return;
  }

  const parsed = JSON.parse(stored);

  isLoading.value = true;
  try {
    const result = await getUserByEmail(parsed.email);

    if (result) {
      userLogin(result);
    } else {
      localStorage.removeItem('user');
    }
  } catch (e) { }
  finally {
    isLoading.value = false
  }
};

onMounted(fetchUserFromLocalStorage);

watch(user, async (val) => {
  if (val) {
    localStorage.setItem('user', JSON.stringify(val));
  } else {
    handleLogout();
  }
});

</script>

<template>

  <Loader v-if="isLoading" />

  <template v-else>
    <Login v-if="!user" @addUser="userLogin" />

    <template v-else>

      <Header :user="user" @logout="handleLogout" />


      <main class='section'>
        <div class="container">
          <div class="tile is-ancestor">
            <PostsList :user="user" v-if="user" />
          </div>
        </div>
      </main>
    </template>
  </template>
</template>

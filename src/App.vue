<script lang="ts">
  import { defineComponent } from 'vue';
  import { LocalStorage } from '@/utils/LocalStorage';
  import Login from '@/components/Login.vue';
  import 'bulma';
  import '@fortawesome/fontawesome-free/css/all.css';
  import Header from '@/components/Header.vue';
  import { UserApi } from '@/api/user.api';
  import PostsList from '@/components/PostsList.vue';


  export default defineComponent({
    components: { PostsList, Header, Login },
    data() {
      return {
        user: LocalStorage.user.get(),
        authorized: !!LocalStorage.user.get().id,
        submitted: false,
        email: '',
      }
    },
    methods: {
      login($event: SubmitEvent) {
        $event.preventDefault();

        UserApi.findUser(this.email)
          .then(response => {
            this.submitted = true;

            if (!response.data.length) {
              this.authorized = false;

              return;
            }

            this.authorized = true;
            this.user = response.data[0];
            LocalStorage.user.set(this.user);
          });
      },
      changeHandler($event: InputEvent) {
        const eventTarget = $event.target as HTMLInputElement;

        this.email = eventTarget.value;
      },
      logoutHandler() {
        this.authorized = false;
        this.submitted = false;

        LocalStorage.user.clear();
      }
    }
  })
</script>

<template>
  <Login
    v-if="!authorized"
    @handleSubmit="login"
    @changeHandler="changeHandler"
    :authorized="authorized"
    :submitted="submitted"
  />

  <template v-if="authorized">
    <Header :user="user" @logout="logoutHandler" />

    <main class="section">
      <div class="container">
        <div class="tile is-ancestor">
          <PostsList :userId="user.id"/>
        </div>
      </div>
    </main>
  </template>
</template>

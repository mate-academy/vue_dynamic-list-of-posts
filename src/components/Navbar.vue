<script setup lang="ts">
import { inject, type Ref } from "vue";
import type { User } from "../types/User";

const user = inject<Ref<User | null>>("user");
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h2 class="is-size-4">Vue List Of Posts</h2>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5">
            <p>User: {{ user ? user.name : "" }}</p>
          </div>

          <a class="button is-light"> Logout </a>
        </div>
      </div>
    </div>
  </nav>
</template>

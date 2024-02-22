<script lang="ts">
  import { defineComponent } from 'vue';
  import Registration from '@/components/Registration.vue'

  export default defineComponent({
    components: { Registration },
    emits: ['handleSubmit', 'changeHandler'],
    props: {
      authorized: Boolean,
      submitted: Boolean,
    }
  })
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit="$emit('handleSubmit', $event)" class="box mt-5">
      <h1 class="title is-3">Get your userId</h1>

      <div class="field">
        <label class="label" for="user-email"> Email </label>

        <div class="control has-icons-left">
          <input
            type="email"
            id="user-email"
            name="email"
            class="input"
            placeholder="Enter your email"
            required
            @input="$emit('changeHandler', $event)"
          />

          <span class="icon is-small is-left">
          <i class="fas fa-envelope" />
        </span>
        </div>

<!--        <p class="help is-danger">error message</p>-->
      </div>

      <Registration v-if="!authorized && submitted"/>

      <div class="field">
        <button type="submit" class="button is-primary">Login</button>
      </div>

    </form>
  </section>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import Registration from '@/components/Registration.vue'

  export default defineComponent({
    components: { Registration },
    emits: ['handleSubmit', 'changeHandler', 'changeName'],
    props: {
      authorized: Boolean,
      submitted: Boolean,
    },
    methods: {
      changeNameHandler($event: InputEvent) {
        const eventTarget = $event.target as HTMLInputElement;

        this.$emit('changeName', eventTarget.value)
      }
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
      </div>

      <Registration v-if="!authorized && submitted" @change-name-handler="changeNameHandler"/>

      <div class="field">
        <button type="submit" class="button is-primary">Login</button>
      </div>

    </form>
  </section>
</template>

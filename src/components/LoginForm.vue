<script>
import { ref } from 'vue'
import { getUserByEmail, addNewUser } from '../server'
import InputField from './InputField.vue'

export default {
  name: 'GetUserIdForm',
  components: { InputField },
  setup(props, context) {
    const emit = context.emit
    const email = ref('')
    const name = ref('')
    const error = ref('')
    const userId = ref(null)
    const loading = ref(false)
    const isNewUser = ref(false)

    const handleSubmit = async () => {
      error.value = ''
      userId.value = null

      if (!email.value.trim()) {
        error.value = 'Email is required'
        return
      }

      if (isNewUser.value) {
        if (!name.value.trim() || name.value.trim().length < 4) {
          error.value = 'Name must be at least 4 characters long'
          return
        }

        try {
          loading.value = true
          const newUser = await addNewUser(name.value.trim(), email.value.trim())
          userId.value = newUser.id
          console.log('Registered new user:', newUser)
          isNewUser.value = false
          name.value = ''
        } catch (error) {
          error.value = 'Could not register user. Try again.'
        } finally {
          loading.value = false
        }

        return
      }

      try {
        loading.value = true
        const user = await getUserByEmail(email.value.trim())

        if (user) {
          userId.value = user.id
          emit('logged-in', { id: user.id, name: user.name })
          console.log('Found user:', user)
        } else {
          isNewUser.value = true
        }
      } catch (error) {
        error.value = 'Something went wrong, please try again.'
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      name,
      error,
      userId,
      loading,
      isNewUser,
      handleSubmit,
    }
  },
}
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form class="box mt-5" @submit.prevent="handleSubmit">
      <h1 class="title is-3">
        {{ isNewUser ? 'You need to register' : 'Get your userId' }}
      </h1>

      <div class="field">
        <!-- <label class="label" for="user-email">Email</label> -->
        <!-- <div class="control has-icons-left"> -->
          <!-- <input
            v-model.trim="email"
            type="email"
            id="user-email"
            name="email"
            class="input"
            placeholder="Enter your email"
            required
            :disabled="isNewUser"
          /> -->
          <InputField
            v-model="email"
            name="email"
            id="user-email"
            label="Email"
            placeholder="Enter your email"
            type="email"
            leftIcon="fas fa-envelope"
            :error="error"
            data-cy="EmailInput"
          />
          <!-- <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span> -->
        <!-- </div> -->
      </div>

      <div v-if="isNewUser" class="field">
        <!-- <label class="label" for="user-name">Your Name</label> -->
        <div class="control has-icons-left">
          <!-- <input
            v-model.trim="name"
            type="text"
            id="user-name"
            name="name"
            class="input"
            placeholder="Enter your name"
            required
            minlength="4"
          /> -->
          <InputField
            v-model="name"
            name="name"
            id="user-name"
            label="Your Name"
            placeholder="Enter your name"
            type="text"
            leftIcon="fas fa-user"
            :error="error"
            data-cy="NameInput"
          />

          <!-- <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span> -->
        </div>
      </div>

      <!-- <p v-if="error" class="help is-danger">{{ error }}</p> -->

      <div class="field mt-4">
        <button type="submit" class="button is-primary" :disabled="loading">
          {{ isNewUser ? 'Register' : 'Login' }}
        </button>
      </div>
    </form>
  </section>
</template>

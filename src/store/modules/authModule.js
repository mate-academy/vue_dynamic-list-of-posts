import { auth } from '@/api/auth'

export const authModule = {
  state() {
    return {
      user: null,
      isNewUser: false,
      loading: false,
      errorMessage: '',
    }
  },
  getters: {},
  mutations: {
    addUser(state, payload) {
      state.user = payload
    },
    createUser(state) {
      state.isNewUser = true
    },
    deleteUser(state) {
      state.user = null
    },
    setLoading(state, payload) {
      state.loading = payload
    },
    setErrorMessage(state, payload) {
      state.errorMessage = payload
    },
  },
  actions: {
    async authClient(context, payload) {
      context.commit('setLoading', true)

      return auth
        .getId(payload)
        .then((response) => {
          if (response.data.length === 0) {
            console.log(response)
            context.commit('createUser')
            return
          }
          console.log(response.data[0])

          context.commit('addUser', response.data[0])
        })
        .catch((e) => {
          console.log(e)

          context.commit('setErrorMessage', 'Something went wrong!')
        })
        .finally(() => {
          context.commit('setLoading', false)
        })
    },

    async createUser(context, payload) {
      context.commit('setLoading', true)

      return auth
        .createUser(payload)
        .then((response) => {
          console.log(response.data[0])

          context.commit('addUser', response.data[0])
        })
        .catch((e) => {
          console.log(e)

          context.commit('setErrorMessage', 'Something went wrong!')
        })
        .finally(() => {
          context.commit('setLoading', false)
        })
    },
  },
}

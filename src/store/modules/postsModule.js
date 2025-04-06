import { posts } from '@/api/posts'

export const postModule = {
  namespaced: true,
  state() {
    return {
      posts: [],
      loading: false,
      errorMessage: '',
    }
  },
  mutations: {
    addPosts(state, payload) {
      state.posts = payload
    },

    addPost(state, payload) {
      state.posts.push(payload)
    },

    editPost(state, payload) {
      state.posts = state.posts.map((post) => {
        if (post.id === payload.id) {
          return {
            ...post,
            ...payload,
          }
        }

        return post
      })
    },

    deletePost(state, payload) {
      state.posts = state.posts.filter((post) => post.id !== payload)
    },

    setLoading(state, payload) {
      state.loading = payload
    },

    setErrorMessage(state, payload) {
      state.errorMessage = payload
    },
  },
  actions: {
    async loadPosts(context) {
      context.commit('setLoading', true)

      const userId = context.rootState.auth.user.id

      posts
        .get(userId)
        .then(({ data }) => {
          context.commit('addPosts', data)
        })
        .catch((e) => {
          console.log(e)

          context.commit('setErrorMessage', 'Something went wrong!')
        })
        .finally(() => {
          context.commit('setLoading', false)
        })
    },

    async addPost(context, payload) {
      const userId = context.rootState.auth.user.id
      const newPost = {
        body: payload.body,
        title: payload.title,
        userId: userId,
      }

      posts.post(newPost).then((response) => {
        console.log(response)

        context.commit('addPost', response.data)
      })
    },

    async editPost(context, payload) {
      const userId = context.rootState.auth.user.id

      posts.update({ ...payload, userId }).then((response) => {
        console.log(response)

        context.commit('editPost', response.data)
      })
    },
    async deletePost(context, payload) {
      posts.delete(payload).then(() => {
        context.commit('deletePost', payload)
      })
    },
  },
}

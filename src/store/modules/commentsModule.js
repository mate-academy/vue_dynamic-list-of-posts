import { comments } from '@/api/comments'

export const commentsModule = {
  namespaced: true,
  state() {
    return {
      comments: [],
      loading: false,
      errorMessage: '',
    }
  },
  mutations: {
    addComments(state, payload) {
      state.comments = payload
    },

    addComment(state, payload) {
      state.comments.push(payload)
    },

    editComment(state, payload) {
      state.comments = state.comments.map((comment) => {
        if (comment.id === payload.id) {
          return payload
        }

        return comment
      })
    },

    deleteComment(state, payload) {
      state.comments = state.comments.filter((comment) => comment.id !== payload)
    },
    setLoading(state, payload) {
      state.loading = payload
    },

    setErrorMessage(state, payload) {
      state.errorMessage = payload
    },
  },
  actions: {
    async loadComments(context, payload) {
      context.commit('setLoading', true)

      comments
        .get(payload)
        .then(({ data }) => {
          context.commit('addComments', data)
        })
        .catch((e) => {
          console.log(e)

          context.commit('setErrorMessage', 'Something went wrong!')
        })
        .finally(() => {
          context.commit('setLoading', false)
        })
    },
    async addComment(context, payload) {
      console.log('works')

      comments
        .post(payload)
        .then((response) => {
          console.log(response)

          context.commit('addComment', response.data)
        })
        .catch((e) => {
          console.log(e)
        })
    },
    async editComment(context, payload) {
      comments.update(payload).then((response) => {
        context.commit('editComment', response.data)
      })
    },
    async deleteComment(context, payload) {
      comments.delete(payload).then(() => {
        context.commit('deleteComment', payload)
      })
    },
  },
}

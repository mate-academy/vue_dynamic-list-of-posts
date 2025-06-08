import { createStore } from 'vuex';
import { getLocalStorage } from '../utils/getLocalStorage';

// Отримуємо початковий user ID з localStorage, якщо він є
const initialUser = getLocalStorage('user');
const initialUserId = initialUser ? initialUser.id : null;

export default createStore({
  // Стан додатка
  state: {
    userId: initialUserId, // ID поточного залогіненого користувача
    postList: [], // Список постів поточного користувача
    currentPost: null, // Пост, який зараз відкритий для деталей або редагування
    inSidebar: '', // Стан сайдбара: '', 'creatingPost', 'updatingPost', 'postDetails'
  },

  // Мутації для зміни стану
  mutations: {
    /**
     * Встановлює ID поточного користувача.
     * @param {object} state - Об'єкт стану Vuex.
     * @param {number|null} id - ID користувача або null.
     */
    setUserId(state, id) {
      state.userId = id;
    },

    /**
     * Додає або оновлює список постів.
     * @param {object} state - Об'єкт стану Vuex.
     * @param {Array<object>} posts - Масив об'єктів постів.
     */
    addPostList(state, posts) {
      state.postList = posts;
    },

    /**
     * Додає новий пост до списку.
     * @param {object} state - Об'єкт стану Vuex.
     * @param {object} newPost - Новий об'єкт поста.
     */
    addPost(state, newPost) {
      state.postList.unshift(newPost); // Додаємо на початок списку
    },

    /**
     * Оновлює існуючий пост у списку.
     * @param {object} state - Об'єкт стану Vuex.
     * @param {object} updatedPost - Оновлений об'єкт поста.
     */
    updatePost(state, updatedPost) {
      const index = state.postList.findIndex(
        (post) => post.id === updatedPost.id,
      );
      if (index !== -1) {
        state.postList.splice(index, 1, updatedPost);
      }
    },

    /**
     * Видаляє пост зі списку.
     * @param {object} state - Об'єкт стану Vuex.
     * @param {number} postId - ID поста для видалення.
     */
    deletePost(state, postId) {
      state.postList = state.postList.filter((post) => post.id !== postId);
    },

    /**
     * Встановлює поточний вибраний пост.
     * @param {object} state - Об'єкт стану Vuex.
     * @param {object|null} post - Об'єкт поста або null.
     */
    setCurrentPost(state, post) {
      state.currentPost = post;
    },

    /**
     * Встановлює стан сайдбара.
     * @param {object} state - Об'єкт стану Vuex.
     * @param {string} status - Рядок, що позначає стан сайдбара.
     */
    setInSidebar(state, status) {
      state.inSidebar = status;
    },
  },

  // Дії (можуть бути асинхронними та викликати мутації)
  actions: {
    // Приклад дії для завантаження постів (якщо вам потрібна асинхронність тут)
    // loadUserPosts({ commit, state }) {
    //   if (state.userId) {
    //     // Тут можна було б викликати getUserPosts з API
    //     // getUserPosts(state.userId)
    //     //   .then(response => commit('addPostList', response.data))
    //     //   .catch(error => console.error(error));
    //   }
    // },
  },

  // Гетери для отримання обчислених даних зі стану (необов'язково, але корисно)
  getters: {
    // isUserLoggedIn: (state) => !!state.userId,
    // getPostById: (state) => (id) => state.postList.find(post => post.id === id),
  },
});

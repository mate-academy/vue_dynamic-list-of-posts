import { createStore } from 'vuex'
import { commentsModule } from './modules/commentsModule'
import { postModule } from './modules/postsModule'
import { authModule } from './modules/authModule'

export const store = createStore({
  modules: {
    comments: commentsModule,
    posts: postModule,
    auth: authModule,
  },
})

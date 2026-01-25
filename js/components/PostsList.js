// PostsList Component
const PostsList = {
  name: 'PostsList',
  components: {
    Loader,
  },
  props: {
    posts: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: '',
    },
  },
  emits: ['addNew', 'openPost'],
  template: `
    <div class="tile is-parent">
      <div class="tile is-child box is-success">
        <div class="block">
          <div class="block is-flex is-justify-content-space-between">
            <p class="title">Posts</p>
            <button 
              type="button" 
              class="button is-link"
              @click="$emit('addNew')"
            >
              Add New Post
            </button>
          </div>

          <div v-if="isLoading">
            <Loader />
          </div>

          <div v-else-if="error" class="notification is-danger">
            {{ error }}
          </div>

          <div v-else-if="posts.length === 0" class="notification is-warning">
            No posts yet
          </div>

          <table v-else class="table is-fullwidth is-striped is-hoverable is-narrow">
            <thead>
              <tr class="has-background-link-light">
                <th>ID</th>
                <th>Title</th>
                <th class="has-text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="post in posts" :key="post.id">
                <td>{{ post.id }}</td>
                <td>{{ post.title }}</td>
                <td class="has-text-right is-vcentered">
                  <button 
                    type="button" 
                    class="button is-link"
                    @click="$emit('openPost', post)"
                  >
                    Open
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
};

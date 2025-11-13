// Sidebar Component
const Sidebar = {
  name: 'Sidebar',
  components: {
    PostPreview,
    PostForm,
    PostComments,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: 'closed', // 'closed', 'create', 'view', 'edit'
    },
    currentPost: {
      type: Object,
      default: null,
    },
  },
  emits: ['save', 'edit', 'delete', 'cancel'],
  template: `
    <div :class="['tile', 'is-parent', 'is-8-desktop', 'Sidebar', { 'Sidebar--open': isOpen }]">
      <div class="tile is-child box is-success">
        <div class="tile is-child box is-success">
          <div class="content">
            <!-- Create New Post Form -->
            <div v-if="mode === 'create'">
              <PostForm
                :isEditing="false"
                @save="$emit('save', $event)"
                @cancel="$emit('cancel')"
              />
            </div>

            <!-- View Post with Comments -->
            <div v-else-if="mode === 'view' && currentPost">
              <PostPreview
                :post="currentPost"
                @edit="$emit('edit')"
                @delete="$emit('delete')"
              />
              
              <hr>
              
              <PostComments
                :postId="currentPost.id"
              />
            </div>

            <!-- Edit Post Form -->
            <div v-else-if="mode === 'edit' && currentPost">
              <PostForm
                :post="currentPost"
                :isEditing="true"
                @save="$emit('save', $event)"
                @cancel="$emit('cancel')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  `
};

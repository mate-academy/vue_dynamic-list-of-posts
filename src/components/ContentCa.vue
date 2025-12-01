<PostForm
  v-if="sidebarMode === SidebarMode.Create_Post"
  mode="create"
  :currentPost="currentPost"
  :submitting="creating"
  @submit="handleCreatePost"
  @cancel="cancelForm"
/>

<PostForm
  v-if="sidebarMode === SidebarMode.Edit_Post"
  mode="edit"
  :currentPost="currentPost"
  :submitting="updating"
  @submit="handleUpdatePost"
  @cancel="cancelForm"
/>

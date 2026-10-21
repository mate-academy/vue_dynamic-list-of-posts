import fun from "@/services/api";
import { reactive, readonly } from "vue";

const state = reactive({
  postsList: [],
  commentList: [],
  commentBody: null,
  isComment: false,
  postBody: null,
  showCreatePost: false,
  showComments: false,
  activePostId: null,
  isLoading: false,
  isLoadingComment: false,
  isEditing: false,
  commentAuthor: '',
  commentEmail: '',
  commentBody: '',
  commentsError: '',
  getPostError: '',
});

export const usePostStore = () => {
  const handleShowPost = (isShow) => {
    state.showCreatePost = isShow;
    if (isShow) {
      state.activePostId = null;
      state.showComments = false;
      state.isComment = false;
    }
  };

  const handleToggleComments = (postId) => {
    if (state.activePostId === postId) {
      state.showComments = !state.showComments;
      if (!state.showComments) {
        state.activePostId = null;
        state.isComment = false;
        state.isEditing = false;
        state.postBody = null;
      }
    } else {
      state.activePostId = postId;
      state.showComments = true;
      state.isComment = false;
      state.isEditing = false;

    }
    state.showCreatePost = false;
  };

const posts = async (user) => {
  if (!user) return;
  try {
    const userId = user.value ? user.value.id : user;
    if (!userId) return;

    state.isLoading = true;

    const data = await fun.getPost(userId);
    
    state.postsList = data;
    
  } catch (e) {
    console.error("Error displaying the list of posts:", e.message);
    state.getPostError = "Error displaying the list of posts";
  } finally {
    state.isLoading = false;
  }
};

  const fecthAddPost = async (postCadastro) => {
    try {
      const data = await fun.addPost(postCadastro)
      if (data) {
        state.postBody = data
        state.showCreatePost = false;
        state.showComments = true;
        state.activePostId = data.id;

        await posts(postCadastro.userId)
      }
    } catch (e) {
      console.error("internal error", e.message)
    }
  }

  const handleIsLoading = (param) => {
    state.isLoading = param
  }

  const fetchComment = async (id) => {
    try {
      state.commentList = []
      if (id) {
      state.isLoadingComment = true
      const data = await fun.getComment(id)
      state.commentList = data
      }
      state.commentsError = '';
    } catch (e) {
      console.error("Error displaying comments", e.message)
      state.commentsError = `Error displaying comments: ${e.message}`
    } finally {
      state.isLoadingComment = false;

    }

  }
  const fetchAddComment = async (comment) => {
    await fun.addComent(comment);
    await fetchComment(comment.postId)
  }

  const handleShowFormComment = (param) => {
    state.isComment = param
  }
  const handleIsEditing = (param) => {
    state.isEditing = param;
    state.isComment = false;
  }
  const fetchUpdatePost = async (updatedData) => {
  try {
    const data = await fun.updatePost({title: updatedData.title, body: updatedData.body, userId: updatedData.userId, postId: updatedData.postId}); // Certifique-se que sua service tem essa função
    if (data) {
      // Atualiza a lista localmente ou recarrega os posts
      await posts(updatedData.userId);
      state.isEditing = false;
    }
  } catch (e) {
    console.error("Error updating post:", e.message);
  }
  };
  const fetchDeletePost = async (postId) => {
    try {
     
      const data = await fun.deletePost(postId);

      
      if (data) {
        state.postsList = state.postsList.filter((post) => post.id !== postId);
      }

      
      if (state.activePostId === postId) {
        state.activePostId = null;
        state.postBody = null;
        state.isEditing = false;
        state.showComments = false;
      }
    } catch (e) {
      console.error("Error deleting post:", e.message);
    }
  };
  const fetchDeleteComment = async (commentId) => {
    try {
      state.commentList = state.commentList.filter((comment) => comment.id !== commentId);
      await fun.deleteComment(commentId);

    } catch (e) {
      console.error("Error deleting comment:", e.message);
    }
  };
  const clearCommentForm = () => {
    state.commentAuthor = "";
    state.commentEmail = "";
    state.commentBody = "";
  };

  const setCommentAuthor = (val) => {
    state.commentAuthor = val
  }
  const setCommentEmail = (val) => {
    state.commentEmail = val
  }
  const setCommentBody = (val) => {
    state.commentBody = val
  }

 
  
  return {
    state: readonly(state),
    handleShowPost,
    handleToggleComments,
    posts,
    fecthAddPost,
    handleIsLoading,
    fetchComment,
    handleShowFormComment,
    fetchAddComment,
    handleIsEditing,
    fetchUpdatePost,
    fetchDeletePost,
    fetchDeleteComment,
    clearCommentForm,
    setCommentAuthor,
    setCommentBody,
    setCommentEmail
  };
};

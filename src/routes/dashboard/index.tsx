import { useState, useCallback, useMemo, useEffect } from "react";

import { createPost, deletePost, getUserPosts, updatePost } from "api";

import { PostsList, Sidebar, AddPostForm, PostPreview } from "components";
import { Header } from "shared/Header";

export const Dashboard = () => {
  const [openPostId, setOpenPostId] = useState<number | null>(null);
  const [isOpenNewPostForm, setIsOpenNewPostForm] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [posts, setPosts] = useState<Posts.Data[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  useEffect(() => {
    (async () => {
      const posts = await getUserPosts();

      posts && setPosts(posts);
      setIsLoadingPosts(false);
    })();
  }, []);

  const handleOpenClosePost = useCallback(
    (postId: number) => () => {
      setIsOpenNewPostForm(false);
      setEditingPostId(null);
      setOpenPostId((prev) => (prev === postId ? null : postId));
    },
    []
  );

  const handleSetEditPost = useCallback(
    (postId: number) => () => {
      setEditingPostId(postId);
      setIsOpenNewPostForm(false);
      setOpenPostId(null);
    },
    []
  );

  const handleOpenCloseNewPostForm = useCallback(
    (value: boolean) => () => {
      setIsOpenNewPostForm(value);
      setOpenPostId(null);
      setEditingPostId(null);
    },
    []
  );

  const handleCreatePost = useCallback(
    async (post: Posts.New) => {
      const newPost = await createPost(post);

      if (!newPost) {
        return;
      }

      setPosts((prev) => [...prev, newPost]);
      handleOpenClosePost(newPost.id)();
    },
    [handleOpenClosePost]
  );

  const handleDeletePost = useCallback(
    (postId: number) => async () => {
      await deletePost(postId, () =>
        setPosts((prev) => prev.filter((el) => el.id !== postId))
      );
    },
    []
  );

  const handleEditPost = useCallback(
    (postId: number) => async (newData: Posts.New) => {
      await updatePost(postId, newData, () => {
        setPosts((prev) =>
          prev.map((el) => (el.id === postId ? { ...el, ...newData } : el))
        );

        handleOpenClosePost(postId)();
      });
    },
    [handleOpenClosePost]
  );

  const componentToSidebar = useMemo(() => {
    if (isOpenNewPostForm) {
      return (
        <AddPostForm
          onCancel={handleOpenCloseNewPostForm(false)}
          onSubmit={handleCreatePost}
        />
      );
    }

    if (editingPostId) {
      const post = posts.find((el) => el.id === editingPostId);

      return post ? (
        <AddPostForm
          onSubmit={handleEditPost(editingPostId)}
          onCancel={handleOpenClosePost(editingPostId)}
          isEditing
          initFields={{ title: post.title, body: post.body }}
        />
      ) : null;
    }

    if (openPostId) {
      const post = posts.find((el) => el.id === openPostId);
      return post ? (
        <PostPreview
          post={post}
          onDeletePost={handleDeletePost(openPostId)}
          onEditPost={handleSetEditPost(openPostId)}
        />
      ) : null;
    }

    return null;
  }, [
    isOpenNewPostForm,
    openPostId,
    editingPostId,
    posts,
    handleSetEditPost,
    handleOpenClosePost,
    handleEditPost,
    handleOpenCloseNewPostForm,
    handleCreatePost,
    handleDeletePost,
  ]);

  return (
    <>
      <Header />
      <main className="section">
        <div className="container">
          <div className="tile is-ancestor">
            <PostsList
              isLoading={isLoadingPosts}
              posts={posts}
              onOpenClosePost={handleOpenClosePost}
              openPostId={openPostId}
              onOpenNewPostForm={handleOpenCloseNewPostForm}
              isOpenNewPostForm={isOpenNewPostForm}
            />
            <Sidebar Component={componentToSidebar} />
          </div>
        </div>
      </main>
    </>
  );
};

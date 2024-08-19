<template>
  <main class="section">
    <div class="container">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <div class="tile is-child box is-success">
            <div class="block">
              <UserSelector
                users="{users}"
                selectedUser="{selectedUser}"
                onChangeSelectedUser="{handleSelectedUser}"
              />
            </div>

            <div class="block" data-cy="MainContent">
              {!selectedUser && (
              <p data-cy="NoSelectedUser">No user selected</p>
              )} {isLoadingPosts && <Loader />} {loadPostError &&
              <Errors dataCy="{loadPostError}" />} {!usersPosts.length &&
              isPostsShown && (
              <div class="notification is-warning" data-cy="NoPostsYet">
                No posts yet
              </div>
              )} {usersPosts.length > 0 && isPostsShown && (
              <PostsList
                posts="{usersPosts}"
                selectedPost="{selectedPost}"
                onSelectedPost="{setSelectedPost}"
              />
              )}
            </div>
          </div>
        </div>

        <div data-cy="Sidebar">
          <div class="tile is-child box is-success ">
            {selectedPost && <PostDetails post="{selectedPost}" />}
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

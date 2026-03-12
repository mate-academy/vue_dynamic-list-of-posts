<script setup></script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h1 class="title is-size-4">Vue List Of Posts</h1>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5 mb-2"><p>User: Paulina</p></div>
          <a class="button is-light">Logout</a>
        </div>
      </div>
    </div>
  </nav>

  <main class="section">
    <div class="container">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <div class="tile is-child box is-success">
            <div class="block">
              <div class="block is-flex is-justify-content-space-between">
                <h2 class="title">Posts</h2>
                <button type="button" class="button is-link">
                  Add New Post
                </button>
              </div>
              <h3 class="mt-2 has-text-centered">No posts yet.</h3>
            </div>
          </div>
        </div>
        <div class="tile is-parent is-8-desktop Sidebar">
          <div class="tile is-child box is-success">
            <div class="content"></div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>

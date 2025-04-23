<script>
export default {
  name: "Header",
  props: {
    user: Object,
  },
  emits: ["logout"],
};
</script>

<template>
    
  <nav class="navbar" role="navigation" aria-label="main navigation">
  
     
    <h2 class="is-size-4">Vue List Of Posts</h2>

   
    <div class="navbar-end">
     
      <div class="navbar-item">
        
        <div class="buttons">
          <div class="mr-5 mb-2">
            <p>User: {{ user.name }} Id: #{{ user.id }}</p>
             
          </div>

          <a class="button is-light" @click="this.$emit('logout')"> Logout </a>
        </div>
      </div>
    </div>
  
  </nav>
</template>

<style>
h2 {
padding-top: 2px;
}
</style>